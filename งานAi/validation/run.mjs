#!/usr/bin/env node
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "out");

const TASK_MODEL = process.env.TASK_MODEL || "claude-opus-5";
const JUDGE_MODEL = process.env.JUDGE_MODEL || "claude-opus-5";
const RUNS = Number(process.env.RUNS || 3);
const CONCURRENCY = Number(process.env.CONCURRENCY || 4);

const client = new Anthropic();

const ARMS = ["A", "E", "F", "B", "C", "D"];
const ARM_NAMES = {
  A: "thai_raw",
  E: "thai_ask",
  F: "thai_thai",
  B: "thai_structured",
  C: "english_literal",
  D: "optimized",
};

// ---------- infrastructure ----------

function read(file) {
  return JSON.parse(fs.readFileSync(path.join(OUT, file), "utf8"));
}

function write(file, data) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, file), JSON.stringify(data, null, 2));
}

function loadInputs() {
  const raw = JSON.parse(fs.readFileSync(path.join(HERE, "inputs.json"), "utf8"));
  return raw.inputs;
}

function optimizerSystem() {
  const md = fs.readFileSync(path.join(HERE, "optimizer.md"), "utf8");
  const marker = "---SYSTEM---";
  const at = md.indexOf(marker);
  if (at === -1) throw new Error("optimizer.md is missing its ---SYSTEM--- marker");
  return md.slice(at + marker.length).trim();
}

async function pool(items, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await worker(items[i], i);
        process.stderr.write(".");
      }
    }),
  );
  process.stderr.write("\n");
  return results;
}

async function ask({ system, user, model = TASK_MODEL, maxTokens = 16000, effort = "high" }) {
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    output_config: { effort },
    ...(system ? { system } : {}),
    messages: [{ role: "user", content: user }],
  });
  if (response.stop_reason === "refusal") {
    return { text: "", refused: true, usage: response.usage };
  }
  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return { text, refused: false, usage: response.usage };
}

async function countTokens(system, user, model = TASK_MODEL) {
  const res = await client.messages.countTokens({
    model,
    ...(system ? { system } : {}),
    messages: [{ role: "user", content: user }],
  });
  return res.input_tokens;
}

function block(text, tag) {
  const m = text.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : "";
}

function confirmed() {
  return process.argv.includes("--yes");
}

// ---------- generate ----------

const GEN_STRUCTURED_TH = `จัดข้อความภาษาไทยข้างล่างให้เป็น prompt ภาษาไทยที่มีโครงสร้าง
ใช้หัวข้อชัดเจน เช่น บริบท ความต้องการ สิ่งที่ขอ
ห้ามเพิ่มข้อมูลที่ผู้ใช้ไม่ได้พูด ห้ามตัดข้อมูลที่ผู้ใช้พูดแล้ว
ตอบกลับมาเฉพาะ prompt ที่จัดแล้ว ไม่ต้องอธิบาย`;

const GEN_LITERAL_EN = `Translate the Thai text below into English, literally.
Keep every politeness marker, hedge, apology, and piece of small talk exactly as the writer expressed them.
Do not restructure, do not summarize, do not add headings.
Reply with the translation only.`;

async function generate() {
  const inputs = loadInputs();
  const optimizer = optimizerSystem();
  console.error(`generating arms for ${inputs.length} inputs`);

  const generated = await pool(inputs, async (input) => {
    const [structured, literal, optimized] = await Promise.all([
      ask({ system: GEN_STRUCTURED_TH, user: input.thai }),
      ask({ system: GEN_LITERAL_EN, user: input.thai }),
      ask({ system: optimizer, user: input.thai }),
    ]);

    const prompts = {
      A: { prompt: input.thai, system: null },
      E: { prompt: `${input.thai}\n\nถ้ามีอะไรไม่ชัด ถามก่อนตอบ`, system: null },
      F: { prompt: input.thai, system: "ตอบเป็นภาษาไทย" },
      B: { prompt: structured.text, system: null },
      C: { prompt: literal.text, system: null },
      D: { prompt: block(optimized.text, "optimized"), system: null },
    };

    for (const arm of ARMS) {
      prompts[arm].tokens = await countTokens(prompts[arm].system, prompts[arm].prompt);
    }

    return {
      id: input.id,
      provenance: input.provenance,
      thai: input.thai,
      must_preserve: input.must_preserve,
      checks: input.checks,
      prompts,
      optimizer_raw: optimized.text,
      optimizer_assumptions: block(optimized.text, "assumptions_th"),
      optimizer_questions: block(optimized.text, "open_questions_th"),
      optimizer_cost_tokens:
        (optimized.usage?.input_tokens ?? 0) + (optimized.usage?.output_tokens ?? 0),
    };
  });

  write("generated.json", generated);
  const empty = generated.filter((g) => !g.prompts.D.prompt);
  if (empty.length) {
    console.error(`WARNING: ${empty.length} input(s) produced no <optimized> block: ${empty.map((e) => e.id).join(", ")}`);
  }
  console.error(`wrote out/generated.json`);
}

// ---------- execute ----------

async function execute() {
  const generated = read("generated.json");
  const jobs = [];
  for (const g of generated) {
    for (const arm of ARMS) {
      for (let run = 0; run < RUNS; run++) {
        jobs.push({ id: g.id, arm, run, ...g.prompts[arm] });
      }
    }
  }

  console.error(`${jobs.length} model calls (${generated.length} inputs x ${ARMS.length} arms x ${RUNS} runs)`);
  if (!confirmed()) {
    console.error("this spends real money. re-run with --yes to proceed.");
    process.exit(1);
  }

  const results = await pool(jobs, async (job) => {
    if (!job.prompt) return { ...job, output: "", skipped: true };
    const res = await ask({ system: job.system, user: job.prompt });
    return {
      id: job.id,
      arm: job.arm,
      run: job.run,
      output: res.text,
      refused: res.refused,
      output_tokens: res.usage?.output_tokens ?? 0,
    };
  });

  write("executed.json", results);
  console.error("wrote out/executed.json");
}

// ---------- judge ----------

const YESNO = `Answer with exactly one word on the first line: YES or NO.
On a second line give a one-sentence reason.
Judge only what is asked. Do not reward length, formatting, or politeness.`;

async function yesNo(user) {
  const res = await ask({ system: YESNO, user, model: JUDGE_MODEL, maxTokens: 1000, effort: "low" });
  const verdict = res.text.split("\n")[0].trim().toUpperCase().startsWith("YES");
  return { pass: verdict, reason: res.text.split("\n").slice(1).join(" ").trim() };
}

async function judge() {
  const generated = read("generated.json");
  const executed = read("executed.json");
  const byId = Object.fromEntries(generated.map((g) => [g.id, g]));

  // Blind: shuffle so ordering carries no arm signal, and never show the arm label.
  const checkJobs = [];
  for (const row of executed) {
    if (row.skipped) continue;
    for (const [ci, check] of byId[row.id].checks.entries()) {
      checkJobs.push({ id: row.id, arm: row.arm, run: row.run, ci, check, output: row.output });
    }
  }
  checkJobs.sort(() => Math.random() - 0.5);

  console.error(`${checkJobs.length} binary checks + invariant checks on arm D`);
  if (!confirmed()) {
    console.error("this spends real money. re-run with --yes to proceed.");
    process.exit(1);
  }

  const checkResults = await pool(checkJobs, async (job) => {
    const { pass, reason } = await yesNo(
      `Here is an AI assistant's response:\n\n<response>\n${job.output}\n</response>\n\nQuestion: ${job.check}`,
    );
    return { id: job.id, arm: job.arm, run: job.run, ci: job.ci, check: job.check, pass, reason };
  });

  // Invariants, on arm D's generated prompt only.
  const invJobs = [];
  for (const g of generated) {
    const optimized = g.prompts.D.prompt;
    if (!optimized) continue;
    for (const item of g.must_preserve) {
      invJobs.push({ id: g.id, kind: "preserve", item, optimized, thai: g.thai });
    }
    invJobs.push({ id: g.id, kind: "no_invention", optimized, thai: g.thai });
    invJobs.push({ id: g.id, kind: "standalone", optimized, thai: g.thai });
  }

  const invResults = await pool(invJobs, async (job) => {
    let q;
    if (job.kind === "preserve") {
      q = `<instruction>\n${job.optimized}\n</instruction>\n\nQuestion: does the instruction above state or clearly convey this requirement: "${job.item}"?`;
    } else if (job.kind === "no_invention") {
      q = `Thai original:\n<thai>\n${job.thai}\n</thai>\n\nEnglish instruction derived from it:\n<instruction>\n${job.optimized}\n</instruction>\n\nQuestion: is the instruction FREE of invented content, meaning it adds no fact, number, technology, timing, or constraint that is absent from the Thai original? Answer YES if nothing was invented.`;
    } else {
      q = `<instruction>\n${job.optimized}\n</instruction>\n\nQuestion: read only the text above, with no other context. Is it a complete, actionable request that does not refer to any missing external section?`;
    }
    const { pass, reason } = await yesNo(q);
    return { id: job.id, kind: job.kind, item: job.item ?? null, pass, reason };
  });

  write("graded.json", { checks: checkResults, invariants: invResults });
  console.error("wrote out/graded.json");
}

// ---------- blind human sheet ----------

function sheet() {
  const generated = read("generated.json");
  const executed = read("executed.json");
  const byId = Object.fromEntries(generated.map((g) => [g.id, g]));

  const rows = executed.filter((r) => !r.skipped).map((r) => ({ ...r, key: Math.random() }));
  rows.sort((a, b) => a.key - b.key);

  const answerKey = [];
  let md = `# Blind scoring sheet\n\nอย่าเปิด out/answer-key.json จนกว่าจะให้คะแนนครบ\nตอบ Y หรือ N ต่อท้ายแต่ละ check\n\n`;

  rows.forEach((r, i) => {
    const label = `R${String(i + 1).padStart(3, "0")}`;
    answerKey.push({ label, id: r.id, arm: r.arm, arm_name: ARM_NAMES[r.arm], run: r.run });
    md += `\n---\n\n## ${label}\n\n<details><summary>output</summary>\n\n\`\`\`\n${r.output}\n\`\`\`\n\n</details>\n\n`;
    for (const check of byId[r.id].checks) md += `- [ ] ${check}\n`;
  });

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "sheet.md"), md);
  write("answer-key.json", answerKey);
  console.error(`wrote out/sheet.md (${rows.length} responses, blinded)`);
}

// ---------- tally ----------

function tally() {
  const generated = read("generated.json");
  const graded = read("graded.json");

  const real = new Set(generated.filter((g) => g.provenance === "real").map((g) => g.id));
  const counted = real.size ? real : new Set(generated.map((g) => g.id));
  if (!real.size) {
    console.log("WARNING: no inputs marked provenance='real'. This is a harness smoke test, NOT a result.\n");
  }

  const rate = (rows) => {
    const hits = rows.filter((r) => r.pass).length;
    return rows.length ? (100 * hits) / rows.length : 0;
  };

  console.log(`inputs counted: ${counted.size}   runs per arm: ${RUNS}   task model: ${TASK_MODEL}\n`);

  // Hard gate first.
  const inv = graded.invariants.filter((r) => counted.has(r.id));
  const invRate = rate(inv);
  console.log("HARD GATE: invariants on arm D");
  for (const kind of ["preserve", "no_invention", "standalone"]) {
    const rows = inv.filter((r) => r.kind === kind);
    console.log(`  ${kind.padEnd(14)} ${rate(rows).toFixed(1)}%  (${rows.filter((r) => r.pass).length}/${rows.length})`);
  }
  console.log(`  OVERALL        ${invRate.toFixed(1)}%\n`);

  const failures = inv.filter((r) => !r.pass);
  if (failures.length) {
    console.log("  invariant failures:");
    for (const f of failures.slice(0, 15)) {
      console.log(`    [${f.id}] ${f.kind}${f.item ? `: ${f.item}` : ""} - ${f.reason}`);
    }
    if (failures.length > 15) console.log(`    ... +${failures.length - 15} more`);
    console.log("");
  }

  // Task success per arm.
  const checks = graded.checks.filter((r) => counted.has(r.id));
  const perArm = {};
  for (const arm of ARMS) perArm[arm] = rate(checks.filter((r) => r.arm === arm));

  console.log("task success rate");
  for (const arm of ARMS) {
    const tokens =
      generated.filter((g) => counted.has(g.id)).reduce((s, g) => s + (g.prompts[arm].tokens ?? 0), 0) /
      (counted.size || 1);
    console.log(
      `  ${arm} ${ARM_NAMES[arm].padEnd(16)} ${perArm[arm].toFixed(1).padStart(5)}%   avg ${tokens.toFixed(0).padStart(5)} input tokens`,
    );
  }

  const optimizerCost =
    generated.filter((g) => counted.has(g.id)).reduce((s, g) => s + (g.optimizer_cost_tokens ?? 0), 0) /
    (counted.size || 1);
  console.log(`\n  optimizer burns avg ${optimizerCost.toFixed(0)} tokens to produce arm D`);

  // Pre-registered decision.
  const margin = perArm.D - perArm.E;
  console.log(`\nPRE-REGISTERED DECISION (see PREREGISTRATION.md)`);
  console.log(`  D - E = ${margin >= 0 ? "+" : ""}${margin.toFixed(1)} pp`);

  if (invRate < 95) {
    console.log(`  => DO NOT BUILD. Invariant gate failed (${invRate.toFixed(1)}% < 95%).`);
    console.log(`     A tool that drops stated requirements is broken regardless of its score.`);
  } else if (margin >= 15) {
    console.log(`  => BUILD.`);
  } else if (margin >= 5) {
    console.log(`  => INCONCLUSIVE. Collect 40 real inputs and re-run once. Do not build yet.`);
  } else {
    console.log(`  => DO NOT BUILD. The product does not beat appending one sentence in Thai.`);
  }

  const vsF = perArm.D - perArm.F;
  const vsC = perArm.D - perArm.C;
  console.log(`\nsecondary`);
  console.log(`  D - F = ${vsF >= 0 ? "+" : ""}${vsF.toFixed(1)} pp  ${Math.abs(vsF) < 5 ? "<- translating to English is NOT carrying its weight" : ""}`);
  console.log(`  D - C = ${vsC >= 0 ? "+" : ""}${vsC.toFixed(1)} pp  (isolates structuring from translating)`);
}

// ---------- main ----------

const cmd = process.argv[2];
const commands = { generate, execute, judge, sheet, tally };
if (!commands[cmd]) {
  console.error(`usage: node run.mjs <generate|execute|judge|sheet|tally> [--yes]`);
  process.exit(1);
}
await commands[cmd]();

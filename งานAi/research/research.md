# Thai → AI-ready prompt: หลักฐานจาก primary sources

วันที่ทำ research: 2026-09-16
ขอบเขต: prompt แบบไหน LLM เข้าใจดีที่สุด, อะไรทำให้ prompt ยาวโดยไม่เพิ่มข้อมูล, และ pipeline ภาษาไทย → intent → requirement → compression → English AI-ready format

---

## TL;DR

1. **โครงสร้างชนะความสุภาพ.** ทั้ง Anthropic และ OpenAI ระบุตรงกันว่า prompt ที่ดีคือ explicit + มี delimiter/XML แยกส่วน + บอก output format. Anthropic ระบุตัวเลขเดียวที่เป็นทางการ: วาง long data ไว้บนสุดและวาง query ไว้ท้ายสุด "can improve response quality by up to 30 percent in tests" ([Anthropic, Long context prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).
2. **Bloat ไม่ได้เป็นกลาง.** OpenAI ระบุว่า prompt ที่ vague หรือขัดแย้งกันเอง "can be more damaging to GPT-5 than to other models, as it expends reasoning tokens searching for a way to reconcile the contradictions" ([OpenAI GPT-5 prompting guide](https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/gpt-5_prompting_guide.ipynb)). บวกกับ lost-in-the-middle (ข้อมูลกลาง context ถูกใช้แย่ลง) ทำให้ token ที่ไม่มีข้อมูลมีต้นทุน 3 ทาง: เงิน, latency, และ attention.
3. **ตัวเลขไทยที่วัดจริง (สำคัญที่สุดในโน้ตนี้).** ใน `o200k_base` (GPT-4o/GPT-4.1 family) ภาษาไทย **ไม่ได้** แพงกว่าอังกฤษ 3-5 เท่าอย่างที่มักพูดกัน. วัดจากประโยค requirement คู่ขนาน 4 คู่: ไทย/อังกฤษ = **1.56x**. แต่ใน `cl100k_base` (GPT-4, GPT-3.5) = **3.82x**. นั่นคือ 2.49x ของช่องว่างนี้มาจาก **รุ่นของ tokenizer** ไม่ใช่จากภาษาไทยเอง.
4. **แปลเป็นอังกฤษได้กำไรน้อยกว่าที่คิด, restructure ได้กำไรเยอะกว่า.** ในตัวอย่างจริงที่วัด: แปลไทย → อังกฤษ ลด token ~19-24% เท่านั้น, แต่ compress + restructure ลดได้ ~55-57% พร้อมกับ **เพิ่ม** ความชัดของ requirement.
5. **Prompt compression มีงานวิจัยรองรับ** (LLMLingua family จาก Microsoft, EMNLP'23 / ACL'24) แต่เป็นคนละเรื่องกับสิ่งที่ pipeline นี้ทำ: LLMLingua บีบ token โดยไม่สนความหมายที่มนุษย์อ่านออก, ส่วน pipeline นี้ rewrite ให้มนุษย์ยัง review ได้.

---

## 1. Prompt แบบไหนที่ LLM เข้าใจดีที่สุด

ทุกข้อในตารางนี้มาจาก official docs ของเจ้าของ model.

| property | หลักฐาน | quote |
|---|---|---|
| Explicit > implicit | [Anthropic, Be clear and direct](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | "If you want 'above and beyond' behavior, explicitly request it rather than relying on the model to infer this from vague prompts." + golden rule: ถ้าเพื่อนร่วมงานที่ไม่มี context อ่านแล้วงง, model ก็งง |
| บอก **เหตุผล** ของ constraint ช่วยได้ | [Anthropic, Add context](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | "NEVER use ellipses" แย่กว่า "Your response will be read aloud by a text-to-speech engine, so never use ellipses..." เพราะ "Claude is smart enough to generalize from the explanation" |
| XML tags แยกประเภทเนื้อหา | [Anthropic, Structure prompts with XML tags](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | "XML tags help Claude parse complex prompts unambiguously, especially when your prompt mixes instructions, context, examples, and variable inputs. Wrapping each type of content in its own tag ... reduces misinterpretation." |
| XML tags (ฝั่ง OpenAI ก็เห็นตรงกัน) | [OpenAI GPT-5 prompting guide](https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/gpt-5_prompting_guide.ipynb) | "structured XML specs like `<[instruction]_spec>` improved instruction adherence on their prompts and allows them to clearly reference previous categories and sections elsewhere in their prompt" |
| Examples (multishot) | [Anthropic, Use examples effectively](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure." ต้อง relevant, diverse, ห่อใน `<example>`. คำแนะนำ: "Include 3–5 examples for best results." |
| ลำดับ context ก่อน instruction | [Anthropic, Long context prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | "Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples." และ "Queries at the end can improve response quality by up to 30 percent in tests" |
| Grounding ด้วย quotes | อ้างอิงเดียวกัน | "ask Claude to quote relevant parts of the documents first before carrying out its task. This helps Claude focus on the relevant content and ignore the rest" |
| Role / system prompt | [Anthropic, Give Claude a role](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | "Setting a role in the system prompt focuses Claude's behavior and tone for your use case. Even a single sentence makes a difference" |
| บอกสิ่งที่ **ให้ทำ** ไม่ใช่สิ่งที่ห้าม | [Anthropic, Control the format of responses](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | แทนที่ "Do not use markdown in your response" ให้ใช้ "Your response should be composed of smoothly flowing prose paragraphs." |
| Prompt style ส่งผลต่อ output style | อ้างอิงเดียวกัน | "The formatting style used in your prompt may influence Claude's response style ... removing markdown from your prompt can reduce the volume of markdown in the output." |

**ข้อสังเกตที่มักถูกมองข้าม:** Anthropic ระบุว่า over-prompting เป็นปัญหาจริงในรุ่นใหม่ ไม่ใช่แค่สิ้นเปลือง: "**Remove over-prompting.** Tools that undertriggered in previous models are likely to trigger appropriately now. Instructions like 'If in doubt, use [tool]' will cause overtriggering." ([Overthinking and excessive thoroughness](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)) กล่าวคือ prompt ที่ยาวเพราะ "กันไว้ก่อน" สามารถทำให้ behavior แย่ลงได้โดยตรง.

---

## 2. กายวิภาคของ token bloat

### 2.1 หมวดของ bloat (วัดต้นทุน token จริง)

วัดด้วย `o200k_base` (วิธีวัดอยู่ใน §3.1):

| หมวด | ตัวอย่าง | tokens |
|---|---|---|
| Thai particle | `ครับ` | 1 |
| Thai particle | `นะครับ` | 2 |
| Thai particle | `อ่ะครับ` | 4 |
| Thai hedge | `คือ พอดีว่า` | 5 |
| Thai hedge | `ไม่รู้ว่าจะเริ่มยังไงดี` | 9 |
| Thai politeness | `รบกวนช่วยแนะนำหน่อยได้ไหมครับ` | 12 |
| Thai closer | `ขอบคุณมากๆ เลยครับ` | 8 |
| English politeness | `Hello, I would like to ask for some advice if that is okay.` | 15 |
| English hedge | `And if it is possible, I would like it to` | 11 |
| English preamble | `I am writing to you today because I have a question about` | 12 |
| English restatement | `As I mentioned above, and just to reiterate,` | 11 |
| English closer | `Thank you so much.` | 5 |

หมวดที่เหลือซึ่งไม่ได้วัดแยกแต่เห็นชัดในตัวอย่าง §4: repeated context (พูดเรื่อง stack ซ้ำ), over-explanation (เล่า background ที่ไม่เปลี่ยนคำตอบ), และ verbose natural-language phrasing ของสิ่งที่เขียนเป็นตารางหรือ list ได้.

### 2.2 มันเสียหายจริงไหม

**ใช่ มี 3 ช่องทาง และมีหลักฐานต่างระดับกัน:**

1. **Attention / positional (หลักฐานแข็งที่สุด).** Liu et al., *Lost in the Middle: How Language Models Use Long Contexts*, TACL 2024 (arXiv:2307.03172) พบ U-shaped curve: performance สูงสุดเมื่อข้อมูลที่เกี่ยวข้องอยู่ต้นหรือท้าย context และลดลงชัดเจนเมื่ออยู่ตรงกลาง. ([repo ของผู้เขียน](https://github.com/nelson-liu/lost-in-the-middle), [TACL](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630/Lost-in-the-Middle-How-Language-Models-Use-Long), [PDF จาก Stanford](https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.arxiv2023.pdf)). ผลสำคัญเชิงปฏิบัติ: การเพิ่ม context window ไม่ได้รับประกันว่า model จะใช้ข้อมูลได้ทั่วทั้ง window. **หมายเหตุความซื่อสัตย์:** ตัวเลข "ลดลงกว่า 20% ใน multi-document QA สำหรับ GPT-3.5-Turbo" ผมได้จาก search-result summary ไม่ได้จาก PDF ตัวจริง (arxiv.org และ aclanthology.org ถูก block จาก environment นี้) ดังนั้นถือเป็น **unverified number**, แต่ทิศทางของ finding ยืนยันได้จาก repo ของผู้เขียนเอง.
2. **Reasoning token ถูกเผาไปกับการแก้ความกำกวม (หลักฐาน first-party).** OpenAI: prompt ที่ vague/contradictory "can be more damaging to GPT-5 than to other models, as it expends reasoning tokens searching for a way to reconcile the contradictions" ([GPT-5 prompting guide](https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/gpt-5_prompting_guide.ipynb)). นี่คือหลักฐานตรงว่า bloat ที่ก่อความกำกวม **ไม่เป็นกลาง** แต่แพงเป็นสองเท่า (จ่ายทั้ง input และ reasoning output).
3. **ต้นทุนและ context budget.** ตรงไปตรงมา: input token ถูกคิดเงิน และกินที่ใน context window. Anthropic แนะนำให้นับ token ล่วงหน้าด้วย `count_tokens` endpoint เพื่อ "Proactively manage rate limits and costs" ([Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)).

**สิ่งที่ยืนยันไม่ได้:** คำว่า "context rot" และ "attention dilution" เป็นศัพท์ที่แพร่หลายในวงการ แต่ผม **ไม่สามารถเข้าถึง** แหล่งต้นทาง (research.trychroma.com/context-rot และ anthropic.com/engineering/effective-context-engineering-for-ai-agents ถูก block) จึงไม่ยืนยันตัวเลขใด ๆ ของสองคำนี้ในโน้ตนี้.

---

## 3. Pipeline: ไทย → intent → requirement → compression → English

### 3.1 Thai tokenization: ตัวเลขที่วัดเอง

**วิธีวัด (ทำจริง, ไม่ใช่ประมาณ):** `js-tiktoken` v1.0.21 รันบน Node ในเครื่อง, ใช้ BPE ranks ชุดเดียวกับ `tiktoken` ของ OpenAI คือ `o200k_base` และ `cl100k_base` ([tiktoken repo](https://github.com/openai/tiktoken), [encoding definitions](https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py)). เลือก `js-tiktoken` เพราะ vocab file ของ python `tiktoken` โหลดจาก `openaipublic.blob.core.windows.net` ซึ่งถูก block ใน environment นี้ ส่วน npm package bundle ranks มาให้.

**ข้อจำกัดที่ต้องระบุชัด:** Anthropic **ไม่เปิด public tokenizer**. วิธีเดียวที่นับ token ของ Claude ได้แม่นคือเรียก `/v1/messages/count_tokens` ([Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)) ซึ่งผมไม่มี API key จึงทำไม่ได้. ตัวเลขทั้งหมดในโน้ตนี้เป็น **OpenAI tokenizer** ใช้เป็น proxy. และ Anthropic เตือนไว้ด้วยว่า tokenizer รุ่นใหม่ (ตั้งแต่ Claude Opus 4.7) ให้ token "approximately 30 percent more tokens than on earlier models" สำหรับ input เดียวกัน ดังนั้นห้าม reuse ตัวเลขข้ามรุ่น.

#### วัดที่ 1: ประโยค requirement คู่ขนาน ไทย/อังกฤษ ความหมายเดียวกัน 4 คู่

| # | ประโยค (ย่อ) | TH o200k | EN o200k | TH cl100k | EN cl100k |
|---|---|---|---|---|---|
| 1 | reset password ทางอีเมล | 16 | 12 | 39 | 12 |
| 2 | เก็บประวัติการสั่งซื้อ | 16 | 10 | 45 | 11 |
| 3 | payment fail retry 3 ครั้ง | 26 | 14 | 62 | 14 |
| 4 | โหลดใน 2 วินาทีบนมือถือ | 17 | 12 | 41 | 12 |
| | **รวม** | **75** | **48** | **187** | **49** |

- **o200k_base: ไทย/อังกฤษ = 1.56x**
- **cl100k_base: ไทย/อังกฤษ = 3.82x**
- tokens ต่อ character: o200k TH 0.366 vs EN 0.194 ; cl100k TH 0.912 vs EN 0.198
- ต้นทุนของการใช้ tokenizer รุ่นเก่า: ภาษาไทยแพงขึ้น **2.49x**, ภาษาอังกฤษแพงขึ้น **1.02x**

**ข้อสรุปที่สำคัญและขัดกับความเชื่อทั่วไป:** "ภาษาไทยเปลือง token มหาศาล" เป็นจริงกับ tokenizer รุ่น `cl100k_base` แต่ **ลดลงมากแล้ว** ใน `o200k_base`. ถ้าใครยกตัวเลข 3-5x มาเป็นเหตุผลว่าต้องแปลเป็นอังกฤษ ตัวเลขนั้นอาจมาจาก tokenizer ที่ล้าสมัย.

#### วัดที่ 2: คำไทยเดี่ยวถูกตัดอย่างไรใน o200k_base

```
ระบบ        (4 ตัวอักษร) → 1 token : "ระบบ"
ลูกค้า       (6)          → 2 tokens: "ลูก" "ค้า"
รหัสผ่าน     (8)          → 3 tokens: "ร" "หัส" "ผ่าน"
สวัสดี       (6)          → 4 tokens: "ส" "วั" "สด" "ี"
การชำระเงิน  (11)         → 5 tokens: "การ" "ช" "ำ" "ระ" "เงิน"
```

สังเกตสองอย่าง: (ก) BPE เรียนรู้ morpheme ไทยที่พบบ่อยได้จริง (`ระบบ`, `การ`, `ผ่าน`, `เงิน`) แต่ (ข) การตัดแตกลงถึงระดับ **สระและวรรณยุกต์เดี่ยว** (`"วั"`, `"ี"`, `"ำ"`) ยังเกิดอยู่ ซึ่งเป็นผลจากการที่ภาษาไทยไม่มี space คั่นคำ, BPE จึงไม่มี word-boundary signal แบบภาษาอังกฤษ. เครื่องมือที่แก้ปัญหานี้ในฝั่ง Thai NLP คือ dictionary/ML-based word segmentation, เช่น PyThaiNLP ที่ให้ "Sentence, word, and subword segmentation (`sent_tokenize`, `word_tokenize`, `subword_tokenize`)" ([PyThaiNLP README](https://github.com/PyThaiNLP/pythainlp)) แต่นั่นเป็น segmentation ของ NLP pipeline ไม่ใช่ tokenizer ของ LLM.

#### หลักฐานรอง (ไม่ได้วัดเอง)

- Petrov et al., *Language Model Tokenizers Introduce Unfairness Between Languages* (arXiv:2305.15425): ข้อความเดียวกันแปลต่างภาษาให้ความยาว token ต่างกัน **ได้ถึง 15 เท่า** และช่องว่างนี้ยังอยู่แม้ใน tokenizer ที่ตั้งใจทำ multilingual. ส่งผลต่อ "the cost of accessing commercial language services, the processing time and latency, as well as the amount of content that can be provided as context". *สถานะ: ผมอ่านได้เฉพาะจาก search-result summary, arxiv.org / ora.ox.ac.uk / openreview.net ถูก block. ถือเป็น secondhand.*
- Typhoon (SCB 10X, Thai LLM, arXiv:2312.13951): tokenizer ของ Typhoon "2.62 times more efficient than GPT-4" สำหรับภาษาไทย โดยเทรน Thai subword 5,000 tokens เพิ่มบน Mistral-7B tokenizer. *สถานะ: secondhand จาก search summary เช่นกัน. หมายเหตุ: "GPT-4" ในที่นี้คือ `cl100k_base` ซึ่งสอดคล้องพอดีกับที่ผมวัดได้เอง (cl100k แพงกว่า o200k สำหรับไทย 2.49x).*

### 3.2 Cross-lingual: ถาม EN หรือถาม TH ดีกว่ากัน

หลักฐานที่หาเจอชี้ไปทาง **ถามเป็นอังกฤษได้ผลดีกว่าสำหรับภาษา lower-resource** แต่ผมเข้าถึง paper ตัวจริงไม่ได้:

- *Better to Ask in English: Evaluation of Large Language Models on English, Low-resource and Cross-Lingual Settings* (arXiv:2410.13153): รายงานว่า GPT-4 ทำได้ดีกว่าเมื่อ prompt เป็นอังกฤษ โดยห่างจาก Bangla / Hindi / Urdu ที่ 17.75% / 14.82% / 22.02% บน XNLI และแนวโน้มนี้คงอยู่ทุก setting.
- *How and Where to Translate? The Impact of Translation Strategies in Cross-lingual LLM Prompting* (arXiv:2507.22923): กลยุทธ์ที่ดีที่สุดต่างกันระหว่างภาษา low-resource (Hindi) กับ high-resource (French), ไม่มีสูตรเดียวใช้ได้หมด.
- *Native vs Non-Native Language Prompting: A Comparative Analysis* (arXiv:2409.07054).

**สถานะ: ทั้งสามรายการเป็น secondhand จาก search-result summary เท่านั้น. ผมไม่ได้เปิด PDF และไม่ยืนยันตัวเลข.** ที่สำคัญ: **ผมไม่พบงานที่วัด ไทย vs อังกฤษ โดยเฉพาะ.** การ generalize จาก Bangla/Hindi/Urdu มาที่ไทยเป็นการเดา. ถ้าต้องการข้อสรุปที่เชื่อถือได้สำหรับไทย ต้องรัน eval เอง.

ข้อควรระวังเชิงปฏิบัติที่ยืนยันได้จาก primary source แทน: Anthropic ไม่ได้บอกให้แปลเป็นอังกฤษ แต่บอกให้ **explicit** และ **มีโครงสร้าง** ซึ่งเป็นเหตุผลที่แข็งกว่าสำหรับ pipeline นี้ ไม่ว่า model จะตอบภาษาไทยได้ดีแค่ไหน.

### 3.3 Intent & requirement extraction

ผมไม่พบ paper ที่ own เรื่องนี้โดยตรงและเข้าถึงได้ ดังนั้นสิ่งที่เขียนในหัวข้อนี้เป็นการ **derive จาก primary prompting docs** ไม่ใช่การอ้าง requirements-engineering literature:

- **สิ่งที่ต้อง extract ออกมาให้ได้** ตามที่ docs บอกว่าจำเป็น: task ที่ต้องทำ, constraint, สิ่งที่มีอยู่แล้ว (stack/context), **output format** ([Anthropic: "Be specific about the desired output format and constraints"](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)), และลำดับขั้นถ้าลำดับสำคัญ ("Provide instructions as sequential steps using numbered lists or bullet points when the order or completeness of steps matters").
- **สิ่งที่ต้องกำจัดให้ได้** เพราะมีหลักฐานว่าแพง: ความขัดแย้งภายใน prompt ([OpenAI: expends reasoning tokens reconciling contradictions](https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/gpt-5_prompting_guide.ipynb)).
- **ข้อเสนอเชิงปฏิบัติที่ปลอดภัย:** ให้ขั้น extraction ปล่อย `<assumptions>` หรือ `<open_questions>` ออกมาด้วยเสมอ. เหตุผลมาจาก docs: prompt ต้องผ่าน "golden rule" คือคนที่ไม่มี context อ่านแล้วทำตามได้. อะไรที่ตอบไม่ได้จากข้อความไทยต้นฉบับ ต้องถูก **ทำให้มองเห็น** ไม่ใช่ถูกเติมเงียบ ๆ โดยตัวแปล. นี่คือจุดที่ pipeline อัตโนมัติพังได้ง่ายที่สุด: การ "compress" ที่จริง ๆ แล้วคือการ **เดาแทนผู้ใช้**.

### 3.4 Prompt compression: เทคนิคที่มีชื่อและมีตัวเลข

ตระกูล LLMLingua จาก Microsoft Research คือ reference implementation ที่ชัดที่สุด ([microsoft/LLMLingua](https://github.com/microsoft/LLMLingua)):

| paper | venue | ตัวเลขที่เจ้าของงานอ้าง |
|---|---|---|
| **LLMLingua** ([MSR page](https://www.microsoft.com/en-us/research/publication/llmlingua-compressing-prompts-for-accelerated-inference-of-large-language-models/), [ACL](https://aclanthology.org/2023.emnlp-main.825/)) | EMNLP 2023 | "a coarse-to-fine prompt compression method that involves a budget controller to maintain semantic integrity under high compression ratios" ; **up to 20x compression** with "little performance loss" ; eval บน GSM8K, BBH, ShareGPT, Arxiv-March23 |
| **LongLLMLingua** ([ACL](https://aclanthology.org/2024.acl-long.91/)) | ACL 2024 | "improves RAG performance by up to **21.4%** using only **1/4 of the tokens**" |
| **LLMLingua-2** ([MSR page](https://www.microsoft.com/en-us/research/publication/llmlingua-2-data-distillation-for-efficient-and-faithful-task-agnostic-prompt-compression/), [ACL](https://aclanthology.org/2024.findings-acl.57/)) | ACL 2024 Findings | task-agnostic, ใช้ data distillation + encoder เล็ก (XLM-RoBERTa-large / mBERT) ; **3x-6x เร็วกว่า LLMLingua**, end-to-end latency เร็วขึ้น **1.6x-2.9x** ที่ compression ratio **2x-5x** ; eval บน MeetingBank, LongBench, ZeroScrolls, GSM8K, BBH |

ตัวเลข 20x / 21.4% / 1/4 tokens / 3x-6x ยืนยันได้จาก README ของ repo เจ้าของงาน และหน้า publication ของ Microsoft Research. ตัวเลข 1.6x-2.9x และ 2x-5x ของ LLMLingua-2 ผมได้จาก search summary ของ abstract ไม่ใช่จาก paper โดยตรง (aclanthology ถูก block).

**ข้อควรระวังที่สำคัญมากสำหรับ pipeline นี้:** LLMLingua เป็น **token-level pruning** คือมันตัด token ที่ perplexity ต่ำออก ทำให้ prompt ที่ออกมามักอ่านไม่รู้เรื่องสำหรับมนุษย์. ถ้าเป้าหมายของ pipeline ไทย → English คือ prompt ที่ผู้ใช้ยัง **review และแก้ไขได้** นี่เป็นคนละ technique กันโดยสิ้นเชิง. สิ่งที่ §4 แสดงคือ **semantic rewriting** ไม่ใช่ LLMLingua-style compression. อย่าอ้างตัวเลข 20x ของ LLMLingua มาใช้กับ pipeline แบบ rewriting.

---

## 4. Worked comparison สี่ทาง

**วิธีวัด:** ทุกตัวเลขในหัวข้อนี้ **วัดจริง** ด้วย `js-tiktoken` v1.0.21 (ranks `o200k_base` และ `cl100k_base` ชุดเดียวกับ OpenAI `tiktoken`) รันในเครื่อง ไม่ใช่การประมาณ. คอลัมน์ "ambiguity" เป็นการประเมินของผมเอง ไม่ใช่การวัด.

### ตัวอย่างที่ 1: ความซับซ้อนปานกลาง (ระบบจองคิวร้านตัดผม)

**(A) ต้นฉบับภาษาไทย ตามที่คนไทยพิมพ์จริง**

```
สวัสดีครับพี่ คือผมอยากจะขอรบกวนปรึกษาหน่อยนะครับ พอดีว่าตอนนี้ผมกำลังทำเว็บร้านตัดผมอยู่ แล้วก็อยากจะได้ระบบ
จองคิวออนไลน์ด้วยอ่ะครับ คือลูกค้าน่าจะเข้ามาเลือกวันเวลาที่ว่างได้ แล้วก็เลือกช่างที่ต้องการได้ด้วย แล้วก็ถ้าเป็นไปได้
อยากให้มันส่ง SMS หรือไม่ก็ LINE แจ้งเตือนลูกค้าก่อนถึงคิวสักหนึ่งชั่วโมงด้วยครับ ตอนนี้ผมใช้ Next.js กับ Postgres
อยู่นะครับ ไม่รู้ว่าจะเริ่มยังไงดี ถ้าพี่พอจะมีเวลาช่วยแนะนำหน่อยได้ไหมครับว่าควรออกแบบ database schema ยังไง
แล้วก็ API endpoint ควรมีอะไรบ้าง ขอบคุณมากๆ เลยครับ
```

**(B) แปลตรงเป็นอังกฤษ (เก็บความสุภาพและ hedging ไว้ครบ)**

```
Hello, I would like to ask for some advice if that is okay. Right now I am building a website for a
barbershop, and I would also like to have an online queue booking system. Customers should be able to
come in and pick an available date and time, and also pick the barber they want. And if it is possible,
I would like it to send an SMS or maybe a LINE notification to remind the customer about one hour before
their turn. Right now I am using Next.js with Postgres. I do not really know how to get started. If you
have the time, could you please advise me on how I should design the database schema, and also what API
endpoints there should be? Thank you so much.
```

**(C) Structured prompt**

```xml
<role>Senior full-stack engineer, Next.js (App Router) + PostgreSQL.</role>

<context>
Product: single barbershop, online queue booking added to an existing Next.js site.
Stack: Next.js App Router, PostgreSQL. Greenfield feature, no existing booking tables.
</context>

<requirements>
1. Customer browses available time slots.
2. Customer selects a specific barber.
3. Reminder sent 1 hour before the appointment, via SMS or LINE.
</requirements>

<task>
1. PostgreSQL schema: tables, columns, types, keys, indexes, and a constraint that makes
   double-booking a barber impossible.
2. REST API endpoints: method, path, request body, response body, error cases.
</task>

<output_format>
## Schema, as SQL DDL.
## API, as a table.
## Assumptions, as a list.
No introduction, no closing summary.
</output_format>
```

**(D) Compressed prompt**

```
Next.js (App Router) + Postgres. Add online booking to a barbershop site.
Requirements: browse free slots; pick a barber; reminder 1h before via SMS or LINE.
Deliver, no prose:
1. SQL DDL: tables, types, indexes, constraint blocking double-booking per barber.
2. REST endpoint table: method, path, request, response, errors.
3. Assumptions list.
```

| | chars | UTF-8 bytes | **o200k** | **cl100k** | vs. ไทย (o200k) | ข้อมูลที่เก็บไว้ | ความกำกวมที่เหลือ |
|---|---|---|---|---|---|---|---|
| A ไทย | 505 | 1,369 | **195** | **426** | 1.00x | ครบ | สูง: ไม่มี output format, ไม่ระบุ concurrency, "ช่าง" กับ slot สัมพันธ์กันยังไงไม่ชัด |
| B อังกฤษ | 664 | 664 | **149** | **149** | 0.76x | ครบ (เท่า A) | สูงเท่า A |
| C structured | 807 | 807 | **193** | **190** | 0.99x | ครบ + เพิ่ม role, double-booking constraint, output format, assumptions | ต่ำ |
| D compressed | 345 | 345 | **88** | **89** | 0.45x | ครบเท่า C ในแง่ decision-relevant | ต่ำ (เท่า C) |

### ตัวอย่างที่ 2: ความซับซ้อนสูง (subscription proration)

**(A) ต้นฉบับภาษาไทย**

```
เรียนทีมครับ พอดีมีเรื่องอยากจะปรึกษาหน่อยครับ คือตอนนี้ระบบ subscription ของเรามันมีปัญหาเรื่องการคิดเงินตอนลูกค้า
อัปเกรดหรือดาวน์เกรดแพ็กเกจกลางรอบบิลอ่ะครับ ซึ่งตอนนี้เราคิดแบบเต็มเดือนเลย ทำให้ลูกค้าบ่นกันเยอะมากว่ามันไม่แฟร์
แล้วทีม support ก็ต้องมานั่งคืนเงินให้ manual ทุกเคส ซึ่งมันเสียเวลามากๆ ครับ ผมเลยอยากให้เราทำ proration คือคิดเงิน
ตามสัดส่วนวันที่ใช้จริง แล้วก็อยากให้มันรองรับกรณีที่ลูกค้าเปลี่ยนแพ็กเกจหลายรอบในเดือนเดียวด้วยนะครับ เพราะเคยเจอเคส
ที่ลูกค้าเปลี่ยนสามรอบในเดือนเดียว แล้วระบบคิดเงินมั่วไปหมดเลย อ้อ แล้วก็เรื่อง currency ด้วยครับ ตอนนี้เรามีลูกค้าทั้งไทย
สิงคโปร์ แล้วก็ญี่ปุ่น ซึ่งค่าเงินไม่เหมือนกัน แล้วก็เรื่อง tax อีก VAT ของไทยคิด 7% แต่ของสิงคโปร์เป็น GST 9%
ไม่รู้ว่าจะจัดการยังไงดี ตอนนี้เราใช้ Stripe อยู่นะครับ แต่ก็ไม่แน่ใจว่า Stripe มันทำ proration ให้เราได้เลยไหม หรือเรา
ต้องเขียนเองทั้งหมด รบกวนช่วยวิเคราะห์หน่อยได้ไหมครับว่าควรจะออกแบบยังไง แล้วก็มี edge case อะไรที่เราควรจะระวังบ้าง
ขอบคุณมากครับทุกคน
```

**(B) แปลตรงเป็นอังกฤษ** (เก็บ hedging และ "Oh, and..." ไว้ครบ, 1,289 chars, ดูตัวเลขในตาราง)

**(C) Structured prompt**

```xml
<role>Billing systems architect. Audience: the engineering team that owns our subscription service.</role>

<context>
Current behaviour: mid-cycle plan changes are billed as a full month.
Consequences: customer complaints, and support issues every refund manually.
Payment provider: Stripe.
Markets: Thailand (VAT 7%), Singapore (GST 9%), Japan. Multiple currencies.
</context>

<requirements>
1. Proration: charge in proportion to days actually used.
2. Correct under N plan changes within one billing cycle (we have seen 3).
3. Multi-currency.
4. Per-market tax rates applied correctly.
</requirements>

<task>
1. State which of the 4 requirements Stripe covers natively and which need our own code.
   Name the Stripe objects involved.
2. Propose a design: data model, the calculation, and where it runs.
3. List edge cases with the expected behaviour for each. Cover at minimum: same-day multiple
   changes, downgrade to a cheaper plan producing a credit, currency change mid-cycle, tax rate
   change mid-cycle, refunds, and proration rounding.
</task>

<output_format>
Three sections matching the three tasks. Edge cases as a table: case, expected behaviour,
risk if unhandled.
Mark anything you are not certain about in Stripe's current behaviour as UNVERIFIED rather
than guessing.
</output_format>
```

**(D) Compressed prompt**

```
Billing design review. Stack: Stripe. Markets: TH (VAT 7%), SG (GST 9%), JP. Multi-currency.
Today: mid-cycle plan change bills a full month, so support refunds by hand.
Target: proration by days used, correct under repeated changes in one cycle (seen: 3),
multi-currency, per-market tax.
Deliver:
1. Stripe native vs our code, per requirement, naming the Stripe objects.
2. Design: data model, calculation, where it runs.
3. Edge-case table (case | expected | risk): same-day repeat changes, downgrade credit,
   mid-cycle currency change, mid-cycle tax change, refunds, rounding.
Mark uncertain Stripe behaviour UNVERIFIED.
```

| | chars | UTF-8 bytes | **o200k** | **cl100k** | vs. ไทย (o200k) | ความกำกวมที่เหลือ |
|---|---|---|---|---|---|---|
| A ไทย | 951 | 2,581 | **341** | **814** | 1.00x | สูงมาก: ไม่ได้บอกว่าอยากได้ analysis หรือ code, ไม่มี edge case list, "มั่วไปหมด" ไม่ใช่ spec |
| B อังกฤษ | 1,289 | 1,289 | **277** | **277** | 0.81x | สูงเท่า A |
| C structured | 1,298 | 1,298 | **277** | **279** | 0.81x | ต่ำ: edge case ถูก enumerate, มี UNVERIFIED rule กัน hallucination เรื่อง Stripe |
| D compressed | 622 | 622 | **147** | **149** | 0.43x | ต่ำเท่า C |

### สิ่งที่ตัวเลขบอก

1. **การแปลอย่างเดียวได้กำไรน้อย.** ไทย → อังกฤษ ประหยัดแค่ 19% (ตัวอย่าง 1) และ 24% (ตัวอย่าง 2) บน `o200k_base` และ **ไม่ลดความกำกวมเลย** เพราะ hedging กับ politeness ถูกแปลติดมาด้วย. ถ้า model ที่ใช้ยังเป็น `cl100k_base` การแปลประหยัดได้ 65% แต่นั่นคือกำไรจาก tokenizer ไม่ใช่จากภาษา.
2. **Structured prompt ไม่ได้ถูกลง มันดีขึ้น.** ตัวอย่าง 1 structured ใช้ 193 token เทียบกับไทย 195 และอังกฤษ 149 คือ **แพงกว่าอังกฤษดิบ 30%**. ตัวอย่าง 2 เท่ากันพอดีที่ 277. ประโยชน์ของ structured อยู่ที่คอลัมน์สุดท้ายของตาราง ไม่ใช่คอลัมน์ token. นี่คือ trade-off ที่ควรพูดตรง ๆ: **โครงสร้างจ่ายด้วย token เพื่อซื้อความแน่นอน**.
3. **กำไรจริงมาจากการตัด bloat ไม่ใช่จากการแปลหรือการใส่ tag.** compressed = 45% และ 43% ของต้นฉบับไทย, และ 59% / 53% ของอังกฤษดิบ โดยยัง **ไม่เสีย decision-relevant information** เลย.
4. **การ compress ในความหมายนี้ = การตัดสินใจแทนผู้ใช้.** เช่น "อยากให้มันส่ง SMS หรือไม่ก็ LINE" ถูกแปลเป็น "via SMS or LINE" แต่ยังไม่ตอบว่า "หรือ" แปลว่าให้เลือกอันเดียวหรือรองรับทั้งสอง. compressed prompt แก้ด้วยการบังคับให้ model คาย `Assumptions list` ออกมา ซึ่งเป็นทางออกที่ถูกกว่าการเดาแทน.

---

## 5. สิ่งที่ยืนยันไม่ได้ในงานนี้

Environment ที่ใช้ทำ research นี้ block egress ไปยัง `arxiv.org`, `aclanthology.org`, `openreview.net`, `huggingface.co`, `www.anthropic.com`, `platform.openai.com`, `cookbook.openai.com`, `research.trychroma.com`, `ora.ox.ac.uk`, `semanticscholar.org`, `alphaxiv.org`, `pythainlp.github.io`, `ai.google.dev`. เข้าถึงได้เฉพาะ `platform.claude.com`, `raw.githubusercontent.com`, `microsoft.com/research` และ web search. ผลที่ตามมา:

| ข้อ | สถานะ |
|---|---|
| ตัวเลข "drop over 20%" ของ lost-in-the-middle | **ยืนยันไม่ได้**, ได้จาก search summary. ตัว finding (U-shape) ยืนยันได้จาก repo ผู้เขียน |
| ตัวเลข 15x ของ Petrov et al. และรายละเอียดต่อภาษา (ไทยอยู่ตรงไหนในกราฟ) | **ยืนยันไม่ได้**, ไม่ได้อ่าน paper. ไม่พบตัวเลขเฉพาะภาษาไทยในงานนั้น |
| ตัวเลข Typhoon "2.62x more efficient than GPT-4" | **ยืนยันไม่ได้**, search summary เท่านั้น |
| ตัวเลข cross-lingual ทั้งหมดใน §3.2 (17.75% / 14.82% / 22.02%) | **ยืนยันไม่ได้**, search summary เท่านั้น |
| งานวิจัยที่วัด **ไทย vs อังกฤษ** ในการ prompt LLM โดยเฉพาะ | **หาไม่พบ**. ทุกอย่างใน §3.2 เป็นการ generalize จากภาษาอื่น ซึ่งไม่ควรถือเป็นข้อสรุปสำหรับไทย |
| "context rot" / "attention dilution" | **ไม่อ้างในโน้ตนี้** เพราะเข้าถึงแหล่งต้นทางไม่ได้ |
| token count จริงของ Claude | **วัดไม่ได้**, Anthropic ไม่เปิด public tokenizer และผมไม่มี API key สำหรับ `count_tokens`. ตัวเลขทั้งหมดเป็น OpenAI tokenizer ใช้เป็น proxy |
| OpenAI prompt engineering guide ตัวหลัก (platform.openai.com) | **เข้าไม่ได้**. ใช้ GPT-5 prompting guide จาก openai-cookbook repo แทน ซึ่งเป็น first-party เหมือนกัน |
| Google prompting guidance | **เข้าไม่ได้**, ไม่ได้อ้างในโน้ตนี้ |
| ตัวเลข "1.6x-2.9x" และ "2x-5x" ของ LLMLingua-2 | ได้จาก search summary ของ abstract. ตัวเลขอื่น (20x, 21.4%, 1/4 tokens, 3x-6x) ยืนยันจาก repo/MSR page |
| ผลกระทบต่อ **output quality** ของ 4 เวอร์ชันใน §4 | **ไม่ได้วัด**. ไม่ได้รัน A/B กับ model จริง. คอลัมน์ "ความกำกวม" เป็นการประเมินเชิงคุณภาพของผมเอง |

**ขั้นถัดไปที่จะเปลี่ยนโน้ตนี้จาก "มีเหตุผล" เป็น "มีหลักฐาน":** รัน eval จริงกับ prompt ทั้ง 4 เวอร์ชันใน §4 ต่อ model เป้าหมาย วัด output ด้วย rubric คงที่ (ตอบครบ requirement กี่ข้อ, เดาโดยไม่บอกกี่ครั้ง, ตรง output format ไหม) อย่างน้อย 5 runs ต่อเวอร์ชัน แล้วนับ token จริงด้วย `count_tokens` ของ model นั้น.

---

## Sources

### วัดเอง (measured)
- `js-tiktoken` v1.0.21 จาก npm, ranks `o200k_base` และ `cl100k_base`: https://github.com/dqbd/tiktoken
- อ้างอิง encoding ต้นทาง: https://github.com/openai/tiktoken และ https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py

### Primary, เข้าถึงโดยตรง
- Anthropic, Prompting best practices: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Anthropic, Token counting: https://platform.claude.com/docs/en/build-with-claude/token-counting
- OpenAI, GPT-5 prompting guide (openai-cookbook): https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/gpt-5_prompting_guide.ipynb
- Microsoft, LLMLingua repo: https://github.com/microsoft/LLMLingua
- Microsoft Research, LLMLingua publication: https://www.microsoft.com/en-us/research/publication/llmlingua-compressing-prompts-for-accelerated-inference-of-large-language-models/
- Microsoft Research, LLMLingua-2 publication: https://www.microsoft.com/en-us/research/publication/llmlingua-2-data-distillation-for-efficient-and-faithful-task-agnostic-prompt-compression/
- Nelson Liu, lost-in-the-middle repo: https://github.com/nelson-liu/lost-in-the-middle
- PyThaiNLP: https://github.com/PyThaiNLP/pythainlp

### Primary, อ้างได้แต่เข้าถึงไม่ได้จาก environment นี้ (secondhand)
- Liu et al., Lost in the Middle, TACL 2024: https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630/Lost-in-the-Middle-How-Language-Models-Use-Long | arXiv:2307.03172 | PDF: https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.arxiv2023.pdf
- Jiang et al., LLMLingua, EMNLP 2023: https://aclanthology.org/2023.emnlp-main.825/
- Jiang et al., LongLLMLingua, ACL 2024: https://aclanthology.org/2024.acl-long.91/
- Pan et al., LLMLingua-2, ACL 2024 Findings: https://aclanthology.org/2024.findings-acl.57/
- Petrov et al., Language Model Tokenizers Introduce Unfairness Between Languages: https://arxiv.org/abs/2305.15425
- Pipatanakul et al., Typhoon: Thai Large Language Models: https://arxiv.org/abs/2312.13951
- Better to Ask in English: https://arxiv.org/abs/2410.13153
- How and Where to Translate?: https://arxiv.org/abs/2507.22923
- Native vs Non-Native Language Prompting: https://arxiv.org/abs/2409.07054

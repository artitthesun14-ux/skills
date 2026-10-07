# Value chain analysis

Map how value moves from raw input to end user, then place the company on the map.

## Build the chain

Write the chain as ordered stages from input to end customer. Example for AI infrastructure:

```
Energy → Generation → Grid → Transformer → Switchgear → Data center → Server → GPU → HBM → AI model → End user
```

Use the stages the industry actually has; branch the chain where two inputs merge. For each stage, record:

| Stage | Key players | Concentration | Typical margin | Commoditized? | Constrained? |
| --- | --- | --- | --- | --- | --- |

Margins come from the players' filings (FACT) or are estimated from peers (INFERENCE, name the peers).

## Go deeper where the thesis leans

Start from one unit of the company's product at work (one chip taped out, one training run, one mile driven) and list what it consumes, phase by phase. Map each input to a stage. Then, for each stage the company depends on or that the thesis leans on, ask "what does this consist of?" and go one level deeper (GPU to HBM to DRAM to wafer to equipment). Stop when the next level stops adding economic understanding about this company, or evidence runs out. Done when every input on the list sits on the map or is named as excluded with the reason.

Stages far from the company stay one line each: the depth goes where the company's revenue, costs and risks are.

## Place the company

- **Where it sits**: which stage or stages, by revenue and by profit.
- **What it controls**: proprietary inputs, standards, customer relationships, capacity.
- **Which stages earn the highest economic profit**, and whether the company is in them.
- **Which stages are commoditized**, and how much of the company's revenue sits there.
- **Distance to the bottleneck**: in it, adjacent to it (supplies it or depends on it), or far from it.

## Neighbours

Name the real companies around the company, not the whole industry:

- **Peers** in the same stage, compared on the same figures in `company-analysis.md`.
- **Substitutes**: what a customer could use instead, and at what cost.
- **Customers building in-house**: who is large enough to make it themselves, and any announced program.
- **Chokepoint suppliers**: a sole source or a two- or three-player oligopoly that gates the company's own output, including one hidden behind a larger business.

## What to conclude

The value chain step ends with one sentence on where economic profit pools in this chain and how much of that pool the company touches. That sentence feeds the bottleneck and economic capture steps.

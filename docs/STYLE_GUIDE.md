# Style guide

Read this before adding a chapter, writing a panel, or making editorial decisions about voice. The doc has a few rules that matter; they came out of conversations during the project's design and they exist for specific reasons. Hold them.

---

## What this doc is for

A visual on-ramp to federal IT compliance for people coming into the world cold. Not a comprehensive reference. Not a textbook. A first read for someone who got dropped into a fed IT job, or is adjacent to one, or is trying to break in, and needs to understand how the pieces hang together — fast enough to not look lost, slow enough to actually understand.

The audience is the **inheritor**, not the **builder**. Most people enter federal IT by walking into a job that already has an ATO, an SSP, and a stack of POA&Ms. They don't build the compliance program — they inherit it and have to figure out what the senior people are talking about. We write for them. Anyone who's actually setting up a program from scratch gets a wink at the end of their branch (the `<GoodLuck>` end-cap) but the chapters themselves don't address them.

---

## Voice

- Plain English. No consultant-speak. No frame-words ("phase transition," "load-bearing," "compounding leverage"). Each sentence should make a concrete claim a non-PhD reader can verify.
- Senior-coworker register. Like the ISSO sitting next to you who says "let me actually explain this" before launching into the topic. Patient, knowing, occasionally wry. Not a textbook. Not a marketing illustration.
- Acknowledge the absurdity where it's absurd. *"Yes, there are 945 controls in NIST 800-53. No, you don't need to memorize them."*
- Define an acronym the first time it appears in a chapter. Use the acronym after. Cross-link the glossary.
- First-person occasional. *"Here's what tripped me up the first time I saw an SSP."* Use sparingly — the first-person is a flavor, not a frame.
- No grand declarations. No "and that's why federal IT matters." If the reader needs that conclusion stated, the chapter failed.

---

## The Frame — every concept gets one

Every concept (FISMA, NIST 800-53, SSP, POA&M, STIG, ATO, etc.) is introduced with **The Frame** — two stacked panels at the top of its section, before any prose.

### The W's Panel — institutional view

`<WPanel>` with five fields. Same content for every reader. The "outside-in" view: what is this thing, from the system's perspective.

| Field | What goes here |
|---|---|
| **Who** | Who owns it / authors it / is accountable |
| **What** | What it actually is — one or two sentences |
| **Where** | Where it sits in the chain. Where you'll encounter it in real life. |
| **Why** | Why it exists. The motivation, not the mechanism. |
| **How** | How it gets implemented in practice — STIG XYZ, CIS Benchmark Q, vendor guide. The implementation gap closed. |

### The You Panel — personal view

`<YouPanel persona="...">` — the personal counterpart to the W's. Under the v2 architecture each persona's chapter wrapper carries exactly one, for that persona. Answers the questions the W's don't:

- *"How does this apply to me?"*
- *"What does this have to do with me?"*
- *"How do I do my job related to this?"*

The You Panel does the psychological work. The reader doesn't have to translate from the institutional view to their own situation — it's already been translated for them.

Visibility is gated by the active persona (`data-active-persona` on `<html>`, set by the FOUC-safe head script in `PageLayout`). On a persona-routed chapter the URL is authoritative — `/jordan/foundation/fisma` renders with `data-active-persona="jordan"` regardless of prior localStorage — so a shared link always shows the right persona's panel. On non-persona pages (home, reference chapters) the active persona falls back to localStorage.

### Hard writing rule for You panels

**The question should never require the answer.**

Every actionable item — every "first-week move," every "what to do," every suggested question to ask a boss/ISSO/senior — must work BEFORE the reader has the chapter's vocabulary, not after. Open questions, not specific ones.

Wrong (assumes the reader knows the distinction the chapter is teaching):
> Ask your ISSO: "Do we POA&M scan findings or only structural items?"

Right (open enough to teach the reader through the answer):
> Ask your ISSO how POA&Ms are handled at this shop.

The right version also pays off in the workplace sense — open questions get the senior to actually explain context instead of giving a yes/no, and they don't make the new person look like they're testing their boss.

### Composition architecture: cores + wrappers

**Chapters are composed, not duplicated.** Each chapter concept (FISMA, A-130, NIST publications, etc.) has ONE shared institutional core at `src/cores/{slug}.mdx`. Each persona's chapter at `src/content/chapters/{persona}/{section}/{slug}.mdx` is a thin wrapper that imports the core via the `@cores/*` path alias and surrounds it with persona-specific prose.

**What goes in the core (shared):**

- The `<WPanel>` (institutional Who / What / Where / Why / How — same facts for everyone)
- Brief institutional framing paragraphs (the "useful mental shape" intro that follows the W's)
- Standalone institutional content blocks (numbered lists like "The 20 control families," anatomy walkthroughs, baselines tables)
- `<InTheField>` callouts (variance notes about institutional reality — these are persona-agnostic; an InTheField about how POA&M scope varies is true regardless of who's reading)

**What stays in the persona wrapper (per-persona):**

- Frontmatter (`title`, `order`, `personas: [persona]`, `summary`, plus `isFinal: true` if it's that persona's last chapter)
- Cold open paragraphs (persona voice — Sam, Tom, Jordan, etc. each open differently)
- The persona's `<YouPanel persona="...">` — how the concept reaches this persona's day, plus the "first-week move" actionable. One panel, this persona only; it's the wrapper's persona-specific payload, visually separated from the shared institutional core.
- The "What's next" pointer (can be tonally persona-specific)
- The persona's `<GoodLuck>` end-cap if this is their final chapter

**Example wrapper pattern:**

```mdx
---
title: "FISMA"
order: 1
personas: [sam]
summary: "..."
---

import FismaCore from "@cores/fisma.mdx";

[Sam-voiced cold open — 2-3 sentences setting tone for Sam's situation.]

<FismaCore />

<YouPanel persona="sam">
[Sam-specific direct address — how FISMA reaches Sam's day, written as the persona's take on the concept and visually separated from the institutional core above.]

**First-week move:** [Sam-specific action — open question per the question-never-requires-the-answer rule.]
</YouPanel>

## What's next

[Sam-tone pointer to the next chapter in his walk.]
```

**Why this matters:**

- **Fix once, applies everywhere.** A correction to a NIST fact in the W's panel updates all 5 persona chapters automatically.
- **Per-persona writing stays cheap.** A new persona wrapper is ~2KB of prose, not a full chapter copy.
- **No drift.** The institutional content can't accidentally drift between persona versions over time because there's only one source.
- **Scales to new personas.** Adding a 6th persona later means writing 10 small wrappers, not 10 full chapters.

The core files live at `src/cores/` (outside the content collection — they're not chapters themselves, just shared content). The `@cores/*` path alias is configured in `tsconfig.json`. MDX imports of other MDX work via Astro's MDX integration; the imported MDX renders inline when the imported component is used as JSX.

**Critical: each core MDX must import its own components directly.**

The dynamic chapter route at `src/pages/[...slug].astro` passes Frame components (`WPanel`, `YouPanel`, `InTheField`, `GoodLuck`) into the persona wrapper via `<Content components={...} />`. That injection works for the wrapper's own MDX scope but does NOT cascade into nested MDX modules that the wrapper imports. The imported core MDX has its own isolated module scope.

So every core that uses Frame components must import them itself at the top of the file:

```mdx
import WPanel from "../components/WPanel.astro";
import InTheField from "../components/InTheField.astro";

{/* core content */}

<WPanel title="..." who="..." what="..." where="..." why="..." how="..." />

<InTheField>...</InTheField>
```

This is actually better than relying on provider-cascade — each core documents its own dependencies and renders correctly regardless of who imports it.

### Hard scope rule

**The defense contractor fork (CMMC + NIST SP 800-171 + DFARS clause 252.204-7012) is out of scope for this guide.** The author doesn't have direct lived experience with private-contractor CMMC environments and won't write speculatively about that fork. The Forks chapter names it for orientation and points readers at official sources (CMMC AB / DoD CIO / NIST 800-171) and practitioner-written content; no dedicated CMMC/800-171/DFARS chapter should be written without a contributor who lives in that world. Same caution applies to **classified work** (CNSSI 1253 / ICD 503 / JSIG / SAP) — named for orientation, depth deferred until a cleared practitioner contributes. Writing speculatively in either area would put bad guidance under the author's name and undermine the rest of the doc.

### Hard writing rule for callouts and prose

**Don't invent fed-IT in-meeting dialogue or social dynamics.**

If a claim about how people talk in this world isn't grounded in lived experience, don't make it. Speculating that "people in meetings will say X" or "your boss will frame this as Y" invents friction the reader won't actually encounter — and worse, primes them to misread real situations.

Wrong (Claude invented this; nobody actually says it):
> When someone in a meeting says "we need to be FISMA compliant," they almost always mean "we need to satisfy the NIST RMF process for our agency."

Right (grounded in what actually happens to new people):
> Most people in federal IT don't talk about FISMA day-to-day. You might hear it once from a senior — usually framed as "FISMA is the law, everything else derives from it" — and then it sits as background.

When in doubt about whether a workplace-dynamic claim is real, leave it out. The doc loses nothing by not making the claim. It loses credibility when it makes one that isn't true.

---

## In the field — variance callout

A lot of federal IT practice varies meaningfully by org, by mission, by environment. R&D vs. commodity datacenter. Civilian vs. DoD vs. IC. Narrow POA&M practice vs. broad POA&M practice.

When a concept has meaningfully different real-world implementations, drop an `<InTheField>` callout that names the variance honestly. The reader who walks into a different shop than the one we wrote about shouldn't feel lied to.

Example (POA&Ms):

> **In the field.** POA&M scope varies by organization. Some shops use them only for big-ticket structural items (OS/hardware migrations, architecture changes); others track every scan finding above a severity threshold. R&D environments tend toward narrow because migrations are heavy projects; commodity datacenters tend toward broad because patching is cheap. Find out which pattern your shop runs before you assume.

---

## GoodLuck end-caps

Each persona's last chapter ends with a `<GoodLuck persona="...">` sticky-note. The pattern: name the harder thing the doc DOESN'T cover for that persona, wish them luck (with the 😂), add one beat of real advice anyway.

Self-aware, light, signals the doc knows its limits, treats the reader like someone who can take a joke.

The drafted versions (Sam / Jordan / Gary / Tom / Jarod) are in the project memory and the per-chapter content files. Don't drift the tone — they should feel like they were all written by the same person on the same afternoon.

---

## Personas

| Persona | Who they are | Path through the doc |
|---|---|---|
| **Sam** | Federal contractor, came in cold via tech skills | Full federal chain: FISMA → NIST → agency overlays → STIGs → ATO + SSP + POA&Ms in operation |
| **Jordan** | Healthcare IT lead | HIPAA + HITECH + NIST CSF + HHS audits; touches federal where govcloud or fed touch applies |
| **Gary** | Tech company with federal customers | FedRAMP, the customer-side reasons, audit cadence, roadmap impact |
| **Tom** | Pure private sector, zero federal exposure | The trickle-down (vendor certs, state laws, insurance, court precedent, free public goods like CIS) and the "surprise pull-in" moment |
| **Jarod** | Wants to break into federal IT | The chain at high level, what jobs exist, how to read a job posting, what to study |

Chapter `personas` tagging under the v2 architecture:
- Each persona wrapper is tagged with **exactly its own persona** — `personas: [sam]` for files under `src/content/chapters/sam/`, `personas: [jordan]` for `jordan/`, and so on. The single-persona tag is what places the chapter in that persona's ordered walk (prev/next).
- Shared **reference chapters** (glossary, bookshelf, about) are tagged with all five — `personas: [sam, jordan, gary, tom, jarod]`. A multi-persona tag keeps them out of every walk: they're lookups, not walk steps, so they get no prev/next.
- An empty tag (`personas: []`) keeps a file out of every walk and every persona — used only for retired/stub pages.

---

## Adding a chapter — the checklist

Under the v2 architecture, adding a chapter means writing **one core** plus **five persona wrappers**.

1. **Write the core** at `src/cores/<slug>.mdx`:
   - Import the Frame components the core uses directly at the top (`import WPanel from "../components/WPanel.astro";` etc.) — component injection does **not** cascade into imported MDX.
   - Open with `<WPanel>` — fill all five W fields. Don't skip "How"; if the implementation gap doesn't apply, say so explicitly ("This is a process artifact, not a technical control — implementation lives in your GRC tool of choice.").
   - Add institutional framing prose, standalone content blocks, and any `<InTheField>` callouts (variance is persona-agnostic — it belongs in the core).
   - The core has **no frontmatter** and is **not** in the content collection.
2. **Write five persona wrappers** at `src/content/chapters/<persona>/<section>/<slug>.mdx`, one per persona:
   - Frontmatter: `title`, `order`, `personas: [<that persona>]`, `summary`; add `isFinal: true` if it's that persona's last chapter.
   - Import the core (`import XCore from "@cores/<slug>.mdx";`), then: persona-voiced cold open (2-3 sentences) → `<XCore />` → `<YouPanel persona="<persona>">` with that persona's take and "first-week move" → `## What's next` pointer.
   - Run every actionable through the **question-should-never-require-the-answer** check.
   - If `isFinal`, add a `<GoodLuck persona="<persona>">` end-cap.
3. Keep `order` consistent across all five wrappers for the same concept, so the walks stay parallel.
4. Cite NIST publication numbers and section anchors when making factual claims (in the core — that's where the facts live). The verification surface for the reader is wide enough already; don't make them go fishing.
5. Note anything that might have moved since the May 2025 knowledge cutoff (CMMC has been shifting, FedRAMP has been re-architecting authorization paths, NIST 800-53 rev 6 was in draft) so a future-revisit can re-verify.

---

## Verification practice

The author (currently a Claude) is generating prose against fed-IT subject matter. The editor (Beeto) has lived experience but can't verify everything. To narrow the verification surface:

- Cite NIST publication number + section anchor on factual claims.
- Flag clearly when summarizing vs. paraphrasing vs. inventing connective tissue.
- Note things that may have moved since the knowledge cutoff.
- Web-search for current state when the claim is fact-shaped.
- Keep a `to-verify.md` running list per chapter so spot-checks are scoped.

The goal isn't "trust nothing." It's narrowing the surface so trust-but-verify doesn't mean verify every line.

---

## Visual

Storybook style, in the spirit of David Macaulay's *The Way Things Work*. Warm parchment background, dark warm ink, small accents of warm orange. Not enterprise-blue. Not corporate vector. Not undraw.

For AI-generated illustrations, use the locked prompt scaffold in `docs/IMAGE_PROMPT_TEMPLATE.md`. Don't break the style lock for one image without updating the doc and regenerating anchor references first.

---

## What this doc is NOT

- Not a comprehensive NIST reference. The official docs do that and we're not competing with them.
- Not an audit prep guide. The reader should be able to walk into an audit understanding what's happening, but we're not selling certification.
- Not a how-to-build-from-scratch guide. The audience is the inheritor.
- Not legal advice. Not security advice. The doc explains the world; it doesn't make decisions for the reader.

When in doubt, ask: would the version of the reader who's coming into this cold understand this without needing to look anything up first? If no, simplify.

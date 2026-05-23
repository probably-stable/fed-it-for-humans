# fed it for humans

A visual on-ramp to federal IT compliance.

This is an interactive, illustrated guide to how federal IT actually works: FISMA at the top, all the way down to STIGs and CIS Benchmarks at the implementation layer. Written for the person coming into this world cold and trying to figure out how the pieces hang together.

## Audience

People new to federal IT compliance who need to understand:

- The chain from FISMA to OMB to NIST to agency overlays to product hardening
- Where the chain forks (federal direct, defense contractor, classified, cloud, industry standards)
- What "how to apply this" actually means at the implementation layer
- The acronyms, in plain English

The site reshapes around five reader personas: Sam (federal contractor), Jordan (healthcare), Gary (tech company with federal customers), Tom (regular private-sector IT), Jarod (wants to break in). Pick one on the home page and you're routed into a chapter set written for your situation — each persona has its own full walk through the material at `/{persona}/...`.

## What this guide is NOT

- Authoritative legal or compliance advice (the official sources are; this is the orientation read).
- A deep CMMC / NIST 800-171 / DFARS reference. The defense-contractor fork is intentionally **out of scope** — open for a contributor with direct experience.
- A guide to classified work. Named for orientation; depth deferred until a cleared practitioner contributes.

See `docs/STYLE_GUIDE.md` for the full editorial discipline and `/reference/about` for scope notes.

## Stack

- Astro 6: static site framework
- Tailwind CSS 4: utility-first styling via Vite plugin
- React: Astro islands for interactive components (chain map is built on this)
- MDX: chapter content (prose + illustrations + embedded interactives in one file)
- @xyflow/react: the interactive chain map on the home page

## Develop

```sh
npm install
npm run dev
```

Then open http://localhost:4321.

## Build

```sh
npm run build
```

Output goes to `dist/`.

## Documentation

- `docs/STYLE_GUIDE.md` — The Frame model, persona system, voice and writing rules, hard scope rules. Read this before adding a chapter.
- `docs/IMAGE_PROMPT_TEMPLATE.md` — master AI image prompt template for storybook-style illustrations.

## Project status

**v2 persona-routed architecture complete.** Each of the five personas has a full ten-chapter walk through the material:

- **Foundation:** FISMA → OMB A-130 → NIST publications → NIST RMF → NIST SP 800-53 → Agency overlays → STIGs + CIS Benchmarks
- **Forks:** The forks (orientation) → FedRAMP → Industry standards
- **Reference (shared):** Glossary → Bookshelf → About

Chapters are **composed, not duplicated**. Each chapter concept has one shared institutional core at `src/cores/{slug}.mdx`; each persona's chapter at `src/content/chapters/{persona}/{section}/{slug}.mdx` is a thin wrapper that imports the core and surrounds it with persona-specific prose. A fix to a NIST fact in a core updates all five persona chapters at once. See `docs/STYLE_GUIDE.md` for the full composition architecture.

**Built and verified end-to-end:** five persona walks (50 chapters over 10 cores), the interactive chain map on the home page (react-flow with click-to-navigate), persona-aware YouPanels and GoodLuck endcaps, per-persona prev/next navigation, persona indicator bar on every chapter page, custom 404 with chapter index, GitHub Actions deploy workflow. Production build: 55 pages, zero errors.

Open gates before publishing:

- Set `site:` (and `base:` if deploying as a GitHub Pages project page) in `astro.config.mjs`. This activates sitemap generation.
- Pick a license (likely MIT for code + CC-BY-SA for content).

Next pass:

- AI-generated storybook illustrations per chapter (prompt template at `docs/IMAGE_PROMPT_TEMPLATE.md`)
- Persona-aware highlighting on the chain map (active persona's path lit up)
- Reader feedback iteration on chapter content

## Contributing

The project welcomes contributions, especially:

- Defense contractor (CMMC / NIST 800-171 / DFARS) chapter — open for a practitioner with direct experience
- Classified work — for cleared practitioners
- State / local / tribal government IT compliance
- Corrections, additions, new personas

Open issues and pull requests on GitHub.

## Author

Jonathan Villarreal — [linkedin.com/in/keeping-it-rreal](https://linkedin.com/in/keeping-it-rreal)

## License

License TBD — pick before publishing. Likely MIT (for code) + CC-BY-SA (for content).

# fed it for humans

A visual on-ramp to federal IT compliance.

**Live site:** https://probably-stable.github.io/fed-it-for-humans/

This is the source for a published doc site, not a local-run app. End users read the live site. The repo is here for transparency, corrections, and contributions.

## What the site is

An interactive, illustrated guide to how federal IT works: FISMA at the top, down to STIGs and CIS Benchmarks at the implementation layer. Written for the person coming into this world cold and trying to figure out how the pieces hang together.

The site reshapes around five reader personas: Sam (federal contractor), Jordan (healthcare), Gary (tech company with federal customers), Tom (regular private-sector IT), Jarod (wants to break in). Pick one on the home page and you're routed into a chapter set written for your situation. Each persona has a full ten-chapter walk through the material at `/{persona}/...`.

## What this guide is NOT

- Authoritative legal or compliance advice. The official sources are the ground truth; this is the orientation read.
- A deep CMMC / NIST 800-171 / DFARS reference. The defense-contractor fork is intentionally out of scope, open for a contributor with direct experience.
- A guide to classified work. Named for orientation; depth deferred until a cleared practitioner contributes.

Full scope notes at https://probably-stable.github.io/fed-it-for-humans/reference/about/.

## Repo layout

- `src/cores/`: shared institutional content (W's panels, framing prose, In-the-field callouts). One file per chapter concept.
- `src/content/chapters/{persona}/{section}/`: per-persona chapter wrappers. Each imports its core and adds persona-specific intro, YouPanel, outro.
- `src/content/chapters/reference/`: shared reference chapters (glossary, bookshelf, about).
- `src/components/`: Astro and React components (chain map, frame panels, persona picker, footer).
- `src/lib/`: persona state, base-URL helpers, rehype plugin.
- `src/pages/`, `src/layouts/`, `src/styles/`: routing, layout, design tokens.
- `docs/STYLE_GUIDE.md`: editorial discipline (voice, the Frame model, composition architecture). Read this before adding a chapter.
- `docs/IMAGE_PROMPT_TEMPLATE.md`: master prompt for the planned storybook illustrations.
- `.github/workflows/deploy.yml`: GitHub Actions build + deploy to GitHub Pages on every push to `main`.

## Hosting

GitHub Pages, deployed by `.github/workflows/deploy.yml`. The workflow reads two repository variables:

- `SITE_URL`: origin where the site is served (e.g. `https://probably-stable.github.io`)
- `BASE_PATH`: subpath if deployed as a project page (e.g. `/fed-it-for-humans`)

`astro.config.mjs` throws on `astro build` if `SITE_URL` is unset, so the workflow fails loudly rather than ship localhost canonical URLs.

## Contributing

Pull requests and issues welcome. The areas that most need contributors with direct experience:

- Defense contractor (CMMC / NIST 800-171 / DFARS) chapter
- Classified work (for cleared practitioners writing at the level the doc allows publicly)
- State / local / tribal government IT compliance
- Corrections and additions to existing chapters

Voice + structure rules are in `docs/STYLE_GUIDE.md`. The composition architecture (shared cores, per-persona thin wrappers) is documented there. A chapter addition is one new core plus five persona wrappers.

If you need to preview a contribution locally, the standard Astro toolchain applies (`npm install`, then `npm run build` to verify the build succeeds). Running a dev server isn't required for content edits; the live site is the canonical preview after merge.

## Author

Jonathan Villarreal, [linkedin.com/in/keeping-it-rreal](https://linkedin.com/in/keeping-it-rreal)

## License

Dual-licensed:

- **Code** (Astro components, TypeScript, build config): MIT. See [`LICENSE`](LICENSE).
- **Written content** (chapters, cores, glossary, this README, STYLE_GUIDE, etc.): CC-BY-SA-4.0. See [`LICENSE-CONTENT`](LICENSE-CONTENT).

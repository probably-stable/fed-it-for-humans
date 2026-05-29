// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `site` and `base` come from environment variables so the build can be
// configured per-deployment without editing this file:
//   SITE_URL=https://example.com npm run build
//   BASE_PATH=/fed-it-for-humans   (only for GitHub Pages project pages)
//
// Build-time guard: production builds (`astro build`) MUST have SITE_URL set,
// otherwise canonical / og:url / sitemap entries get stamped with
// localhost:4321 in every page. We throw early so the deploy workflow fails
// loudly instead of shipping broken meta tags.
const isBuild = process.argv.includes('build');
const SITE_URL = process.env.SITE_URL;
const BASE_PATH = process.env.BASE_PATH;

if (isBuild && !SITE_URL) {
  throw new Error(
    [
      '',
      'SITE_URL is required for `astro build`.',
      'Set it before building, e.g.:',
      '  SITE_URL=https://example.com npm run build',
      '  SITE_URL=https://probably-stable.github.io BASE_PATH=/fed-it-for-humans npm run build',
      '',
      'Without it, every built page would have localhost:4321 in its canonical and og:url meta tags.',
      '',
    ].join('\n'),
  );
}

// https://astro.build/config
export default defineConfig({
  ...(SITE_URL ? { site: SITE_URL } : {}),
  ...(BASE_PATH ? { base: BASE_PATH } : {}),

  integrations: [react(), mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});

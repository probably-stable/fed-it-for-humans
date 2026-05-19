// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Set `site` (and `base` if deploying as a project page) before publishing.
  // Sitemap requires `site` to be configured.
  //
  // For GitHub Pages project deployment at <user>.github.io/fed-it-for-humans:
  //   site: 'https://<your-username>.github.io',
  //   base: '/fed-it-for-humans',
  //
  // For a custom domain (recommended once available):
  //   site: 'https://your-domain.example',

  integrations: [react(), mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});

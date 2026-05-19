/**
 * Content collections — defines the chapters collection for the site.
 *
 * Each chapter is an MDX file under src/content/chapters/. Frontmatter is
 * validated against the schema below. The dynamic route at
 * src/pages/[...slug].astro reads from this collection.
 */

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const chapters = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/chapters",
  }),
  schema: z.object({
    title: z.string(),
    /* order within the foundation/persona path; lower = earlier */
    order: z.number().default(100),
    /* which personas should see this chapter in their flow */
    personas: z.array(
      z.enum(["sam", "jordan", "gary", "tom", "jarod"]),
    ),
    /* one-line summary used in chapter index / preview cards */
    summary: z.string().optional(),
    /* set true on the LAST chapter in a persona's path; renders <GoodLuck> */
    isFinal: z.boolean().default(false),
  }),
});

export const collections = { chapters };

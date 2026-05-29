/**
 * rehype-base-url
 *
 * Prefixes internal absolute hrefs (starting with /) inside MDX-rendered HTML
 * with the configured base path. Without this, MDX markdown links of the form
 * [text](/sam/foundation/fisma) render with raw "/sam/..." hrefs into the
 * built HTML, which 404 on a project-page deploy (e.g. /fed-it-for-humans/).
 *
 * Skips:
 *   - external links (// or scheme://)
 *   - fragments and queries (start with # or ?)
 *   - hrefs already prefixed with the base
 *   - non-string href values
 *
 * Usage in astro.config.mjs:
 *   mdx({ rehypePlugins: [[rehypeBaseUrl, "/fed-it-for-humans"]] })
 *
 * Pass "" or "/" to disable.
 */
export function rehypeBaseUrl(base = "/") {
  const cleanBase = (base || "/").replace(/\/$/, "");
  return function transformer(tree) {
    if (!cleanBase) return;
    walk(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "a") return;
      const href = node.properties && node.properties.href;
      if (typeof href !== "string") return;
      if (!href.startsWith("/")) return;
      if (href.startsWith(cleanBase + "/")) return;
      if (href.startsWith("//")) return;
      node.properties.href = cleanBase + href;
    });
  };
}

function walk(node, fn) {
  if (!node) return;
  fn(node);
  const children = node.children;
  if (!children) return;
  for (let i = 0; i < children.length; i++) {
    walk(children[i], fn);
  }
}

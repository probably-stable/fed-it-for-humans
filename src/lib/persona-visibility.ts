/**
 * Persona visibility — runs on every page after the head-inline script has
 * already set [data-active-persona] on <html>. This module's job is to keep
 * that attribute in sync when persona changes (picker click, other tab,
 * etc.). The CSS rules in global.css do the actual show/hide work.
 *
 * The head-inline FOUC-safe script lives in PageLayout.astro.
 */

import { getPersona, subscribe, type Persona } from "./persona";

function applyAttribute(active: Persona | null) {
  document.documentElement.setAttribute(
    "data-active-persona",
    active ?? "none",
  );
}

export function initPersonaVisibility() {
  // attribute is already set by the head-inline script — but call once to
  // self-heal in case anything diverged
  applyAttribute(getPersona());
  subscribe(applyAttribute);
}

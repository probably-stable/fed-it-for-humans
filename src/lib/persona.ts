/**
 * Persona state — vanilla module that holds the active reader persona.
 *
 * Used across React/Astro islands (YouPanel, GoodLuck, persona-dependent UI).
 * Persists to localStorage so the choice survives reloads + new tabs.
 *
 * Why not React Context: Astro islands don't share a React tree. A vanilla
 * module + storage event listeners is the cleanest cross-island sync.
 *
 * All localStorage access is wrapped in try/catch — private browsing modes
 * and aggressive privacy settings can throw on storage access.
 */

export type Persona = "sam" | "jordan" | "gary" | "tom" | "jarod";

export const PERSONAS: Persona[] = ["sam", "jordan", "gary", "tom", "jarod"];

export const PERSONA_LABELS: Record<Persona, string> = {
  sam:    "I work in federal IT",
  jordan: "I work in healthcare IT",
  gary:   "I work at a tech company that sells to the feds",
  tom:    "I work in regular private-sector IT",
  jarod:  "I want to break into federal IT",
};

export const PERSONA_SHORT: Record<Persona, string> = {
  sam:    "Sam",
  jordan: "Jordan",
  gary:   "Gary",
  tom:    "Tom",
  jarod:  "Jarod",
};

const STORAGE_KEY = "fed-it-persona";

type Listener = (p: Persona | null) => void;
const listeners = new Set<Listener>();

function isPersona(value: unknown): value is Persona {
  return typeof value === "string" && (PERSONAS as string[]).includes(value);
}

function safeGet(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function safeSet(value: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage disabled / quota exceeded — silently degrade */
  }
}

function safeRemove(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* see above */
  }
}

export function getPersona(): Persona | null {
  if (typeof window === "undefined") return null;
  const raw = safeGet();
  return isPersona(raw) ? raw : null;
}

export function setPersona(p: Persona): void {
  if (typeof window === "undefined") return;
  safeSet(p);
  listeners.forEach((fn) => fn(p));
  // also fire a custom event for cross-island sync within the same tab
  window.dispatchEvent(new CustomEvent("persona:change", { detail: p }));
}

export function clearPersona(): void {
  if (typeof window === "undefined") return;
  safeRemove();
  listeners.forEach((fn) => fn(null));
  window.dispatchEvent(new CustomEvent("persona:change", { detail: null }));
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  // also listen for native storage events (different tabs)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      const next = isPersona(e.newValue) ? e.newValue : null;
      fn(next);
    }
  };
  const onCustom = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    fn(isPersona(detail) ? detail : null);
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
    window.addEventListener("persona:change", onCustom);
  }
  return () => {
    listeners.delete(fn);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("persona:change", onCustom);
    }
  };
}

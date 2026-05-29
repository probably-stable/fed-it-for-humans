/**
 * ChainMap — interactive visual of the federal compliance chain.
 *
 * Foundation chain runs top to bottom in the center; forks branch off at
 * the agency-overlays layer; industry standards sits parallel on the left.
 * Out-of-scope forks (defense contractor, classified) get a dashed-border
 * "this is real but this guide doesn't cover it in depth" treatment.
 *
 * Click a node → navigate to the active persona's chapter for that node.
 *
 * Accessibility: react-flow's pixel-positioned nodes are mouse-only, so a
 * visually-hidden parallel <ul> mirrors every node as a real <a>. Keyboard
 * users, screen readers, and JS-off readers all have an accessible path to
 * every chapter on the map.
 *
 * Astro island via client:load. Lives at src/components/ChainMap.tsx.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type Persona = "sam" | "jordan" | "gary" | "tom" | "jarod";
const PERSONAS: Persona[] = ["sam", "jordan", "gary", "tom", "jarod"];
const DEFAULT_PERSONA: Persona = "sam";

function isPersona(v: unknown): v is Persona {
  return typeof v === "string" && (PERSONAS as string[]).includes(v);
}

type ChainVariant = "foundation" | "fork" | "out-of-scope" | "parallel";

type ChainNodeData = {
  label: string;
  sublabel?: string;
  slug: string;
  variant: ChainVariant;
};

type ChainNode = Node<ChainNodeData, "chain">;

/* ──────── Custom node component ──────── */

function ChainNodeComponent({ data }: NodeProps<ChainNode>) {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="chainmap-node-inner">
        <div className="chainmap-node-label">{data.label}</div>
        {data.sublabel && <div className="chainmap-node-sublabel">{data.sublabel}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </>
  );
}

const nodeTypes = { chain: ChainNodeComponent };

/* ──────── Node + edge definitions ──────── */

const NODES: ChainNode[] = [
  // foundation chain — center column, top to bottom
  { id: "fisma", type: "chain", position: { x: 380, y: 0 }, data: { label: "FISMA", sublabel: "the law", slug: "foundation/fisma", variant: "foundation" } },
  { id: "a130", type: "chain", position: { x: 380, y: 110 }, data: { label: "OMB Circular A-130", sublabel: "the policy", slug: "foundation/omb-a130", variant: "foundation" } },
  { id: "nist-pubs", type: "chain", position: { x: 380, y: 220 }, data: { label: "NIST publications", sublabel: "FIPS + SP 800 series", slug: "foundation/nist-publications", variant: "foundation" } },
  { id: "rmf", type: "chain", position: { x: 380, y: 330 }, data: { label: "RMF", sublabel: "the 7-step lifecycle", slug: "foundation/nist-rmf", variant: "foundation" } },
  { id: "800-53", type: "chain", position: { x: 380, y: 440 }, data: { label: "NIST SP 800-53", sublabel: "the controls catalog", slug: "foundation/nist-800-53", variant: "foundation" } },
  { id: "agency-overlays", type: "chain", position: { x: 380, y: 550 }, data: { label: "Agency overlays", sublabel: "agency-specific tailoring", slug: "foundation/agency-overlays", variant: "foundation" } },
  { id: "stigs-cis", type: "chain", position: { x: 380, y: 660 }, data: { label: "STIGs & CIS Benchmarks", sublabel: "the implementation layer", slug: "foundation/stigs-and-cis", variant: "foundation" } },

  // forks — branching from agency-overlays out to the right
  { id: "fedramp", type: "chain", position: { x: 720, y: 500 }, data: { label: "FedRAMP", sublabel: "cloud services", slug: "forks/fedramp", variant: "fork" } },
  { id: "defense-contractor", type: "chain", position: { x: 720, y: 580 }, data: { label: "Defense contractor", sublabel: "out of scope — CMMC / 800-171", slug: "forks/the-forks", variant: "out-of-scope" } },
  { id: "classified", type: "chain", position: { x: 720, y: 660 }, data: { label: "Classified", sublabel: "out of scope — CNSSI 1253 / ICD 503", slug: "forks/the-forks", variant: "out-of-scope" } },

  // industry standards — parallel column on the left, runs alongside the whole chain
  { id: "industry-standards", type: "chain", position: { x: 60, y: 330 }, data: { label: "Industry standards", sublabel: "SOC 2 · ISO 27001 · PCI · HIPAA · CSF", slug: "forks/industry-standards", variant: "parallel" } },
];

const EDGES: Edge[] = [
  { id: "e1", source: "fisma", target: "a130" },
  { id: "e2", source: "a130", target: "nist-pubs" },
  { id: "e3", source: "nist-pubs", target: "rmf" },
  { id: "e4", source: "rmf", target: "800-53" },
  { id: "e5", source: "800-53", target: "agency-overlays" },
  { id: "e6", source: "agency-overlays", target: "stigs-cis" },
  { id: "e-fedramp", source: "agency-overlays", target: "fedramp" },
  { id: "e-defense", source: "agency-overlays", target: "defense-contractor", style: { strokeDasharray: "6 4", opacity: 0.5 } },
  { id: "e-classified", source: "agency-overlays", target: "classified", style: { strokeDasharray: "6 4", opacity: 0.5 } },
  {
    id: "e-industry",
    source: "industry-standards",
    target: "nist-pubs",
    type: "default",
    style: { strokeDasharray: "6 4", opacity: 0.6 },
    label: "runs alongside",
    labelStyle: { fontStyle: "italic", fontSize: 12 },
  },
];

/* ──────── Main component ──────── */

function readPersonaFromStorage(): Persona {
  try {
    const stored = window.localStorage.getItem("fed-it-persona");
    return isPersona(stored) ? stored : DEFAULT_PERSONA;
  } catch {
    return DEFAULT_PERSONA;
  }
}

export default function ChainMap() {
  // Persona reactive state. The first paint of this client island happens
  // after PageLayout's head script has populated localStorage, so the
  // initial read is reliable. Subscribe to persona changes from the picker
  // (same tab) and storage events (other tabs) so links stay correct.
  const [persona, setPersona] = useState<Persona>(DEFAULT_PERSONA);

  useEffect(() => {
    setPersona(readPersonaFromStorage());

    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setPersona(isPersona(detail) ? detail : DEFAULT_PERSONA);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "fed-it-persona") {
        setPersona(isPersona(e.newValue) ? e.newValue : DEFAULT_PERSONA);
      }
    };
    window.addEventListener("persona:change", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("persona:change", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      const data = node.data as ChainNodeData;
      if (!data?.slug) return;
      window.location.href = `/${persona}/${data.slug}`;
    },
    [persona],
  );

  const nodes = useMemo(
    () =>
      NODES.map((n) => ({
        ...n,
        className: `chainmap-node chainmap-node--${n.data.variant}`,
      })),
    [],
  );

  // Group nodes by section for the accessible parallel list.
  const groupedForList = useMemo(() => {
    const foundation = NODES.filter((n) => n.data.variant === "foundation");
    const forks = NODES.filter((n) => n.data.variant === "fork" || n.data.variant === "out-of-scope");
    const parallel = NODES.filter((n) => n.data.variant === "parallel");
    return { foundation, forks, parallel };
  }, []);

  return (
    <div className="chainmap-region" role="region" aria-label="The federal IT compliance chain — interactive map">
      <div className="chainmap-wrap" aria-hidden="true">
        <ReactFlow
          nodes={nodes}
          edges={EDGES}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          zoomOnScroll={false}
          zoomOnPinch={true}
          panOnScroll={false}
          panOnDrag={true}
        >
          <Background gap={24} color="var(--color-border, #e8ddc8)" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {/* Accessible parallel list — visually hidden but exposed to keyboard
          users, screen readers, and JS-off browsers. */}
      <nav className="chainmap-a11y-nav" aria-label="Chapters on the chain map">
        <h3 className="visually-hidden">Chapters on the chain map</h3>

        <h4 className="visually-hidden">Foundation chain</h4>
        <ul className="visually-hidden">
          {groupedForList.foundation.map((n) => (
            <li key={n.id}>
              <a href={`/${persona}/${n.data.slug}`}>{n.data.label}</a>
            </li>
          ))}
        </ul>

        <h4 className="visually-hidden">Forks</h4>
        <ul className="visually-hidden">
          {groupedForList.forks.map((n) => (
            <li key={n.id}>
              <a href={`/${persona}/${n.data.slug}`}>{n.data.label}</a>
            </li>
          ))}
        </ul>

        <h4 className="visually-hidden">Parallel</h4>
        <ul className="visually-hidden">
          {groupedForList.parallel.map((n) => (
            <li key={n.id}>
              <a href={`/${persona}/${n.data.slug}`}>{n.data.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <style>{`
        .chainmap-wrap {
          width: 100%;
          height: 720px;
          background: var(--color-bg, #fdf9f3);
          border: 1px solid var(--color-border, #e8ddc8);
          border-radius: var(--radius, 0.5rem);
          overflow: hidden;
        }
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .visually-hidden:focus,
        .visually-hidden a:focus {
          position: static;
          width: auto;
          height: auto;
          clip: auto;
          white-space: normal;
        }
        .chainmap-wrap :global(.react-flow__node) {
          font-family: var(--font-serif, Georgia, serif);
          color: var(--color-fg, #252220);
          border-radius: var(--radius, 0.5rem);
          cursor: pointer;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          width: auto;
          min-width: 200px;
          padding: 0;
        }
        .chainmap-wrap :global(.chainmap-node-inner) {
          padding: 0.6rem 0.85rem;
          text-align: center;
          line-height: 1.2;
        }
        .chainmap-wrap :global(.chainmap-node-label) {
          font-weight: 600;
          font-size: 14px;
        }
        .chainmap-wrap :global(.chainmap-node-sublabel) {
          font-size: 11px;
          font-style: italic;
          opacity: 0.75;
          margin-top: 2px;
        }
        .chainmap-wrap :global(.react-flow__node:hover) {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px -6px rgb(0 0 0 / 0.10);
        }
        .chainmap-wrap :global(.chainmap-node--foundation) {
          background: var(--color-card, #ffffff);
          border: 2px solid var(--color-accent, #9a330a);
        }
        .chainmap-wrap :global(.chainmap-node--fork) {
          background: var(--color-card, #ffffff);
          border: 1px solid var(--color-accent, #9a330a);
        }
        .chainmap-wrap :global(.chainmap-node--parallel) {
          background: var(--color-card, #ffffff);
          border: 1px dashed var(--color-accent, #9a330a);
        }
        .chainmap-wrap :global(.chainmap-node--out-of-scope) {
          background: var(--color-bg, #fdf9f3);
          border: 1px dashed var(--color-muted, #6b6358);
          opacity: 0.7;
        }
        .chainmap-wrap :global(.react-flow__edge-path) {
          stroke: var(--color-accent, #9a330a);
          stroke-width: 2;
        }
        @media (prefers-reduced-motion: reduce) {
          .chainmap-wrap :global(.react-flow__node) {
            transition: none;
          }
          .chainmap-wrap :global(.react-flow__node:hover) {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

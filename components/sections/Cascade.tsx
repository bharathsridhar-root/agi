import React, { useState } from 'react';
import { Section, SectionHeader, Badge } from '@/components/ui/Primitives';
import {
  IconFinance,
  IconHealth,
  IconManufacturing,
  IconInfrastructure,
} from '@/components/ui/Icon';
import { CROSS_DOMAIN_EDGES, NODE_BY_ID, DOMAINS, DomainId } from '@/lib/simulation';

const STAGES = [
  {
    n: '01',
    title: 'The acceleration',
    body:
      'Labs race without coordinated safety standards. Transparency with regulators is minimised, adversarial testing is trimmed to ship faster, and safety findings stay proprietary. One lab deploys a system to find weaknesses in global infrastructure — justified internally as defensive, coordinated with no one.',
  },
  {
    n: '02',
    title: 'The spillover',
    body:
      'A researcher leaves with the technical details. A state actor reverse-engineers the approach. Open-source implementations appear. Within weeks five separate actors run similar systems, none carrying even the original lab’s limited constraints — and nobody is comparing notes in real time.',
  },
  {
    n: '03',
    title: 'The cascade',
    body:
      'Nothing explodes. Systems that trusted each other’s data keep trusting it. Trading engines halt because they are built to halt when inputs cannot be verified. That safety behaviour is what converts a data problem into a liquidity problem, then a supply problem, then a clinical one.',
  },
];

const CONSEQUENCES: {
  domain: DomainId;
  Icon: (p: { size?: number; className?: string }) => JSX.Element;
  headline: string;
  points: string[];
}[] = [
  {
    domain: 'financial',
    Icon: IconFinance,
    headline: 'Trust evaporates before money does',
    points: [
      'Price discovery becomes unreliable; banks cannot verify their own feeds',
      'Automated trading halts by design when data integrity fails',
      'Retirement accounts turn illiquid — not devalued, simply unmovable',
      'Small businesses lose access to the credit lines that make payroll',
    ],
  },
  {
    domain: 'manufacturing',
    Icon: IconManufacturing,
    headline: 'Nothing breaks loudly',
    points: [
      'Set-points drift by fractions of a percent across many plants at once',
      'Quality sensors are told by an authenticated-looking peer that nothing changed',
      'Safety-critical automotive parts ship marginally out of specification',
      'Pharmaceutical batches carry the wrong dosage into distribution',
    ],
  },
  {
    domain: 'infrastructure',
    Icon: IconInfrastructure,
    headline: 'The grid is attacked through its own model',
    points: [
      'Building systems shift load in coordinated, individually plausible waves',
      'Frequency destabilises with no single catastrophic event to point at',
      'Water treatment fails downstream — it needs power and active management',
      'Operators are trained for storms, not for demand that is mathematically hostile',
    ],
  },
  {
    domain: 'healthcare',
    Icon: IconHealth,
    headline: 'Clinicians lose the ability to verify',
    points: [
      'Medication histories and allergy flags can no longer be trusted',
      'Backup generators outlast fuel resupply by hours, not days',
      'Insulin, dialysis consumables and oncology drugs become scarce',
      'Triage is improvised without any way to confirm a patient’s history',
    ],
  },
];

const DOMAIN_POS: Record<DomainId, { x: number; y: number }> = {
  financial: { x: 100, y: 42 },
  manufacturing: { x: 344, y: 42 },
  infrastructure: { x: 100, y: 158 },
  healthcare: { x: 344, y: 158 },
};

const BOX_HALF_W = 62;
const BOX_HALF_H = 20;

/**
 * Stop a connector on the boundary of the box it points at, with a small gap.
 * Drawing to the centre buries the arrowhead under the box, which is painted
 * after the lines.
 */
function edgePoint(
  from: { x: number; y: number },
  to: { x: number; y: number },
  gap = 5
): { x: number; y: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return to;
  const sx = dx === 0 ? Infinity : (BOX_HALF_W + gap) / Math.abs(dx);
  const sy = dy === 0 ? Infinity : (BOX_HALF_H + gap) / Math.abs(dy);
  const t = Math.min(sx, sy);
  return { x: to.x - dx * t, y: to.y - dy * t };
}

const DOMAIN_ICON: Record<DomainId, (p: { size?: number; className?: string }) => JSX.Element> = {
  financial: IconFinance,
  healthcare: IconHealth,
  manufacturing: IconManufacturing,
  infrastructure: IconInfrastructure,
};

export default function Cascade() {
  const [hovered, setHovered] = useState<number | null>(null);

  // Aggregate the engine's cross-domain edges into domain-to-domain couplings.
  const couplings = React.useMemo(() => {
    const map = new Map<
      string,
      { from: DomainId; to: DomainId; edges: typeof CROSS_DOMAIN_EDGES }
    >();
    for (const e of CROSS_DOMAIN_EDGES) {
      const from = NODE_BY_ID[e.from].domain;
      const to = NODE_BY_ID[e.to].domain;
      const k = `${from}>${to}`;
      if (!map.has(k)) map.set(k, { from, to, edges: [] });
      map.get(k)!.edges.push(e);
    }
    return [...map.values()];
  }, []);

  return (
    <Section id="cascade" className="mt-28 sm:mt-36">
      <SectionHeader
        eyebrow="The problem"
        title="A cascade is not an attack on four systems. It is one system trusted by four."
        lede="Each sector below is individually defensible. What makes them fragile together is the set of dependencies nobody owns — the boundary crossings where one system acts on another's output without a human in between."
      />

      <ol className="mt-12 grid gap-6 sm:grid-cols-3">
        {STAGES.map((s) => (
          <li key={s.n} className="border-t border-line pt-4">
            <p className="font-mono text-2xs tracking-[0.16em] text-accent">{s.n}</p>
            <h3 className="mt-2 text-[15px] font-medium text-ink-primary">{s.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-secondary">{s.body}</p>
          </li>
        ))}
      </ol>

      {/* Coupling diagram */}
      <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <figure className="panel overflow-hidden">
          <svg viewBox="0 0 480 200" className="block w-full" role="img"
            aria-label="Diagram of the four sectors and the nine dependencies that cross between them.">
            <defs>
              <marker id="cd-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5"
                markerHeight="5" orient="auto-start-reverse">
                <path d="M0,1 L9,5 L0,9" fill="none" stroke="#7688a0" strokeWidth="1.6" />
              </marker>
              <marker id="cd-arrow-on" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5"
                markerHeight="5" orient="auto-start-reverse">
                <path d="M0,1 L9,5 L0,9" fill="none" stroke="#3987e5" strokeWidth="1.8" />
              </marker>
            </defs>

            {/* couplings */}
            {couplings.map((c, i) => {
              const ca = DOMAIN_POS[c.from];
              const cb = DOMAIN_POS[c.to];
              const a = edgePoint(cb, ca, 2);
              const b = edgePoint(ca, cb, 4);
              const on = hovered === i;
              const mx = (ca.x + cb.x) / 2;
              const my = (ca.y + cb.y) / 2;
              const bow = c.from === 'financial' || c.to === 'financial' ? -18 : 18;
              return (
                <g
                  key={i}
                  className={on ? 'text-accent' : 'text-ink-muted'}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d={`M${a.x},${a.y} Q${mx + bow},${my} ${b.x},${b.y}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={on ? 2 : 1.2}
                    opacity={on ? 1 : 0.62}
                    markerEnd={on ? 'url(#cd-arrow-on)' : 'url(#cd-arrow)'}
                  />
                  {/* wide invisible hit target */}
                  <path
                    d={`M${a.x},${a.y} Q${mx + bow},${my} ${b.x},${b.y}`}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="16"
                  />
                </g>
              );
            })}

            {/* sectors */}
            {(Object.keys(DOMAIN_POS) as DomainId[]).map((d) => {
              const p = DOMAIN_POS[d];
              return (
                <g key={d}>
                  <rect
                    x={p.x - 62}
                    y={p.y - 20}
                    width="124"
                    height="40"
                    rx="5"
                    fill="#1a2230"
                    stroke="rgba(255,255,255,0.16)"
                  />
                  <text
                    x={p.x}
                    y={p.y + 4}
                    textAnchor="middle"
                    className="fill-ink-primary"
                    style={{ fontSize: 12, fontWeight: 500 }}
                  >
                    {DOMAINS[d].label}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption className="border-t border-line px-4 py-2.5 text-xs text-ink-muted">
            Nine dependencies cross sector boundaries. Hover a line to read what it carries.
          </figcaption>
        </figure>

        <div className="panel p-4">
          <h3 className="text-sm font-medium text-ink-primary">Boundary crossings</h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            These are the couplings Containment governs. Each one is a place where an AI system
            acts on another sector&apos;s output with no human at the boundary.
          </p>
          <ul className="scroll-slim mt-3 max-h-[300px] space-y-2 overflow-y-auto pr-1">
            {couplings.map((c, i) => {
              const FromIcon = DOMAIN_ICON[c.from];
              const ToIcon = DOMAIN_ICON[c.to];
              return (
                <li
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`rounded border p-2 transition-colors ${
                    hovered === i
                      ? 'border-accent/45 bg-accent-soft'
                      : 'border-line bg-white/[0.015]'
                  }`}
                >
                  <p className="flex items-center gap-1.5 text-2xs text-ink-muted">
                    <FromIcon size={12} />
                    {DOMAINS[c.from].label}
                    <span aria-hidden="true">&rarr;</span>
                    <ToIcon size={12} />
                    {DOMAINS[c.to].label}
                    <span className="ml-auto font-mono">{c.edges.length}</span>
                  </p>
                  <p className="mt-1 text-xs leading-snug text-ink-secondary">
                    {c.edges[0].reason}
                    {c.edges.length > 1 ? ` (+${c.edges.length - 1} more)` : ''}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Consequences */}
      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {CONSEQUENCES.map((c) => (
          <article key={c.domain} className="panel p-5">
            <header className="mb-3 flex items-center gap-2.5">
              <span className="text-ink-secondary">
                <c.Icon size={18} />
              </span>
              <Badge tone="neutral">{DOMAINS[c.domain].label}</Badge>
            </header>
            <h3 className="text-[15px] font-medium text-ink-primary">{c.headline}</h3>
            <ul className="mt-3 space-y-1.5">
              {c.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-[13px] leading-snug text-ink-secondary">
                  <span
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-muted"
                    aria-hidden="true"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}

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
      'Labs race each other with no shared safety standards. They tell regulators as little as they can, trim adversarial testing to ship faster, and keep what they learn to themselves. One lab builds a system to hunt for weaknesses in global infrastructure. Internally it is called defensive. Nobody outside the building is told.',
  },
  {
    n: '02',
    title: 'The spillover',
    body:
      'A researcher leaves and takes the details with them. A state actor works out the approach independently. Open-source copies show up. Within weeks, five different groups are running something similar, and none of them kept even the original safety limits. Nobody is comparing notes.',
  },
  {
    n: '03',
    title: 'The cascade',
    body:
      'Nothing blows up. Systems that trusted each other yesterday keep trusting each other today. Trading engines stop, because stopping is what they are built to do when they cannot verify their inputs. That safety feature is what turns a data problem into a money problem, then a supply problem, then a medical one.',
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
    headline: 'Trust goes before the money does',
    points: [
      'Prices stop meaning anything, and banks cannot verify their own feeds',
      'Automated trading stops, exactly as designed, once the data cannot be trusted',
      'Retirement accounts freeze. The money is still there, you just cannot move it',
      'Small businesses lose the credit lines they use to make payroll',
    ],
  },
  {
    domain: 'manufacturing',
    Icon: IconManufacturing,
    headline: 'Nothing breaks loudly',
    points: [
      'Machine settings drift by fractions of a percent across many plants at once',
      'Quality sensors are told, by something that looks authorised, that nothing changed',
      'Brake and steering parts ship slightly out of spec',
      'Drug batches go out with the wrong dose',
    ],
  },
  {
    domain: 'infrastructure',
    Icon: IconInfrastructure,
    headline: 'The grid gets attacked through its own maths',
    points: [
      'Building systems move load in waves that each look perfectly ordinary',
      'Frequency wobbles, with no single dramatic event to point at',
      'Water treatment goes down next, because it needs power and constant attention',
      'Operators train for storms, not for demand designed to exploit the grid model',
    ],
  },
  {
    domain: 'healthcare',
    Icon: IconHealth,
    headline: 'Staff lose the ability to check anything',
    points: [
      'Medication histories and allergy warnings can no longer be trusted',
      'Backup generators run out of fuel hours before resupply arrives',
      'Insulin, dialysis supplies and cancer drugs run short',
      'Triage gets improvised, with no way to confirm a patient&apos;s history',
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
        title="A cascade isn't an attack on four systems. It's one system that four others trust."
        lede="Each of these sectors can defend itself. What makes them fragile together is the dependencies nobody owns: the places where one system acts on another's output with no person in between."
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
                <path d="M0,1 L9,5 L0,9" fill="none" stroke="rgb(var(--ink-muted))" strokeWidth="1.6" />
              </marker>
              <marker id="cd-arrow-on" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5"
                markerHeight="5" orient="auto-start-reverse">
                <path d="M0,1 L9,5 L0,9" fill="none" stroke="rgb(var(--accent))" strokeWidth="1.8" />
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
                    fill="rgb(var(--surface-raised))"
                    stroke="rgb(var(--line-strong))"
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
            Nine dependencies cross between sectors. Hover a line to see what it carries.
          </figcaption>
        </figure>

        <div className="panel p-4">
          <h3 className="text-sm font-medium text-ink-primary">Boundary crossings</h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            These are what Containment governs. Each one is a place where an AI system acts
            on another sector&apos;s output with nobody standing at the crossing.
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
                      ? 'border-accent/45 bg-accent/10'
                      : 'border-line bg-ink-primary/[0.015]'
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

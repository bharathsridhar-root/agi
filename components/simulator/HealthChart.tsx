import React, { useMemo, useRef, useState } from 'react';
import type { SimState } from '@/lib/simulation';

// Colours come from CSS variables so both themes are handled by the
// stylesheet and there is no theme state to hydrate in JS.
const SERIES = [
  { key: 'financial', label: 'Financial', color: 'rgb(var(--series-1))' },
  { key: 'healthcare', label: 'Healthcare', color: 'rgb(var(--series-2))' },
  { key: 'manufacturing', label: 'Manufacturing', color: 'rgb(var(--series-3))' },
  { key: 'infrastructure', label: 'Infrastructure', color: 'rgb(var(--series-4))' },
] as const;

type SeriesKey = (typeof SERIES)[number]['key'];

const PAD = { top: 14, right: 96, bottom: 26, left: 34 };
const W = 720;
const H = 260;

export default function HealthChart({
  history,
  maxTicks,
}: {
  history: SimState['history'];
  maxTicks: number;
}) {
  const [hoverTick, setHoverTick] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const x = (tick: number) => PAD.left + (tick / maxTicks) * plotW;
  const y = (v: number) => PAD.top + (1 - v / 100) * plotH;

  const paths = useMemo(() => {
    return SERIES.map((s) => {
      const d = history
        .map((h, i) => `${i === 0 ? 'M' : 'L'}${x(h.tick).toFixed(1)},${y(h[s.key]).toFixed(1)}`)
        .join(' ');
      return { ...s, d, last: history[history.length - 1]?.[s.key] ?? 100 };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, maxTicks]);

  /**
   * Direct labels for four series collide whenever two sectors sit at the same
   * capacity (very common at 100 before anything fails). Push them apart
   * greedily, keeping their vertical order, then clamp into the plot area.
   */
  const labelPositions = useMemo(() => {
    const MIN_GAP = 13;
    const items = paths
      .map((s) => ({ key: s.key as SeriesKey, label: s.label, want: y(s.last) }))
      .sort((a, b) => a.want - b.want);

    const placed = items.map((it) => ({ ...it, at: it.want }));
    // top-down pass
    for (let i = 1; i < placed.length; i++) {
      if (placed[i].at - placed[i - 1].at < MIN_GAP) {
        placed[i].at = placed[i - 1].at + MIN_GAP;
      }
    }
    // if the stack ran past the bottom, push back up
    const bottom = PAD.top + plotH;
    const overflow = placed[placed.length - 1].at - bottom;
    if (overflow > 0) {
      for (const p of placed) p.at -= overflow;
      for (let i = placed.length - 2; i >= 0; i--) {
        if (placed[i + 1].at - placed[i].at < MIN_GAP) {
          placed[i].at = placed[i + 1].at - MIN_GAP;
        }
      }
    }
    for (const p of placed) p.at = Math.max(PAD.top + 4, p.at);
    return placed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths, plotH]);

  const hovered = hoverTick === null ? null : history.find((h) => h.tick === hoverTick) ?? null;

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg || history.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const t = Math.round(((px - PAD.left) / plotW) * maxTicks);
    const clamped = Math.max(0, Math.min(history[history.length - 1].tick, t));
    setHoverTick(clamped);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-medium text-ink-primary">Sector capacity over time</h4>
          <p className="mt-0.5 text-xs text-ink-muted">
            Average capacity per sector. 100 means normal service.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="rounded border border-line-strong px-2 py-1 font-mono text-2xs uppercase tracking-[0.1em] text-ink-secondary transition-colors hover:bg-ink-primary/5 hover:text-ink-primary"
          aria-pressed={showTable}
        >
          {showTable ? 'Show chart' : 'Show table'}
        </button>
      </div>

      {showTable ? (
        <div className="scroll-slim max-h-[260px] overflow-auto rounded border border-line">
          <table className="w-full text-left text-xs tabular">
            <caption className="sr-only">
              Mean operational capacity per sector at each interval
            </caption>
            <thead className="sticky top-0 bg-surface-raised">
              <tr className="border-b border-line">
                <th scope="col" className="px-3 py-2 font-medium text-ink-secondary">Interval</th>
                {SERIES.map((s) => (
                  <th key={s.key} scope="col" className="px-3 py-2 font-medium text-ink-secondary">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.tick} className="border-b border-line/60 last:border-0">
                  <th scope="row" className="px-3 py-1.5 font-normal text-ink-muted">{h.tick}</th>
                  {SERIES.map((s) => (
                    <td key={s.key} className="px-3 py-1.5 text-ink-primary">
                      {h[s.key].toFixed(1)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full touch-none"
            style={{ maxWidth: '100%' }}
            onMouseMove={onMove}
            onMouseLeave={() => setHoverTick(null)}
            role="img"
            aria-label="Line chart of sector capacity over time. Use the table view for exact values."
          >
            {/* gridlines - recessive */}
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line
                  x1={PAD.left}
                  x2={PAD.left + plotW}
                  y1={y(v)}
                  y2={y(v)}
                  stroke="rgb(var(--ink-muted) / 0.22)"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 8}
                  y={y(v) + 3.5}
                  textAnchor="end"
                  className="fill-ink-muted"
                  style={{ fontSize: 10, fontVariantNumeric: 'tabular-nums' }}
                >
                  {v}
                </text>
              </g>
            ))}

            {/* failure threshold reference */}
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={y(25)}
              y2={y(25)}
              stroke="rgb(var(--status-critical))"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            <text
              x={PAD.left + 4}
              y={y(25) - 5}
              className="fill-status-critical"
              style={{ fontSize: 9.5, letterSpacing: '0.06em' }}
            >
              FAILURE
            </text>

            {/* x axis */}
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={PAD.top + plotH}
              y2={PAD.top + plotH}
              stroke="rgb(var(--ink-muted) / 0.45)"
              strokeWidth="1"
            />
            {[0, 10, 20, 30, 40].filter((t) => t <= maxTicks).map((t) => (
              <text
                key={t}
                x={x(t)}
                y={H - 8}
                textAnchor="middle"
                className="fill-ink-muted"
                style={{ fontSize: 10, fontVariantNumeric: 'tabular-nums' }}
              >
                {t}
              </text>
            ))}

            {/* crosshair */}
            {hovered ? (
              <line
                x1={x(hovered.tick)}
                x2={x(hovered.tick)}
                y1={PAD.top}
                y2={PAD.top + plotH}
                stroke="rgb(var(--ink-muted) / 0.7)"
                strokeWidth="1"
              />
            ) : null}

            {/* series */}
            {paths.map((s) => (
              <path
                key={s.key}
                d={s.d}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {/* hover markers - 2px surface ring so overlapping dots stay readable */}
            {hovered
              ? SERIES.map((s) => (
                  <circle
                    key={s.key}
                    cx={x(hovered.tick)}
                    cy={y(hovered[s.key])}
                    r="4.5"
                    fill={s.color}
                    stroke="rgb(var(--chart-surface))"
                    strokeWidth="2"
                  />
                ))
              : null}

            {/* direct labels - 4 series, so all are labelled, de-collided */}
            {labelPositions.map((s) => {
              const endY = y(paths.find((p) => p.key === s.key)!.last);
              const nudged = Math.abs(endY - s.at) > 1.5;
              const color = SERIES.find((x) => x.key === s.key)!.color;
              return (
                <g key={s.key}>
                  {nudged ? (
                    <polyline
                      points={`${PAD.left + plotW},${endY} ${PAD.left + plotW + 4},${endY} ${
                        PAD.left + plotW + 6
                      },${s.at} ${PAD.left + plotW + 9},${s.at}`}
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  ) : null}
                  <text
                    x={PAD.left + plotW + 12}
                    y={s.at + 3.5}
                    className="fill-ink-secondary"
                    style={{ fontSize: 10.5 }}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* tooltip */}
          {hovered ? (
            <div
              className="pointer-events-none absolute top-2 z-10 w-[190px] rounded-md border border-line-strong bg-surface-raised/95 p-2.5 shadow-xl backdrop-blur"
              style={{
                left: `${Math.min(72, (x(hovered.tick) / W) * 100)}%`,
              }}
            >
              <p className="mb-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-ink-muted">
                Interval {hovered.tick}
              </p>
              <dl className="space-y-1">
                {SERIES.map((s) => (
                  <div key={s.key} className="flex items-center justify-between gap-2">
                    <dt className="flex min-w-0 items-center gap-1.5 text-xs text-ink-secondary">
                      <span
                        className="h-2 w-2 shrink-0 rounded-sm"
                        style={{ background: s.color }}
                      />
                      <span className="truncate">{s.label}</span>
                    </dt>
                    <dd className="tabular text-xs font-medium text-ink-primary">
                      {hovered[s.key].toFixed(0)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      )}

      {/* legend - always present for >= 2 series */}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

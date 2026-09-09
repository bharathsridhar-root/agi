import React, { useEffect, useMemo, useState } from 'react';
import { TOTAL_DISTRICTS } from '@/lib/game';
import type { Scene } from '@/lib/game';

const MOOD: Record<
  Scene['mood'],
  { sky: string; glow: string; grid: string; label: string }
> = {
  calm: { sky: '#0f1722', glow: '#3987e5', grid: 'rgba(57,135,229,0.16)', label: 'Nominal' },
  strained: { sky: '#151520', glow: '#fab219', grid: 'rgba(250,178,25,0.16)', label: 'Strained' },
  emergency: { sky: '#1a1418', glow: '#ec835a', grid: 'rgba(236,131,90,0.18)', label: 'Emergency' },
  dark: { sky: '#120f13', glow: '#d03b3b', grid: 'rgba(208,59,59,0.18)', label: 'Degraded' },
  restored: { sky: '#0d1720', glow: '#0ca30c', grid: 'rgba(12,163,12,0.16)', label: 'Advisory' },
};

/** Deterministic pseudo-random so the skyline is stable across renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export default function CityView({
  mood,
  districtsDark,
  trust,
}: {
  mood: Scene['mood'];
  districtsDark: number;
  trust: number;
}) {
  const m = MOOD[mood];
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 4), 1400);
    return () => clearInterval(id);
  }, []);

  // 4 x 3 district grid
  const districts = useMemo(() => {
    const out: {
      i: number;
      x: number;
      y: number;
      w: number;
      h: number;
      buildings: { x: number; w: number; h: number }[];
    }[] = [];
    const cols = 4;
    const rows = 3;
    const cw = 108;
    const ch = 62;
    const gap = 8;
    for (let i = 0; i < TOTAL_DISTRICTS; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const x = 16 + c * (cw + gap);
      const y = 18 + r * (ch + gap);
      const buildings = Array.from({ length: 5 }, (_, b) => {
        const seed = i * 7 + b;
        return {
          x: 8 + b * 19 + rand(seed) * 4,
          w: 10 + rand(seed + 100) * 5,
          h: 12 + rand(seed + 200) * 30,
        };
      });
      out.push({ i, x, y, w: cw, h: ch, buildings });
    }
    return out;
  }, []);

  // Districts go dark from the last index backwards (District 12 first).
  const isDark = (i: number) => i >= TOTAL_DISTRICTS - districtsDark;

  return (
    <div
      className="display-panel relative overflow-hidden rounded-lg border border-line"
      style={{ background: m.sky, transition: 'background 700ms ease' }}
    >
      {/* The schematic is capped in width and centred: at full container width
          its 480x232 viewBox renders over 500px tall and swamps the dialogue.
          The wrapper carries the sky colour so the side gutters blend in. */}
      <svg
        viewBox="0 0 480 232"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block w-full max-w-[660px]"
        style={{ transition: 'background 700ms ease' }}
        role="img"
        aria-label={`City schematic. Status ${m.label}. ${districtsDark} of ${TOTAL_DISTRICTS} districts without power. Public trust ${Math.round(trust)} percent.`}
      >
        <defs>
          <linearGradient id="cv-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={m.glow} stopOpacity="0.22" />
            <stop offset="100%" stopColor={m.glow} stopOpacity="0" />
          </linearGradient>
          <filter id="cv-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* ambient horizon glow */}
        <rect x="0" y="0" width="480" height="232" fill="url(#cv-fade)" />

        {/* street grid */}
        {Array.from({ length: 13 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={16 + i * 37}
            x2={16 + i * 37}
            y1="10"
            y2="222"
            stroke="rgba(255,255,255,0.045)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="8"
            x2="472"
            y1={14 + i * 35}
            y2={14 + i * 35}
            stroke="rgba(255,255,255,0.045)"
            strokeWidth="1"
          />
        ))}

        {/* districts */}
        {districts.map((d) => {
          const dark = isDark(d.i);
          const lit = dark ? 0.1 : 0.85;
          return (
            <g key={d.i} style={{ transition: 'opacity 600ms ease' }}>
              <rect
                x={d.x}
                y={d.y}
                width={d.w}
                height={d.h}
                rx="3"
                fill={dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.035)'}
                stroke={dark ? 'rgba(208,59,59,0.45)' : m.grid}
                strokeWidth="1"
              />
              {/* skyline */}
              {d.buildings.map((b, bi) => (
                <g key={bi}>
                  <rect
                    x={d.x + b.x}
                    y={d.y + d.h - 6 - b.h}
                    width={b.w}
                    height={b.h}
                    fill={dark ? '#1c1c22' : '#222c3a'}
                    stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.09)'}
                    strokeWidth="0.75"
                  />
                  {/* windows */}
                  {!dark &&
                    Array.from({ length: Math.max(1, Math.floor(b.h / 9)) }, (_, wi) => (
                      <rect
                        key={wi}
                        x={d.x + b.x + 2.5}
                        y={d.y + d.h - 12 - wi * 9}
                        width={b.w - 5}
                        height="3"
                        fill={m.glow}
                        opacity={
                          rand(d.i * 31 + bi * 13 + wi + pulse) > 0.42 ? lit * 0.75 : 0.12
                        }
                        style={{ transition: 'opacity 900ms ease' }}
                      />
                    ))}
                </g>
              ))}
              <text
                x={d.x + 4}
                y={d.y + 10}
                style={{ fontSize: 7, letterSpacing: '0.08em' }}
                fill={dark ? '#d03b3b' : 'rgba(255,255,255,0.34)'}
              >
                D{String(d.i + 1).padStart(2, '0')}
              </text>
              {dark ? (
                <text
                  x={d.x + d.w - 4}
                  y={d.y + 10}
                  textAnchor="end"
                  style={{ fontSize: 6.5, letterSpacing: '0.1em' }}
                  fill="#d03b3b"
                >
                  DARK
                </text>
              ) : null}
            </g>
          );
        })}

        {/* status readout */}
        <g>
          <circle cx="22" cy="224" r="3" fill={m.glow} filter="url(#cv-blur)" opacity="0.9" />
          <circle cx="22" cy="224" r="2.5" fill={m.glow} />
          <text x="31" y="227" style={{ fontSize: 8, letterSpacing: '0.12em' }} fill="rgba(255,255,255,0.6)">
            ORACLE · {m.label.toUpperCase()}
          </text>
          <text
            x="472"
            y="227"
            textAnchor="end"
            style={{ fontSize: 8, letterSpacing: '0.08em' }}
            fill="rgba(255,255,255,0.45)"
          >
            PUBLIC TRUST {Math.round(trust)}%
          </text>
        </g>
      </svg>
    </div>
  );
}

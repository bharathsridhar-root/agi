import React from 'react';

/*
 * Comic art. Flat geometric shapes only, drawn against a 400x260 viewBox.
 * Every colour comes from a CSS variable so the panels follow the theme.
 */

const INK = 'rgb(var(--ink-primary))';
const MUTED = 'rgb(var(--ink-muted))';
const LINE = 'rgb(var(--line-strong))';
const ACCENT = 'rgb(var(--accent))';
const BAD = 'rgb(var(--status-critical))';
const WARN = 'rgb(var(--status-warning))';
const GOOD = 'rgb(var(--status-good))';
const SURF = 'rgb(var(--surface-raised))';

/* ---------- shared cast ---------- */

function Oracle({
  x,
  y,
  w = 96,
  h = 46,
  tone = ACCENT,
  label = 'ORACLE',
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  tone?: string;
  label?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={SURF} stroke={tone} strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + w / 2 - 14 + i * 14} cy={y + h / 2 + 6} r="2.6" fill={tone} />
      ))}
      <text
        x={x + w / 2}
        y={y + 17}
        textAnchor="middle"
        fill={tone}
        style={{ fontSize: 9, letterSpacing: '0.14em', fontWeight: 600 }}
      >
        {label}
      </text>
    </g>
  );
}

function Person({ x, y, s = 1, tone = INK }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-16" r="8" fill="none" stroke={tone} strokeWidth="2" />
      <path
        d="M-11 12 C -11 0, -6 -6, 0 -6 C 6 -6, 11 0, 11 12"
        fill="none"
        stroke={tone}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

function Building({
  x,
  y,
  w,
  h,
  lit = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lit?: boolean;
}) {
  const rows = Math.max(1, Math.floor(h / 13));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={lit ? LINE : BAD} strokeWidth="1.5" />
      {Array.from({ length: rows }, (_, r) => (
        <rect
          key={r}
          x={x + 4}
          y={y + 6 + r * 13}
          width={w - 8}
          height="4"
          fill={lit ? ACCENT : BAD}
          opacity={lit ? 0.55 : 0.35}
        />
      ))}
    </g>
  );
}

function Chip({
  x,
  y,
  label,
  tone = LINE,
  text = MUTED,
  w = 74,
}: {
  x: number;
  y: number;
  label: string;
  tone?: string;
  text?: string;
  w?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="26" rx="5" fill={SURF} stroke={tone} strokeWidth="1.5" />
      <text
        x={x + w / 2}
        y={y + 17}
        textAnchor="middle"
        fill={text}
        style={{ fontSize: 9.5, fontWeight: 500 }}
      >
        {label}
      </text>
    </g>
  );
}

function Bubble({
  x,
  y,
  w,
  h,
  text,
  tone = INK,
  tail = 'bl',
  size = 11,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  tone?: string;
  tail?: 'bl' | 'br';
  size?: number;
}) {
  const tailPath =
    tail === 'bl'
      ? `M${x + 16},${y + h} l0,10 l12,-10`
      : `M${x + w - 16},${y + h} l0,10 l-12,-10`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill={SURF} stroke={tone} strokeWidth="1.6" />
      <path d={tailPath} fill={SURF} stroke={tone} strokeWidth="1.6" strokeLinejoin="round" />
      <line x1={x + 4} x2={x + w - 4} y1={y + h} y2={y + h} stroke={SURF} strokeWidth="2.4" />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fill={tone}
        style={{ fontSize: size, fontWeight: 500 }}
      >
        {text}
      </text>
    </g>
  );
}

function Arrow({
  d,
  tone = MUTED,
  width = 1.6,
  dash,
}: {
  d: string;
  tone?: string;
  width?: number;
  dash?: string;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={tone}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dash}
      markerEnd={`url(#ct-arrow-${tone === BAD ? 'bad' : tone === ACCENT ? 'accent' : 'muted'})`}
    />
  );
}

/** Markers, defined once per panel svg. */
export function ComicDefs() {
  return (
    <defs>
      {[
        ['muted', MUTED],
        ['accent', ACCENT],
        ['bad', BAD],
      ].map(([id, col]) => (
        <marker
          key={id}
          id={`ct-arrow-${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0,1 L9,5 L0,9" fill="none" stroke={col} strokeWidth="1.8" />
        </marker>
      ))}
    </defs>
  );
}

/* ---------- panels ---------- */

export const PANEL_ART: ((props: { play: boolean }) => JSX.Element)[] = [
  // 1. A city that works
  () => (
    <g>
      <Oracle x={152} y={26} />
      {[
        [70, 150, 34, 62],
        [118, 168, 30, 44],
        [250, 158, 32, 54],
        [296, 176, 34, 36],
      ].map(([x, y, w, h], i) => (
        <Building key={i} x={x} y={y} w={w} h={h} />
      ))}
      <Arrow d="M180,74 C 160,100 120,120 100,146" tone={ACCENT} />
      <Arrow d="M200,74 L200,146" tone={ACCENT} />
      <Arrow d="M222,74 C 244,100 268,124 280,152" tone={ACCENT} />
      <line x1="40" y1="216" x2="360" y2="216" stroke={LINE} strokeWidth="1.5" />
      <text x={200} y={238} textAnchor="middle" fill={MUTED} style={{ fontSize: 9.5 }}>
        power · hospital beds · traffic
      </text>
    </g>
  ),

  // 2. So we give it more
  () => (
    <g>
      <Oracle x={152} y={104} w={96} h={46} />
      <Chip x={44} y={40} label="Money" />
      <Chip x={282} y={40} label="Hospitals" />
      <Chip x={44} y={186} label="Factories" />
      <Chip x={282} y={186} label="Power" />
      <Arrow d="M118,58 C 150,70 160,92 170,102" tone={ACCENT} />
      <Arrow d="M282,58 C 250,70 240,92 230,102" tone={ACCENT} />
      <Arrow d="M118,196 C 150,184 160,166 170,152" tone={ACCENT} />
      <Arrow d="M282,196 C 250,184 240,166 230,152" tone={ACCENT} />
      <text x={200} y={238} textAnchor="middle" fill={MUTED} style={{ fontSize: 9.5 }}>
        it is right more often than we are
      </text>
    </g>
  ),

  // 3. One wrong input
  () => (
    <g>
      <Oracle x={152} y={30} />
      <rect x={140} y={132} width={120} height={54} rx="6" fill={SURF} stroke={BAD} strokeWidth="2" />
      <text x={200} y={152} textAnchor="middle" fill={MUTED} style={{ fontSize: 8.5, letterSpacing: '0.1em' }}>
        SENSOR · DISTRICT 12
      </text>
      <text x={200} y={172} textAnchor="middle" fill={BAD} style={{ fontSize: 13, fontWeight: 600 }}>
        STABLE
      </text>
      <path d="M186 186 l8 12 l-5 0 l7 14" fill="none" stroke={BAD} strokeWidth="1.6" strokeLinecap="round" />
      <Arrow d="M200,132 L200,80" tone={BAD} />
      <text x={286} y={166} fill={BAD} style={{ fontSize: 9.5 }}>
        it is not
      </text>
      <line x1={252} y1={162} x2={278} y2={162} stroke={BAD} strokeWidth="1.4" />
    </g>
  ),

  // 4. It travels
  () => (
    <g>
      {[
        [22, 'Money'],
        [117, 'Factories'],
        [212, 'Hospitals'],
        [307, 'Power'],
      ].map(([x, label], i) => (
        <Chip
          key={i}
          x={x as number}
          y={104}
          label={label as string}
          tone={BAD}
          text={BAD}
          w={71}
        />
      ))}
      <Arrow d="M95,117 L114,117" tone={BAD} />
      <Arrow d="M190,117 L209,117" tone={BAD} />
      <Arrow d="M285,117 L304,117" tone={BAD} />
      <circle cx={57} cy={117} r="0" fill={BAD} />
      <text x={200} y={62} textAnchor="middle" fill={MUTED} style={{ fontSize: 10 }}>
        every system trusts the one before it
      </text>
      <text x={200} y={178} textAnchor="middle" fill={MUTED} style={{ fontSize: 9.5 }}>
        nobody is checking, because nobody ever had to
      </text>
      <path d="M40 148 L360 148" stroke={LINE} strokeWidth="1" strokeDasharray="3 4" />
    </g>
  ),

  // 5. You ask why
  () => (
    <g>
      <Person x={78} y={150} s={1.5} />
      <Bubble x={34} y={74} w={86} h={34} text="Why?" tone={INK} tail="bl" size={14} />
      <Oracle x={244} y={128} w={104} h={48} />
      <Bubble x={222} y={72} w={150} h={38} text="Confidence: 94%" tone={ACCENT} tail="br" size={12} />
      <text x={200} y={238} textAnchor="middle" fill={MUTED} style={{ fontSize: 9.5 }}>
        a number is not a reason
      </text>
    </g>
  ),

  // 6. The trap
  () => (
    <g>
      <rect x={52} y={48} width={296} height={132} rx="10" fill="none" stroke={WARN} strokeWidth="2" strokeDasharray="6 5" />
      <text x={200} y={40} textAnchor="middle" fill={WARN} style={{ fontSize: 9, letterSpacing: '0.12em' }}>
        EVERYTHING RUNS THROUGH IT
      </text>
      {[
        [86, 118, 26, 48],
        [124, 132, 24, 34],
        [244, 124, 26, 42],
        [280, 140, 26, 26],
      ].map(([x, y, w, h], i) => (
        <Building key={i} x={x} y={y} w={w} h={h} />
      ))}
      <Oracle x={162} y={96} w={78} h={40} tone={WARN} />
      <g transform="translate(196 190)">
        <rect x={-34} y={-12} width={68} height={24} rx="12" fill={SURF} stroke={MUTED} strokeWidth="1.6" />
        <circle cx={-18} cy={0} r="8" fill={MUTED} />
        <text x={16} y={4} textAnchor="middle" fill={MUTED} style={{ fontSize: 8.5 }}>
          OFF
        </text>
      </g>
      <text x={200} y={228} textAnchor="middle" fill={MUTED} style={{ fontSize: 9.5 }}>
        switching it off now means switching off the city
      </text>
    </g>
  ),

  // 7. The checkpoints
  () => (
    <g>
      <text x={200} y={34} textAnchor="middle" fill={MUTED} style={{ fontSize: 9.5 }}>
        unless somebody built the checks in first
      </text>
      {['Show', 'Contain', 'Approve', 'Share', 'Fail safe'].map((l, i) => {
        const x = 22 + i * 73;
        const stopped = i === 1;
        return (
          <g key={l}>
            <rect
              x={x}
              y={70}
              width={62}
              height={76}
              rx="6"
              fill={SURF}
              stroke={stopped ? GOOD : LINE}
              strokeWidth={stopped ? 2 : 1.5}
            />
            <text x={x + 31} y={96} textAnchor="middle" fill={stopped ? GOOD : MUTED} style={{ fontSize: 9.5, fontWeight: 500 }}>
              {l}
            </text>
            <line x1={x + 14} x2={x + 48} y1={112} y2={112} stroke={stopped ? GOOD : LINE} strokeWidth="1.4" />
            <line x1={x + 14} x2={x + 40} y1={122} y2={122} stroke={LINE} strokeWidth="1.4" />
            <line x1={x + 14} x2={x + 44} y1={132} y2={132} stroke={LINE} strokeWidth="1.4" />
          </g>
        );
      })}
      <Arrow d="M22,182 L96,182" tone={BAD} />
      <g>
        <circle cx={112} cy={182} r="9" fill="none" stroke={GOOD} strokeWidth="2" />
        <path d="M107 182 l4 4 l7 -8" fill="none" stroke={GOOD} strokeWidth="2" strokeLinecap="round" />
      </g>
      <text x={200} y={186} fill={MUTED} style={{ fontSize: 9.5 }}>
        it stops here, at the second one
      </text>
    </g>
  ),

  // 8. The last permission
  () => (
    <g>
      <rect x={58} y={38} width={284} height={116} rx="8" fill={SURF} stroke={LINE} strokeWidth="1.5" />
      <text x={78} y={62} fill={MUTED} style={{ fontSize: 8.5, letterSpacing: '0.12em' }}>
        RECOMMENDED ACTION
      </text>
      <text x={78} y={84} fill={INK} style={{ fontSize: 12, fontWeight: 500 }}>
        Restrict access to emergency zone
      </text>
      <line x1={78} y1={98} x2={322} y2={98} stroke={LINE} strokeWidth="1" />
      {[
        ['Approve', 78, MUTED],
        ['Reject', 152, MUTED],
        ['Ask why', 216, ACCENT],
      ].map(([label, x, tone], i) => (
        <g key={i}>
          <rect
            x={x as number}
            y={112}
            width={label === 'Ask why' ? 84 : 66}
            height={26}
            rx="5"
            fill="none"
            stroke={tone as string}
            strokeWidth={label === 'Ask why' ? 2 : 1.4}
          />
          <text
            x={(x as number) + (label === 'Ask why' ? 42 : 33)}
            y={129}
            textAnchor="middle"
            fill={tone as string}
            style={{ fontSize: 9.5, fontWeight: label === 'Ask why' ? 600 : 400 }}
          >
            {label as string}
          </text>
        </g>
      ))}
      <path d="M262 146 l0 18 l6 -5 l5 10 l5 -3 l-5 -9 l7 -1 z" fill={INK} />
      <Person x={200} y={196} s={1.15} />
      <text x={200} y={240} textAnchor="middle" fill={MUTED} style={{ fontSize: 10 }}>
        the last question is still yours
      </text>
    </g>
  ),
];

import React from 'react';

export type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  title?: string;
};

const base = (
  d: React.ReactNode,
  { size = 20, className = '', strokeWidth = 1.5, title }: IconProps
) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : undefined}
    focusable="false"
  >
    {title ? <title>{title}</title> : null}
    {d}
  </svg>
);

type C = (p: IconProps) => JSX.Element;

/* ---- Domains ---------------------------------------------------------- */
export const IconFinance: C = (p) =>
  base(
    <>
      <path d="M3 21h18" />
      <path d="M5 21V9l7-5 7 5v12" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 11h.01M15 11h.01" />
    </>,
    p
  );

export const IconHealth: C = (p) =>
  base(
    <>
      <path d="M3 12h3.5l2-5 3 10 2.5-5H21" />
      <path d="M4.5 7.5a4 4 0 0 1 6.3-3.2" />
    </>,
    p
  );

export const IconManufacturing: C = (p) =>
  base(
    <>
      <path d="M3 21V10l5 3.5V10l5 3.5V10l5 3.5V21z" />
      <path d="M3 21h18" />
      <path d="M18 10V4h3v6" />
      <path d="M7.5 17.5h1M12 17.5h1M16.5 17.5h1" />
    </>,
    p
  );

export const IconInfrastructure: C = (p) =>
  base(
    <>
      <path d="M13 2 4.5 13H11l-1 9 8.5-11H12z" />
    </>,
    p
  );

/* ---- Principles ------------------------------------------------------- */
export const IconTransparency: C = (p) =>
  base(
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>,
    p
  );

export const IconContainment: C = (p) =>
  base(
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </>,
    p
  );

export const IconAuthority: C = (p) =>
  base(
    <>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M8 7l-3 6a3 3 0 0 0 6 0z" />
      <path d="M16 7l3 6a3 3 0 0 1-6 0z" />
      <path d="M9 21h6" />
    </>,
    p
  );

export const IconCoordination: C = (p) =>
  base(
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M10.4 7.1 6.6 15.9M13.6 7.1l3.8 8.8M7.5 18h9" />
    </>,
    p
  );

export const IconSafeFailure: C = (p) =>
  base(
    <>
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M21 3v6h-6" />
      <path d="M12 8v4l2.5 2.5" />
    </>,
    p
  );

/* ---- Status ----------------------------------------------------------- */
export const IconCheck: C = (p) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>,
    p
  );

export const IconWarning: C = (p) =>
  base(
    <>
      <path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </>,
    p
  );

export const IconSerious: C = (p) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </>,
    p
  );

export const IconCritical: C = (p) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>,
    p
  );

export const IconInfo: C = (p) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>,
    p
  );

/* ---- Controls --------------------------------------------------------- */
export const IconPlay: C = (p) => base(<path d="M7 4.5v15l13-7.5z" />, p);
export const IconPause: C = (p) =>
  base(
    <>
      <path d="M9 4v16M15 4v16" />
    </>,
    p
  );
export const IconStep: C = (p) =>
  base(
    <>
      <path d="M6 4.5v15l11-7.5z" />
      <path d="M19 4v16" />
    </>,
    p
  );
export const IconReset: C = (p) =>
  base(
    <>
      <path d="M3 12a9 9 0 1 1 3 6.7" />
      <path d="M3 20v-6h6" />
    </>,
    p
  );

/* ---- Navigation / misc ------------------------------------------------ */
export const IconArrowRight: C = (p) =>
  base(
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>,
    p
  );
export const IconArrowUpRight: C = (p) =>
  base(
    <>
      <path d="M7 17 17 7M8 7h9v9" />
    </>,
    p
  );
export const IconChevronDown: C = (p) => base(<path d="m6 9 6 6 6-6" />, p);
export const IconMenu: C = (p) =>
  base(
    <>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </>,
    p
  );
export const IconClose: C = (p) =>
  base(
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>,
    p
  );
export const IconDoc: C = (p) =>
  base(
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>,
    p
  );
export const IconGithub: C = (p) =>
  base(
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
    p
  );
export const IconShield: C = (p) =>
  base(
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>,
    p
  );
export const IconGauge: C = (p) =>
  base(
    <>
      <path d="M3.5 17a9 9 0 1 1 17 0" />
      <path d="m12 13 4-3.5" />
      <circle cx="12" cy="14" r="1.5" />
    </>,
    p
  );
export const IconUsers: C = (p) =>
  base(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.5a3.2 3.2 0 0 1 0 5M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
    </>,
    p
  );
export const IconSun: C = (p) =>
  base(
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>,
    p
  );

export const IconMoon: C = (p) =>
  base(<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a6.8 6.8 0 0 0 11 11z" />, p);

export const IconMonitor: C = (p) =>
  base(
    <>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8.5 21h7M12 17v4" />
    </>,
    p
  );

export const IconLink: C = (p) =>
  base(
    <>
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </>,
    p
  );

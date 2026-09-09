import React from 'react';
import Link from 'next/link';
import { IconArrowRight, IconArrowUpRight } from './Icon';

/* ---------------- Button ---------------- */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-[#2f76cd] active:bg-[#2a6ab8] border border-transparent',
  secondary:
    'bg-surface-raised text-ink-primary hover:bg-[#232c3c] border border-line-strong',
  ghost:
    'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-white/5 border border-transparent',
  danger:
    'bg-transparent text-status-critical hover:bg-status-critical/10 border border-status-critical/40',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

const buttonBase =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap select-none';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`${buttonBase} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Internal navigation / same-page anchor. Renders a real, followable link. */
export function LinkButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  withArrow = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  withArrow?: boolean;
}) {
  const cls = `${buttonBase} ${variants[variant]} ${sizes[size]} ${className}`;
  const inner = (
    <>
      {children}
      {withArrow ? <IconArrowRight size={16} /> : null}
    </>
  );
  if (href.startsWith('#') || href.startsWith('http')) {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
        {external ? <IconArrowUpRight size={14} /> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Quiet inline text link. */
export function TextLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const cls = `inline-flex items-center gap-1 text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent transition-colors ${className}`;
  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <IconArrowUpRight size={13} />
      </a>
    );
  }
  if (href.startsWith('#')) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* ---------------- Layout ---------------- */

export function Section({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 ${className}`}>
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-prose text-center' : 'max-w-prose'}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2 className="text-balance text-2xl font-semibold tracking-[-0.02em] text-ink-primary sm:text-[32px] sm:leading-[1.15]">
        {title}
      </h2>
      {lede ? (
        <p className="mt-4 text-[15px] leading-relaxed text-ink-secondary">{lede}</p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className = '',
  as: As = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: any;
}) {
  return (
    <As className={`panel p-5 ${className}`}>{children}</As>
  );
}

/* ---------------- Data display ---------------- */

export function Stat({
  label,
  value,
  unit,
  tone = 'default',
  note,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: 'default' | 'good' | 'warning' | 'serious' | 'critical';
  note?: string;
}) {
  const toneCls = {
    default: 'text-ink-primary',
    good: 'text-status-good',
    warning: 'text-status-warning',
    serious: 'text-status-serious',
    critical: 'text-status-critical',
  }[tone];
  return (
    <div className="min-w-0">
      <dt className="eyebrow truncate">{label}</dt>
      <dd className={`mt-1.5 text-[26px] font-semibold leading-none tracking-[-0.02em] ${toneCls}`}>
        {value}
        {unit ? (
          <span className="ml-1 text-sm font-normal text-ink-muted">{unit}</span>
        ) : null}
      </dd>
      {note ? <p className="mt-1.5 text-xs text-ink-muted">{note}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
  icon,
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'good' | 'warning' | 'serious' | 'critical' | 'accent';
  icon?: React.ReactNode;
}) {
  const tones = {
    neutral: 'border-line-strong text-ink-secondary bg-white/[0.03]',
    good: 'border-status-good/40 text-status-good bg-status-good/10',
    warning: 'border-status-warning/40 text-status-warning bg-status-warning/10',
    serious: 'border-status-serious/40 text-status-serious bg-status-serious/10',
    critical: 'border-status-critical/40 text-status-critical bg-status-critical/10',
    accent: 'border-accent/40 text-accent bg-accent-soft',
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.1em] ${tones}`}
    >
      {icon}
      {children}
    </span>
  );
}

/** Horizontal magnitude meter. Rounded data-end, anchored to a baseline. */
export function Meter({
  value,
  max = 100,
  tone = 'accent',
  className = '',
  label,
}: {
  value: number;
  max?: number;
  tone?: 'accent' | 'good' | 'warning' | 'serious' | 'critical';
  className?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = {
    accent: 'bg-accent',
    good: 'bg-status-good',
    warning: 'bg-status-warning',
    serious: 'bg-status-serious',
    critical: 'bg-status-critical',
  }[tone];
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07] ${className}`}
      role="meter"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ease-out ${fill}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

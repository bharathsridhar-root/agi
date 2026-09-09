import React from 'react';
import { LinkButton, Section } from '@/components/ui/Primitives';
import { IconArrowRight, IconPlay } from '@/components/ui/Icon';

const FIGURES = [
  { value: '20', label: 'Systems modelled', note: 'across four sectors' },
  { value: '26', label: 'Dependencies', note: '9 of them cross sectors' },
  { value: '5', label: 'Safeguards', note: 'each one testable on its own' },
  { value: '486', label: 'Ways the story ends', note: 'depending on your choices' },
];

export default function Hero() {
  return (
    <Section className="relative overflow-hidden pt-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-70" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 opacity-[0.16]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgb(var(--accent)) 0%, transparent 68%)',
        }}
      />

      <p className="eyebrow mb-5 animate-fade-in">Constitutional AI Governance Platform</p>

      <h1 className="max-w-4xl text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-primary animate-fade-up sm:text-[54px]">
        Intelligence can scale power.
        <br />
        <span className="text-ink-muted">Governance decides who holds it.</span>
      </h1>

      <p
        className="mt-6 max-w-prose text-[16px] leading-relaxed text-ink-secondary animate-fade-up sm:text-[17px]"
        style={{ animationDelay: '60ms' }}
      >
        An AI system doesn&apos;t have to turn hostile to do damage. It just has to be trusted
        by systems that were never built to check it. That&apos;s what this models: one bad
        input, and where it travels through finance, healthcare, manufacturing and
        infrastructure. Then you switch on five safeguards and watch the same thing again.
      </p>

      <div
        className="mt-8 flex flex-wrap gap-2.5 animate-fade-up"
        style={{ animationDelay: '120ms' }}
      >
        <LinkButton href="#simulator" size="lg">
          <IconPlay size={15} />
          Run the cascade simulator
        </LinkButton>
        <LinkButton href="#story" variant="secondary" size="lg">
          Play The Last Permission
          <IconArrowRight size={16} />
        </LinkButton>
      </div>

      <dl
        className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 animate-fade-up sm:grid-cols-4"
        style={{ animationDelay: '180ms' }}
      >
        {FIGURES.map((f) => (
          <div key={f.label}>
            <dd className="text-[30px] font-semibold leading-none tracking-[-0.02em] text-ink-primary">
              {f.value}
            </dd>
            <dt className="mt-2 text-[13px] font-medium text-ink-secondary">{f.label}</dt>
            <p className="mt-0.5 text-xs text-ink-muted">{f.note}</p>
          </div>
        ))}
      </dl>
    </Section>
  );
}

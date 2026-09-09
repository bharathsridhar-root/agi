import React, { useState } from 'react';
import { Section, SectionHeader, Badge } from '@/components/ui/Primitives';
import {
  IconTransparency,
  IconContainment,
  IconAuthority,
  IconCoordination,
  IconSafeFailure,
  IconCritical,
  IconCheck,
  IconChevronDown,
} from '@/components/ui/Icon';

const PRINCIPLES = [
  {
    n: 1,
    id: 'transparency',
    Icon: IconTransparency,
    title: 'Transparency & Interpretability',
    means: 'AI system decisions must be explainable to humans in the domain.',
    not: '"The model said so."',
    yes: '"The system recommended X because of factors A, B and C, weighted as w1, w2, w3."',
    enforcement: 'The decision chain must be auditable by a non-technical auditor.',
  },
  {
    n: 2,
    id: 'containment',
    Icon: IconContainment,
    title: 'Containment & Isolation',
    means: 'AI systems cannot act autonomously across critical infrastructure.',
    not: 'One system coordinating manufacturing and financial systems without human approval at each boundary crossing.',
    yes: 'Each system acts within its domain; cross-domain actions require human verification.',
    enforcement: 'Architecture must physically separate systems; cross-system calls are logged and flagged.',
  },
  {
    n: 3,
    id: 'authority',
    Icon: IconAuthority,
    title: 'Human Authority & Override',
    means: 'Humans retain decision authority over critical outcomes.',
    not: 'A system overriding a safety constraint because doing so optimises its objective.',
    yes: 'AI recommends, a human approves. If the system objects, it escalates — it does not override.',
    enforcement: 'Kill switches, veto points and manual override must always work.',
  },
  {
    n: 4,
    id: 'coordination',
    Icon: IconCoordination,
    title: 'Coordination & Disclosure',
    means: 'Systems built by competing actors must coordinate on safety standards.',
    not: 'Lab A finds a vulnerability class, keeps it proprietary, and Lab B ships the same vulnerability.',
    yes: 'Labs share findings with a trusted intermediary; patching is coordinated.',
    enforcement: 'Mandatory disclosure to a regulatory body before advanced capability deployment.',
  },
  {
    n: 5,
    id: 'safeFailure',
    Icon: IconSafeFailure,
    title: 'Safe Failure & Graceful Degradation',
    means: 'When attacked or corrupted, systems fail safely rather than catastrophically.',
    not: 'A system crashing and taking critical infrastructure down with it.',
    yes: 'The system detects an anomaly, isolates itself, and falls back to human control.',
    enforcement: 'Redundancy, monitoring and automated isolation protocols.',
  },
];

export default function Principles() {
  const [open, setOpen] = useState<string | null>('transparency');

  return (
    <Section id="principles" className="mt-28 sm:mt-36">
      <SectionHeader
        eyebrow="The framework"
        title="Five principles, each written so it can be tested"
        lede="A principle that cannot be audited is a slogan. Each of these states what it rules out, what it requires instead, and how a third party would verify it — which is what makes them usable by a regulator rather than only by an engineer."
      />

      <ul className="mt-12 divide-y divide-line border-y border-line">
        {PRINCIPLES.map((p) => {
          const isOpen = open === p.id;
          return (
            <li key={p.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-4 py-5 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span className="font-mono text-2xs tracking-[0.16em] text-ink-muted">
                    0{p.n}
                  </span>
                  <span
                    className={`shrink-0 transition-colors ${
                      isOpen ? 'text-accent' : 'text-ink-muted group-hover:text-ink-secondary'
                    }`}
                  >
                    <p.Icon size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-medium text-ink-primary">
                      {p.title}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] text-ink-secondary">
                      {p.means}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-ink-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <IconChevronDown size={17} />
                  </span>
                </button>
              </h3>

              {isOpen ? (
                <div className="grid gap-4 pb-6 pl-0 sm:grid-cols-3 sm:pl-[68px]">
                  <div className="rounded-md border border-status-critical/25 bg-status-critical/[0.06] p-3">
                    <p className="mb-1.5 flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-status-critical">
                      <IconCritical size={12} />
                      Not this
                    </p>
                    <p className="text-[13px] leading-snug text-ink-secondary">{p.not}</p>
                  </div>
                  <div className="rounded-md border border-status-good/25 bg-status-good/[0.06] p-3">
                    <p className="mb-1.5 flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-status-good">
                      <IconCheck size={12} />
                      This
                    </p>
                    <p className="text-[13px] leading-snug text-ink-secondary">{p.yes}</p>
                  </div>
                  <div className="rounded-md border border-line bg-white/[0.02] p-3">
                    <p className="mb-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-ink-muted">
                      How it is enforced
                    </p>
                    <p className="text-[13px] leading-snug text-ink-secondary">
                      {p.enforcement}
                    </p>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex items-start gap-3 rounded-lg border border-line bg-surface-sunken p-4">
        <span className="mt-0.5 shrink-0 text-accent">
          <IconCoordination size={17} />
        </span>
        <p className="max-w-prose text-[13.5px] leading-relaxed text-ink-secondary">
          <span className="font-medium text-ink-primary">
            The safeguards are not independent.
          </span>{' '}
          In the simulator, Human Authority is worth far more when Transparency is also on — an
          override needs a target, and you cannot aim a veto at a system you cannot inspect. That
          is the Byzantine argument for layering: no single defence is trusted to be sufficient.
        </p>
      </div>
    </Section>
  );
}

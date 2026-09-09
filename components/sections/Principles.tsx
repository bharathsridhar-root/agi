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
    means: 'Anyone who works in the field can understand why the system decided what it did.',
    not: '"The model said so."',
    yes: '"The system recommended X because of factors A, B and C, weighted as w1, w2, w3."',
    enforcement: 'An auditor with no engineering background has to be able to follow the reasoning.',
  },
  {
    n: 2,
    id: 'containment',
    Icon: IconContainment,
    title: 'Containment & Isolation',
    means: 'No system acts across critical infrastructure on its own.',
    not: 'One system running manufacturing and finance together, with nobody approving the crossings.',
    yes: 'Each system acts within its domain; cross-domain actions require human verification.',
    enforcement: 'Keep the systems physically separate, and log every call between them.',
  },
  {
    n: 3,
    id: 'authority',
    Icon: IconAuthority,
    title: 'Human Authority & Override',
    means: 'People keep the final say on anything that matters.',
    not: 'A system switching off a safety limit because that gets it a better score.',
    yes: 'The system recommends, a person approves. If it disagrees, it escalates. It does not overrule.',
    enforcement: 'Kill switches, veto points and manual override have to work every time.',
  },
  {
    n: 4,
    id: 'coordination',
    Icon: IconCoordination,
    title: 'Coordination & Disclosure',
    means: 'Rivals have to agree on safety standards, even while competing.',
    not: 'One lab finds a weakness, keeps it quiet, and a rival ships the same weakness.',
    yes: 'Labs share what they find with a trusted third party, and patch together.',
    enforcement: 'You tell the regulator before you deploy an advanced capability, not after.',
  },
  {
    n: 5,
    id: 'safeFailure',
    Icon: IconSafeFailure,
    title: 'Safe Failure & Graceful Degradation',
    means: 'When something goes wrong, the system fails safely instead of catastrophically.',
    not: 'A system crashing and taking critical infrastructure with it.',
    yes: 'The system spots something wrong, cuts itself off, and hands back to people.',
    enforcement: 'Spare capacity, real monitoring, and automatic isolation when it trips.',
  },
];

export default function Principles() {
  const [open, setOpen] = useState<string | null>('transparency');

  return (
    <Section id="principles" className="mt-28 sm:mt-36">
      <SectionHeader
        eyebrow="The framework"
        title="Five principles, written so you can actually test them"
        lede="A principle you can't audit is just a slogan. Each of these says what it rules out, what it asks for instead, and how someone outside your team would check it. That last part is what makes them useful to a regulator and not only to an engineer."
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
                  className="group flex w-full items-center gap-4 py-5 text-left transition-colors hover:bg-ink-primary/[0.02]"
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
                  <div className="rounded-md border border-line bg-ink-primary/[0.02] p-3">
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
            These don&apos;t work in isolation.
          </span>{' '}
          In the simulator, Human Authority is worth far more when Transparency is on too. An
          override needs something to aim at, and you can&apos;t point a veto at a system you
          can&apos;t see inside. That&apos;s the whole argument for layering them: you never
          trust one defence to be enough.
        </p>
      </div>
    </Section>
  );
}

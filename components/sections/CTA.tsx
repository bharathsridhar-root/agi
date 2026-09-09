import React from 'react';
import { LinkButton, Section } from '@/components/ui/Primitives';
import { IconArrowRight, IconGithub } from '@/components/ui/Icon';

const QUESTIONS = [
  { q: 'Who is accountable?', a: 'Name a person, not a system. If the answer is "the model approved it", you do not have an answer.' },
  { q: 'What can it reach?', a: 'List the boundaries it is allowed to cross, and who is standing at each one.' },
  { q: 'How do you check its decisions?', a: 'Working that an auditor can follow without an engineering degree. Not a confidence score.' },
  { q: 'How do you stop it?', a: 'A veto somebody has used recently enough that nobody thinks of it as hypothetical.' },
];

export default function CTA() {
  return (
    <Section id="act" className="mt-28 sm:mt-36">
      <div className="panel overflow-hidden">
        <div className="border-b border-line bg-surface-sunken p-6 sm:p-9">
          <p className="eyebrow mb-4">Before giving AI more power</p>
          <h2 className="max-w-3xl text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-ink-primary sm:text-[32px]">
            Answer these four first. They cost almost nothing today, and a great deal in the
            middle of an incident.
          </h2>
        </div>

        <dl className="grid gap-px bg-line sm:grid-cols-2">
          {QUESTIONS.map((item, i) => (
            <div key={item.q} className="bg-surface p-5 sm:p-6">
              <dt className="flex items-baseline gap-2.5">
                <span className="font-mono text-2xs tracking-[0.16em] text-accent">
                  0{i + 1}
                </span>
                <span className="text-[15px] font-medium text-ink-primary">{item.q}</span>
              </dt>
              <dd className="mt-2 pl-[26px] text-[13.5px] leading-relaxed text-ink-secondary">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center gap-2.5 border-t border-line p-6 sm:p-7">
          <LinkButton href="/framework" size="lg">
            Read the framework
            <IconArrowRight size={16} />
          </LinkButton>
          <LinkButton
            href="https://github.com/bharathsridhar-root/agi"
            variant="secondary"
            size="lg"
          >
            <IconGithub size={16} />
            Source
          </LinkButton>
        </div>
      </div>

      <blockquote className="mx-auto mt-20 max-w-2xl text-center">
        <p className="text-balance text-xl font-medium leading-snug tracking-[-0.01em] text-ink-primary sm:text-2xl">
          &ldquo;Because a system that cannot be stopped is not infrastructure. It is a
          ruler.&rdquo;
        </p>
        <footer className="mt-4 font-mono text-2xs uppercase tracking-[0.14em] text-ink-muted">
          Maya, in The Last Permission
        </footer>
      </blockquote>
    </Section>
  );
}

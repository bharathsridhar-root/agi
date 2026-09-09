import React from 'react';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Section, SectionHeader, Badge, LinkButton, TextLink } from '@/components/ui/Primitives';
import {
  IconArrowRight,
  IconCheck,
  IconDoc,
  IconShield,
  IconUsers,
  IconGauge,
  IconFinance,
  IconHealth,
  IconManufacturing,
  IconInfrastructure,
} from '@/components/ui/Icon';

const LEVELS = [
  {
    level: 'Level 1',
    actor: 'Internal self-assessment',
    Icon: IconDoc,
    body: 'The organisation building the system audits itself against the five principles. The claim is not binding, but it is a public record with the methodology disclosed.',
    output: 'Published certification claim',
  },
  {
    level: 'Level 2',
    actor: 'Independent auditor',
    Icon: IconUsers,
    body: 'Someone outside the company, a consultancy, research lab or NGO trained on the framework, reads the design docs, tries to misuse the system, and checks that the safety limits actually hold.',
    output: 'Published audit report, including findings',
  },
  {
    level: 'Level 3',
    actor: 'Regulatory authority',
    Icon: IconShield,
    body: 'A government agency or international body reviews Level 2 audits, spot-checks systems directly, and enforces policy. It can mandate decertification, require fixes, or impose penalties.',
    output: 'Public regulatory compliance record',
  },
];

const TIERS = [
  {
    tier: 'Bronze',
    tone: 'neutral' as const,
    use: 'Non-critical systems, R&D, prototypes',
    reqs: ['Transparency documentation', 'Basic safety constraints'],
    risk: 'Grassroots level; no enforcement',
    passes: 'Self-assessment',
  },
  {
    tier: 'Silver',
    tone: 'warning' as const,
    use: 'Internal business systems, limited deployment',
    reqs: ['External verification', 'Decision-chain documentation', 'Audit log capability'],
    risk: 'Medium; some human oversight required',
    passes: 'Independent audit on 3+ principles',
  },
  {
    tier: 'Gold',
    tone: 'serious' as const,
    use: 'Critical infrastructure, cross-domain systems',
    reqs: ['Red-team testing', 'Kill-switch verification', 'Coordination proof'],
    risk: 'Low; robust safeguards demonstrated',
    passes: 'Full audit on all 5 principles + adversarial testing',
  },
  {
    tier: 'Platinum',
    tone: 'good' as const,
    use: 'Financial systems, healthcare, power grids, manufacturing',
    reqs: ['Independent monitoring', 'Incident reporting', 'Annual re-certification'],
    risk: 'Lowest; continuous oversight',
    passes: 'Regulatory approval + ongoing monitoring',
  },
];

const TEMPLATES = [
  {
    Icon: IconManufacturing,
    title: 'Manufacturing AI Safety Mandate',
    scope: 'Tolerances, quality control, cross-facility coordination',
    includes: 'Testing protocol, audit frequency, incident response',
    legal: 'Implemented via regulation or licensing',
  },
  {
    Icon: IconFinance,
    title: 'Financial AI Governance',
    scope: 'Data integrity, market stability, circuit breakers',
    includes: 'Market-stress testing, coordination with central banks',
    legal: 'Implemented via regulatory oversight',
  },
  {
    Icon: IconHealth,
    title: 'Healthcare AI Deployment',
    scope: 'Decision transparency, human oversight, liability',
    includes: 'Clinical validation, informed consent, audit trails',
    legal: 'Implemented via professional licensing',
  },
  {
    Icon: IconInfrastructure,
    title: 'Critical Infrastructure Protection',
    scope: 'Grid, water, telecoms and transport control systems',
    includes: 'Adversarial resilience testing, isolation requirements',
    legal: 'Implemented via sector regulators and procurement rules',
  },
];

export default function Framework() {
  return (
    <>
      <Head>
        <title>Framework &amp; Certification · CAIGP</title>
        <meta
          name="description"
          content="The Constitutional AI governance framework: five auditable principles, a three-level certification structure, four tiers, and modular policy templates for regulators."
        />
      </Head>
      <Navigation />

      <main id="main">
        <Section className="pt-32 sm:pt-36">
          <p className="eyebrow mb-5">Reference</p>
          <h1 className="max-w-3xl text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink-primary sm:text-[46px]">
            The framework, in a form a regulator could actually adopt
          </h1>
          <p className="mt-6 max-w-prose text-[16px] leading-relaxed text-ink-secondary">
            The five principles are the foundation, but on their own they&apos;re just a
            position. What makes them work is everything below: who certifies, on what evidence,
            at which tier, and what happens if you fail. This page is the reference. The{' '}
            <TextLink href="/#simulator">simulator</TextLink> is where the same ideas are
            measured.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <LinkButton href="/#principles" size="md">
              The five principles
              <IconArrowRight size={15} />
            </LinkButton>
            <LinkButton href="/#simulator" variant="secondary" size="md">
              Run the simulator
            </LinkButton>
          </div>
        </Section>

        {/* Certification levels */}
        <Section id="certification" className="mt-24">
          <SectionHeader
            eyebrow="Layer 2"
            title="This starts from the ground up, not from a regulator"
            lede="Waiting for a regulator isn't a plan. This is built so self-assessment and independent audits can start today, and so that whenever a regulator does show up, they inherit a pile of evidence instead of a blank page."
          />
          <ol className="mt-10 grid gap-4 lg:grid-cols-3">
            {LEVELS.map((l) => (
              <li key={l.level} className="panel p-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="text-accent">
                    <l.Icon size={18} />
                  </span>
                  <Badge tone="accent">{l.level}</Badge>
                </div>
                <h3 className="text-[15px] font-medium text-ink-primary">{l.actor}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-secondary">{l.body}</p>
                <p className="mt-4 border-t border-line pt-3 text-xs text-ink-muted">
                  <span className="font-mono uppercase tracking-[0.1em]">Output</span>
                  <br />
                  {l.output}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Tiers */}
        <Section id="tiers" className="mt-24">
          <SectionHeader
            eyebrow="Layer 2"
            title="Four tiers, matched to consequence"
            lede="The tier depends on what happens when the system is wrong, not on how clever it is. Something powerful doing reversible work needs less oversight than something simple wired into a power grid."
          />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                Certification tiers, their requirements, intended use and residual risk
              </caption>
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="py-3 pr-4 text-xs font-medium text-ink-muted">Tier</th>
                  <th scope="col" className="py-3 pr-4 text-xs font-medium text-ink-muted">Passes</th>
                  <th scope="col" className="py-3 pr-4 text-xs font-medium text-ink-muted">Used for</th>
                  <th scope="col" className="py-3 pr-4 text-xs font-medium text-ink-muted">Requirements</th>
                  <th scope="col" className="py-3 text-xs font-medium text-ink-muted">Residual risk</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((t) => (
                  <tr key={t.tier} className="border-b border-line align-top last:border-0">
                    <td className="py-4 pr-4">
                      <Badge tone={t.tone}>{t.tier}</Badge>
                    </td>
                    <td className="py-4 pr-4 text-[13px] text-ink-primary">{t.passes}</td>
                    <td className="py-4 pr-4 text-[13px] text-ink-secondary">{t.use}</td>
                    <td className="py-4 pr-4">
                      <ul className="space-y-1">
                        {t.reqs.map((r) => (
                          <li key={r} className="flex gap-1.5 text-[13px] text-ink-secondary">
                            <span className="mt-0.5 shrink-0 text-status-good">
                              <IconCheck size={12} />
                            </span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 text-[13px] text-ink-secondary">{t.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Policy templates */}
        <Section id="templates" className="mt-24">
          <SectionHeader
            eyebrow="Layer 3"
            title="Modular policy templates"
            lede="These are meant to be adapted, not copied word for word. Each one gives you a scope, the testing that follows from it, and the legal route a jurisdiction would actually use to make it stick."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {TEMPLATES.map((t) => (
              <article key={t.title} className="panel p-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="text-ink-secondary">
                    <t.Icon size={18} />
                  </span>
                  <h3 className="text-[15px] font-medium text-ink-primary">{t.title}</h3>
                </div>
                <dl className="space-y-2.5">
                  {[
                    ['Scope', t.scope],
                    ['Includes', t.includes],
                    ['Legal framework', t.legal],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-mono text-2xs uppercase tracking-[0.1em] text-ink-muted">
                        {k}
                      </dt>
                      <dd className="mt-0.5 text-[13px] leading-snug text-ink-secondary">{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </Section>

        <Section className="mt-24">
          <div className="panel flex flex-wrap items-center gap-4 p-6">
            <span className="text-accent">
              <IconGauge size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-medium text-ink-primary">
                See what the framework is worth under pressure
              </h2>
              <p className="mt-1 text-[13px] text-ink-secondary">
                The simulator measures what each principle is worth on the same incident, on
                its own and combined with the others.
              </p>
            </div>
            <LinkButton href="/#simulator" size="md">
              Open the simulator
              <IconArrowRight size={15} />
            </LinkButton>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}

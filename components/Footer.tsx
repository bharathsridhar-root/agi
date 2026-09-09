import React from 'react';
import Link from 'next/link';
import { IconShield, IconGithub, IconArrowUpRight } from '@/components/ui/Icon';

const REPO = 'https://github.com/bharathsridhar-root/agi';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface-sunken">
      <div className="mx-auto max-w-content px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="text-accent">
                <IconShield size={19} />
              </span>
              <span className="text-[15px] font-semibold text-ink-primary">CAIGP</span>
            </div>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink-muted">
              The Constitutional AI Governance Platform. An educational model of how failures
              cascade between AI-managed systems, and how five safeguards change the outcome.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-ink-muted">
              The scenarios here are deliberately hypothetical. Figures come from the
              platform&apos;s own model, not from measured incidents, and are intended to show
              the shape of a cascade rather than to forecast one.
            </p>
          </div>

          <div>
            <h3 className="eyebrow mb-3">Explore</h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <a href="/#cascade" className="text-ink-secondary transition-colors hover:text-ink-primary">
                  The Cascade
                </a>
              </li>
              <li>
                <a href="/#simulator" className="text-ink-secondary transition-colors hover:text-ink-primary">
                  Cascade simulator
                </a>
              </li>
              <li>
                <a href="/#story" className="text-ink-secondary transition-colors hover:text-ink-primary">
                  The Last Permission
                </a>
              </li>
              <li>
                <a href="/#principles" className="text-ink-secondary transition-colors hover:text-ink-primary">
                  Five principles
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-3">Reference</h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link href="/framework" className="text-ink-secondary transition-colors hover:text-ink-primary">
                  Framework &amp; certification
                </Link>
              </li>
              <li>
                <Link href="/framework#tiers" className="text-ink-secondary transition-colors hover:text-ink-primary">
                  Certification tiers
                </Link>
              </li>
              <li>
                <Link href="/framework#templates" className="text-ink-secondary transition-colors hover:text-ink-primary">
                  Policy templates
                </Link>
              </li>
              <li>
                <a
                  href={REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink-secondary transition-colors hover:text-ink-primary"
                >
                  <IconGithub size={14} />
                  Source
                  <IconArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <p className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-muted">
            Constitutional AI Governance Platform
          </p>
          <p className="text-xs text-ink-muted">
            Educational demonstration · not affiliated with any deployed system
          </p>
        </div>
      </div>
    </footer>
  );
}

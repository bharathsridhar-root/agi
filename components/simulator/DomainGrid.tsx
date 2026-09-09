import React from 'react';
import {
  DOMAINS,
  DomainId,
  NODES,
  SimState,
  severityOf,
  NODE_BY_ID,
} from '@/lib/simulation';
import {
  IconFinance,
  IconHealth,
  IconManufacturing,
  IconInfrastructure,
} from '@/components/ui/Icon';
import { Meter } from '@/components/ui/Primitives';

const DOMAIN_ICON: Record<DomainId, (p: { size?: number; className?: string }) => JSX.Element> = {
  financial: IconFinance,
  healthcare: IconHealth,
  manufacturing: IconManufacturing,
  infrastructure: IconInfrastructure,
};

const SEV_STYLE = {
  operational: { dot: 'bg-status-good', text: 'text-ink-secondary', tone: 'good' as const, label: 'Normal' },
  degraded: { dot: 'bg-status-warning', text: 'text-ink-primary', tone: 'warning' as const, label: 'Degraded' },
  critical: { dot: 'bg-status-serious', text: 'text-ink-primary', tone: 'serious' as const, label: 'Critical' },
  failed: { dot: 'bg-status-critical', text: 'text-ink-primary', tone: 'critical' as const, label: 'Failed' },
};

const ORDER: DomainId[] = ['financial', 'healthcare', 'manufacturing', 'infrastructure'];

export default function DomainGrid({ state }: { state: SimState }) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      {ORDER.map((d) => {
        const Icon = DOMAIN_ICON[d];
        const nodes = NODES.filter((n) => n.domain === d);
        const mean =
          nodes.reduce((acc, n) => acc + state.nodes[n.id].health, 0) / nodes.length;
        const domainSev = severityOf(mean);
        const ds = SEV_STYLE[domainSev];

        return (
          <section key={d} className="panel min-w-0 p-3.5">
            <header className="mb-3 flex items-center gap-2.5">
              <span className="text-ink-secondary">
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[13px] font-medium text-ink-primary">
                  {DOMAINS[d].label}
                </h4>
                <p className="truncate text-2xs text-ink-muted">{DOMAINS[d].blurb}</p>
              </div>
              <span className="tabular shrink-0 text-right">
                <span className="text-[15px] font-semibold text-ink-primary">
                  {mean.toFixed(0)}
                </span>
                <span className="text-2xs text-ink-muted">/100</span>
              </span>
            </header>
            <Meter value={mean} tone={ds.tone} label={`${DOMAINS[d].label} capacity`} className="mb-3" />

            <ul className="space-y-1">
              {nodes.map((n) => {
                const st = state.nodes[n.id];
                const sev = severityOf(st.health);
                const s = SEV_STYLE[sev];
                return (
                  <li
                    key={n.id}
                    className="group flex items-center gap-2 rounded px-1 py-0.5"
                    title={`${n.detail}. ${s.label} (${st.health.toFixed(0)}/100)`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot} ${
                        sev === 'failed' ? 'animate-pulse' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span className={`min-w-0 flex-1 truncate text-xs ${s.text}`}>
                      {n.label}
                    </span>
                    {st.overridden ? (
                      <span className="shrink-0 font-mono text-2xs uppercase tracking-[0.08em] text-accent">
                        Manual
                      </span>
                    ) : st.isolated ? (
                      <span className="shrink-0 font-mono text-2xs uppercase tracking-[0.08em] text-status-warning">
                        Isolated
                      </span>
                    ) : (
                      <span className="sr-only">{s.label}</span>
                    )}
                    <span className="tabular w-7 shrink-0 text-right font-mono text-2xs text-ink-muted">
                      {st.health.toFixed(0)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export { DOMAIN_ICON };

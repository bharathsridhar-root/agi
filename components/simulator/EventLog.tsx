import React, { useEffect, useRef } from 'react';
import type { SimEvent } from '@/lib/simulation';
import {
  IconCheck,
  IconWarning,
  IconSerious,
  IconCritical,
  IconInfo,
  IconShield,
} from '@/components/ui/Icon';

const TONE: Record<
  string,
  { cls: string; Icon: (p: { size?: number; className?: string }) => JSX.Element; label: string }
> = {
  operational: { cls: 'text-status-good', Icon: IconCheck, label: 'Normal' },
  degraded: { cls: 'text-status-warning', Icon: IconWarning, label: 'Degraded' },
  critical: { cls: 'text-status-serious', Icon: IconSerious, label: 'Critical' },
  failed: { cls: 'text-status-critical', Icon: IconCritical, label: 'Failed' },
  contained: { cls: 'text-accent', Icon: IconShield, label: 'Contained' },
  info: { cls: 'text-ink-muted', Icon: IconInfo, label: 'Info' },
};

export default function EventLog({ events }: { events: SimEvent[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const shown = events.slice(-80);

  /**
   * Keep the log pinned to the newest entry by scrolling THIS container only.
   * scrollIntoView() would scroll every ancestor including the document, which
   * yanks a visitor down the page on first load.
   */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [events.length]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-ink-primary">Incident log</h3>
        <span className="font-mono text-2xs uppercase tracking-[0.1em] text-ink-muted">
          {events.length} {events.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      <ol
        ref={listRef}
        className="scroll-slim min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-1"
        aria-live="polite"
        aria-relevant="additions"
      >
        {shown.map((e, i) => {
          const t = TONE[e.severity] ?? TONE.info;
          const { Icon } = t;
          return (
            <li
              key={`${e.tick}-${i}-${e.nodeId ?? 'sys'}`}
              className="flex items-start gap-2 rounded px-1.5 py-1 text-xs leading-snug hover:bg-ink-primary/[0.03]"
            >
              <span className="tabular mt-px w-6 shrink-0 text-right font-mono text-2xs text-ink-muted">
                {e.tick}
              </span>
              <span className={`mt-px shrink-0 ${t.cls}`} aria-hidden="true">
                <Icon size={13} />
              </span>
              <span className="min-w-0 text-ink-secondary">
                <span className="sr-only">{t.label}: </span>
                {e.message}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

import React from 'react';
import { SAFEGUARDS, SafeguardId } from '@/lib/simulation';
import {
  IconTransparency,
  IconContainment,
  IconAuthority,
  IconCoordination,
  IconSafeFailure,
} from '@/components/ui/Icon';

const ICONS: Record<SafeguardId, (p: { size?: number; className?: string }) => JSX.Element> = {
  transparency: IconTransparency,
  containment: IconContainment,
  authority: IconAuthority,
  coordination: IconCoordination,
  safeFailure: IconSafeFailure,
};

export default function SafeguardControls({
  safeguards,
  onToggle,
  onSetAll,
  disabled = false,
}: {
  safeguards: Record<SafeguardId, boolean>;
  onToggle: (id: SafeguardId) => void;
  onSetAll: (on: boolean) => void;
  disabled?: boolean;
}) {
  const activeCount = Object.values(safeguards).filter(Boolean).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-ink-primary">Constitutional safeguards</h3>
          <p className="mt-0.5 text-xs text-ink-muted">
            {activeCount} of 5 active. Changing these restarts the run.
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onSetAll(false)}
            disabled={disabled || activeCount === 0}
            className="rounded border border-line-strong px-2 py-1 font-mono text-2xs uppercase tracking-[0.1em] text-ink-secondary transition-colors hover:bg-white/5 hover:text-ink-primary disabled:opacity-35"
          >
            None
          </button>
          <button
            type="button"
            onClick={() => onSetAll(true)}
            disabled={disabled || activeCount === 5}
            className="rounded border border-line-strong px-2 py-1 font-mono text-2xs uppercase tracking-[0.1em] text-ink-secondary transition-colors hover:bg-white/5 hover:text-ink-primary disabled:opacity-35"
          >
            All
          </button>
        </div>
      </div>

      <ul className="space-y-1.5">
        {SAFEGUARDS.map((sg) => {
          const Icon = ICONS[sg.id];
          const on = safeguards[sg.id];
          return (
            <li key={sg.id}>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => onToggle(sg.id)}
                disabled={disabled}
                className={`group flex w-full items-start gap-3 rounded-md border p-2.5 text-left transition-colors ${
                  on
                    ? 'border-accent/45 bg-accent-soft'
                    : 'border-line bg-white/[0.015] hover:border-line-strong hover:bg-white/[0.04]'
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 transition-colors ${
                    on ? 'text-accent' : 'text-ink-muted group-hover:text-ink-secondary'
                  }`}
                >
                  <Icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={`text-[13px] font-medium ${
                        on ? 'text-ink-primary' : 'text-ink-secondary'
                      }`}
                    >
                      {sg.label}
                    </span>
                    <span
                      className={`ml-auto font-mono text-2xs uppercase tracking-[0.1em] ${
                        on ? 'text-accent' : 'text-ink-muted'
                      }`}
                    >
                      {on ? 'On' : 'Off'}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-ink-muted">
                    {on ? sg.effect : sg.principle}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import { IconSun, IconMoon, IconMonitor } from './Icon';

export type ThemeChoice = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'caigp-theme';

/**
 * Applies a choice to the document. "system" removes the attribute so the
 * prefers-color-scheme rules in globals.css take over again.
 */
export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
  try {
    if (choice === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Private browsing or blocked storage: the choice still applies for
    // this page view, it just will not be remembered.
  }
}

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof IconSun }[] = [
  { value: 'light', label: 'Light', Icon: IconSun },
  { value: 'system', label: 'System', Icon: IconMonitor },
  { value: 'dark', label: 'Dark', Icon: IconMoon },
];

export default function ThemeToggle({ className = '' }: { className?: string }) {
  // Start as "system" on both server and first client render so the markup
  // matches; the real choice is read after mount.
  const [choice, setChoice] = useState<ThemeChoice>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === 'light' || stored === 'dark') setChoice(stored);
    setReady(true);
  }, []);

  const pick = useCallback((next: ThemeChoice) => {
    setChoice(next);
    applyTheme(next);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-md border border-line p-0.5 ${className}`}
      role="radiogroup"
      aria-label="Colour theme"
    >
      {OPTIONS.map((o) => {
        const active = ready && choice === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={`${o.label} theme`}
            onClick={() => pick(o.value)}
            className={`inline-flex h-7 w-7 items-center justify-center rounded transition-colors ${
              active
                ? 'bg-accent/[0.14] text-accent'
                : 'text-ink-muted hover:bg-ink-primary/[0.06] hover:text-ink-secondary'
            }`}
          >
            <o.Icon size={15} />
            <span className="sr-only">{o.label} theme</span>
          </button>
        );
      })}
    </div>
  );
}

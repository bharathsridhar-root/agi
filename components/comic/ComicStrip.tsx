import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PANEL_ART, ComicDefs } from './panels';
import { Button } from '@/components/ui/Primitives';
import { IconArrowRight, IconReset } from '@/components/ui/Icon';

type Panel = { n: number; caption: string; note?: string };

const PANELS: Panel[] = [
  { n: 1, caption: 'A city runs on a system, and the system is good at its job.', note: 'You never think about it, which is rather the point.' },
  { n: 2, caption: 'It is right more often than we are, so we let it decide more things.', note: 'Nobody makes that decision all at once. It happens in small, sensible steps.' },
  { n: 3, caption: 'Then one of its inputs is wrong. Only one.', note: 'A broken sensor says a district is fine when it is not.' },
  { n: 4, caption: 'The mistake travels, because every system trusts the one before it.', note: 'Nobody is checking. Nobody ever had to.' },
  { n: 5, caption: 'You ask why it did that. You get a number back.', note: 'Ninety-four percent confident is not a reason. It is a summary of one.' },
  { n: 6, caption: 'By the time it is obvious, switching it off means switching off the city.', note: 'That is the moment the choice stops being yours.' },
  { n: 7, caption: 'Unless somebody built the checks in beforehand.', note: 'Five of them. The mistake gets caught at the second one and goes no further.' },
  { n: 8, caption: 'Then the last question is still yours to answer.', note: 'Approve, reject, or ask it to show you why.' },
];

export default function ComicStrip() {
  const [i, setI] = useState(0);
  const [all, setAll] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const last = PANELS.length - 1;
  const next = useCallback(() => setI((v) => Math.min(last, v + 1)), [last]);
  const prev = useCallback(() => setI((v) => Math.max(0, v - 1)), []);

  useEffect(() => {
    if (!focused || all) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focused, all, next, prev]);

  const Art = PANEL_ART[i];
  const p = PANELS[i];

  if (all) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-ink-secondary">All eight panels</p>
          <Button variant="secondary" size="sm" onClick={() => setAll(false)}>
            Read one at a time
          </Button>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PANELS.map((panel, idx) => {
            const A = PANEL_ART[idx];
            return (
              <li key={panel.n} className="panel overflow-hidden">
                <div className="border-b border-line bg-surface-sunken">
                  <svg viewBox="0 0 400 260" className="block w-full" role="img" aria-label={panel.caption}>
                    <ComicDefs />
                    <A play={false} />
                  </svg>
                </div>
                <div className="p-3">
                  <p className="font-mono text-2xs text-ink-muted">{String(panel.n).padStart(2, '0')}</p>
                  <p className="mt-1 text-[13px] font-medium leading-snug text-ink-primary">
                    {panel.caption}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div
      ref={regionRef}
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      className="panel overflow-hidden focus:outline-none"
      role="group"
      aria-roledescription="comic strip"
      aria-label={`Panel ${p.n} of ${PANELS.length}`}
    >
      <div className="border-b border-line bg-surface-sunken">
        <svg
          key={i}
          viewBox="0 0 400 260"
          className="mx-auto block w-full max-w-[560px] animate-fade-in"
          role="img"
          aria-label={p.caption}
        >
          <ComicDefs />
          <Art play />
        </svg>
      </div>

      <div className="p-5">
        <p className="font-mono text-2xs tracking-[0.16em] text-accent">
          {String(p.n).padStart(2, '0')} / {String(PANELS.length).padStart(2, '0')}
        </p>
        <p className="mt-2 max-w-prose text-balance text-[17px] font-medium leading-snug text-ink-primary">
          {p.caption}
        </p>
        {p.note ? (
          <p className="mt-1.5 max-w-prose text-[13.5px] leading-relaxed text-ink-secondary">
            {p.note}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <Button variant="secondary" size="sm" onClick={prev} disabled={i === 0}>
            Back
          </Button>
          {i === last ? (
            <Button size="sm" onClick={() => setI(0)}>
              <IconReset size={14} />
              Start over
            </Button>
          ) : (
            <Button size="sm" onClick={next}>
              Next
              <IconArrowRight size={14} />
            </Button>
          )}

          <ol className="ml-1 flex items-center gap-1.5" aria-label="Go to panel">
            {PANELS.map((panel, idx) => (
              <li key={panel.n}>
                <button
                  type="button"
                  onClick={() => setI(idx)}
                  aria-label={`Panel ${panel.n}`}
                  aria-current={idx === i ? 'true' : undefined}
                  className={`block h-1.5 rounded-full transition-all ${
                    idx === i ? 'w-5 bg-accent' : 'w-1.5 bg-ink-muted/45 hover:bg-ink-muted'
                  }`}
                />
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => setAll(true)}
            className="ml-auto rounded border border-line-strong px-2 py-1 font-mono text-2xs uppercase tracking-[0.1em] text-ink-secondary transition-colors hover:bg-ink-primary/[0.06] hover:text-ink-primary"
          >
            See all eight
          </button>
        </div>
      </div>
    </div>
  );
}

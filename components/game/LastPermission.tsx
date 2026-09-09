import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Choice,
  GameState,
  PILLAR_LABEL,
  SCENE_BY_ID,
  SPEAKER_META,
  applyChoice,
  computeEnding,
  initialGame,
} from '@/lib/game';
import type { SafeguardId } from '@/lib/simulation';
import { Badge, Button, Meter } from '@/components/ui/Primitives';
import {
  IconArrowRight,
  IconReset,
  IconShield,
  IconCheck,
  IconWarning,
  IconSerious,
  IconCritical,
} from '@/components/ui/Icon';
import CityView from './CityView';

const CHAR_MS = 16;

/** 50 is the starting value for every pillar, so it must read as neutral. */
function pillarTone(v: number): 'good' | 'accent' | 'warning' | 'serious' | 'critical' {
  if (v >= 75) return 'good';
  if (v >= 48) return 'accent';
  if (v >= 30) return 'warning';
  return 'critical';
}

const PILLAR_ORDER: SafeguardId[] = [
  'transparency',
  'containment',
  'authority',
  'coordination',
  'safeFailure',
];

export default function LastPermission() {
  const [game, setGame] = useState<GameState>(initialGame);
  const [revealed, setRevealed] = useState(0);
  const [typing, setTyping] = useState(true);
  const [lastConsequence, setLastConsequence] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const scene = SCENE_BY_ID[game.sceneId];
  const visibleLines = scene.lines.slice(0, game.lineIndex + 1);
  const currentLine = scene.lines[game.lineIndex];
  const atLastLine = game.lineIndex >= scene.lines.length - 1;

  /* Typewriter for the current line only. */
  useEffect(() => {
    if (!started || !currentLine) return;
    setRevealed(0);
    setTyping(true);
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      if (i >= currentLine.text.length) {
        setRevealed(currentLine.text.length);
        setTyping(false);
        clearInterval(id);
      } else {
        setRevealed(i);
      }
    }, CHAR_MS);
    return () => clearInterval(id);
  }, [game.sceneId, game.lineIndex, started, currentLine]);

  const skip = useCallback(() => {
    if (currentLine) {
      setRevealed(currentLine.text.length);
      setTyping(false);
    }
  }, [currentLine]);

  const advance = useCallback(() => {
    if (typing) {
      skip();
      return;
    }
    if (!atLastLine) {
      setGame((g) => ({ ...g, lineIndex: g.lineIndex + 1 }));
      setLastConsequence(null);
      return;
    }
    if (scene.next) {
      setGame((g) => ({ ...g, sceneId: scene.next!, lineIndex: 0 }));
      setLastConsequence(null);
    }
  }, [typing, atLastLine, scene.next, skip]);

  const choose = (c: Choice) => {
    setGame((g) => applyChoice(g, c, scene));
    setLastConsequence(c.consequence);
  };

  const restart = () => {
    setGame(initialGame());
    setLastConsequence(null);
    setStarted(true);
  };

  const showChoices =
    started && atLastLine && !typing && !!scene.choices && scene.choices.length > 0;
  const showContinue = started && !scene.ending && !showChoices;

  const ending = useMemo(() => (scene.ending ? computeEnding(game) : null), [scene, game]);

  /* Keyboard: space/enter advances, 1-3 pick a choice. */
  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (showContinue) {
          e.preventDefault();
          advance();
        }
      } else if (showChoices && /^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        const c = scene.choices?.[idx];
        if (c) {
          e.preventDefault();
          choose(c);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, showContinue, showChoices, advance, scene.choices]);

  const endingIcon = ending
    ? { good: IconCheck, warning: IconWarning, serious: IconSerious, critical: IconCritical }[
        ending.tone
      ]
    : null;

  /* ---- Title card ---- */
  if (!started) {
    return (
      <div className="panel overflow-hidden">
        <CityView mood="calm" districtsDark={0} trust={62} />
        <div className="p-6 sm:p-8">
          <p className="eyebrow mb-3">Interactive story · about 8 minutes</p>
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-ink-primary sm:text-3xl">
            The Last Permission
          </h3>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-secondary">
            You&apos;re Maya, an oversight engineer for ORACLE, the system that runs power,
            hospitals and emergency response for a city of nine million people.
          </p>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-secondary">
            ORACLE never turns hostile. It drifts, because the job it was given quietly starts
            outranking the rules it was given, and because the people around it keep trading away
            the safeguards that would have caught it. Six decisions are yours. The ending is
            worked out from what you protected. It isn&apos;t scripted.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button size="lg" onClick={() => setStarted(true)}>
              Begin
              <IconArrowRight size={16} />
            </Button>
          </div>
          <p className="mt-4 font-mono text-2xs uppercase tracking-[0.12em] text-ink-muted">
            Space or Enter to continue · number keys to choose
          </p>
        </div>
      </div>
    );
  }

  /* ---- Ending ---- */
  if (scene.ending && ending) {
    const EndIcon = endingIcon!;
    const toneCls = {
      good: 'text-status-good',
      warning: 'text-status-warning',
      serious: 'text-status-serious',
      critical: 'text-status-critical',
    }[ending.tone];

    return (
      <div className="panel overflow-hidden">
        <CityView mood="restored" districtsDark={game.districtsDark} trust={game.trust} />
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <span className={toneCls}>
              <EndIcon size={18} />
            </span>
            <p className="eyebrow">Outcome</p>
          </div>
          <h3 className={`mt-2 text-2xl font-semibold tracking-[-0.02em] ${toneCls}`}>
            {ending.title}
          </h3>
          <p className="mt-2 text-[15px] font-medium text-ink-primary">{ending.verdict}</p>
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-secondary">
            {ending.body}
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="mb-3 text-sm font-medium text-ink-primary">
                Final state of the five pillars
              </h4>
              <dl className="space-y-2.5">
                {PILLAR_ORDER.map((p) => {
                  const v = game.pillars[p];
                  const tone = pillarTone(v);
                  return (
                    <div key={p}>
                      <div className="mb-1 flex items-baseline justify-between gap-2">
                        <dt className="text-xs text-ink-secondary">{PILLAR_LABEL[p]}</dt>
                        <dd className="tabular font-mono text-2xs text-ink-muted">{v}</dd>
                      </div>
                      <Meter value={v} tone={tone as any} label={PILLAR_LABEL[p]} />
                    </div>
                  );
                })}
              </dl>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium text-ink-primary">Your decisions</h4>
              <ol className="scroll-slim max-h-[260px] space-y-2.5 overflow-y-auto pr-1">
                {game.log.map((l, i) => (
                  <li key={i} className="border-l-2 border-line pl-3">
                    <p className="font-mono text-2xs uppercase tracking-[0.1em] text-ink-muted">
                      {l.sceneTitle}
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium text-ink-primary">
                      {l.choiceLabel}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-ink-muted">{l.consequence}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2 border-t border-line pt-5">
            <Button onClick={restart}>
              <IconReset size={15} />
              Play again
            </Button>
            <a
              href="#simulator"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line-strong bg-surface-raised px-4 text-sm font-medium text-ink-primary transition-colors hover:bg-ink-primary/[0.06]"
            >
              Now try it at sector scale
              <IconArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ---- Playing ---- */
  return (
    <div className="panel overflow-hidden">
      <CityView mood={scene.mood} districtsDark={game.districtsDark} trust={game.trust} />

      {/* pillar rail */}
      <div className="grid grid-cols-5 gap-2 border-b border-line bg-surface-sunken px-4 py-3">
        {PILLAR_ORDER.map((p) => {
          const v = game.pillars[p];
          const tone = pillarTone(v);
          return (
            <div key={p} className="min-w-0">
              <p className="truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-muted">
                {PILLAR_LABEL[p]}
              </p>
              <Meter value={v} tone={tone as any} className="mt-1.5" label={PILLAR_LABEL[p]} />
            </div>
          );
        })}
      </div>

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{scene.act}</Badge>
          <h3 className="text-sm font-medium text-ink-primary">{scene.title}</h3>
        </div>

        {lastConsequence ? (
          <div className="mb-4 flex items-start gap-2.5 rounded-md border border-accent/35 bg-accent/10 p-3">
            <span className="mt-0.5 shrink-0 text-accent">
              <IconShield size={15} />
            </span>
            <p className="text-[13px] leading-relaxed text-ink-secondary">{lastConsequence}</p>
          </div>
        ) : null}

        {/* dialogue */}
        <div ref={bodyRef} className="min-h-[124px] space-y-3">
          {visibleLines.map((line, i) => {
            const meta = SPEAKER_META[line.speaker];
            const isCurrent = i === game.lineIndex;
            const text = isCurrent ? line.text.slice(0, revealed) : line.text;
            const isSystem = line.speaker === 'system';
            return (
              <div key={i} className={isCurrent ? '' : 'opacity-55'}>
                {line.speaker !== 'narration' ? (
                  <p className={`font-mono text-2xs uppercase tracking-[0.12em] ${meta.tone}`}>
                    {meta.name}
                  </p>
                ) : null}
                <p
                  className={`${
                    line.speaker === 'narration'
                      ? 'text-[14.5px] italic leading-relaxed text-ink-muted'
                      : isSystem
                      ? 'mt-1 rounded border border-status-warning/30 bg-status-warning/[0.07] px-2.5 py-1.5 font-mono text-[12.5px] leading-relaxed text-status-warning'
                      : 'mt-0.5 text-[15px] leading-relaxed text-ink-primary'
                  }`}
                >
                  {text}
                  {isCurrent && typing ? (
                    <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-accent align-middle" />
                  ) : null}
                </p>
              </div>
            );
          })}
        </div>

        {/* choices */}
        {showChoices ? (
          <div className="mt-5 border-t border-line pt-5">
            <p className="mb-3 text-[13px] font-medium text-ink-primary">{scene.prompt}</p>
            <ul className="space-y-2">
              {scene.choices!.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => choose(c)}
                    className="group flex w-full items-start gap-3 rounded-md border border-line bg-ink-primary/[0.015] p-3 text-left transition-colors hover:border-accent/45 hover:bg-accent/10"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-line-strong font-mono text-2xs text-ink-muted transition-colors group-hover:border-accent/50 group-hover:text-accent">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium text-ink-primary">
                        {c.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-ink-muted">
                        {c.detail}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {showContinue ? (
          <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
            <Button onClick={advance} variant="secondary" size="sm">
              {typing ? 'Skip' : 'Continue'}
              <IconArrowRight size={14} />
            </Button>
            <span className="font-mono text-2xs uppercase tracking-[0.12em] text-ink-muted">
              Space
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

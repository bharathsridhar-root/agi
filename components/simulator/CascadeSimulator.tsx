import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MAX_TICKS,
  SCENARIOS,
  SCENARIO_BY_ID,
  SafeguardId,
  SimState,
  createState,
  defaultSafeguards,
  formatMoney,
  formatPeople,
  runToEnd,
  step,
} from '@/lib/simulation';
import { Badge, Button, Stat } from '@/components/ui/Primitives';
import {
  IconPlay,
  IconPause,
  IconStep,
  IconReset,
  IconShield,
  IconCritical,
  IconGauge,
} from '@/components/ui/Icon';
import SafeguardControls from './SafeguardControls';
import DomainGrid from './DomainGrid';
import EventLog from './EventLog';
import HealthChart from './HealthChart';

const TICK_MS = 420;

export default function CascadeSimulator() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [safeguards, setSafeguards] = useState<Record<SafeguardId, boolean>>(
    defaultSafeguards(false)
  );
  const [state, setState] = useState<SimState>(() =>
    createState(SCENARIOS[0].id, defaultSafeguards(false))
  );
  const [running, setRunning] = useState(false);

  const scenario = SCENARIO_BY_ID[scenarioId];
  const done = state.tick >= MAX_TICKS;

  const reset = useCallback(
    (id: string, sg: Record<SafeguardId, boolean>) => {
      setRunning(false);
      setState(createState(id, sg));
    },
    []
  );

  // Autorun
  useEffect(() => {
    if (!running || done) return;
    const t = setTimeout(() => setState((s) => step(s)), TICK_MS);
    return () => clearTimeout(t);
  }, [running, done, state.tick]);

  useEffect(() => {
    if (done) setRunning(false);
  }, [done]);

  const handleScenario = (id: string) => {
    setScenarioId(id);
    reset(id, safeguards);
  };

  const handleToggle = (id: SafeguardId) => {
    const next = { ...safeguards, [id]: !safeguards[id] };
    setSafeguards(next);
    reset(scenarioId, next);
  };

  const handleSetAll = (on: boolean) => {
    const next = defaultSafeguards(on);
    setSafeguards(next);
    reset(scenarioId, next);
  };

  /** Counterfactual: the same scenario with every safeguard flipped. */
  const counterfactual = useMemo(() => {
    const anyOn = Object.values(safeguards).some(Boolean);
    return runToEnd(scenarioId, defaultSafeguards(!anyOn ? true : false));
  }, [scenarioId, safeguards]);

  const anyOn = Object.values(safeguards).some(Boolean);
  const m = state.metrics;
  const healthTone =
    m.systemHealth >= 85 ? 'good' : m.systemHealth >= 60 ? 'warning' : m.systemHealth >= 40 ? 'serious' : 'critical';

  return (
    <div className="panel overflow-hidden">
      {/* Scenario picker */}
      <div className="border-b border-line bg-surface-sunken p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="eyebrow">Scenario</span>
          {state.metrics.containedAtTick !== null ? (
            <Badge tone="accent" icon={<IconShield size={11} />}>
              Contained at interval {state.metrics.containedAtTick}
            </Badge>
          ) : null}
          {state.metrics.collapsed ? (
            <Badge tone="critical" icon={<IconCritical size={11} />}>
              Collapsed
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose a scenario">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleScenario(s.id)}
              aria-pressed={s.id === scenarioId}
              className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                s.id === scenarioId
                  ? 'border-accent/50 bg-accent/10 text-ink-primary'
                  : 'border-line text-ink-secondary hover:border-line-strong hover:bg-ink-primary/5 hover:text-ink-primary'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-3 max-w-prose text-[13px] leading-relaxed text-ink-secondary">
          {scenario.summary}
        </p>
        <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-muted">
          {scenario.realWorld}
        </p>
      </div>

      {/* Controls + metrics */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => setRunning((r) => !r)}
            disabled={done}
            variant={running ? 'secondary' : 'primary'}
            size="sm"
          >
            {running ? <IconPause size={14} /> : <IconPlay size={14} />}
            {running ? 'Pause' : state.tick === 0 ? 'Run' : 'Resume'}
          </Button>
          <Button
            onClick={() => setState((s) => step(s))}
            disabled={running || done}
            variant="secondary"
            size="sm"
          >
            <IconStep size={14} />
            Step
          </Button>
          <Button
            onClick={() => reset(scenarioId, safeguards)}
            variant="ghost"
            size="sm"
            disabled={state.tick === 0 && !running}
          >
            <IconReset size={14} />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.1em] text-ink-muted">
          <IconGauge size={13} />
          Interval {state.tick}/{MAX_TICKS}
        </div>

        <div className="ml-auto h-1 w-24 overflow-hidden rounded-full bg-ink-primary/[0.07]">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${(state.tick / MAX_TICKS) * 100}%` }}
          />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 border-b border-line p-4 sm:grid-cols-4">
        <Stat
          label="System capacity"
          value={m.systemHealth.toFixed(0)}
          unit="/100"
          tone={healthTone}
        />
        <Stat
          label="Sectors failed"
          value={String(m.nodesFailed)}
          note={`peak ${m.peakFailed} of 20`}
          tone={m.nodesFailed > 0 ? 'critical' : 'good'}
        />
        <Stat
          label="People affected"
          value={formatPeople(m.peopleAffected)}
          note="peak concurrent"
          tone={m.peopleAffected > 0 ? 'serious' : 'good'}
        />
        <Stat
          label="Economic loss"
          value={formatMoney(m.economicLoss)}
          note="cumulative"
          tone={m.economicLoss > 1000 ? 'critical' : 'default'}
        />
      </dl>

      {/* Main body */}
      <div className="grid gap-5 p-4 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-5">
          <DomainGrid state={state} />
          <div className="rounded-lg border border-line bg-surface-sunken p-4">
            <HealthChart history={state.history} maxTicks={MAX_TICKS} />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <SafeguardControls
            safeguards={safeguards}
            onToggle={handleToggle}
            onSetAll={handleSetAll}
          />

          {/* Counterfactual comparison */}
          <div className="rounded-lg border border-line bg-surface-sunken p-3">
            <h3 className="text-[13px] font-medium text-ink-primary">
              Same scenario, {anyOn ? 'no safeguards' : 'all five safeguards'}
            </h3>
            <p className="mt-0.5 text-xs text-ink-muted">
              A full run, so you can compare.
            </p>
            <dl className="mt-3 space-y-2">
              {[
                {
                  k: 'Capacity',
                  v: `${counterfactual.metrics.systemHealth.toFixed(0)}/100`,
                },
                { k: 'Sectors failed', v: String(counterfactual.metrics.nodesFailed) },
                {
                  k: 'People affected',
                  v: formatPeople(counterfactual.metrics.peopleAffected),
                },
                { k: 'Economic loss', v: formatMoney(counterfactual.metrics.economicLoss) },
              ].map((row) => (
                <div key={row.k} className="flex items-baseline justify-between gap-2">
                  <dt className="text-xs text-ink-muted">{row.k}</dt>
                  <dd className="tabular text-xs font-medium text-ink-secondary">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="min-h-[220px] flex-1 rounded-lg border border-line bg-surface-sunken p-3">
            <EventLog events={state.events} />
          </div>
        </div>
      </div>
    </div>
  );
}

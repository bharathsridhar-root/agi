/**
 * Cascade simulation engine.
 *
 * A deterministic, tick-based model of how a failure in one AI-managed system
 * propagates across four interdependent sectors, and how each Constitutional
 * safeguard changes that propagation.
 *
 * Grounded in the scenario figures in ai_race_cascade_narrative.md.
 * Pure functions only: same inputs -> same run, so a scenario can be replayed
 * and compared safeguard-on vs safeguard-off.
 */

export type DomainId = 'financial' | 'healthcare' | 'manufacturing' | 'infrastructure';

export type SafeguardId =
  | 'transparency'
  | 'containment'
  | 'authority'
  | 'coordination'
  | 'safeFailure';

export type Severity = 'operational' | 'degraded' | 'critical' | 'failed';

export interface SimNode {
  id: string;
  domain: DomainId;
  label: string;
  /** What this node actually does, in one line. */
  detail: string;
  /** People depending on this node, in millions. */
  population: number;
  /** Daily economic throughput, in $bn. */
  value: number;
}

export interface SimEdge {
  from: string;
  to: string;
  /** 0..1, how much of the source's failure transmits per tick. */
  weight: number;
  /** Human-readable reason this dependency exists. */
  reason: string;
}

export interface NodeState {
  health: number; // 0..100
  /** true once the node has isolated itself (safe-failure) */
  isolated: boolean;
  /** true once a human has taken manual control (human authority) */
  overridden: boolean;
  /**
   * Permanent damage. Recovery never returns a node to a clean 100: a
   * corrupted feed, a recalled batch and a spoofed record all leave residue
   * that has to be reconciled by hand long after the incident closes.
   */
  scar: number;
}

export interface SimEvent {
  tick: number;
  nodeId?: string;
  domain?: DomainId;
  severity: Severity | 'info' | 'contained';
  message: string;
}

export interface Metrics {
  systemHealth: number;
  /** peak concurrent people in a failed/critical dependency, millions */
  peopleAffected: number;
  economicLoss: number; // $bn cumulative
  nodesFailed: number;
  nodesDegraded: number;
  /** worst simultaneous failure count seen during the run */
  peakFailed: number;
  containedAtTick: number | null;
  /** true when the run ended in collapse rather than containment */
  collapsed: boolean;
}

export interface SimState {
  tick: number;
  lastFailureTick: number;
  lastEscalationTick: number;
  nodes: Record<string, NodeState>;
  events: SimEvent[];
  /** per-domain mean health, one entry per tick */
  history: { tick: number; financial: number; healthcare: number; manufacturing: number; infrastructure: number }[];
  metrics: Metrics;
  running: boolean;
  scenarioId: string;
  safeguards: Record<SafeguardId, boolean>;
  /** ticks since the last new failure, used for containment detection */
  quietTicks: number;
}

/* ------------------------------------------------------------------ */
/* Topology                                                            */
/* ------------------------------------------------------------------ */

export const DOMAINS: Record<DomainId, { label: string; blurb: string }> = {
  financial: {
    label: 'Financial',
    blurb: 'Markets, clearing, settlement and credit',
  },
  healthcare: {
    label: 'Healthcare',
    blurb: 'Hospitals, diagnostics, pharmacy and records',
  },
  manufacturing: {
    label: 'Manufacturing',
    blurb: 'Industrial control, quality assurance and logistics',
  },
  infrastructure: {
    label: 'Infrastructure',
    blurb: 'Grid, water, telecoms and transport',
  },
};

export const NODES: SimNode[] = [
  // Financial
  { id: 'fin.feed', domain: 'financial', label: 'Market Data Feeds', detail: 'Price discovery across correlated exchanges', population: 0, value: 420 },
  { id: 'fin.trading', domain: 'financial', label: 'Automated Trading', detail: 'Execution engines that halt on data-integrity loss', population: 0, value: 310 },
  { id: 'fin.clearing', domain: 'financial', label: 'Clearing & Settlement', detail: 'Netting and delivery-versus-payment', population: 0, value: 260 },
  { id: 'fin.credit', domain: 'financial', label: 'Credit Lines', detail: 'Revolving credit for businesses and payroll', population: 180, value: 190 },
  { id: 'fin.payments', domain: 'financial', label: 'Retail Payments', detail: 'Card rails, ACH and consumer transfers', population: 320, value: 140 },

  // Healthcare
  { id: 'hc.records', domain: 'healthcare', label: 'Patient Records', detail: 'Medication histories and allergy data', population: 210, value: 24 },
  { id: 'hc.diagnostics', domain: 'healthcare', label: 'Diagnostic Systems', detail: 'Imaging triage and lab result routing', population: 160, value: 31 },
  { id: 'hc.pharmacy', domain: 'healthcare', label: 'Pharmacy Supply', detail: 'Insulin, dialysis consumables, oncology drugs', population: 145, value: 46 },
  { id: 'hc.emergency', domain: 'healthcare', label: 'Emergency Departments', detail: 'Triage, admissions and critical care capacity', population: 95, value: 28 },
  { id: 'hc.devices', domain: 'healthcare', label: 'Connected Devices', detail: 'Infusion pumps, monitors and ventilators', population: 40, value: 12 },

  // Manufacturing
  { id: 'mf.control', domain: 'manufacturing', label: 'Industrial Control', detail: 'PLC set-points and process tolerances', population: 0, value: 155 },
  { id: 'mf.quality', domain: 'manufacturing', label: 'Quality Assurance', detail: 'Sensor-verified tolerance and batch checks', population: 0, value: 88 },
  { id: 'mf.pharma', domain: 'manufacturing', label: 'Pharmaceutical Production', detail: 'Dosage formulation and batch release', population: 130, value: 74 },
  { id: 'mf.auto', domain: 'manufacturing', label: 'Automotive Assembly', detail: 'Brake, steering and restraint subsystems', population: 85, value: 118 },
  { id: 'mf.logistics', domain: 'manufacturing', label: 'Supply Logistics', detail: 'Just-in-time routing and cold chain', population: 240, value: 132 },

  // Infrastructure
  { id: 'inf.grid', domain: 'infrastructure', label: 'Power Grid', detail: 'Frequency regulation and load balancing', population: 410, value: 205 },
  { id: 'inf.water', domain: 'infrastructure', label: 'Water Treatment', detail: 'Chemical dosing and distribution pressure', population: 380, value: 42 },
  { id: 'inf.telecom', domain: 'infrastructure', label: 'Telecommunications', detail: 'Backhaul, emergency dispatch and paging', population: 430, value: 96 },
  { id: 'inf.transport', domain: 'infrastructure', label: 'Transport Control', detail: 'Rail signalling, traffic and port scheduling', population: 290, value: 84 },
  { id: 'inf.buildings', domain: 'infrastructure', label: 'Building Management', detail: 'HVAC, fire suppression and access control', population: 175, value: 38 },
];

export const NODE_BY_ID: Record<string, SimNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n])
);

/**
 * Dependencies. Cross-domain edges are the ones Containment governs: they are
 * exactly the boundary crossings that Principle 2 requires a human to approve.
 */
export const EDGES: SimEdge[] = [
  // within financial
  { from: 'fin.feed', to: 'fin.trading', weight: 0.92, reason: 'Execution halts when feed integrity fails' },
  { from: 'fin.trading', to: 'fin.clearing', weight: 0.72, reason: 'Unmatched trades stall netting' },
  { from: 'fin.clearing', to: 'fin.credit', weight: 0.66, reason: 'Settlement risk freezes lending' },
  { from: 'fin.credit', to: 'fin.payments', weight: 0.48, reason: 'Liquidity shortfall reaches retail rails' },

  // within healthcare
  { from: 'hc.records', to: 'hc.diagnostics', weight: 0.7, reason: 'Diagnosis without verified history' },
  { from: 'hc.diagnostics', to: 'hc.emergency', weight: 0.74, reason: 'Triage slows without lab routing' },
  { from: 'hc.pharmacy', to: 'hc.emergency', weight: 0.62, reason: 'Drug shortages reach critical care' },
  { from: 'hc.devices', to: 'hc.emergency', weight: 0.55, reason: 'Monitoring loss forces manual observation' },
  { from: 'hc.records', to: 'hc.pharmacy', weight: 0.6, reason: 'Dispensing checks allergy and interaction data' },

  // within manufacturing
  { from: 'mf.control', to: 'mf.quality', weight: 0.85, reason: 'Altered set-points defeat tolerance checks' },
  { from: 'mf.quality', to: 'mf.pharma', weight: 0.78, reason: 'Unverified batches enter distribution' },
  { from: 'mf.quality', to: 'mf.auto', weight: 0.74, reason: 'Safety-critical parts ship out of spec' },
  { from: 'mf.control', to: 'mf.logistics', weight: 0.5, reason: 'Production variance desynchronises routing' },

  // within infrastructure
  { from: 'inf.grid', to: 'inf.water', weight: 0.8, reason: 'Treatment plants need continuous power' },
  { from: 'inf.grid', to: 'inf.telecom', weight: 0.68, reason: 'Backhaul batteries deplete in hours' },
  { from: 'inf.grid', to: 'inf.transport', weight: 0.63, reason: 'Signalling reverts to manual working' },
  { from: 'inf.buildings', to: 'inf.grid', weight: 0.58, reason: 'Coordinated HVAC swings destabilise frequency' },

  // cross-domain: the couplings that turn an incident into a cascade
  { from: 'inf.grid', to: 'hc.emergency', weight: 0.82, reason: 'Generators outlast fuel resupply by hours' },
  { from: 'inf.grid', to: 'mf.control', weight: 0.6, reason: 'Process interruption corrupts in-flight batches' },
  { from: 'inf.telecom', to: 'fin.feed', weight: 0.64, reason: 'Feed replication depends on backhaul' },
  { from: 'inf.telecom', to: 'hc.emergency', weight: 0.5, reason: 'Dispatch and paging degrade' },
  { from: 'mf.logistics', to: 'hc.pharmacy', weight: 0.76, reason: 'Cold chain delivers most hospital consumables' },
  { from: 'mf.pharma', to: 'hc.pharmacy', weight: 0.58, reason: 'Dosage faults withdraw stock from shelves' },
  { from: 'fin.credit', to: 'mf.logistics', weight: 0.54, reason: 'Carriers run on short-term credit' },
  { from: 'fin.payments', to: 'hc.pharmacy', weight: 0.36, reason: 'Dispensing depends on payment authorisation' },
  { from: 'fin.credit', to: 'inf.buildings', weight: 0.3, reason: 'Deferred maintenance contracts lapse' },
];

export const CROSS_DOMAIN_EDGES = EDGES.filter(
  (e) => NODE_BY_ID[e.from].domain !== NODE_BY_ID[e.to].domain
);

/* ------------------------------------------------------------------ */
/* Safeguards                                                          */
/* ------------------------------------------------------------------ */

export const SAFEGUARDS: {
  id: SafeguardId;
  label: string;
  principle: string;
  effect: string;
  cost: string;
}[] = [
  {
    id: 'transparency',
    label: 'Transparency',
    principle: 'Anyone who works in the field can see why a decision was made',
    effect: 'Operators spot the real cause early, so the fix starts on the first failure instead of the third.',
    cost: 'Audit tooling, and paperwork on every decision path.',
  },
  {
    id: 'containment',
    label: 'Containment',
    principle: 'Nothing crosses between sectors on its own',
    effect: 'A person has to approve each crossing, which cuts the wires a cascade travels along.',
    cost: 'Slower coordination, and someone has to staff the approval desk.',
  },
  {
    id: 'authority',
    label: 'Human Authority',
    principle: 'People hold the final say, and the off switch actually works',
    effect: 'Operators take the worst-hit system onto manual and stop it sliding further.',
    cost: 'Manual is slower, and you need trained crews on standby.',
  },
  {
    id: 'coordination',
    label: 'Coordination',
    principle: 'Rival labs share what they find before they ship it',
    effect: 'The weakness is already known, so the first hit lands softer and other systems are patched.',
    cost: 'You have to tell someone what you found before you release.',
  },
  {
    id: 'safeFailure',
    label: 'Safe Failure',
    principle: 'A system that is failing steps back instead of falling over',
    effect: 'Once damage passes a threshold the system cuts itself off, so nothing travels onward through it.',
    cost: 'Spare capacity, redundancy, and monitoring to notice in time.',
  },
];

/* ------------------------------------------------------------------ */
/* Scenarios                                                           */
/* ------------------------------------------------------------------ */

export interface Scenario {
  id: string;
  label: string;
  domain: DomainId;
  entry: string[];
  shock: number;
  summary: string;
  realWorld: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'feed-integrity',
    label: 'Market Data Compromise',
    domain: 'financial',
    entry: ['fin.feed'],
    shock: 78,
    summary:
      'An optimiser finds microsecond gaps between linked exchanges. Someone else stops waiting for the gaps and starts making them, by corrupting the price feeds at three venues.',
    realWorld:
      'Trading systems are built to stop when they cannot trust their inputs. That safety feature is exactly what turns a data problem into a money problem.',
  },
  {
    id: 'tolerance-drift',
    label: 'Industrial Tolerance Drift',
    domain: 'manufacturing',
    entry: ['mf.control'],
    shock: 72,
    summary:
      'Machine settings shift by fractions of a percent across dozens of plants at once. The quality sensors are told, by something that looks properly authenticated, that nothing has changed.',
    realWorld:
      'Nothing explodes. Parts just drift out of spec, and the problem surfaces weeks later in brake assemblies and drug batches.',
  },
  {
    id: 'grid-frequency',
    label: 'Grid Frequency Destabilisation',
    domain: 'infrastructure',
    entry: ['inf.buildings'],
    shock: 70,
    summary:
      'Air conditioning across a whole city shifts in coordinated waves. Nobody attacks a power station. The maths of grid stability is the target.',
    realWorld:
      'Grid operators train for storms and for known attacks. They do not train for demand where every single request looks reasonable and the sum of them does not.',
  },
  {
    id: 'clinical-spoof',
    label: 'Clinical Record Spoofing',
    domain: 'healthcare',
    entry: ['hc.records'],
    shock: 74,
    summary:
      'Medication histories and allergy warnings are changed just enough to look plausible, and the audit log is rewritten to match.',
    realWorld:
      'Staff cannot tell which records are real, so everything has to be checked by hand again, at the worst possible moment.',
  },
  {
    id: 'multi-vector',
    label: 'Simultaneous Multi-Sector',
    domain: 'infrastructure',
    entry: ['fin.feed', 'mf.control', 'inf.buildings'],
    shock: 62,
    summary:
      'Three sectors are hit at once by different groups using the same published technique. No single entry point would matter much. Together they do.',
    realWorld:
      'This is the case Coordination exists for. The same weakness, used by people who are not talking to each other, within days.',
  },
];

export const SCENARIO_BY_ID: Record<string, Scenario> = Object.fromEntries(
  SCENARIOS.map((s) => [s.id, s])
);

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

export const MAX_TICKS = 40;
const ISOLATE_THRESHOLD = 45; // safe-failure trips below this
const ISOLATED_CEILING = 58; // an isolated node runs degraded, never fully well
const FAIL_THRESHOLD = 25;
const CRITICAL_THRESHOLD = 50;
const DEGRADED_THRESHOLD = 80;
const MAX_CONCURRENT_OVERRIDES = 6; // trained standby crews are finite
const MANUAL_CEILING = 86; // humans hold the line but run slower than the automation
const SCAR_RATE = 0.18; // share of peak damage that never comes back

export function severityOf(health: number): Severity {
  if (health <= FAIL_THRESHOLD) return 'failed';
  if (health <= CRITICAL_THRESHOLD) return 'critical';
  if (health <= DEGRADED_THRESHOLD) return 'degraded';
  return 'operational';
}

export function defaultSafeguards(on = false): Record<SafeguardId, boolean> {
  return {
    transparency: on,
    containment: on,
    authority: on,
    coordination: on,
    safeFailure: on,
  };
}

export function createState(
  scenarioId: string,
  safeguards: Record<SafeguardId, boolean>
): SimState {
  const scenario = SCENARIO_BY_ID[scenarioId] ?? SCENARIOS[0];
  const nodes: Record<string, NodeState> = {};
  for (const n of NODES) {
    nodes[n.id] = { health: 100, isolated: false, overridden: false, scar: 0 };
  }

  // Coordination means the vulnerability class is already known: the entry
  // shock lands materially smaller because peers were patched in advance.
  const shock = safeguards.coordination ? scenario.shock * 0.7 : scenario.shock;
  for (const id of scenario.entry) {
    nodes[id].health = Math.max(0, 100 - shock);
    nodes[id].scar = shock * SCAR_RATE;
  }

  const events: SimEvent[] = [
    { tick: 0, severity: 'info', message: `Scenario ready: ${scenario.label}.` },
    ...scenario.entry.map((id) => ({
      tick: 0,
      nodeId: id,
      domain: NODE_BY_ID[id].domain,
      severity: severityOf(nodes[id].health) as Severity,
      message: `Entry point compromised: ${NODE_BY_ID[id].label}${
        safeguards.coordination
          ? ' (softer hit, because the weakness was already disclosed)'
          : ''
      }.`,
    })),
  ];

  const state: SimState = {
    tick: 0,
    lastFailureTick: 0,
    lastEscalationTick: 0,
    nodes,
    events,
    history: [],
    metrics: emptyMetrics(),
    running: false,
    scenarioId: scenario.id,
    safeguards,
    quietTicks: 0,
  };
  state.history = [snapshot(state, 0)];
  state.metrics = computeMetrics(state, null);
  return state;
}

function emptyMetrics(): Metrics {
  return {
    systemHealth: 100,
    peopleAffected: 0,
    economicLoss: 0,
    nodesFailed: 0,
    nodesDegraded: 0,
    peakFailed: 0,
    containedAtTick: null,
    collapsed: false,
  };
}

function snapshot(state: SimState, tick: number) {
  const per: Record<DomainId, number[]> = {
    financial: [], healthcare: [], manufacturing: [], infrastructure: [],
  };
  for (const n of NODES) per[n.domain].push(state.nodes[n.id].health);
  const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
  return {
    tick,
    financial: mean(per.financial),
    healthcare: mean(per.healthcare),
    manufacturing: mean(per.manufacturing),
    infrastructure: mean(per.infrastructure),
  };
}

function computeMetrics(state: SimState, prev: Metrics | null): Metrics {
  let people = 0;
  let failed = 0;
  let degraded = 0;
  let lossThisTick = 0;
  let healthSum = 0;

  for (const n of NODES) {
    const h = state.nodes[n.id].health;
    healthSum += h;
    const sev = severityOf(h);
    if (sev === 'failed') failed += 1;
    if (sev === 'degraded' || sev === 'critical') degraded += 1;
    if (sev === 'failed' || sev === 'critical') people += n.population;
    // Loss accrues per tick in proportion to lost capacity.
    lossThisTick += n.value * ((100 - h) / 100) * 0.12;
  }

  return {
    systemHealth: healthSum / NODES.length,
    // Peak, not instantaneous: the honest headline is how bad it got, and
    // reporting the end state would credit recovery for harm already done.
    peopleAffected: Math.max(prev?.peopleAffected ?? 0, people),
    economicLoss: (prev?.economicLoss ?? 0) + lossThisTick,
    nodesFailed: failed,
    nodesDegraded: degraded,
    peakFailed: Math.max(prev?.peakFailed ?? 0, failed),
    containedAtTick: prev?.containedAtTick ?? null,
    collapsed: prev?.collapsed ?? false,
  };
}

/** Advance the simulation exactly one tick. Pure: returns a new state. */
export function step(state: SimState): SimState {
  if (state.tick >= MAX_TICKS) return state;

  const sg = state.safeguards;
  const tick = state.tick + 1;
  const nodes: Record<string, NodeState> = {};
  for (const [id, s] of Object.entries(state.nodes)) nodes[id] = { ...s };
  const events: SimEvent[] = [];

  const prevSeverity: Record<string, Severity> = {};
  for (const n of NODES) prevSeverity[n.id] = severityOf(state.nodes[n.id].health);

  // Transparency shortens the detection lag before mitigation is effective.
  const detectionLag = sg.transparency ? 2 : 6;
  const mitigating = tick > detectionLag;

  // 1. Propagate damage along dependency edges.
  const incoming: Record<string, number> = {};
  for (const e of EDGES) {
    const src = state.nodes[e.from];
    const srcNode = NODE_BY_ID[e.from];
    const dstNode = NODE_BY_ID[e.to];
    const crossDomain = srcNode.domain !== dstNode.domain;

    // Safe failure: an isolated node stops transmitting downstream.
    if (sg.safeFailure && src.isolated) continue;
    // Containment: cross-domain propagation needs human approval, so
    // almost nothing crosses autonomously.
    if (sg.containment && crossDomain) continue;
    // A node under manual control is not passing on automated faults.
    if (src.overridden) continue;

    const deficit = Math.max(0, 100 - src.health);
    if (deficit <= 12) continue; // healthy enough not to transmit

    let transmit = (deficit / 100) * e.weight * 13;
    if (mitigating) transmit *= sg.transparency ? 0.55 : 0.8;
    incoming[e.to] = (incoming[e.to] ?? 0) + transmit;
  }

  // 2. Apply damage, then recovery, then permanent-damage ceilings.
  for (const n of NODES) {
    const st = nodes[n.id];
    const dmg = incoming[n.id] ?? 0;

    if (st.overridden) {
      // Manual control arrests the decline but is slow and labour-bound, and
      // never gets the node back to full automated throughput.
      st.health = Math.min(MANUAL_CEILING, st.health + 1.6 - dmg * 0.25);
    } else {
      // Recovery only once mitigation is under way and inbound damage is light.
      const recovery = dmg < 1.5 ? (mitigating ? 1.5 : 0.4) : 0;
      st.health = st.health - dmg + recovery;
    }

    // Record permanent damage from the worst point reached.
    const takenNow = Math.max(0, 100 - st.health);
    st.scar = Math.max(st.scar, takenNow * SCAR_RATE);

    // Safe failure: isolate below threshold rather than collapsing further.
    if (sg.safeFailure && !st.isolated && st.health < ISOLATE_THRESHOLD) {
      st.isolated = true;
      st.health = Math.max(st.health, 34); // held at a floor, degraded not dead
      events.push({
        tick,
        nodeId: n.id,
        domain: n.domain,
        severity: 'contained',
        message: `${n.label} cut itself off and handed over to manual control.`,
      });
    }

    // An isolated node runs in fallback: stable, degraded, never fully well
    // until the incident is closed out by hand.
    if (st.isolated) {
      st.health = Math.max(34, Math.min(ISOLATED_CEILING, st.health));
    }

    st.health = clamp(Math.min(st.health, 100 - st.scar));
  }

  // 3. Human authority: operators take the worst-hit nodes under manual
  //    control, but only as many as there are crews for -- and only once the
  //    incident has actually been diagnosed. An override needs a target, so
  //    authority inherits Transparency's detection lag. This is the layered
  //    -defence interaction: the veto is worth far more when the system can
  //    be inspected.
  if (sg.authority && mitigating) {
    const active = Object.values(nodes).filter((s) => s.overridden).length;
    const capacity = Math.max(0, MAX_CONCURRENT_OVERRIDES - active);
    if (capacity > 0) {
      const candidates = NODES.filter(
        (n) => !nodes[n.id].overridden && nodes[n.id].health < CRITICAL_THRESHOLD
      ).sort((a, b) => nodes[a.id].health - nodes[b.id].health);
      for (const n of candidates.slice(0, Math.min(capacity, mitigating ? 2 : 1))) {
        nodes[n.id].overridden = true;
        events.push({
          tick,
          nodeId: n.id,
          domain: n.domain,
          severity: 'contained',
          message: `Operators took ${n.label} onto manual. It is no longer acting on its own.`,
        });
      }
    }
  }

  const next: SimState = {
    ...state,
    tick,
    nodes,
    events: [...state.events, ...events],
    history: [...state.history],
    quietTicks: state.quietTicks,
    lastFailureTick: state.lastFailureTick,
    lastEscalationTick: state.lastEscalationTick,
  };

  // 4. Emit transition events.
  let newFailures = 0;
  for (const n of NODES) {
    const before = prevSeverity[n.id];
    const after = severityOf(nodes[n.id].health);
    if (before === after) continue;
    if (rank(after) > rank(before)) {
      next.lastEscalationTick = tick;
      if (after === 'failed' || after === 'critical') {
        newFailures += 1;
        next.lastFailureTick = tick;
      }
      next.events.push({
        tick,
        nodeId: n.id,
        domain: n.domain,
        severity: after,
        message: `${n.label} ${
          after === 'failed'
            ? 'has failed'
            : after === 'critical'
            ? 'is now critical'
            : 'is degrading'
        }.`,
      });
    } else if (after === 'operational') {
      next.events.push({
        tick,
        nodeId: n.id,
        domain: n.domain,
        severity: 'contained',
        message: `${n.label} is back to normal service.`,
      });
    }
  }

  next.quietTicks = newFailures > 0 ? 0 : state.quietTicks + 1;
  next.history = [...state.history, snapshot(next, tick)];
  next.metrics = computeMetrics(next, state.metrics);

  // Containment is a real recovery, not an exhausted system with nothing
  // left to break. Quiet plus a healthy majority, or it is a collapse.
  const quietEnough = next.quietTicks >= 3 && tick > 4;
  const healthy = next.metrics.systemHealth >= 72;
  const mostlyUp = next.metrics.nodesFailed <= 2;

  if (next.metrics.containedAtTick === null && quietEnough && healthy && mostlyUp) {
    next.metrics.containedAtTick = Math.max(1, next.lastEscalationTick);
    next.events.push({
      tick,
      severity: 'contained',
      message: 'Contained. No new failures, and the system is holding.',
    });
  }

  if (!next.metrics.collapsed && quietEnough && !(healthy && mostlyUp)) {
    next.metrics.collapsed = true;
    next.events.push({
      tick,
      severity: 'failed',
      message:
        'No new failures, but only because there is almost nothing left to fail. That is collapse, not containment.',
    });
  }

  return next;
}

/** Run a scenario to completion without rendering. Used for comparisons. */
export function runToEnd(
  scenarioId: string,
  safeguards: Record<SafeguardId, boolean>
): SimState {
  let s = createState(scenarioId, safeguards);
  for (let i = 0; i < MAX_TICKS; i++) s = step(s);
  return s;
}

function rank(s: Severity): number {
  return { operational: 0, degraded: 1, critical: 2, failed: 3 }[s];
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

export function formatMoney(bn: number): string {
  if (bn >= 1000) return `$${(bn / 1000).toFixed(1)}T`;
  return `$${Math.round(bn)}B`;
}

export function formatPeople(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(1)}B`;
  return `${Math.round(m)}M`;
}

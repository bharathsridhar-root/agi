import React from 'react';
import { Section, SectionHeader } from '@/components/ui/Primitives';
import CascadeSimulator from '@/components/simulator/CascadeSimulator';

export default function SimulatorSection() {
  return (
    <Section id="simulator" className="mt-28 sm:mt-36">
      <SectionHeader
        eyebrow="Interactive model"
        title="Break something, then try to contain it"
        lede="Pick an entry point and run it. Twenty systems, twenty-five dependencies, forty intervals. Then switch the safeguards on and run the same scenario again — the counterfactual panel keeps the other outcome on screen so the comparison is never from memory."
      />
      <div className="mt-8">
        <CascadeSimulator />
      </div>
      <p className="mt-4 max-w-prose text-xs leading-relaxed text-ink-muted">
        The model is deliberately simple and fully deterministic: the same scenario and the same
        safeguard settings always produce the same run. Figures are illustrative outputs of this
        model, chosen to show the shape of a cascade — they are not forecasts, and not drawn from
        measured incidents.
      </p>
    </Section>
  );
}

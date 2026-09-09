import React from 'react';
import { Section, SectionHeader } from '@/components/ui/Primitives';
import CascadeSimulator from '@/components/simulator/CascadeSimulator';

export default function SimulatorSection() {
  return (
    <Section id="simulator" className="mt-28 sm:mt-36">
      <SectionHeader
        eyebrow="Interactive model"
        title="Break something, then try to stop it spreading"
        lede="Pick where it starts and hit run. Twenty systems, twenty-six dependencies, forty intervals. Then turn the safeguards on and run the same thing again. The comparison panel keeps the other result on screen, so you're never going from memory."
      />
      <div className="mt-8">
        <CascadeSimulator />
      </div>
      <p className="mt-4 max-w-prose text-xs leading-relaxed text-ink-muted">
        The model is deliberately simple, and it always behaves the same way: same scenario and
        same settings, same run, every time. The numbers come out of this model and are here to
        show you the shape of a cascade. They are not predictions, and they are not measurements
        of anything that has actually happened.
      </p>
    </Section>
  );
}

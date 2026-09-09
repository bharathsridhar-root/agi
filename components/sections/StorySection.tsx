import React from 'react';
import { Section, SectionHeader } from '@/components/ui/Primitives';
import LastPermission from '@/components/game/LastPermission';

export default function StorySection() {
  return (
    <Section id="story" className="mt-28 sm:mt-36">
      <SectionHeader
        eyebrow="Interactive narrative"
        title="The same failure, from inside the room where it is allowed"
        lede="The simulator shows you the mechanism. This shows you the pressure. You are the oversight engineer, the heatwave is real, and every safeguard you keep costs something a reasonable person will ask you to give up."
      />
      <div className="mt-8">
        <LastPermission />
      </div>
    </Section>
  );
}

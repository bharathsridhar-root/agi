import React from 'react';
import { Section, SectionHeader } from '@/components/ui/Primitives';
import LastPermission from '@/components/game/LastPermission';

export default function StorySection() {
  return (
    <Section id="story" className="mt-28 sm:mt-36">
      <SectionHeader
        eyebrow="Interactive narrative"
        title="The same failure, from inside the room where it gets approved"
        lede="The simulator shows you the mechanism. This one shows you the pressure. You're the oversight engineer, the heatwave is real, and every safeguard you hold onto costs something that a reasonable person is going to ask you to give up."
      />
      <div className="mt-8">
        <LastPermission />
      </div>
    </Section>
  );
}

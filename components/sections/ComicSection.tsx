import React from 'react';
import { Section, SectionHeader } from '@/components/ui/Primitives';
import ComicStrip from '@/components/comic/ComicStrip';

export default function ComicSection() {
  return (
    <Section id="comic" className="mt-28 sm:mt-36">
      <SectionHeader
        eyebrow="The short version"
        title="Eight panels, and you have the whole argument"
        lede="If you read nothing else here, read this. It is the same idea the simulator measures and the story puts you inside, drawn out in the order it actually happens."
      />
      <div className="mt-8">
        <ComicStrip />
      </div>
    </Section>
  );
}

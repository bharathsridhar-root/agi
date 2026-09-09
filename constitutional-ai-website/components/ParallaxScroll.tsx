import React, { useEffect, useRef, ReactNode } from 'react';

interface ParallaxScrollProps {
  children: ReactNode;
  speed?: number;
}

export default function ParallaxScroll({ children, speed = 0.5 }: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrollPosition = window.scrollY;
        const offset = scrollPosition * speed;
        ref.current.style.transform = `translateY(${offset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return <div ref={ref}>{children}</div>;
}

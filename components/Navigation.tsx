import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconMenu, IconClose, IconShield, IconArrowRight } from '@/components/ui/Icon';
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV = [
  { id: 'comic', label: 'In Brief' },
  { id: 'cascade', label: 'The Cascade' },
  { id: 'simulator', label: 'Simulator' },
  { id: 'story', label: 'The Last Permission' },
  { id: 'principles', label: 'Principles' },
];

export default function Navigation() {
  const router = useRouter();
  const onIndex = router.pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Highlight the section currently in view. */
  useEffect(() => {
    if (!onIndex) return;
    const targets = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (targets.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-72px 0px -55% 0px', threshold: [0.05, 0.25, 0.5] }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [onIndex]);

  // Lock scroll behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const hrefFor = (id: string) => (onIndex ? `#${id}` : `/#${id}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? 'border-b border-line bg-plane/90 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-content items-center gap-4 px-5 sm:px-8"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-ink-primary transition-opacity hover:opacity-80"
        >
          <span className="text-accent">
            <IconShield size={20} />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.01em]">CAIGP</span>
        </Link>

        <ul className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={hrefFor(n.id)}
                aria-current={active === n.id ? 'true' : undefined}
                className={`rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                  active === n.id
                    ? 'bg-ink-primary/[0.06] text-ink-primary'
                    : 'text-ink-secondary hover:bg-ink-primary/[0.04] hover:text-ink-primary'
                }`}
              >
                {n.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/framework"
              className={`rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                router.pathname === '/framework'
                  ? 'bg-ink-primary/[0.06] text-ink-primary'
                  : 'text-ink-secondary hover:bg-ink-primary/[0.04] hover:text-ink-primary'
              }`}
            >
              Framework
            </Link>
          </li>
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <a
            href={onIndex ? '#simulator' : '/#simulator'}
            className="hidden h-9 items-center gap-1.5 rounded-md bg-accent px-3.5 text-[13px] font-medium text-accent-on transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            Run the simulator
            <IconArrowRight size={14} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-secondary transition-colors hover:bg-ink-primary/5 hover:text-ink-primary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <IconClose size={19} /> : <IconMenu size={19} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-plane lg:hidden">
          <ul className="mx-auto max-w-content px-5 py-3 sm:px-8">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={hrefFor(n.id)}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-ink-primary/5 hover:text-ink-primary"
                >
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/framework"
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-ink-primary/5 hover:text-ink-primary"
              >
                Framework
              </Link>
            </li>
            <li className="mt-2 flex items-center justify-between border-t border-line pt-3">
              <span className="text-sm text-ink-secondary">Theme</span>
              <ThemeToggle />
            </li>
            <li className="mt-2">
              <a
                href={onIndex ? '#simulator' : '/#simulator'}
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-accent px-4 text-sm font-medium text-accent-on"
              >
                Run the simulator
                <IconArrowRight size={15} />
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}

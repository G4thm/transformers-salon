"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, CalendarDays, Home, Scissors, Tag, Images, BookOpen, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/services", label: "Services", Icon: Scissors },
  { href: "/offers", label: "Offers", Icon: Tag },
  { href: "/gallery", label: "Gallery", Icon: Images },
  { href: "/book", label: "Book", Icon: BookOpen },
  { href: "/contact", label: "Contact", Icon: Phone },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  /* Lock / unlock body scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  return (
    <>
      {/* ── Hamburger trigger ─────────────────────────── */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      {/* ── Full-screen overlay ───────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!open}
        style={{ zIndex: 9999 }}
        className={`fixed inset-0 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Solid dark backdrop — no bleed-through */}
        <div className="absolute inset-0 bg-neutral-950" />

        {/* Orange top accent line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        {/* ── Inner content ───────────────────────────── */}
        <div className="relative flex h-full flex-col">

          {/* Header row */}
          <div className="flex items-center justify-between px-6 py-5">
            <span className="brand-wordmark text-xl text-white/90">Transformers</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all duration-200 hover:bg-orange-500/20 hover:border-orange-500/40 active:scale-90"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-white/10" />

          {/* ── Nav links (vertically centered) ────────── */}
          <nav className="flex flex-1 flex-col justify-center gap-1.5 px-5">
            {nav.map(({ href, label, Icon }, i) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  transitionDelay: open ? `${60 + i * 55}ms` : "0ms",
                  transitionProperty: "opacity, transform",
                  transitionDuration: "320ms",
                  transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(28px)",
                }}
                className="group flex items-center gap-4 rounded-2xl px-4 py-4 text-white/70 hover:bg-white/5 hover:text-white active:scale-[0.98] transition-colors duration-150"
              >
                {/* Icon pill */}
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/8 text-orange-400 ring-1 ring-white/10 transition-all duration-200 group-hover:bg-orange-500/15 group-hover:ring-orange-500/30">
                  <Icon className="size-5" />
                </span>
                {/* Label */}
                <span className="text-[1.05rem] font-semibold tracking-wide">{label}</span>
                {/* Arrow accent */}
                <span className="ml-auto text-white/20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-orange-400">
                  ›
                </span>
              </Link>
            ))}
          </nav>

          {/* ── Bottom CTA ──────────────────────────────── */}
          <div className="px-5 pb-8 pt-4">
            <div className="h-px bg-white/10 mb-5" />
            <Button
              asChild
              size="lg"
              onClick={() => setOpen(false)}
              className="w-full rounded-full bg-orange-500 text-base font-bold text-white shadow-[0_0_24px_rgb(249_115_22_/_35%)] hover:bg-orange-400 hover:shadow-[0_0_32px_rgb(249_115_22_/_55%)] active:scale-[0.98] transition-all duration-200"
            >
              <Link href="/book">
                <CalendarDays className="size-4 mr-1" />
                Book an Appointment
              </Link>
            </Button>
            <p className="mt-4 text-center text-xs font-medium tracking-wider text-white/30 uppercase">
              Transformers Unisex Salon · Puducherry
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

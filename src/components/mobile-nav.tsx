"use client";

import { useState } from "react";
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

  return (
    <>
      {/* Hamburger trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Slide-in drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(19rem,100vw)] flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <span className="brand-wordmark text-lg">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X className="size-5" />
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-4">
          {nav.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA at bottom */}
        <div className="mt-auto border-t p-4">
          <Button asChild className="w-full rounded-full" onClick={() => setOpen(false)}>
            <Link href="/book">
              <CalendarDays className="size-4" />
              Book an appointment
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );
}

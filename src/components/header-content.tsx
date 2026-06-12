"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Phone, Shield } from "lucide-react";
import { brand } from "@/data/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/offers", label: "Offers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
];

export function HeaderContent({
  phonePrimary,
  foxLogo,
}: {
  phonePrimary: string;
  foxLogo: string;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ── Zone 1: Logo ── */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label={brand.fullName}
        >
          <span className="relative size-11 overflow-hidden rounded-lg border border-border/60 bg-black shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_0_16px_rgb(249_115_22_/_35%)]">
            <Image
              src={foxLogo}
              alt=""
              width={44}
              height={44}
              sizes="44px"
              className="object-cover"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="brand-wordmark text-[1.05rem] tracking-tight transition-colors duration-200 group-hover:text-primary">
              {brand.name}
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Unisex Salon
            </span>
          </span>
        </Link>

        {/* ── Zone 2: Nav (centered absolutely) ── */}
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex"
          aria-label="Main navigation"
        >
          {nav.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${isActive ? " active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Zone 3: Actions (right) ── */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Phone — icon on mobile, icon + number on md+ */}
          <a
            href={`tel:${phonePrimary}`}
            aria-label="Call salon"
            className="group flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2 py-2 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary md:px-3"
          >
            <Phone size={16} className="shrink-0" />
            <span className="hidden text-xs font-semibold md:block">{phonePrimary}</span>
          </a>

          <ThemeToggle />

          {/* Book button */}
          <Button
            asChild
            className="hidden rounded-full shadow-[0_2px_16px_rgb(249_115_22_/_20%)] transition-shadow hover:shadow-[0_4px_24px_rgb(249_115_22_/_35%)] sm:inline-flex"
          >
            <Link href="/book">
              <CalendarDays data-icon="inline-start" />
              Book
            </Link>
          </Button>

          {/* Admin shield */}
          <Button
            asChild
            variant="outline"
            size="icon"
            className="hidden rounded-full lg:inline-flex"
            aria-label="Admin login"
          >
            <Link href="/login">
              <Shield data-icon="inline-start" />
            </Link>
          </Button>

          {/* Mobile nav drawer */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

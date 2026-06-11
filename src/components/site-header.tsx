import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Phone, Shield } from "lucide-react";
import { brand } from "@/data/brand";
import { getPublicContent } from "@/lib/public-content";
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

export async function SiteHeader() {
  const { contact, assets } = await getPublicContent();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={brand.fullName}>
          <span className="relative size-12 overflow-hidden rounded-md border bg-black">
            <Image src={assets.foxLogo} alt="" width={48} height={48} sizes="48px" className="object-cover" priority />
          </span>
          <span className="flex flex-col leading-none">
            <span className="brand-wordmark text-lg">{brand.name}</span>
            <span className="text-xs font-semibold uppercase text-muted-foreground">Unisex Salon</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Phone icon — replaces raw number text */}
          <a
            href={`tel:${contact.phonePrimary}`}
            aria-label="Call salon"
            className="flex size-9 items-center justify-center rounded-full border bg-background/70 text-muted-foreground transition hover:text-foreground"
          >
            <Phone size={18} />
          </a>
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/book">
              <CalendarDays data-icon="inline-start" />
              Book
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="hidden lg:inline-flex" aria-label="Admin login">
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

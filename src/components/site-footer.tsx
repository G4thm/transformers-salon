import Link from "next/link";
import { AtSign, BadgeCheck, Mail, MapPinned, MessageCircleMore, PhoneCall } from "lucide-react";
import { brand } from "@/data/brand";
import { getPublicContent } from "@/lib/public-content";

export async function SiteFooter() {
  const { contact } = await getPublicContent();
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapsQuery)}`;

  return (
    <footer className="border-t bg-card/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-3">
          <p className="brand-wordmark text-2xl">{brand.fullName}</p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">{brand.promise}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <a className="group flex items-center gap-3 rounded-xl border bg-background/60 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/60 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/20 active:scale-95" href={`tel:${contact.phonePrimary}`}>
            <span className="flex size-9 items-center justify-center rounded-full bg-sky-500/15 text-sky-600 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white">
              <PhoneCall className="size-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">Phone</span>
              <span className="block font-semibold">{contact.phonePrimary}</span>
            </span>
          </a>
          <a className="group flex items-center gap-3 rounded-xl border bg-background/60 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95" href={`mailto:${contact.email}`}>
            <span className="flex size-9 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-600 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white">
              <Mail className="size-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</span>
              <span className="block font-semibold">{contact.email}</span>
            </span>
          </a>
          <a className="group flex items-center gap-3 rounded-xl border bg-background/60 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95" href={`https://wa.me/91${contact.whatsapp}`} target="_blank" rel="noreferrer">
            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white">
              <MessageCircleMore className="size-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">WhatsApp</span>
              <span className="block font-semibold">Chat now</span>
            </span>
          </a>
        </div>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <a className="group flex items-start gap-3 rounded-xl border bg-background/60 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20 hover:text-amber-600 active:scale-95" href={mapHref} target="_blank" rel="noreferrer">
            <span className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white">
              <MapPinned className="size-4" />
            </span>
            <span>{contact.address}</span>
          </a>
          <a className="group flex items-center gap-3 rounded-xl border bg-background/60 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/60 hover:bg-pink-500/10 hover:shadow-lg hover:shadow-pink-500/20 hover:text-pink-600 active:scale-95" href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
            <span className="flex size-9 items-center justify-center rounded-full bg-pink-500/15 text-pink-600 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white">
              <AtSign className="size-4" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">Instagram</span>
              <span className="block font-semibold">{contact.instagram}</span>
            </span>
          </a>
          <div className="flex items-center gap-2 rounded-xl border bg-background/60 p-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <BadgeCheck className="size-4 text-primary" />
            Verified original contact channels
          </div>
          <Link className="font-semibold text-foreground transition-colors hover:text-primary" href="/login">
            Admin login
          </Link>
        </div>
      </div>
    </footer>
  );
}

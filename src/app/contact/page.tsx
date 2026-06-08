import Image from "next/image";
import { AtSign, BadgeCheck, ChevronRight, ExternalLink, Mail, MapPinned, MessageCircleMore, PhoneCall } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicContent } from "@/lib/public-content";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const { contact, assets } = await getPublicContent();
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapsQuery)}`;
  const whatsappHref = `https://wa.me/91${contact.whatsapp}`;
  const phoneHref = `tel:${contact.phonePrimary}`;

  return (
    <PageShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col gap-6">
          <Badge>Contact</Badge>
          <h1 className="text-4xl font-black sm:text-5xl">Visit the fox atelier in Puducherry.</h1>

          {/* ── Clickable contact cards ── */}
          <Card className="glass">
            <CardContent className="grid gap-4 p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Tap a card to connect</p>
              <div className="grid gap-3 sm:grid-cols-2">

                {/* Call */}
                <a
                  className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-sky-200/40 bg-sky-500/5 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-500 hover:bg-sky-500/10 hover:shadow-md hover:shadow-sky-500/20 active:scale-95 dark:border-sky-800/40"
                  href={phoneHref}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-600 transition-all duration-200 group-hover:bg-sky-500 group-hover:text-white">
                    <PhoneCall className="size-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-500">Call us</span>
                    <span className="block truncate font-bold">{contact.phonePrimary}</span>
                    <span className="block text-[11px] text-muted-foreground">Tap to call now</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-sky-500" />
                </a>

                {/* WhatsApp */}
                <a
                  className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-emerald-200/40 bg-emerald-500/5 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-500/10 hover:shadow-md hover:shadow-emerald-500/20 active:scale-95 dark:border-emerald-800/40"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 transition-all duration-200 group-hover:bg-emerald-500 group-hover:text-white">
                    <MessageCircleMore className="size-5" />
                    {/* Live pulse dot */}
                    <span className="absolute -right-0.5 -top-0.5 flex size-3 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600">WhatsApp</span>
                    <span className="block truncate font-bold">Chat now</span>
                    <span className="block text-[11px] text-muted-foreground">Opens WhatsApp</span>
                  </span>
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:text-emerald-500" />
                </a>

                {/* Location */}
                <a
                  className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-amber-200/40 bg-amber-500/5 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-500 hover:bg-amber-500/10 hover:shadow-md hover:shadow-amber-500/20 active:scale-95 dark:border-amber-800/40"
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 transition-all duration-200 group-hover:bg-amber-500 group-hover:text-white">
                    <MapPinned className="size-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">Location</span>
                    <span className="block truncate font-bold">Open in Google Maps</span>
                    <span className="block text-[11px] text-muted-foreground">Get directions</span>
                  </span>
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:text-amber-500" />
                </a>

                {/* Instagram */}
                <a
                  className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-pink-200/40 bg-pink-500/5 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-500 hover:bg-pink-500/10 hover:shadow-md hover:shadow-pink-500/20 active:scale-95 dark:border-pink-800/40"
                  href={`https://instagram.com/${contact.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-pink-600 transition-all duration-200 group-hover:bg-pink-500 group-hover:text-white">
                    <AtSign className="size-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-600">Instagram</span>
                    <span className="block truncate font-bold">@{contact.instagram}</span>
                    <span className="block text-[11px] text-muted-foreground">Opens Instagram</span>
                  </span>
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:text-pink-500" />
                </a>
              </div>

              {/* Email — full width */}
              <a
                className="group flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-cyan-200/40 bg-cyan-500/5 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500 hover:bg-cyan-500/10 hover:shadow-md hover:shadow-cyan-500/20 active:scale-95 dark:border-cyan-800/40"
                href={`mailto:${contact.email}`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-600 transition-all duration-200 group-hover:bg-cyan-500 group-hover:text-white">
                  <Mail className="size-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Email</span>
                  <span className="block truncate font-bold">{contact.email}</span>
                  <span className="block text-[11px] text-muted-foreground">Send us a message</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-500" />
              </a>

              <div className="flex items-center gap-2 rounded-xl border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                <BadgeCheck className="size-4 shrink-0 text-primary" />
                Original verified salon account and public location details.
              </div>
            </CardContent>
          </Card>

          {/* Business hours */}
          <div className="grid gap-3 sm:grid-cols-2">
            {contact.businessHours.map((row) => (
              <div key={row.day} className="rounded-xl border bg-card p-4">
                <p className="font-bold">{row.day}</p>
                <p className="text-sm text-muted-foreground">{row.hours}</p>
              </div>
            ))}
          </div>

          {/* Primary CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="flex-1 sm:flex-none">
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircleMore className="mr-2 size-4" />
                Book via WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none">
              <a href={mapHref} target="_blank" rel="noreferrer">
                <MapPinned className="mr-2 size-4" />
                Get directions
              </a>
            </Button>
          </div>
        </div>

        {/* Contact card image — auto-fit all aspect ratios */}
        <div className="relative w-full overflow-hidden rounded-2xl border shadow-lg">
          {/* Responsive spacer: portrait on mobile, landscape on desktop */}
          <div className="aspect-[3/4] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[36rem]" />
          <Image
            src={assets.contactCard}
            alt="Transformers Salon contact card"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top"
            loading="lazy"
          />
        </div>
      </section>
    </PageShell>
  );
}

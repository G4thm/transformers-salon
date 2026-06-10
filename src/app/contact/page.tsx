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
      <section className="hero-grain mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col gap-6">
          <Badge className="w-fit border-l-4 border-l-primary pl-3">Contact</Badge>
          <h1 className="text-4xl font-black sm:text-5xl">
            Visit the fox atelier in Puducherry.
            <span className="mt-2 block h-1 w-16 rounded-full bg-primary" />
          </h1>

          {/* ── Clickable contact cards ── */}
          <Card className="glass">
            <CardContent className="grid gap-4 p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Tap a card to connect</p>
              <div className="grid gap-3 sm:grid-cols-2">

                {/* Call */}
                <a
                  className="group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-500/20 to-orange-700/10 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-orange-500 hover:shadow-[0_8px_30px_rgba(249,115,22,0.25)] active:scale-95"
                  href={phoneHref}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_4px_15px_rgba(249,115,22,0.4)] transition-transform duration-200 group-hover:scale-115">
                    <svg viewBox="0 0 24 24" className="size-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">Call us</span>
                    <span className="block truncate font-bold text-white">{contact.phonePrimary}</span>
                    <span className="block text-[11px] text-orange-200/70">Tap to call now</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-orange-400/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-orange-400" />
                </a>

                {/* WhatsApp */}
                <a
                  className="group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-[#25D366]/40 bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/10 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#25D366] hover:shadow-[0_8px_30px_rgba(37,211,102,0.25)] active:scale-95"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_15px_rgba(37,211,102,0.4)] transition-transform duration-200 group-hover:scale-115">
                    <svg viewBox="0 0 24 24" className="size-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {/* Live pulse dot */}
                    <span className="absolute -right-0.5 -top-0.5 flex size-3 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">WhatsApp</span>
                    <span className="block truncate font-bold text-white">Chat now</span>
                    <span className="block text-[11px] text-emerald-200/70">Instant reply</span>
                  </span>
                  <ExternalLink className="size-4 shrink-0 text-emerald-400/50 transition-transform duration-200 group-hover:text-emerald-400" />
                </a>

                {/* Location */}
                <a
                  className="group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-red-500/40 bg-gradient-to-br from-red-500/20 to-blue-600/10 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-red-500 hover:shadow-[0_8px_30px_rgba(234,67,53,0.25)] active:scale-95"
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_15px_rgba(234,67,53,0.3)] transition-transform duration-200 group-hover:scale-115">
                    {/* Google Maps pin SVG */}
                    <svg viewBox="0 0 24 24" className="size-6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
                    </svg>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">Location</span>
                    <span className="block truncate font-bold text-white">Find us</span>
                    <span className="block text-[11px] text-red-200/70">Pillaithottam, Puducherry</span>
                  </span>
                  <ExternalLink className="size-4 shrink-0 text-red-400/50 transition-transform duration-200 group-hover:text-red-400" />
                </a>

                {/* Instagram */}
                <a
                  className="group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-pink-500/40 bg-gradient-to-br from-pink-500/20 to-purple-600/10 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-500 hover:shadow-[0_8px_30px_rgba(236,72,153,0.25)] active:scale-95"
                  href={`https://instagram.com/${contact.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white shadow-[0_4px_15px_rgba(236,72,153,0.4)] transition-transform duration-200 group-hover:scale-115">
                    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-400">Instagram</span>
                    <span className="block truncate font-bold text-white">@{contact.instagram}</span>
                    <span className="block text-[11px] text-pink-200/70">Follow our style</span>
                  </span>
                  <ExternalLink className="size-4 shrink-0 text-pink-400/50 transition-transform duration-200 group-hover:text-pink-400" />
                </a>
              </div>

              {/* Email — full width */}
              <a
                className="group flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-cyan-500/40 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-[0_8px_30px_rgba(6,182,212,0.25)] active:scale-95"
                href={`mailto:${contact.email}`}
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-[0_4px_15px_rgba(6,182,212,0.4)] transition-transform duration-200 group-hover:scale-115">
                  <Mail className="size-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">Email</span>
                  <span className="block truncate font-bold text-white">{contact.email}</span>
                  <span className="block text-[11px] text-cyan-200/70">Send a message</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-cyan-400/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-500" />
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

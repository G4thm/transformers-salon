import Image from "next/image";
import { AtSign, BadgeCheck, Mail, MapPinned, MessageCircleMore, PhoneCall } from "lucide-react";
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
          <Card className="glass">
            <CardContent className="grid gap-4 p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <a className="group flex items-center gap-3 rounded-xl border bg-background/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/60 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/20 hover:text-primary active:scale-95" href={phoneHref}>
                  <span className="flex size-11 items-center justify-center rounded-full bg-sky-500/15 text-sky-600 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white">
                    <PhoneCall className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">Call</span>
                    <span className="block font-semibold">{contact.phonePrimary}</span>
                  </span>
                </a>
                <a className="group flex items-center gap-3 rounded-xl border bg-background/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 hover:text-emerald-600 active:scale-95" href={whatsappHref} target="_blank" rel="noreferrer">
                  <span className="flex size-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                    <MessageCircleMore className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">WhatsApp</span>
                    <span className="block font-semibold">Chat now</span>
                  </span>
                </a>
                <a className="group flex items-center gap-3 rounded-xl border bg-background/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60 hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20 hover:text-amber-600 active:scale-95" href={mapHref} target="_blank" rel="noreferrer">
                  <span className="flex size-11 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white">
                    <MapPinned className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">Location</span>
                    <span className="block font-semibold">Open in Google Maps</span>
                  </span>
                </a>
                <a className="group flex items-center gap-3 rounded-xl border bg-background/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/60 hover:bg-pink-500/10 hover:shadow-lg hover:shadow-pink-500/20 hover:text-pink-600 active:scale-95" href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
                  <span className="flex size-11 items-center justify-center rounded-full bg-pink-500/15 text-pink-600 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white">
                    <AtSign className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">Instagram</span>
                    <span className="block font-semibold">{contact.instagram}</span>
                  </span>
                </a>
              </div>
              <div className="flex items-center gap-2 rounded-xl border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
                <BadgeCheck className="size-4 text-primary" />
                Original verified salon account and public location details.
              </div>
              <a className="group flex gap-3 rounded-xl border bg-background/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/60 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/20 hover:text-primary active:scale-95" href={`mailto:${contact.email}`}>
                <span className="mt-0.5 flex size-11 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-600 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white">
                  <Mail className="size-5" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</span>
                  <span className="block font-semibold">{contact.email}</span>
                </span>
              </a>
            </CardContent>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2">
            {contact.businessHours.map((row) => (
              <div key={row.day} className="rounded-lg border bg-card p-4">
                <p className="font-bold">{row.day}</p>
                <p className="text-sm text-muted-foreground">{row.hours}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircleMore data-icon="inline-start" />
                WhatsApp booking
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={mapHref} target="_blank" rel="noreferrer">
                <MapPinned data-icon="inline-start" />
                Open location
              </a>
            </Button>
          </div>
        </div>
        <div className="relative min-h-130 overflow-hidden rounded-lg border">
          <Image src={assets.contactCard} alt="Transformers Salon contact card" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" loading="lazy" />
        </div>
      </section>
    </PageShell>
  );
}

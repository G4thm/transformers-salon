import Image from "next/image";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicContent } from "@/lib/public-content";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const { contact, assets } = await getPublicContent();
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapsQuery)}`;

  return (
    <PageShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col gap-6">
          <Badge>Contact</Badge>
          <h1 className="text-5xl font-black">Visit the fox atelier in Puducherry.</h1>
          <Card className="glass">
            <CardContent className="grid gap-5 p-6">
              <a className="flex gap-3 hover:text-primary" href={`tel:${contact.phonePrimary}`}>
                <Phone data-icon="inline-start" />
                {contact.phonePrimary} / {contact.phoneSecondary}
              </a>
              <a className="flex gap-3 hover:text-primary" href={`mailto:${contact.email}`}>
                <Mail data-icon="inline-start" />
                {contact.email}
              </a>
              <a className="flex gap-3 hover:text-primary" href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
                <AtSign data-icon="inline-start" />
                {contact.instagram}
              </a>
              <a className="flex gap-3 hover:text-primary" href={mapHref} target="_blank" rel="noreferrer">
                <MapPin data-icon="inline-start" />
                {contact.address}
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
          <Button asChild>
            <a href={`https://wa.me/91${contact.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp booking
            </a>
          </Button>
        </div>
        <div className="relative min-h-130 overflow-hidden rounded-lg border">
          <Image src={assets.contactCard} alt="Transformers Salon contact card" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>
    </PageShell>
  );
}

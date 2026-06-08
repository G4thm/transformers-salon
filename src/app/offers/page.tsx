import Image from "next/image";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicContent } from "@/lib/public-content";

export const metadata = { title: "Offers" };

export default async function OffersPage() {
  const content = await getPublicContent();

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex max-w-3xl flex-col gap-5">
          <Badge>Offers</Badge>
          <h1 className="text-4xl font-black sm:text-5xl">Salon campaigns without public price display.</h1>
          <p className="text-lg leading-8 text-muted-foreground">Offers are dashboard-managed with expiry dates, enabled states, and uploadable images.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {content.offers.map((offer) => (
            <Card key={offer.id} className="glass overflow-hidden">
              <div className="relative aspect-[16/10]">
                <Image src={offer.image} alt={offer.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" loading="lazy" />
              </div>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <CalendarClock data-icon="inline-start" />
                  {offer.expiryLabel}
                </div>
                <h2 className="text-2xl font-black">{offer.title}</h2>
                <p className="leading-7 text-muted-foreground">{offer.description}</p>
                <Button asChild>
                  <Link href={`/book?service=${encodeURIComponent(offer.title)}`}>Book this offer</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

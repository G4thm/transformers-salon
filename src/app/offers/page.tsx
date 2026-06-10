import Image from "next/image";
import Link from "next/link";
import { CalendarClock, Sparkles } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicContent } from "@/lib/public-content";

export const metadata = { title: "Offers" };

export default async function OffersPage() {
  const content = await getPublicContent();

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex max-w-3xl flex-col gap-5">
          <Badge className="w-fit border-l-4 border-l-primary pl-3">Offers</Badge>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Salon campaigns &amp; exclusive deals
            <span className="mt-2 block h-1 w-16 rounded-full bg-primary" />
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Dashboard-managed campaigns with expiry dates and uploadable images. No price display online.
          </p>
        </div>

        {/* Offers grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {content.offers.map((offer) => (
            <article
              key={offer.id}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_8px_32px_rgb(249_115_22_/_20%)]"
            >
              {/* Image container — fixed max height 200px */}
              <div className="relative h-[200px] w-full overflow-hidden bg-muted">
                <Image
                  src={offer.image || "/brand/fox-mascot.webp"}
                  alt={offer.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <CalendarClock className="size-4" />
                  {offer.expiryLabel}
                </div>
                <h2 className="text-2xl font-black">{offer.title}</h2>
                <p className="leading-7 text-muted-foreground">{offer.description}</p>
                <Button asChild className="mt-1 w-fit rounded-full">
                  <Link href={`/book?service=${encodeURIComponent(offer.title)}`}>
                    <Sparkles className="mr-2 size-4" />
                    Book this offer
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

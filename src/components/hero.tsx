import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { brand } from "@/data/brand";
import { getPublicContent } from "@/lib/public-content";
import { Button } from "@/components/ui/button";

export async function Hero() {
  const { contact, assets } = await getPublicContent();

  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgb(249_115_22_/_18%),transparent_32%,rgb(0_0_0_/_0%))]" />
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-3 text-sm font-bold uppercase text-primary">
            <Sparkles data-icon="inline-start" />
            {brand.tagline}
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="brand-wordmark max-w-4xl text-4xl leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Transformers Unisex Salon
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              A luxury beauty atelier in Puducherry built around sharp grooming, modern hair artistry, and the iconic fox mascot.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/book">
                Book appointment
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${contact.phonePrimary}`}>
                <Phone data-icon="inline-start" />
                Call salon
              </a>
            </Button>
          </div>
        </div>
        <div className="relative min-h-[420px]">
          <div className="glass absolute inset-x-8 bottom-2 top-10 rounded-lg" />
          <Image
            src={assets.mascot}
            alt="Transformers fox mascot wearing sunglasses with salon tools"
            fill
            sizes="(min-width: 1024px) 44vw, 90vw"
            priority
            className="object-contain drop-shadow-[0_30px_80px_rgb(249_115_22_/_35%)]"
          />
        </div>
      </div>
    </section>
  );
}

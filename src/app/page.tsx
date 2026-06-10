import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Gem, ShieldCheck, Sparkles } from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";
import { Hero } from "@/components/hero";
import { MotionSection } from "@/components/motion-section";
import { PageShell } from "@/components/page-shell";
import { ServiceFlipCards } from "@/components/service-flip-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicContent } from "@/lib/public-content";

export default async function Home() {
  const content = await getPublicContent();

  return (
    <PageShell>
      <Hero />

      {/* Feature pillars */}
      <MotionSection className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          ["Luxury finish", "Glass-clean interiors, careful consultations, and refined service rituals."],
          ["Unisex expertise", "Men's grooming and women's beauty services under one premium atelier."],
          ["Editable platform", "Services, offers, gallery, appointments, and settings managed from dashboard."],
        ].map(([title, text]) => (
          <Card key={title} className="glass rounded-xl border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_32px_rgb(249_115_22_/_15%)]">
            <CardContent className="flex flex-col gap-4 p-6">
              <Gem className="text-primary" aria-hidden />
              <h2 className="text-xl font-black">{title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{text}</p>
            </CardContent>
          </Card>
        ))}
      </MotionSection>

      {/* Services preview */}
      <MotionSection className="border-y bg-card/50 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8">
          <div className="flex flex-col gap-5">
            <Badge className="w-fit border-l-4 border-l-primary pl-3">Signature services</Badge>
            <h2 className="text-4xl font-black">
              Interactive service cards for every transformation.
              <span className="mt-2 block h-1 w-10 rounded-full bg-primary" />
            </h2>
            <p className="text-muted-foreground">Hover or tap through the 3D cards. No prices are displayed online.</p>
            <Button asChild variant="outline" className="w-fit rounded-full">
              <Link href="/services">
                View services
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
          <ServiceFlipCards category="men" services={content.services} />
        </div>
      </MotionSection>

      {/* Offers preview */}
      <MotionSection className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative min-h-105 overflow-hidden rounded-xl border transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_32px_rgb(249_115_22_/_15%)]">
          <Image
            src={content.assets.grandOpening}
            alt="Transformers Salon grand opening creative"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-center gap-5">
          <Badge className="w-fit border-l-4 border-l-primary pl-3">Offers</Badge>
          <h2 className="text-4xl font-black">
            {content.offers[0]?.title ?? "Luxury salon offers"}
            <span className="mt-2 block h-1 w-10 rounded-full bg-primary" />
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            {content.offers[0]?.description ?? "Dashboard-managed offers, campaigns, and limited-time salon experiences."}
          </p>
          <Button asChild className="w-fit rounded-full">
            <Link href="/offers">
              Explore offers
              <Sparkles data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </MotionSection>

      {/* Book appointment section */}
      <MotionSection className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <CalendarDays className="text-primary" aria-hidden />
          <h2 className="text-3xl font-black">
            Book your salon visit
            <span className="ml-3 inline-block h-0.5 w-8 rounded-full bg-primary align-middle" />
          </h2>
        </div>
        <AppointmentForm services={content.services} />
      </MotionSection>

      {/* Admin CTA */}
      <MotionSection className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="glass flex flex-col gap-5 rounded-xl p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Dashboard ready from day one</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Secure admin tools are prepared for services, offers, gallery, appointments, and business settings.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full">
            <Link href="/login">
              <ShieldCheck data-icon="inline-start" />
              Admin login
            </Link>
          </Button>
        </div>
      </MotionSection>
    </PageShell>
  );
}

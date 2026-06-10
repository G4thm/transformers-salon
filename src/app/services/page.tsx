import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors, Sparkles } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ServiceFlipCards } from "@/components/service-flip-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicContent } from "@/lib/public-content";
import { getSupabaseImageUrl } from "@/lib/utils";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const content = await getPublicContent();

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex max-w-3xl flex-col gap-5">
          <Badge className="w-fit border-l-4 border-l-primary pl-3">Services</Badge>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Men &amp; Women premium services
            <span className="mt-2 block h-1 w-16 rounded-full bg-primary" />
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Every card is built for booking, not price display. Service details are managed from the admin dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {/* Men section */}
          <section className="flex flex-col gap-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-black">
                  {content.categories[0]?.name ?? "Men"}
                  <span className="mt-1 block h-0.5 w-10 rounded-full bg-primary" />
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {content.categories[0]?.description ?? "Sharp grooming, clean detailing, and confident finishing."}
                </p>
              </div>
              <Button asChild variant="outline" className="hidden rounded-full sm:flex">
                <Link href="/book">
                  Book Men&apos;s Service
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>

            {/* Service cards with images */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {content.services
                .filter((s) => s.category === "men" || s.categoryName?.toLowerCase() === "men")
                .map((service) => {
                  const imgSrc =
                    getSupabaseImageUrl(service.imagePath) ?? "/brand/fox-mascot.webp";
                  return (
                    <article
                      key={service.id}
                      className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_32px_rgb(249_115_22_/_18%)]"
                    >
                      <div className="relative h-[220px] w-full overflow-hidden bg-muted">
                        <Image
                          src={imgSrc}
                          alt={service.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col gap-3 p-5">
                        <div className="flex items-center gap-2">
                          <Scissors className="size-4 text-primary" />
                          <h3 className="text-lg font-black">{service.name}</h3>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">{service.description}</p>
                        <Button asChild size="sm" className="mt-1 w-fit rounded-full">
                          <Link href={`/book?service=${encodeURIComponent(service.name)}`}>
                            <Sparkles className="mr-1.5 size-3.5" />
                            Book now
                          </Link>
                        </Button>
                      </div>
                    </article>
                  );
                })}
            </div>

            {/* Also render flip cards for the 3D interactive experience */}
            <div className="mt-4">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Or browse with interactive 3D cards
              </p>
              <ServiceFlipCards category="men" services={content.services} />
            </div>
          </section>

          {/* Women section */}
          <section className="flex flex-col gap-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-black">
                  {content.categories[1]?.name ?? "Women"}
                  <span className="mt-1 block h-0.5 w-10 rounded-full bg-primary" />
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {content.categories[1]?.description ?? "Hair artistry, skin rituals, bridal glow, and occasion styling."}
                </p>
              </div>
              <Button asChild variant="outline" className="hidden rounded-full sm:flex">
                <Link href="/book">
                  Book Women&apos;s Service
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>

            {/* Service cards with images */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {content.services
                .filter((s) => s.category === "women" || s.categoryName?.toLowerCase() === "women")
                .map((service) => {
                  const imgSrc =
                    getSupabaseImageUrl(service.imagePath) ?? "/brand/fox-mascot.webp";
                  return (
                    <article
                      key={service.id}
                      className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_32px_rgb(249_115_22_/_18%)]"
                    >
                      <div className="relative h-[220px] w-full overflow-hidden bg-muted">
                        <Image
                          src={imgSrc}
                          alt={service.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col gap-3 p-5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="size-4 text-primary" />
                          <h3 className="text-lg font-black">{service.name}</h3>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">{service.description}</p>
                        <Button asChild size="sm" className="mt-1 w-fit rounded-full">
                          <Link href={`/book?service=${encodeURIComponent(service.name)}`}>
                            <Sparkles className="mr-1.5 size-3.5" />
                            Book now
                          </Link>
                        </Button>
                      </div>
                    </article>
                  );
                })}
            </div>

            {/* Also render flip cards for the 3D interactive experience */}
            <div className="mt-4">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Or browse with interactive 3D cards
              </p>
              <ServiceFlipCards category="women" services={content.services} />
            </div>
          </section>
        </div>
      </section>
    </PageShell>
  );
}

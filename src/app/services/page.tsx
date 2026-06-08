import { PageShell } from "@/components/page-shell";
import { ServiceFlipCards } from "@/components/service-flip-cards";
import { Badge } from "@/components/ui/badge";
import { getPublicContent } from "@/lib/public-content";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const content = await getPublicContent();

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex max-w-3xl flex-col gap-5">
          <Badge>Services</Badge>
          <h1 className="text-4xl font-black sm:text-5xl">Men and women categories with premium 3D service cards.</h1>
          <p className="text-lg leading-8 text-muted-foreground">Every card is built for booking, not price display. Service details are managed from the admin dashboard.</p>
        </div>
        <div className="flex flex-col gap-16">
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-black">{content.categories[0]?.name ?? "Men"}</h2>
              <p className="text-muted-foreground">{content.categories[0]?.description ?? "Sharp grooming, clean detailing, and confident finishing."}</p>
            </div>
            <ServiceFlipCards category="men" services={content.services} />
          </section>
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-black">{content.categories[1]?.name ?? "Women"}</h2>
              <p className="text-muted-foreground">{content.categories[1]?.description ?? "Hair artistry, skin rituals, bridal glow, and occasion styling."}</p>
            </div>
            <ServiceFlipCards category="women" services={content.services} />
          </section>
        </div>
      </section>
    </PageShell>
  );
}

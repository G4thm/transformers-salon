import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { getPublicContent } from "@/lib/public-content";
import { getSupabaseImageUrl } from "@/lib/utils";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const content = await getPublicContent();

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex max-w-3xl flex-col gap-5">
          <Badge className="w-fit border-l-4 border-l-primary pl-3">Gallery</Badge>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Fox-led brand &amp; salon gallery
            <span className="mt-2 block h-1 w-16 rounded-full bg-primary" />
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Gallery items managed from the admin dashboard with Supabase Storage uploads.
          </p>
        </div>

        {/* Masonry grid */}
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {content.gallery.map((item) => {
            const imgSrc = getSupabaseImageUrl(item.image) ?? "/brand/fox-mascot.webp";
            return (
              <figure
                key={item.id}
                className="group mb-5 break-inside-avoid overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_24px_rgb(249_115_22_/_15%)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={item.altText ?? item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <figcaption className="flex items-center justify-between p-4 text-sm">
                  <span className="font-semibold">{item.title}</span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {item.category}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

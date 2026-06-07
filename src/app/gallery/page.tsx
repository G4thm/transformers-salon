import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { getPublicContent } from "@/lib/public-content";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const content = await getPublicContent();

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex max-w-3xl flex-col gap-5">
          <Badge>Gallery</Badge>
          <h1 className="text-5xl font-black">Fox-led brand and salon gallery.</h1>
          <p className="text-lg leading-8 text-muted-foreground">Gallery items are ready for Supabase Storage uploads and dashboard editing.</p>
        </div>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {content.gallery.map((item) => (
            <figure key={item.id} className="glass mb-5 break-inside-avoid overflow-hidden rounded-lg">
              <div className="relative aspect-[4/3]">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="flex items-center justify-between p-4 text-sm">
                <span className="font-semibold">{item.title}</span>
                <span className="text-muted-foreground">{item.category}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

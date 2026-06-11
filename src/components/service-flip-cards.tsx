"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Scissors, Sparkles } from "lucide-react";
import { services as fallbackServices } from "@/data/brand";
import type { PublicService } from "@/lib/public-content";
import { Button } from "@/components/ui/button";

/** Keyword → static image fallback when no image_path is set in DB */
const AUTO_IMAGE_MAP: Record<string, string> = {
  haircut: "/services/haircuts.jpg",
  "hair cut": "/services/haircuts.jpg",
  beard: "/services/beard.jpg",
  shave: "/services/beard.jpg",
  color: "/services/coloring.jpg",
  colour: "/services/coloring.jpg",
  highlight: "/services/coloring.jpg",
  spa: "/services/hair-spa.jpg",
  treatment: "/services/hair-spa.jpg",
  facial: "/services/facial.jpg",
  face: "/services/facial.jpg",
  skin: "/services/facial.jpg",
  women: "/services/women-hair.jpg",
  styling: "/services/women-hair.jpg",
  blowdry: "/services/women-hair.jpg",
};

function getAutoImage(name: string): string {
  const lower = name.toLowerCase();
  for (const [keyword, path] of Object.entries(AUTO_IMAGE_MAP)) {
    if (lower.includes(keyword)) return path;
  }
  return "/services/haircuts.jpg"; // generic fallback
}

export function ServiceFlipCards({ category, services }: { category: "men" | "women"; services?: PublicService[] }) {
  const visible = (services ?? fallbackServices).filter((service) => service.category === category);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((service, index) => (
        <motion.article
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: Math.min(index * 0.03, 0.15) }}
          className="group perspective-1000 h-64"
        >
          <div className="preserve-3d relative size-full rounded-lg transition duration-500 group-hover:rotate-y-180">
            {/* Front — photo with gradient overlay */}
            <div className="backface-hidden absolute inset-0 overflow-hidden rounded-lg">
              <Image
                src={service.imagePath ?? getAutoImage(service.name)}
                alt={service.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <Scissors className="mb-2 size-4 text-primary" aria-hidden />
                <h3 className="text-xl font-black text-white drop-shadow">{service.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/75">{service.description}</p>
              </div>
            </div>
            {/* Back — CTA */}
            <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-lg border bg-primary p-6 text-primary-foreground">
              <Sparkles aria-hidden />
              <div className="flex flex-col gap-4">
                <p className="text-lg font-black">Ready for a transformation?</p>
                <Button asChild variant="secondary">
                  <a href={`/book?service=${encodeURIComponent(service.name)}`}>Choose service</a>
                </Button>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

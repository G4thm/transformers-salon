"use client";

import { motion } from "framer-motion";
import { Scissors, Sparkles } from "lucide-react";
import { services as fallbackServices } from "@/data/brand";
import type { PublicService } from "@/lib/public-content";
import { Button } from "@/components/ui/button";

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
          transition={{ delay: index * 0.04 }}
          className="group perspective-1000 h-64"
        >
          <div className="preserve-3d relative size-full rounded-lg transition duration-500 group-hover:rotate-y-180">
            <div className="backface-hidden glass absolute inset-0 flex flex-col justify-between rounded-lg p-6">
              <Scissors className="text-primary" aria-hidden />
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-black">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            </div>
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

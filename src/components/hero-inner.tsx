"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { brand } from "@/data/brand";
import { Button } from "@/components/ui/button";

/* ---------- animation variants ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.11,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, x: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

export function HeroInner({
  phonePrimary,
  mascot,
}: {
  phonePrimary: string;
  mascot: string;
}) {
  return (
    <section className="hero-grain relative overflow-hidden border-b">
      {/* Gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgb(249_115_22_/_18%),transparent_35%,rgb(0_0_0_/_0%))]" />

      {/* Ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-[340px] w-[340px] rounded-full bg-primary/8 blur-[100px]"
      />

      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1280px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:gap-16 lg:px-8">

        {/* ── Left: Text column ── */}
        <div className="flex flex-col gap-8 lg:max-w-xl">

          {/* Badge */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
            <span className="premium-badge">
              <Sparkles className="size-3 shrink-0" aria-hidden />
              {brand.tagline}
            </span>
          </motion.div>

          {/* Title + Subtitle */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col gap-5"
          >
            <h1 className="brand-wordmark hero-title">
              Transformers<br className="hidden sm:block" /> Unisex Salon
            </h1>
            <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              A luxury beauty atelier in Puducherry built around sharp grooming,
              modern hair artistry, and the iconic fox mascot.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full shadow-[0_4px_24px_rgb(249_115_22_/_30%)] transition-shadow hover:shadow-[0_8px_32px_rgb(249_115_22_/_45%)]"
            >
              <Link href="/book">
                Book appointment
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <a href={`tel:${phonePrimary}`}>
                <Phone data-icon="inline-start" />
                Call salon
              </a>
            </Button>
          </motion.div>
        </div>

        {/* ── Right: Glass card with mascot ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariant}
          className="relative flex items-center justify-center"
        >
          {/* Decorative ring */}
          <div
            aria-hidden
            className="absolute inset-8 -z-10 rounded-3xl border border-primary/15 bg-primary/5"
          />

          {/* Glass card */}
          <div className="hero-glass-card group w-full max-w-[420px] p-2 lg:max-w-full">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Image
                src={mascot}
                alt="Transformers fox mascot wearing sunglasses with salon tools"
                fill
                sizes="(min-width: 1024px) 40vw, 86vw"
                priority
                className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] drop-shadow-[0_24px_64px_rgb(249_115_22_/_40%)]"
              />
            </div>

            {/* Bottom label strip */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {brand.name}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary" />
                Open today
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

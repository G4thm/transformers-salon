import { AppointmentForm } from "@/components/appointment-form";
import { PageShell } from "@/components/page-shell";
import { getPublicContent } from "@/lib/public-content";

export const metadata = { title: "Book Appointment" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const content = await getPublicContent();

  return (
    <PageShell>
      <section className="hero-grain mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10 flex flex-col gap-4">
          {/* Pill badge with glowing orange left border */}
          <div className="flex items-center gap-3">
            <span className="pill-glow inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-[0_0_16px_rgb(249_115_22_/_15%)]">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              Appointments
            </span>
          </div>
          <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
            Request a time with the Transformers team.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Submit via our form, send via WhatsApp, or call us directly.
          </p>
          {/* Horizontal divider */}
          <div className="h-px w-full bg-gradient-to-r from-primary/40 via-border/50 to-transparent" />
        </div>

        {/* Appointment form + contact cards */}
        <AppointmentForm selectedService={params.service} services={content.services} />
      </section>
    </PageShell>
  );
}

import { AppointmentForm } from "@/components/appointment-form";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { getPublicContent } from "@/lib/public-content";

export const metadata = { title: "Book Appointment" };

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;
  const content = await getPublicContent();

  return (
    <PageShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.75fr_1fr] lg:px-8">
        <div className="flex flex-col gap-5">
          <Badge>Appointments</Badge>
          <h1 className="text-5xl font-black">Request a time with the Transformers team.</h1>
          <p className="text-lg leading-8 text-muted-foreground">Submit to the dashboard database, send the same intent by WhatsApp, or call directly.</p>
        </div>
        <AppointmentForm selectedService={params.service} services={content.services} />
      </section>
    </PageShell>
  );
}

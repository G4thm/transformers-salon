"use client";

import { useActionState, useMemo } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { createAppointment, type ActionState } from "@/app/actions/appointments";
import { brand, services as fallbackServices } from "@/data/brand";
import type { PublicService } from "@/lib/public-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { ok: false, message: "" };

export function AppointmentForm({ selectedService, services }: { selectedService?: string; services?: PublicService[] }) {
  const [state, action, pending] = useActionState(createAppointment, initialState);
  const visibleServices = services ?? fallbackServices;
  const whatsappHref = useMemo(() => {
    const text = `Hello Transformers Salon, I want to book an appointment${selectedService ? ` for ${selectedService}` : ""}.`;
    return `https://wa.me/91${brand.whatsapp}?text=${encodeURIComponent(text)}`;
  }, [selectedService]);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Book Appointment</CardTitle>
        <CardDescription>No prices are shown online. The salon team will guide availability and service details directly.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Name
              <Input name="name" required placeholder="Your name" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Phone
              <Input name="phone" required placeholder="Mobile number" inputMode="tel" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold">
            Service
            <select
              name="service"
              defaultValue={selectedService ?? ""}
              required
              className="h-11 rounded-md border bg-background/70 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="" disabled>
                Select service
              </option>
              {visibleServices.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Date
              <Input name="date" required type="date" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Time
              <Input name="time" required type="time" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold">
            Notes
            <Textarea name="notes" placeholder="Occasion, preferred stylist, or anything we should know" />
          </label>
          {state.message ? (
            <p className={state.ok ? "text-sm font-semibold text-primary" : "text-sm font-semibold text-destructive"}>
              {state.message}
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-3">
            <Button type="submit" disabled={pending} className="sm:col-span-1">
              {pending ? "Sending..." : "Send request"}
            </Button>
            <Button asChild variant="outline">
              <a href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle data-icon="inline-start" />
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`tel:${brand.phonePrimary}`}>
                <Phone data-icon="inline-start" />
                Phone
              </a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

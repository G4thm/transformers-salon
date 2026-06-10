"use client";

import { useActionState, useMemo, useState } from "react";
import { Calendar, Scissors, Send } from "lucide-react";
import { createAppointment, type ActionState } from "@/app/actions/appointments";
import { brand, services as fallbackServices } from "@/data/brand";
import type { PublicService } from "@/lib/public-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { ok: false, message: "" };


export function AppointmentForm({
  selectedService,
  services,
}: {
  selectedService?: string;
  services?: PublicService[];
}) {
  const [state, action, pending] = useActionState(createAppointment, initialState);
  const visibleServices = services ?? fallbackServices;

  // Deduplicate by name — keep first occurrence only
  const uniqueServices = useMemo(() => {
    const seen = new Set<string>();
    return visibleServices.filter((s) => {
      if (seen.has(s.name)) return false;
      seen.add(s.name);
      return true;
    });
  }, [visibleServices]);

  // Multi-service selection state
  const [selectedServices, setSelectedServices] = useState<string[]>(
    selectedService ? [selectedService] : []
  );

  const toggleService = (name: string) => {
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const whatsappHref = useMemo(() => {
    const serviceText =
      selectedServices.length > 0 ? ` for ${selectedServices.join(", ")}` : "";
    const text = `Hello Transformers Salon, I want to book an appointment${serviceText}.`;
    return `https://wa.me/91${brand.whatsapp}?text=${encodeURIComponent(text)}`;
  }, [selectedServices]);

  return (
    <div className="flex flex-col gap-8">
      {/* Booking form card */}
      <div className="rounded-2xl border border-border bg-[#111] shadow-2xl">
        <div className="border-b border-border/60 px-6 py-5">
          <h2 className="text-lg font-black tracking-tight text-white">Book Appointment</h2>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            No prices shown online. The salon team will guide availability directly.
          </p>
        </div>

        <form action={action} className="flex flex-col gap-5 p-6">
          {/* Hidden field to pass selected services as comma-separated */}
          <input type="hidden" name="service" value={selectedServices.join(", ")} />

          {/* Name + Phone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
                Name
              </label>
              <Input
                name="name"
                required
                placeholder="Your name"
                className="rounded-lg border-border/50 bg-[#1a1a1a] text-white placeholder:text-[#555] focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
                Phone
              </label>
              <Input
                name="phone"
                required
                placeholder="Mobile number"
                inputMode="tel"
                className="rounded-lg border-border/50 bg-[#1a1a1a] text-white placeholder:text-[#555] focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* Service multi-select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
              Select Services (choose one or more)
            </label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {uniqueServices.map((service) => {
                const isSelected = selectedServices.includes(service.name);
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.name)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-medium transition-all duration-150 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-[#1a1a1a] text-[#9CA3AF] hover:border-border hover:text-white"
                    }`}
                  >
                    <Scissors className={`size-3.5 shrink-0 ${isSelected ? "text-primary" : "text-[#555]"}`} />
                    {service.name}
                  </button>
                );
              })}
            </div>
            {selectedServices.length === 0 && (
              <p className="text-xs text-destructive">Please select at least one service.</p>
            )}
            {selectedServices.length > 0 && (
              <p className="text-xs text-primary">
                Selected: {selectedServices.join(", ")}
              </p>
            )}
          </div>

          {/* Date + Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
                Date
              </label>
              <Input
                name="date"
                required
                type="date"
                className="rounded-lg border-border/50 bg-[#1a1a1a] text-white focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
                Time
              </label>
              <Input
                name="time"
                required
                type="time"
                className="rounded-lg border-border/50 bg-[#1a1a1a] text-white focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
              Notes
            </label>
            <Textarea
              name="notes"
              placeholder="Occasion, preferred stylist, or anything we should know"
              className="rounded-lg border-border/50 bg-[#1a1a1a] text-white placeholder:text-[#555] focus:border-primary focus:ring-primary"
            />
          </div>

          {/* State message */}
          {state.message ? (
            <p
              className={
                state.ok
                  ? "text-sm font-semibold text-primary"
                  : "text-sm font-semibold text-destructive"
              }
            >
              {state.message}
            </p>
          ) : null}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={pending || selectedServices.length === 0}
            className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30 disabled:opacity-60"
          >
            <Calendar className="mr-2 size-4" />
            {pending ? "Sending request..." : "Send booking request"}
            <Send className="ml-2 size-4" />
          </Button>
        </form>
      </div>

      {/* Horizontal divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">
          or reach us directly
        </span>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      {/* 3 bold brand contact action cards */}
      <div className="grid gap-4 sm:grid-cols-3">

        {/* WhatsApp */}
        <a
          href={`https://wa.me/91${brand.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-[#25D366]/40 bg-gradient-to-br from-[#25D366]/20 to-[#128C7E]/10 p-6 text-center transition-all duration-200 hover:-translate-y-2 hover:border-[#25D366] hover:shadow-[0_12px_40px_rgba(37,211,102,0.35)]"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.5)] transition-transform duration-200 group-hover:scale-110">
            {/* WhatsApp SVG logo */}
            <svg viewBox="0 0 24 24" className="size-8 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </span>
          <span className="flex flex-col gap-1">
            <span className="block text-lg font-black text-white">Chat on WhatsApp</span>
            <span className="block text-sm font-bold text-[#25D366]">Instant reply</span>
          </span>
        </a>

        {/* Call */}
        <a
          href={`tel:${brand.phonePrimary}`}
          className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-500/20 to-orange-700/10 p-6 text-center transition-all duration-200 hover:-translate-y-2 hover:border-orange-500 hover:shadow-[0_12px_40px_rgba(249,115,22,0.35)]"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_4px_20px_rgba(249,115,22,0.5)] transition-transform duration-200 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="size-8 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </span>
          <span className="flex flex-col gap-1">
            <span className="block text-lg font-black text-white">Call Salon</span>
            <span className="block text-sm font-bold text-orange-400">{brand.phonePrimary}</span>
          </span>
        </a>

        {/* Google Maps */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.mapsQuery)}`}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-red-500/40 bg-gradient-to-br from-red-500/20 to-blue-600/10 p-6 text-center transition-all duration-200 hover:-translate-y-2 hover:border-red-500 hover:shadow-[0_12px_40px_rgba(234,67,53,0.35)]"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(234,67,53,0.4)] transition-transform duration-200 group-hover:scale-110">
            {/* Google Maps pin SVG */}
            <svg viewBox="0 0 24 24" className="size-8" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13V11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5V2z" fill="#34A853" opacity="0"/>
            </svg>
          </span>
          <span className="flex flex-col gap-1">
            <span className="block text-lg font-black text-white">Get Directions</span>
            <span className="block text-sm font-bold text-red-400">Pillaithottam, Puducherry</span>
          </span>
        </a>

      </div>
    </div>
  );
}

"use client";

import { useActionState, useMemo, useState } from "react";
import { Calendar, MapPin, MessageCircle, Phone, Scissors, Send } from "lucide-react";
import { createAppointment, type ActionState } from "@/app/actions/appointments";
import { brand, services as fallbackServices } from "@/data/brand";
import type { PublicService } from "@/lib/public-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { ok: false, message: "" };

const CONTACT_CARDS = [
  {
    key: "whatsapp",
    icon: MessageCircle,
    label: "Chat on WhatsApp",
    subtitle: "Instant reply",
    color: "emerald",
    href: `https://wa.me/91${brand.whatsapp}`,
    external: true,
  },
  {
    key: "phone",
    icon: Phone,
    label: "Call Salon",
    subtitle: brand.phonePrimary,
    color: "orange",
    href: `tel:${brand.phonePrimary}`,
    external: false,
  },
  {
    key: "maps",
    icon: MapPin,
    label: "Get Directions",
    subtitle: "Pillaithottam, Puducherry",
    color: "sky",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      brand.mapsQuery
    )}`,
    external: true,
  },
] as const;

const COLOR_MAP: Record<string, { bg: string; border: string; icon: string; text: string }> = {
  emerald: {
    bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
    border: "border-emerald-500/30 hover:border-emerald-400",
    icon: "bg-emerald-500/20 text-emerald-500",
    text: "text-emerald-400",
  },
  orange: {
    bg: "bg-orange-500/10 hover:bg-orange-500/15",
    border: "border-orange-500/30 hover:border-orange-400",
    icon: "bg-orange-500/20 text-orange-500",
    text: "text-orange-400",
  },
  sky: {
    bg: "bg-sky-500/10 hover:bg-sky-500/15",
    border: "border-sky-500/30 hover:border-sky-400",
    icon: "bg-sky-500/20 text-sky-500",
    text: "text-sky-400",
  },
};

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

      {/* 3 contact action cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {CONTACT_CARDS.map(({ key, icon: Icon, label, subtitle, color, href, external }) => {
          const colors = COLOR_MAP[color];

          return (
            <a
              key={key}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className={`group flex flex-col items-center gap-4 rounded-xl border p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${colors.bg} ${colors.border}`}
            >
              <span
                className={`flex size-14 items-center justify-center rounded-full ${colors.icon} transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon className="size-6" />
              </span>
              <span className="flex flex-col gap-1">
                <span className={`block text-lg font-black leading-tight text-white`}>{label}</span>
                <span className={`block text-sm font-semibold ${colors.text}`}>{subtitle}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const appointmentSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  service: z.string().min(2),
  date: z.string().min(4),
  time: z.string().min(2),
  notes: z.string().optional(),
});

export type ActionState = {
  ok: boolean;
  message: string;
};

export async function createAppointment(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = appointmentSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    date: formData.get("date"),
    time: formData.get("time"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Please complete the required booking details." };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Booking database is not connected yet. Configure Supabase env vars or use WhatsApp booking.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({
    customer_name: parsed.data.name,
    phone: parsed.data.phone,
    service_name: parsed.data.service,
    appointment_date: parsed.data.date,
    appointment_time: parsed.data.time,
    notes: parsed.data.notes,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  return { ok: true, message: "Appointment request received. The salon team will confirm shortly." };
}

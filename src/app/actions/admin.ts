"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) {
    throw new Error("Authentication required.");
  }

  const { data: role } = await supabase
    .from("roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!role) {
    throw new Error("Admin access required.");
  }

  return { supabase, userId: userData.user.id };
}

const enabled = (value: FormDataEntryValue | null) => value === "on";

async function uploadFileToBucket(supabase: Awaited<ReturnType<typeof createClient>>, bucket: string, value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  const extension = value.name.includes(".") ? value.name.slice(value.name.lastIndexOf(".")) : "";
  const filePath = `${bucket}/${randomUUID()}${extension}`;
  const buffer = Buffer.from(await value.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
    contentType: value.type || "application/octet-stream",
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
}

export async function upsertService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const schema = z.object({
    id: z.string().optional(),
    category_id: z.string().uuid(),
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().optional(),
    image_path: z.string().optional(),
    display_order: z.coerce.number().int().default(0),
  });
  const data = schema.parse(Object.fromEntries(formData));
  const uploadedImagePath = await uploadFileToBucket(supabase, "service-images", formData.get("image_file"));
  const payload = { ...data, image_path: uploadedImagePath ?? data.image_path ?? null, enabled: enabled(formData.get("enabled")) };
  const { error } = data.id
    ? await supabase.from("services").update(payload).eq("id", data.id)
    : await supabase.from("services").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/services");
  revalidatePath("/admin");
}

export async function deleteService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/services");
  revalidatePath("/admin");
}

export async function upsertOffer(formData: FormData) {
  const { supabase } = await requireAdmin();
  const schema = z.object({
    id: z.string().optional(),
    title: z.string().min(2),
    description: z.string().optional(),
    image_path: z.string().optional(),
    expires_at: z.string().optional(),
  });
  const data = schema.parse(Object.fromEntries(formData));
  const uploadedImagePath = await uploadFileToBucket(supabase, "offer-images", formData.get("image_file"));
  const payload = {
    ...data,
    image_path: uploadedImagePath ?? data.image_path ?? null,
    expires_at: data.expires_at || null,
    enabled: enabled(formData.get("enabled")),
  };
  const { error } = data.id
    ? await supabase.from("offers").update(payload).eq("id", data.id)
    : await supabase.from("offers").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/offers");
  revalidatePath("/admin");
}

export async function deleteOffer(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("offers").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/offers");
  revalidatePath("/admin");
}

export async function upsertGalleryItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const schema = z.object({
    id: z.string().optional(),
    title: z.string().min(2),
    alt_text: z.string().optional(),
    image_path: z.string().min(2),
    category: z.string().optional(),
    display_order: z.coerce.number().int().default(0),
  });
  const data = schema.parse(Object.fromEntries(formData));
  const uploadedImagePath = await uploadFileToBucket(supabase, "gallery-images", formData.get("image_file"));
  const payload = { ...data, image_path: uploadedImagePath ?? data.image_path, enabled: enabled(formData.get("enabled")) };
  const { error } = data.id
    ? await supabase.from("gallery").update(payload).eq("id", data.id)
    : await supabase.from("gallery").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/gallery");
  revalidatePath("/admin");
}

export async function updateAppointmentStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const status = z.enum(["pending", "confirmed", "completed", "cancelled"]).parse(formData.get("status"));
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateSetting(formData: FormData) {
  const { supabase, userId } = await requireAdmin();
  const key = String(formData.get("key"));
  const value = JSON.parse(String(formData.get("value") || "{}"));
  const { error } = await supabase.from("settings").upsert({ key, value, updated_by: userId });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin");
}

export async function updateBrandAsset(formData: FormData) {
  const { supabase, userId } = await requireAdmin();
  const key = String(formData.get("key") || "brand_assets");
  const assetName = String(formData.get("asset") || "");
  if (!assetName) {
    throw new Error("Asset slot is required.");
  }

  const uploadedImagePath = await uploadFileToBucket(supabase, "brand-assets", formData.get("image_file"));
  const { data: existingSetting } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  const existingValue = existingSetting?.value && typeof existingSetting.value === "object" ? existingSetting.value : {};
  const currentValue = existingValue as Record<string, unknown>;
  const nextValue = {
    ...currentValue,
    [assetName]: uploadedImagePath ?? String(formData.get("image_path") || currentValue[assetName] || ""),
  };

  const { error } = await supabase.from("settings").upsert({ key, value: nextValue, updated_by: userId });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/offers");
  revalidatePath("/gallery");
  revalidatePath("/contact");
  revalidatePath("/admin");
}

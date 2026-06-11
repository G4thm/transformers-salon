"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

function redirectWithNotice(message: string) {
  redirect(`/admin?notice=${encodeURIComponent(message)}`);
}

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
  redirectWithNotice(data.id ? "Service updated." : "Service created.");
}

export async function deleteService(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/services");
  revalidatePath("/admin");
  redirectWithNotice("Service deleted.");
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
  redirectWithNotice(data.id ? "Offer updated." : "Offer created.");
}

export async function deleteOffer(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("offers").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/offers");
  revalidatePath("/admin");
  redirectWithNotice("Offer deleted.");
}

export async function upsertGalleryItem(formData: FormData) {
  const { supabase } = await requireAdmin();

  // Support multi-file upload: process each file in image_files[], or fall back to single image_file
  const files = formData.getAll("image_files[]").filter((f): f is File => f instanceof File && f.size > 0);
  const singleFile = formData.get("image_file");
  const allFiles = files.length > 0 ? files : (singleFile instanceof File && singleFile.size > 0 ? [singleFile] : []);

  const id = formData.get("id") ? String(formData.get("id")) : undefined;
  const category = String(formData.get("category") || "").trim();
  const display_order = Number(formData.get("display_order") || 0);
  const alt_text = String(formData.get("alt_text") || "").trim();
  const enabled_val = enabled(formData.get("enabled"));

  if (allFiles.length > 1) {
    // Bulk insert multiple images
    for (const file of allFiles) {
      const uploadedPath = await uploadFileToBucket(supabase, "gallery-images", file);
      if (!uploadedPath) continue;
      const autoTitle = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      const { error } = await supabase.from("gallery").insert({
        title: autoTitle,
        alt_text: autoTitle,
        image_path: uploadedPath,
        category: category || null,
        display_order,
        enabled: enabled_val,
      });
      if (error) throw new Error(error.message);
    }
    revalidatePath("/gallery");
    revalidatePath("/admin");
    redirectWithNotice(`${allFiles.length} gallery images added.`);
  }

  // Single image or update
  const imageFile = allFiles[0] ?? null;
  const uploadedImagePath = await uploadFileToBucket(supabase, "gallery-images", imageFile);

  // For updates, image_path can come from existing record; for new uploads without a file, require path
  const rawPath = String(formData.get("image_path") || "").trim();
  const finalPath = uploadedImagePath ?? (rawPath || null);
  if (!finalPath) throw new Error("An image file is required.");

  const rawTitle = String(formData.get("title") || "").trim();
  const autoTitle = imageFile ? imageFile.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") : rawTitle;
  const title = rawTitle || autoTitle || "Gallery image";

  const payload = { title, alt_text, image_path: finalPath, category: category || null, display_order, enabled: enabled_val };
  const { error } = id
    ? await supabase.from("gallery").update(payload).eq("id", id)
    : await supabase.from("gallery").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/gallery");
  revalidatePath("/admin");
  redirectWithNotice(id ? "Gallery image updated." : "Gallery image added.");
}

export async function deleteGalleryItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));

  // Fetch the image path so we can delete from storage too
  const { data: item } = await supabase.from("gallery").select("image_path").eq("id", id).maybeSingle();
  if (item?.image_path) {
    // Extract the storage key from the public URL (everything after /object/public/)
    const match = item.image_path.match(/\/object\/public\/(.+)$/);
    const storagePath = match ? match[1] : null;
    if (storagePath) {
      const bucket = storagePath.split("/")[0];
      const filePath = storagePath.slice(bucket.length + 1);
      await supabase.storage.from(bucket).remove([filePath]);
    }
  }

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/gallery");
  revalidatePath("/admin");
  redirectWithNotice("Gallery image deleted.");
}

export async function updateAppointmentStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const status = z.enum(["pending", "confirmed", "completed", "cancelled"]).parse(formData.get("status"));
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  redirectWithNotice("Appointment status saved.");
}

export async function deleteAppointment(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  redirectWithNotice("Appointment removed.");
}

export async function purgeOldAppointments(formData: FormData) {
  void formData; // no fields needed, admin-only cleanup
  const { supabase } = await requireAdmin();

  // Delete cancelled/completed rows older than 48 hours OR if total > 50, delete oldest finished ones
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase
    .from("appointments")
    .delete()
    .in("status", ["cancelled", "completed"])
    .lt("created_at", cutoff);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  redirectWithNotice("Old appointments cleared.");
}

export async function updateSetting(formData: FormData) {
  const { supabase, userId } = await requireAdmin();
  const key = String(formData.get("key"));
  const rawValue = String(formData.get("value") || "").trim();
  const value = rawValue
    ? JSON.parse(rawValue)
    : {
        phonePrimary: String(formData.get("phonePrimary") || "").trim(),
        phoneSecondary: String(formData.get("phoneSecondary") || "").trim(),
        whatsapp: String(formData.get("whatsapp") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        instagram: String(formData.get("instagram") || "").trim(),
        address: String(formData.get("address") || "").trim(),
        mapsQuery: String(formData.get("mapsQuery") || "").trim(),
        businessHours: [
          {
            day: String(formData.get("businessHoursDay1") || "").trim(),
            hours: String(formData.get("businessHoursHours1") || "").trim(),
          },
          {
            day: String(formData.get("businessHoursDay2") || "").trim(),
            hours: String(formData.get("businessHoursHours2") || "").trim(),
          },
        ].filter((row) => row.day && row.hours),
      };
  const { error } = await supabase.from("settings").upsert({ key, value, updated_by: userId });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin");
  redirectWithNotice("Contact settings saved.");
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
  redirectWithNotice("Brand asset saved.");
}

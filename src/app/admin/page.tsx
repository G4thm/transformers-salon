import type { LucideIcon } from "lucide-react";
import { CalendarCheck, Gift, Images, Layers3, Save, Trash2 } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import {
  deleteOffer,
  deleteService,
  updateAppointmentStatus,
  updateBrandAsset,
  updateSetting,
  upsertGalleryItem,
  upsertOffer,
  upsertService,
} from "@/app/actions/admin";
import { AdminActionNotice } from "@/components/admin-action-notice";
import { ImageCropField } from "@/components/image-crop-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminModal } from "@/components/admin-modal";
import { brand, brandAssets } from "@/data/brand";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Admin Dashboard" };

async function getDashboardData() {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      categories: [],
      services: [],
      offers: [],
      gallery: [],
      appointments: [],
      settings: [],
    };
  }

  const supabase = await createClient();
  const [{ data: categories }, { data: services }, { data: offers }, { data: gallery }, { data: appointments }, { data: settings }] =
    await Promise.all([
      supabase.from("service_categories").select("id, name, slug, description, display_order, enabled").order("display_order"),
      supabase
        .from("services")
        .select("id, category_id, name, slug, description, image_path, enabled, display_order, service_categories(name)")
        .order("display_order"),
      supabase.from("offers").select("id, title, description, image_path, expires_at, enabled, created_at").order("created_at", { ascending: false }),
      supabase.from("gallery").select("id, title, alt_text, image_path, category, enabled, display_order").order("display_order"),
      supabase
        .from("appointments")
        .select("id, customer_name, phone, service_name, appointment_date, appointment_time, status")
        .order("appointment_date", { ascending: true }),
      supabase.from("settings").select("key, value").order("key"),
    ]);

  return {
    configured: true,
    categories: categories ?? [],
    services: services ?? [],
    offers: offers ?? [],
    gallery: gallery ?? [],
    appointments: appointments ?? [],
    settings: settings ?? [],
  };
}

export default async function AdminPage() {
  const data = await getDashboardData();
  const contactSettings = data.settings.find((setting) => setting.key === "contact");
  const assetSettings = data.settings.find((setting) => setting.key === "brand_assets");
  const contactValue = contactSettings?.value ?? {
    phonePrimary: brand.phonePrimary,
    phoneSecondary: brand.phoneSecondary,
    whatsapp: brand.whatsapp,
    email: brand.email,
    instagram: brand.instagram,
    address: brand.address,
    businessHours: [],
  };
  const assetValue = assetSettings?.value && typeof assetSettings.value === "object" ? assetSettings.value : brandAssets;

  if (!data.configured) {
    return (
      <AdminFrame>
        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle>Supabase is not connected</CardTitle>
            <CardDescription>Add the environment variables from `DEPLOYMENT.md`, run `supabase/schema.sql`, then sign in again.</CardDescription>
          </CardHeader>
        </Card>
      </AdminFrame>
    );
  }

  return (
    <AdminFrame>
      <AdminActionNotice />

      {/* Stat cards */}
      <section className="grid gap-4 md:grid-cols-4">
        {(
          [
            ["Services", data.services.length, Layers3, "bg-orange-500/15 text-orange-500"],
            ["Offers", data.offers.length, Gift, "bg-purple-500/15 text-purple-500"],
            ["Gallery", data.gallery.length, Images, "bg-sky-500/15 text-sky-500"],
            ["Appointments", data.appointments.filter((a) => a.status !== "cancelled").length, CalendarCheck, "bg-emerald-500/15 text-emerald-500"],
          ] as Array<[string, number, LucideIcon, string]>
        ).map(([label, count, Icon, iconClass]) => (
          <Card key={String(label)} className="rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{String(label)}</p>
                <p className="text-3xl font-black">{String(count)}</p>
              </div>
              <span className={`flex size-12 items-center justify-center rounded-xl ${iconClass}`}>
                <Icon className="size-5" aria-hidden />
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Appointments */}
      <DashboardSection title="Appointments" description="Confirm, complete, or cancel requests from the booking form.">
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-190 text-sm">
            <thead className="border-b bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.appointments.map((appointment, index) => (
                <tr
                  key={appointment.id}
                  className={`border-t transition-colors hover:bg-orange-50/40 dark:hover:bg-orange-900/10 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                >
                  <td className="px-4 py-3 font-semibold">{appointment.customer_name}</td>
                  <td className="px-4 py-3">{appointment.phone}</td>
                  <td className="px-4 py-3">{appointment.service_name}</td>
                  <td className="px-4 py-3">
                    {appointment.appointment_date} {appointment.appointment_time}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      appointment.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : appointment.status === "completed"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                        : appointment.status === "cancelled"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateAppointmentStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={appointment.id} />
                      <select
                        name="status"
                        defaultValue={appointment.status}
                        className="h-9 rounded-md border bg-background px-2 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                      <Button size="sm" type="submit" variant="outline" className="gap-1">
                        <Save className="size-3.5" />
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Services */}
      <DashboardSection title="Services" description="Add, edit, disable, delete, and attach images to services.">
        {/* Add Service Modal — compact form */}
        <AdminModal triggerLabel="Add service" title="New service" description="Create a service for the public menu.">
          <form action={upsertService} encType="multipart/form-data" className="mx-auto max-w-[900px]">
            <div className="grid gap-5 rounded-xl border bg-muted/30 p-5 shadow-sm lg:grid-cols-[1fr_260px]">
              {/* Left — text fields 60% */}
              <div className="grid gap-4">
                {/* Row 1: Category | Service Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm font-semibold">
                    Category
                    <select
                      name="category_id"
                      required
                      className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {data.categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm font-semibold">
                    Service Name
                    <Input name="name" placeholder="e.g. Haircuts" required />
                  </label>
                </div>
                {/* Row 2: URL Name */}
                <label className="grid gap-1 text-sm font-semibold">
                  URL Name
                  <Input name="slug" placeholder="e.g. haircuts" required />
                  <span className="text-xs font-normal text-muted-foreground">No spaces allowed.</span>
                </label>
                {/* Row 3: Description */}
                <label className="grid gap-1 text-sm font-semibold">
                  Description
                  <Textarea name="description" placeholder="Short description shown to customers" rows={3} />
                </label>
                {/* Row 4: Display Order | Visible toggle */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm font-semibold">
                    Display Order
                    <Input name="display_order" type="number" defaultValue="0" placeholder="0" />
                    <span className="text-xs font-normal text-muted-foreground">Lower number shows first</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-background p-3 text-sm font-semibold">
                    <span className="flex-1">Visible on website</span>
                    <input name="enabled" type="checkbox" defaultChecked className="size-5 accent-primary" />
                  </label>
                </div>
              </div>

              {/* Right — image 260px constrained with overflow hidden */}
              <div className="flex flex-col gap-2 overflow-hidden" style={{ maxWidth: "260px", width: "100%" }}>
                <p className="text-sm font-semibold">Image</p>
                <ImageCropField label="Service image" aspect={5 / 3} helperText="Crop before saving." />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <Button type="submit" size="sm" className="gap-1">
                <Save className="size-3.5" />
                Add service
              </Button>
            </div>
          </form>
        </AdminModal>

        {/* Existing services list */}
        <div className="grid gap-4">
          {data.services.map((item) => (
            <Card key={item.id} className="rounded-xl shadow-md">
              <CardContent className="flex flex-col gap-4 p-4">
                <form action={upsertService} encType="multipart/form-data">
                  <input type="hidden" name="id" value={item.id} />
                  <div className="grid gap-5 rounded-xl border bg-muted/30 p-4 shadow-sm lg:grid-cols-[1fr_260px]">
                    <div className="grid gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-1 text-sm font-semibold">
                          Category
                          <select
                            name="category_id"
                            defaultValue={item.category_id}
                            required
                            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {data.categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-1 text-sm font-semibold">
                          Service Name
                          <Input name="name" defaultValue={item.name} placeholder="e.g. Haircuts" required />
                        </label>
                      </div>
                      <label className="grid gap-1 text-sm font-semibold">
                        URL Name
                        <Input name="slug" defaultValue={item.slug} placeholder="e.g. haircuts" required />
                        <span className="text-xs font-normal text-muted-foreground">No spaces allowed.</span>
                      </label>
                      <label className="grid gap-1 text-sm font-semibold">
                        Description
                        <Textarea
                          name="description"
                          defaultValue={item.description ?? ""}
                          placeholder="Short description shown to customers"
                          rows={3}
                        />
                      </label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-1 text-sm font-semibold">
                          Display Order
                          <Input name="display_order" type="number" defaultValue={String(item.display_order)} />
                          <span className="text-xs font-normal text-muted-foreground">Lower number shows first</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-background p-3 text-sm font-semibold">
                          <span className="flex-1">Visible on website</span>
                          <input name="enabled" type="checkbox" defaultChecked={item.enabled} className="size-5 accent-primary" />
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 overflow-hidden" style={{ maxWidth: "260px", width: "100%" }}>
                      <p className="text-sm font-semibold">Image</p>
                      <ImageCropField
                        label="Service image"
                        currentImageUrl={item.image_path ?? undefined}
                        aspect={5 / 3}
                        helperText="Pick a new file or keep existing."
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-3">
                    <Button type="submit" size="sm" className="gap-1">
                      <Save className="size-3.5" />
                      Save service
                    </Button>
                  </div>
                </form>
                <form action={deleteService} className="self-start">
                  <input type="hidden" name="id" value={item.id} />
                  <Button type="submit" size="sm" variant="destructive" className="gap-1">
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardSection>

      {/* Offers */}
      <DashboardSection title="Offers" description="Create campaigns with expiry dates and enabled states. Prices stay out of public UI.">
        <AdminModal triggerLabel="Add offer" title="New offer" description="Create a campaign card with a preview image and optional expiry date.">
          <form action={upsertOffer} className="grid gap-4 lg:grid-cols-5" encType="multipart/form-data">
            <Input name="title" placeholder="Offer title" required />
            <div className="lg:col-span-2">
              <ImageCropField label="Upload and crop offer image" currentImageUrl={undefined} aspect={16 / 9} helperText="Crop the banner image before it saves to storage." />
            </div>
            <Input name="expires_at" type="date" />
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input name="enabled" type="checkbox" defaultChecked />
              Enabled
            </label>
            <Button type="submit">Add offer</Button>
            <Textarea name="description" placeholder="Offer description" className="lg:col-span-5" />
          </form>
        </AdminModal>
        <div className="grid gap-4">
          {data.offers.map((item, index) => (
            <Card key={item.id} className={`rounded-xl shadow-md ${index % 2 === 0 ? "" : "bg-muted/20"}`}>
              <CardContent className="flex flex-col gap-4 p-4">
                <form action={upsertOffer} className="grid gap-4 lg:grid-cols-5" encType="multipart/form-data">
                  <input type="hidden" name="id" value={item.id} />
                  <Input name="title" defaultValue={item.title} placeholder="Offer title" required />
                  <div className="lg:col-span-2">
                    <ImageCropField
                      label="Replace offer image"
                      currentImageUrl={item.image_path ?? undefined}
                      aspect={16 / 9}
                      helperText="Pick a new banner crop or keep the current image."
                    />
                  </div>
                  <Input name="expires_at" type="date" defaultValue={item.expires_at ? String(item.expires_at).slice(0, 10) : ""} />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input name="enabled" type="checkbox" defaultChecked={item.enabled} />
                    Enabled
                  </label>
                  <Textarea name="description" defaultValue={item.description ?? ""} placeholder="Offer description" className="lg:col-span-5" />
                  <div className="lg:col-span-5">
                    <Button type="submit" size="sm" className="gap-1">
                      <Save className="size-3.5" />
                      Save offer
                    </Button>
                  </div>
                </form>
                <form action={deleteOffer} className="self-start">
                  <input type="hidden" name="id" value={item.id} />
                  <Button type="submit" size="sm" variant="destructive" className="gap-1">
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardSection>

      {/* Gallery */}
      <DashboardSection title="Gallery" description="Upload images to Supabase Storage, then manage gallery records here.">
        <AdminModal triggerLabel="Add gallery image" title="New gallery image" description="Upload an image and choose how it appears in the gallery grid.">
          <form action={upsertGalleryItem} className="grid gap-4 lg:grid-cols-6" encType="multipart/form-data">
            <Input name="title" placeholder="Image title" required />
            <Input name="image_path" placeholder="Storage image path" required />
            <div className="lg:col-span-2">
              <ImageCropField label="Upload and crop gallery image" currentImageUrl={undefined} aspect={1} helperText="Crop the image to fit the gallery tile." required />
            </div>
            <Input name="category" placeholder="Category" />
            <Input name="display_order" type="number" defaultValue="0" />
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input name="enabled" type="checkbox" defaultChecked />
              Enabled
            </label>
            <Button type="submit">Add image</Button>
            <Textarea name="alt_text" placeholder="Alt text" className="lg:col-span-6" />
          </form>
        </AdminModal>
        <div className="grid gap-4">
          {data.gallery.map((item, index) => (
            <Card key={item.id} className={`rounded-xl shadow-md ${index % 2 === 0 ? "" : "bg-muted/20"}`}>
              <CardContent className="flex flex-col gap-4 p-4">
                <form action={upsertGalleryItem} className="grid gap-4 lg:grid-cols-6" encType="multipart/form-data">
                  <input type="hidden" name="id" value={item.id} />
                  <Input name="title" defaultValue={item.title} placeholder="Image title" required />
                  <Input name="image_path" defaultValue={item.image_path} placeholder="Storage image path" required />
                  <div className="lg:col-span-2">
                    <ImageCropField
                      label="Replace gallery image"
                      currentImageUrl={item.image_path}
                      aspect={1}
                      helperText="Pick a new image crop or keep the current image."
                    />
                  </div>
                  <Input name="category" defaultValue={item.category ?? ""} placeholder="Category" />
                  <Input name="display_order" type="number" defaultValue={String(item.display_order)} />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input name="enabled" type="checkbox" defaultChecked={item.enabled} />
                    Enabled
                  </label>
                  <Button type="submit" size="sm" className="gap-1">
                    <Save className="size-3.5" />
                    Save image
                  </Button>
                  <Textarea name="alt_text" defaultValue={item.alt_text ?? ""} placeholder="Alt text" className="lg:col-span-6" />
                </form>
                <form action={upsertGalleryItem} className="self-start">
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="title" value={item.title} />
                  <input type="hidden" name="image_path" value={item.image_path} />
                  <input type="hidden" name="category" value={item.category ?? ""} />
                  <input type="hidden" name="display_order" value={String(item.display_order)} />
                  <input type="hidden" name="alt_text" value={item.alt_text ?? ""} />
                  <input type="hidden" name="enabled" value={item.enabled ? "on" : ""} />
                  <Button type="submit" size="sm" variant="outline">
                    Re-save
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardSection>

      {/* Settings */}
      <DashboardSection title="Settings" description="Update contact information, hours, social links, and WhatsApp configuration.">
        <form action={updateSetting} className="grid gap-4">
          <input type="hidden" name="key" value="contact" />
          <div className="grid gap-4 lg:grid-cols-2">
            <Input name="phonePrimary" defaultValue={contactValue.phonePrimary} placeholder="Primary phone" />
            <Input name="phoneSecondary" defaultValue={contactValue.phoneSecondary} placeholder="Secondary phone" />
            <Input name="whatsapp" defaultValue={contactValue.whatsapp} placeholder="WhatsApp number" />
            <Input name="email" defaultValue={contactValue.email} placeholder="Email address" />
            <Input name="instagram" defaultValue={contactValue.instagram} placeholder="Instagram handle" />
            <Input name="mapsQuery" defaultValue={contactValue.mapsQuery} placeholder="Google Maps search text" />
            <Textarea name="address" defaultValue={contactValue.address} placeholder="Salon address" className="lg:col-span-2" />
          </div>
          <div className="grid gap-4 rounded-xl border bg-background/60 p-4">
            <div>
              <p className="font-semibold">Business hours</p>
              <p className="text-sm text-muted-foreground">Enter the opening schedule shown on the contact page and footer.</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <Input name="businessHoursDay1" defaultValue={contactValue.businessHours[0]?.day ?? ""} placeholder="Day label" />
              <Input name="businessHoursHours1" defaultValue={contactValue.businessHours[0]?.hours ?? ""} placeholder="Hours" />
              <Input name="businessHoursDay2" defaultValue={contactValue.businessHours[1]?.day ?? ""} placeholder="Day label" />
              <Input name="businessHoursHours2" defaultValue={contactValue.businessHours[1]?.hours ?? ""} placeholder="Hours" />
            </div>
          </div>
          <Button type="submit" className="w-fit gap-1">
            <Save className="size-4" />
            Save contact settings
          </Button>
        </form>
      </DashboardSection>

      {/* Brand Assets */}
      <DashboardSection title="Brand Assets" description="Upload the fox identity images and choose the page slot they should appear in.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { asset: "foxLogo", label: "Header logo", hint: "Top-left navigation mark", preview: assetValue.foxLogo ?? brandAssets.foxLogo },
            { asset: "mascot", label: "Hero mascot", hint: "Main homepage character image", preview: assetValue.mascot ?? brandAssets.mascot },
            { asset: "grandOpening", label: "Offer feature image", hint: "Homepage and offers spotlight", preview: assetValue.grandOpening ?? brandAssets.grandOpening },
            { asset: "contactCard", label: "Contact panel", hint: "Contact page display image", preview: assetValue.contactCard ?? brandAssets.contactCard },
            { asset: "logoWide", label: "Wordmark banner", hint: "Wide logo usage and promo art", preview: assetValue.logoWide ?? brandAssets.logoWide },
          ].map((slot) => (
            <Card key={slot.asset} className="rounded-xl shadow-md">
              <CardContent className="flex flex-col gap-4 p-4">
                <div>
                  <p className="font-semibold">{slot.label}</p>
                  <p className="text-xs text-muted-foreground">{slot.hint}</p>
                </div>
                <AdminModal triggerLabel="Edit slot" title={slot.label} description={slot.hint}>
                  <form action={updateBrandAsset} className="grid gap-3" encType="multipart/form-data">
                    <input type="hidden" name="key" value="brand_assets" />
                    <input type="hidden" name="asset" value={slot.asset} />
                    <Input name="image_path" defaultValue={String(slot.preview)} placeholder="Public image URL or storage path" />
                    <ImageCropField
                      label={`Replace ${slot.label.toLowerCase()}`}
                      currentImageUrl={String(slot.preview)}
                      aspect={16 / 9}
                      helperText="Crop the asset before saving it to the selected slot."
                    />
                    <Button type="submit" className="gap-1">
                      <Save className="size-4" />
                      Save slot
                    </Button>
                  </form>
                </AdminModal>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardSection>

      {/* Future Modules */}
      <DashboardSection title="Future Modules" description="Architecture placeholders for the next operational layers.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Billing Dashboard",
            "Invoice Generation",
            "Customer Management",
            "Loyalty Rewards",
            "Inventory Management",
            "Staff Attendance",
            "Multi Branch Support",
          ].map((module) => (
            <div key={module} className="rounded-xl border bg-background/70 p-4 text-sm font-semibold">
              {module}
            </div>
          ))}
        </div>
      </DashboardSection>
    </AdminFrame>
  );
}

function AdminFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Orange left border accent */}
            <div className="h-8 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgb(249_115_22_/_60%)]" />
            <div>
              <p className="brand-wordmark text-2xl">Transformers Admin</p>
              <p className="text-xs text-muted-foreground">Services · Offers · Gallery · Appointments · Settings</p>
            </div>
          </div>
          <form action={signOut}>
            <Button variant="outline" size="sm" type="submit" className="rounded-full">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

function DashboardSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgb(249_115_22_/_50%)]" />
          <CardTitle className="text-xl font-black">{title}</CardTitle>
        </div>
        <CardDescription className="ml-[1.375rem]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pt-5">{children}</CardContent>
    </Card>
  );
}

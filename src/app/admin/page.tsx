import type { LucideIcon } from "lucide-react";
import { CalendarCheck, Gift, Images, Layers3 } from "lucide-react";
import Image from "next/image";
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
      supabase.from("service_categories").select("*").order("display_order"),
      supabase.from("services").select("*, service_categories(name)").order("display_order"),
      supabase.from("offers").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery").select("*").order("display_order"),
      supabase.from("appointments").select("*").order("appointment_date", { ascending: true }),
      supabase.from("settings").select("*").order("key"),
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
        <Card className="glass">
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
      <section className="grid gap-4 md:grid-cols-4">
        {([
          ["Services", data.services.length, Layers3],
          ["Offers", data.offers.length, Gift],
          ["Gallery", data.gallery.length, Images],
          ["Appointments", data.appointments.length, CalendarCheck],
        ] as Array<[string, number, LucideIcon]>).map(([label, count, Icon]) => (
          <Card key={String(label)} className="glass">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{String(label)}</p>
                <p className="text-3xl font-black">{String(count)}</p>
              </div>
              <Icon className="text-primary" aria-hidden />
            </CardContent>
          </Card>
        ))}
      </section>

      <DashboardSection title="Appointments" description="Confirm, complete, or cancel requests from the booking form.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Service</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t">
                  <td className="p-3 font-semibold">{appointment.customer_name}</td>
                  <td className="p-3">{appointment.phone}</td>
                  <td className="p-3">{appointment.service_name}</td>
                  <td className="p-3">{appointment.appointment_date} {appointment.appointment_time}</td>
                  <td className="p-3 capitalize">{appointment.status}</td>
                  <td className="p-3">
                    <form action={updateAppointmentStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={appointment.id} />
                      <select name="status" defaultValue={appointment.status} className="h-9 rounded-md border bg-background px-2">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                      <Button size="sm" type="submit">Save</Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      <DashboardSection title="Services" description="Add, edit, disable, delete, and attach Storage image paths.">
        <AdminModal triggerLabel="Add service" title="New service" description="Create a service, upload its image, and keep the public page in sync.">
          <form action={upsertService} className="grid gap-4 lg:grid-cols-6" encType="multipart/form-data">
            <select name="category_id" required className="h-11 rounded-md border bg-background px-3 text-sm lg:col-span-1">
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <Input name="name" placeholder="Service name" required className="lg:col-span-1" />
            <Input name="slug" placeholder="service-slug" required className="lg:col-span-1" />
            <Input name="image_path" placeholder="Storage image path" className="lg:col-span-1" />
            <Input name="image_file" type="file" accept="image/*" className="lg:col-span-1" />
            <Input name="display_order" type="number" defaultValue="0" className="lg:col-span-1" />
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input name="enabled" type="checkbox" defaultChecked />
              Enabled
            </label>
            <Textarea name="description" placeholder="Description" className="lg:col-span-5" />
            <Button type="submit">Add service</Button>
          </form>
        </AdminModal>
        <div className="grid gap-4">
          {data.services.map((item) => (
            <Card key={item.id} className="border bg-background/60">
              <CardContent className="flex flex-col gap-4 p-4">
                <form action={upsertService} className="grid gap-4 lg:grid-cols-6" encType="multipart/form-data">
                  <input type="hidden" name="id" value={item.id} />
                  <select name="category_id" defaultValue={item.category_id} required className="h-11 rounded-md border bg-background px-3 text-sm lg:col-span-1">
                    {data.categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <Input name="name" defaultValue={item.name} placeholder="Service name" required className="lg:col-span-1" />
                  <Input name="slug" defaultValue={item.slug} placeholder="service-slug" required className="lg:col-span-1" />
                  <Input name="image_path" defaultValue={item.image_path ?? ""} placeholder="Storage image path" className="lg:col-span-1" />
                  <Input name="image_file" type="file" accept="image/*" className="lg:col-span-1" />
                  <Input name="display_order" type="number" defaultValue={String(item.display_order)} className="lg:col-span-1" />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input name="enabled" type="checkbox" defaultChecked={item.enabled} />
                    Enabled
                  </label>
                  <Textarea name="description" defaultValue={item.description ?? ""} placeholder="Description" className="lg:col-span-5" />
                  <div className="flex flex-col gap-3 lg:col-span-6">
                    {item.image_path ? (
                      <Image src={item.image_path} alt={item.name} width={160} height={96} className="h-24 w-40 rounded-md border object-cover" />
                    ) : null}
                    <Button type="submit">Save service</Button>
                  </div>
                </form>
                <form action={deleteService} className="self-start">
                  <input type="hidden" name="id" value={item.id} />
                  <Button type="submit" size="sm" variant="destructive">Delete</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="Offers" description="Create campaigns with expiry dates and enabled states. Prices stay out of public UI.">
        <AdminModal triggerLabel="Add offer" title="New offer" description="Create a campaign card with a preview image and optional expiry date.">
          <form action={upsertOffer} className="grid gap-4 lg:grid-cols-5" encType="multipart/form-data">
            <Input name="title" placeholder="Offer title" required />
            <Input name="image_path" placeholder="Storage image path" />
            <Input name="image_file" type="file" accept="image/*" />
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
          {data.offers.map((item) => (
            <Card key={item.id} className="border bg-background/60">
              <CardContent className="flex flex-col gap-4 p-4">
                <form action={upsertOffer} className="grid gap-4 lg:grid-cols-5" encType="multipart/form-data">
                  <input type="hidden" name="id" value={item.id} />
                  <Input name="title" defaultValue={item.title} placeholder="Offer title" required />
                  <Input name="image_path" defaultValue={item.image_path ?? ""} placeholder="Storage image path" />
                  <Input name="image_file" type="file" accept="image/*" />
                  <Input name="expires_at" type="date" defaultValue={item.expires_at ? String(item.expires_at).slice(0, 10) : ""} />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input name="enabled" type="checkbox" defaultChecked={item.enabled} />
                    Enabled
                  </label>
                  <Textarea name="description" defaultValue={item.description ?? ""} placeholder="Offer description" className="lg:col-span-5" />
                  <div className="flex flex-col gap-3 lg:col-span-5">
                    {item.image_path ? (
                      <Image src={item.image_path} alt={item.title} width={240} height={135} className="h-28 w-48 rounded-md border object-cover" />
                    ) : null}
                    <Button type="submit">Save offer</Button>
                  </div>
                </form>
                <form action={deleteOffer} className="self-start">
                  <input type="hidden" name="id" value={item.id} />
                  <Button type="submit" size="sm" variant="destructive">Delete</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="Gallery" description="Upload images to Supabase Storage, then manage gallery records here.">
        <AdminModal triggerLabel="Add gallery image" title="New gallery image" description="Upload an image and choose how it appears in the gallery grid.">
          <form action={upsertGalleryItem} className="grid gap-4 lg:grid-cols-6" encType="multipart/form-data">
            <Input name="title" placeholder="Image title" required />
            <Input name="image_path" placeholder="Storage image path" required />
            <Input name="image_file" type="file" accept="image/*" />
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
          {data.gallery.map((item) => (
            <Card key={item.id} className="border bg-background/60">
              <CardContent className="flex flex-col gap-4 p-4">
                <form action={upsertGalleryItem} className="grid gap-4 lg:grid-cols-6" encType="multipart/form-data">
                  <input type="hidden" name="id" value={item.id} />
                  <Input name="title" defaultValue={item.title} placeholder="Image title" required />
                  <Input name="image_path" defaultValue={item.image_path} placeholder="Storage image path" required />
                  <Input name="image_file" type="file" accept="image/*" />
                  <Input name="category" defaultValue={item.category ?? ""} placeholder="Category" />
                  <Input name="display_order" type="number" defaultValue={String(item.display_order)} />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input name="enabled" type="checkbox" defaultChecked={item.enabled} />
                    Enabled
                  </label>
                  <Button type="submit">Save image</Button>
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
                  <Button type="submit" size="sm" variant="outline">Re-save</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="Settings" description="Update contact information, hours, social links, and WhatsApp configuration.">
        <form action={updateSetting} className="grid gap-4">
          <input type="hidden" name="key" value="contact" />
          <Textarea
            name="value"
            defaultValue={JSON.stringify(contactValue, null, 2)}
            className="min-h-52 font-mono text-xs"
          />
          <Button type="submit">Save contact settings</Button>
        </form>
      </DashboardSection>

      <DashboardSection title="Brand Assets" description="Upload the fox identity images and choose the page slot they should appear in.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { asset: "foxLogo", label: "Header logo", hint: "Top-left navigation mark", preview: assetValue.foxLogo ?? brandAssets.foxLogo },
            { asset: "mascot", label: "Hero mascot", hint: "Main homepage character image", preview: assetValue.mascot ?? brandAssets.mascot },
            { asset: "grandOpening", label: "Offer feature image", hint: "Homepage and offers spotlight", preview: assetValue.grandOpening ?? brandAssets.grandOpening },
            { asset: "contactCard", label: "Contact panel", hint: "Contact page display image", preview: assetValue.contactCard ?? brandAssets.contactCard },
            { asset: "logoWide", label: "Wordmark banner", hint: "Wide logo usage and promo art", preview: assetValue.logoWide ?? brandAssets.logoWide },
          ].map((slot) => (
            <Card key={slot.asset} className="border bg-background/60">
              <CardContent className="flex flex-col gap-4 p-4">
                <div>
                  <p className="font-semibold">{slot.label}</p>
                  <p className="text-xs text-muted-foreground">{slot.hint}</p>
                </div>
                <Image src={slot.preview} alt={slot.label} width={640} height={360} className="h-40 w-full rounded-md border object-cover" />
                <AdminModal triggerLabel="Edit slot" title={slot.label} description={slot.hint}>
                  <form action={updateBrandAsset} className="grid gap-3" encType="multipart/form-data">
                    <input type="hidden" name="key" value="brand_assets" />
                    <input type="hidden" name="asset" value={slot.asset} />
                    <Input name="image_path" defaultValue={String(slot.preview)} placeholder="Public image URL or storage path" />
                    <Input name="image_file" type="file" accept="image/*" />
                    <Button type="submit">Save slot</Button>
                  </form>
                </AdminModal>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardSection>

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
            <div key={module} className="rounded-lg border bg-background/70 p-4 text-sm font-semibold">
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
      <header className="border-b bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="brand-wordmark text-2xl">Transformers Admin</p>
            <p className="text-sm text-muted-foreground">Services, offers, gallery, appointments, and settings</p>
          </div>
          <form action={signOut}>
            <Button variant="outline" type="submit">Sign out</Button>
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
    <Card className="glass">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">{children}</CardContent>
    </Card>
  );
}


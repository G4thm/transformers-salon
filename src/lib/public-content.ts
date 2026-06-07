import { brand, brandAssets, businessHours, gallery as staticGallery, offers as staticOffers, serviceCategories as staticCategories, services as staticServices } from "@/data/brand";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type PublicContact = {
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  email: string;
  instagram: string;
  address: string;
  mapsQuery: string;
  businessHours: typeof businessHours;
};

export type PublicServiceCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  displayOrder: number;
};

export type PublicService = {
  id: string;
  category: string;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  imagePath?: string | null;
  enabled: boolean;
  displayOrder: number;
};

export type PublicOffer = {
  id: string;
  title: string;
  description: string;
  expiryLabel: string;
  image: string;
  enabled: boolean;
};

export type PublicGalleryItem = {
  id: string;
  title: string;
  image: string;
  category: string;
  altText: string;
  enabled: boolean;
  displayOrder: number;
};

export type PublicContent = {
  contact: PublicContact;
  assets: typeof brandAssets;
  categories: PublicServiceCategory[];
  services: PublicService[];
  offers: PublicOffer[];
  gallery: PublicGalleryItem[];
};

const fallbackContent: PublicContent = {
  contact: {
    phonePrimary: brand.phonePrimary,
    phoneSecondary: brand.phoneSecondary,
    whatsapp: brand.whatsapp,
    email: brand.email,
    instagram: brand.instagram,
    address: brand.address,
    mapsQuery: brand.mapsQuery,
    businessHours,
  },
  assets: brandAssets,
  categories: staticCategories.map((category, index) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.id,
    displayOrder: index + 1,
  })),
  services: staticServices.map((service, index) => ({
    id: service.id,
    category: service.category,
    categoryName: service.category === "men" ? "Men" : "Women",
    name: service.name,
    slug: service.id,
    description: service.description,
    imagePath: null,
    enabled: true,
    displayOrder: index + 1,
  })),
  offers: staticOffers.map((offer) => ({
    id: offer.id,
    title: offer.title,
    description: offer.description,
    expiryLabel: offer.expiryLabel,
    image: offer.image,
    enabled: true,
  })),
  gallery: staticGallery.map((item, index) => ({
    id: item.id,
    title: item.title,
    image: item.image,
    category: item.category,
    altText: item.title,
    enabled: true,
    displayOrder: index + 1,
  })),
};

function getContactValue(value: unknown): PublicContact {
  if (!value || typeof value !== "object") {
    return fallbackContent.contact;
  }

  const record = value as Record<string, unknown>;
  const businessHoursValue = Array.isArray(record.businessHours)
    ? record.businessHours
        .map((entry) => {
          if (!entry || typeof entry !== "object") {
            return null;
          }

          const row = entry as Record<string, unknown>;
          const day = typeof row.day === "string" ? row.day : "";
          const hours = typeof row.hours === "string" ? row.hours : "";
          if (!day || !hours) {
            return null;
          }

          return { day, hours };
        })
        .filter((entry): entry is { day: string; hours: string } => Boolean(entry))
    : fallbackContent.contact.businessHours;

  return {
    phonePrimary: typeof record.phonePrimary === "string" && record.phonePrimary ? record.phonePrimary : fallbackContent.contact.phonePrimary,
    phoneSecondary: typeof record.phoneSecondary === "string" && record.phoneSecondary ? record.phoneSecondary : fallbackContent.contact.phoneSecondary,
    whatsapp: typeof record.whatsapp === "string" && record.whatsapp ? record.whatsapp : fallbackContent.contact.whatsapp,
    email: typeof record.email === "string" && record.email ? record.email : fallbackContent.contact.email,
    instagram: typeof record.instagram === "string" && record.instagram ? record.instagram : fallbackContent.contact.instagram,
    address: typeof record.address === "string" && record.address ? record.address : fallbackContent.contact.address,
    mapsQuery: typeof record.mapsQuery === "string" && record.mapsQuery ? record.mapsQuery : fallbackContent.contact.mapsQuery,
    businessHours: businessHoursValue,
  };
}

function getAssetsValue(value: unknown): typeof brandAssets {
  if (!value || typeof value !== "object") {
    return brandAssets;
  }

  const record = value as Record<string, unknown>;
  return {
    logoWide: typeof record.logoWide === "string" && record.logoWide ? record.logoWide : brandAssets.logoWide,
    mascot: typeof record.mascot === "string" && record.mascot ? record.mascot : brandAssets.mascot,
    foxLogo: typeof record.foxLogo === "string" && record.foxLogo ? record.foxLogo : brandAssets.foxLogo,
    grandOpening: typeof record.grandOpening === "string" && record.grandOpening ? record.grandOpening : brandAssets.grandOpening,
    contactCard: typeof record.contactCard === "string" && record.contactCard ? record.contactCard : brandAssets.contactCard,
  };
}

function resolveImageSource(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  path: string | null | undefined,
  fallback: string,
) {
  if (!path) {
    return fallback;
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl || fallback;
}

function resolveOfferExpiry(expiresAt: string | null | undefined) {
  if (!expiresAt) {
    return "Ask in salon";
  }

  const formatted = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(expiresAt));

  return `Valid until ${formatted}`;
}

export async function getPublicContent(): Promise<PublicContent> {
  if (!isSupabaseConfigured()) {
    return fallbackContent;
  }

  try {
    const supabase = await createClient();
    const [categoriesResult, servicesResult, offersResult, galleryResult, settingsResult, assetsResult] = await Promise.all([
      supabase.from("service_categories").select("id, name, slug, description, display_order, enabled").order("display_order"),
      supabase
        .from("services")
        .select("id, category_id, name, slug, description, image_path, enabled, display_order, service_categories(id, name, slug)")
        .order("display_order"),
      supabase.from("offers").select("id, title, description, image_path, expires_at, enabled, created_at").order("created_at", { ascending: false }),
      supabase.from("gallery").select("id, title, alt_text, image_path, category, enabled, display_order").order("display_order"),
      supabase.from("settings").select("key, value").eq("key", "contact").maybeSingle(),
      supabase.from("settings").select("key, value").eq("key", "brand_assets").maybeSingle(),
    ]);

    const categories =
      categoriesResult.data?.filter((category) => category.enabled).map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description ?? "",
        slug: category.slug,
        displayOrder: category.display_order,
      })) ?? fallbackContent.categories;

    const services =
      servicesResult.data?.filter((service) => service.enabled).map((service) => ({
        id: service.id,
        category: (service.service_categories as { slug?: string; name?: string } | null | undefined)?.slug ?? "men",
        categoryName: (service.service_categories as { slug?: string; name?: string } | null | undefined)?.name ?? "Salon",
        name: service.name,
        slug: service.slug,
        description: service.description ?? "",
        imagePath: service.image_path,
        enabled: service.enabled,
        displayOrder: service.display_order,
      })) ?? fallbackContent.services;

    const offers =
      offersResult.data?.filter((offer) => offer.enabled).map((offer) => ({
        id: offer.id,
        title: offer.title,
        description: offer.description ?? "",
        expiryLabel: resolveOfferExpiry(offer.expires_at),
        image: resolveImageSource(supabase, "offer-images", offer.image_path, brandAssets.grandOpening),
        enabled: offer.enabled,
      })) ?? fallbackContent.offers;

    const gallery =
      galleryResult.data?.filter((item) => item.enabled).map((item) => ({
        id: item.id,
        title: item.title,
        image: resolveImageSource(supabase, "gallery-images", item.image_path, brandAssets.mascot),
        category: item.category ?? "Gallery",
        altText: item.alt_text ?? item.title,
        enabled: item.enabled,
        displayOrder: item.display_order,
      })) ?? fallbackContent.gallery;

    return {
      contact: getContactValue(settingsResult.data?.value),
      assets: getAssetsValue(assetsResult.data?.value),
      categories,
      services,
      offers,
      gallery,
    };
  } catch {
    return fallbackContent;
  }
}
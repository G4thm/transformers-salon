import Link from "next/link";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { brand } from "@/data/brand";
import { getPublicContent } from "@/lib/public-content";

export async function SiteFooter() {
  const { contact } = await getPublicContent();

  return (
    <footer className="border-t bg-card/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-3">
          <p className="brand-wordmark text-2xl">{brand.fullName}</p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">{brand.promise}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <a className="flex items-center gap-2 hover:text-primary" href={`tel:${contact.phonePrimary}`}>
            <Phone data-icon="inline-start" />
            {contact.phonePrimary} / {contact.phoneSecondary}
          </a>
          <a className="flex items-center gap-2 hover:text-primary" href={`mailto:${contact.email}`}>
            <Mail data-icon="inline-start" />
            {contact.email}
          </a>
          <a className="flex items-center gap-2 hover:text-primary" href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
            <AtSign data-icon="inline-start" />
            {contact.instagram}
          </a>
        </div>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <MapPin data-icon="inline-start" />
            <span>{contact.address}</span>
          </p>
          <Link className="font-semibold text-foreground hover:text-primary" href="/login">
            Admin login
          </Link>
        </div>
      </div>
    </footer>
  );
}

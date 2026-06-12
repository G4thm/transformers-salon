import { getPublicContent } from "@/lib/public-content";
import { HeaderContent } from "@/components/header-content";

export async function SiteHeader() {
  const { contact, assets } = await getPublicContent();
  return (
    <HeaderContent
      phonePrimary={contact.phonePrimary}
      foxLogo={assets.foxLogo}
    />
  );
}

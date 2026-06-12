import { getPublicContent } from "@/lib/public-content";
import { HeroInner } from "@/components/hero-inner";

export async function Hero() {
  const { contact, assets } = await getPublicContent();
  return <HeroInner phonePrimary={contact.phonePrimary} mascot={assets.mascot} />;
}

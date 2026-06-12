import Image from "next/image";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";
import { brandAssets } from "@/data/brand";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect(params.next ?? "/admin");
  }

  return (
    <PageShell>
      <section className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative min-h-[420px]">
          <Image src={brandAssets.mascot} alt="Transformers fox mascot" fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-contain" priority />
        </div>
        <Card className="glass">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Secure Supabase Auth access for salon dashboard management.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm next={params.next ?? "/admin"} error={params.error} supabaseReady={isSupabaseConfigured()} />
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}

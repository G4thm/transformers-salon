import Image from "next/image";
import { redirect } from "next/navigation";
import { signIn } from "@/app/actions/auth";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
          <Image src={brandAssets.mascot} alt="Transformers fox mascot" fill sizes="50vw" className="object-contain" priority />
        </div>
        <Card className="glass">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Secure Supabase Auth access for salon dashboard management.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signIn} className="grid gap-4">
              <input type="hidden" name="next" value={params.next ?? "/admin"} />
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <Input name="email" type="email" required placeholder="admin@example.com" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Password
                <Input name="password" type="password" required placeholder="Password" />
              </label>
              {params.error ? <p className="text-sm font-semibold text-destructive">{params.error}</p> : null}
              {!isSupabaseConfigured() ? (
                <p className="text-sm text-muted-foreground">Set Supabase environment variables before using login.</p>
              ) : null}
              <Button type="submit">Sign in</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}

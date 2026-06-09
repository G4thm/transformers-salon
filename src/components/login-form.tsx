"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ next, error, supabaseReady = true }: { next: string; error?: string; supabaseReady?: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      void signIn(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="grid gap-2 text-sm font-semibold">
        Email
        <Input name="email" type="email" required placeholder="admin@example.com" autoComplete="email" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Password
        <Input name="password" type="password" required placeholder="Password" autoComplete="current-password" />
      </label>
      {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
      {!supabaseReady ? (
        <p className="text-sm text-muted-foreground">Set Supabase environment variables before using login.</p>
      ) : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

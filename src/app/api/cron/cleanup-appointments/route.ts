import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET /api/cron/cleanup-appointments
 *
 * Called by Vercel Cron every 12 hours.
 * Deletes cancelled/completed appointments older than 48 hours,
 * OR if total row count > 50, deletes the oldest finished rows until under limit.
 *
 * Secured with Authorization: Bearer <CRON_SECRET> env var.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // 1. Delete cancelled/completed older than 48h
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { error: ageError, count: ageCount } = await supabase
    .from("appointments")
    .delete({ count: "exact" })
    .in("status", ["cancelled", "completed"])
    .lt("created_at", cutoff);

  if (ageError) {
    return NextResponse.json({ error: ageError.message }, { status: 500 });
  }

  // 2. If still over 50 rows total, trim oldest finished ones
  const LIMIT = 50;
  const { count: total } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true });

  let trimCount = 0;
  if ((total ?? 0) > LIMIT) {
    const overflow = (total ?? 0) - LIMIT;
    const { data: oldest } = await supabase
      .from("appointments")
      .select("id")
      .in("status", ["cancelled", "completed"])
      .order("created_at", { ascending: true })
      .limit(overflow);

    if (oldest && oldest.length > 0) {
      const ids = oldest.map((r) => r.id);
      const { error: trimError } = await supabase
        .from("appointments")
        .delete()
        .in("id", ids);
      if (!trimError) trimCount = ids.length;
    }
  }

  return NextResponse.json({
    ok: true,
    deletedByAge: ageCount ?? 0,
    deletedByLimit: trimCount,
    timestamp: new Date().toISOString(),
  });
}

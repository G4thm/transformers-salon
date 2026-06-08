"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function AdminActionNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const notice = searchParams.get("notice");

  useEffect(() => {
    if (!notice) {
      return;
    }

    toast.success(notice);
    router.replace("/admin");
  }, [notice, router]);

  return null;
}
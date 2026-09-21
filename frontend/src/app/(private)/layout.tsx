"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/features/auth/hooks/use-me";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const query = useMe();
  const router = useRouter();

  useEffect(() => {
    if (query.isError) {
      router.push("/login");
    }
  }, [query.isError, router]);

  if (query.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (query.isError) return null;

  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("reclaim_user");

    if (!user) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}

export default AuthGuard;
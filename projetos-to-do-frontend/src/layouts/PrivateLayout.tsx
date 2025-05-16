"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import { getUserFromToken } from "@/services/authService";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const response = await getUserFromToken();
        if (!response?.data) {
          router.push("/auth");
        } else {
          setIsCheckingAuth(false);
        }
      } catch {
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500 text-sm">
          Verificando autenticação...
        </span>
      </div>
    );
  }

  if (pathname === "/configuracoes") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main id="children" className="flex-1 overflow-auto custom-scroll-2">
        {children}
      </main>
    </div>
  );
}

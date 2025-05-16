"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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

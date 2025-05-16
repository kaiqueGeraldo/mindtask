import { Menu } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";

export function SidebarTopbarMobile() {
  const { setSidebarOpen, scrolled } = useSidebar();

  return (
    <div
      className={`md:hidden fixed top-0 left-0 w-full flex items-center p-3 z-30 transition-all duration-300 ${
        scrolled ? "bg-[#081A40] shadow-md" : "bg-transparent"
      }`}
    >
      <button
        className="p-2 rounded-full shadow-md bg-[#0e224d] cursor-pointer"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
      <span className="text-white text-lg font-bold ml-3">MindTask</span>
    </div>
  );
}

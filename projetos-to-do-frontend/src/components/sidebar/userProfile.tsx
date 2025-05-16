import { useUser } from "@/hooks/useUser";
import { Users, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSidebar } from "@/hooks/useSidebar";
import { UserCard } from "../userCard";
import { useRouter } from "next/navigation";
import { useModals } from "@/hooks/useModals";

export function SidebarUserProfile() {
  const router = useRouter();
  const { user, refetchUser } = useUser();
  const { showAccountOptions, setShowAccountOptions, menuRef } = useSidebar();
  const { setManageAccountOpen } = useModals();

  return (
    <div className="relative z-100" ref={menuRef}>
      <UserCard
        nome={user?.nome || ""}
        email={user?.email || ""}
        onClick={() => setShowAccountOptions((prev) => !prev)}
        showLogoutButton={false}
      />

      <AnimatePresence>
        {showAccountOptions && (
          <motion.div
            key="account-options"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 mt-1 w-6/7 bg-[#1A2747] rounded-lg shadow-lg z-50 p-2 space-y-2 select-none"
          >
            <button
              onClick={async () => {
                await refetchUser();
                setManageAccountOpen(true);
                setShowAccountOptions((prev) => !prev);
              }}
              className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 w-full p-2 rounded-md transition cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Gerenciar contas</span>
            </button>
            <button
              onClick={() => {
                router.push("/configuracoes");
                setShowAccountOptions((prev) => !prev);
              }}
              className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 w-full p-2 rounded-md transition cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

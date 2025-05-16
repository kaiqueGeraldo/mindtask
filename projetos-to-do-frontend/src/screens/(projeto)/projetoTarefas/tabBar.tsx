import { motion } from "framer-motion";

interface TabBarProps {
  active: "pendentes" | "concluidas";
  pendentesCount: number;
  concluidasCount: number;
  onSelect: (tab: "pendentes" | "concluidas") => void;
}

export function TabBar({
  active,
  pendentesCount,
  concluidasCount,
  onSelect,
}: TabBarProps) {
  const tabs = ["pendentes", "concluidas"] as const;
  const index = tabs.indexOf(active);

  return (
    <div className="relative flex border-b border-zinc-700 mb-4">
      {tabs.map((tab) => {
        const isActive = active === tab;
        const label =
          tab === "pendentes"
            ? `Pendentes (${pendentesCount})`
            : `Concluídas (${concluidasCount})`;

        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`relative flex-1 py-2 text-sm font-medium text-center transition duration-300 hover:bg-white/5 ${
              isActive ? "text-white" : "text-zinc-400"
            }`}
          >
            {label}
          </button>
        );
      })}

      <motion.div
        className="absolute bottom-0 w-1/2 h-1 bg-blue-500 rounded-t-md"
        animate={{ x: `${index * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
}

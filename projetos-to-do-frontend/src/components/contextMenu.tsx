import { motion } from "framer-motion";
import { getContextMenuItems } from "@/utils/contextMenuUtils";
import { ContextMenuData } from "@/models/contextMenuModel";
import { useProject } from "@/hooks/useProject";
import { forwardRef } from "react";

interface Props {
  data: ContextMenuData;
  onAction: (action: string, id: number, type: "grupo" | "projeto" | "tarefa") => void;
}

export const ContextMenu = forwardRef<HTMLUListElement, Props>(
  ({ data, onAction }, ref) => {
    const { projetos } = useProject();
    const items = getContextMenuItems(
      data.type,
      data.type === "projeto" ? data.projeto! : data.id,
      projetos
    );

    return (
      <motion.ul
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed z-[1000] min-w-[180px] p-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl text-sm text-white"
        style={{ top: data.y, left: data.x }}
      >
        {items.map((item) => (
          <li
            key={item.action}
            onClick={(e) => {
              e.stopPropagation();
              if (item.action === "delete" && data.onDelete) {
                data.onDelete();
              } else {
                onAction(item.action, data.id, data.type);
              }
            }}
            className="px-3 py-2 hover:bg-white/20 cursor-pointer select-none rounded-md transition duration-300"
          >
            {item.label}
          </li>
        ))}
      </motion.ul>
    );
  }
);

ContextMenu.displayName = "ContextMenu";

import { motion, AnimatePresence } from "framer-motion";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableItem } from "../draggableItem";
import { Projeto } from "@/models/projetoModel";

interface GroupContentProps {
  isExpanded: boolean;
  projetos: Projeto[];
  containerId: string;
}

export function GroupContent({
  isExpanded,
  projetos,
  containerId,
}: GroupContentProps) {
  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          key="conteudo-expandido"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <SortableContext
            items={projetos.map((p) => `projeto-${p.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <motion.div className="pl-6 pt-2 flex flex-col gap-2">
              {projetos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm text-white/50 italic select-none border border-dashed border-white/20 rounded px-3 py-2"
                >
                  | arraste projetos aqui
                </motion.div>
              ) : (
                projetos.map((projeto) => (
                  <motion.div
                    key={projeto.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DraggableItem
                      projeto={projeto}
                      containerId={containerId}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </SortableContext>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

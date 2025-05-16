import { motion, AnimatePresence } from "framer-motion";
import { useTask } from "@/hooks/useTask";
import { TarefaItem } from "./tarefaItem";

interface TarefaListProps {
  tipo: "pendentes" | "concluidas";
}

export function TarefaList({ tipo }: TarefaListProps) {
  const { tarefasVisiveis } = useTask();

  return (
    <motion.ul
      key={tipo}
      initial={{ x: tipo === "pendentes" ? -20 : 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: tipo === "pendentes" ? 20 : -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2 mb-3"
    >
      <AnimatePresence mode="popLayout">
        {tarefasVisiveis.length === 0 ? (
          <div className="flex justify-center text-sm text-zinc-400">
            {tipo === "pendentes"
              ? "Adicione tarefas e elas aparecerão aqui"
              : "Marque tarefas como concluídas e elas aparecerão aqui"}
          </div>
        ) : (
          tarefasVisiveis.map((tarefa) => (
            <TarefaItem key={tarefa.id} tarefa={tarefa} />
          ))
        )}
      </AnimatePresence>
    </motion.ul>
  );
}

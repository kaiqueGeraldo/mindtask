import { Folder, ChevronDown, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { EditableTitle } from "@/components/editableTitle";

interface GroupHeaderProps {
  grupo: { id: number; nome: string };
  isExpanded: boolean;
  toggleExpand: () => void;
  grupoEmEdicao: number | null;
  setGrupoEmEdicao: (id: number | null) => void;
  listeners: any;
  attributes: any;
  onSalvar: (novoNome: string) => void;
}

export function GroupHeader({
  grupo,
  isExpanded,
  toggleExpand,
  grupoEmEdicao,
  listeners,
  onSalvar,
}: GroupHeaderProps) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer px-2 select-none"
      onClick={toggleExpand}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Folder className="text-blue-400 w-5 h-5 shrink-0" />
        <EditableTitle
          id={grupo.id}
          valor={grupo.nome}
          aoSalvar={onSalvar}
          maxLength={255}
          forcarEdicao={grupoEmEdicao === grupo.id}
          className="flex-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-white" />
        </motion.div>

        <div {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-white/50" />
        </div>
      </div>
    </div>
  );
}

import { EditableTitle } from "@/components/editableTitle";
import { Star, Pencil, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Projeto } from "@/models/projetoModel";
import { Modal } from "@/components/ui/modal";
import { formatarDataBR } from "@/utils/formatDate";

interface ProjetoHeaderProps {
  projeto: Projeto;
  onFavoritar?: () => void;
  onSalvarTitulo: (novoNome: string) => void;
  emEdicao: boolean;
  setEmEdicao: (id: number | null) => void;
  habilitarEdicaoDuploClique?: boolean;
  modalAberto: boolean;
  setModalAberto: (open: boolean) => void;
}

export function ProjetoHeader({
  projeto,
  onFavoritar,
  onSalvarTitulo,
  emEdicao,
  setEmEdicao,
  modalAberto,
  setModalAberto,
}: ProjetoHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-5 flex-wrap">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <EditableTitle
          id={projeto.id}
          valor={projeto.nome}
          maxLength={100}
          aoSalvar={onSalvarTitulo}
          className={`text-2xl sm:text-3xl font-bold text-white ${
            emEdicao ? "w-full" : "truncate"
          }`}
          forcarEdicao={emEdicao}
          aoCancelarEdicao={() => setEmEdicao(null)}
        />

        <button
          onClick={() => setEmEdicao(emEdicao ? null : projeto.id)}
          className="text-white/60 hover:text-white transition shrink-0"
          title="Editar nome"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      <motion.div
        key="star"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0.6, 1.2, 1], opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0, rotate: 90 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="shrink-0 cursor-pointer"
        onClick={onFavoritar}
      >
        <Star
          className="w-7 h-7"
          fill={projeto.favorito ? "#fff" : "none"}
          stroke={projeto.favorito ? "#fff" : "#fff"}
        />
      </motion.div>

      <HelpCircle
        onClick={() => setModalAberto(true)}
        className="w-7 h-7 cursor-pointer"
        stroke={"#fff"}
      />

      <Modal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Informações do projeto"
      >
        <div className="space-y-3 text-sm text-white">
          <div className="flex items-center gap-2">
            <strong>Criado em:</strong>
            <span className="font-semibold">
              {formatarDataBR(projeto.criado_em)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <strong>Última atualização:</strong>
            <span className="font-semibold">
              {formatarDataBR(projeto.atualizado_em)}
            </span>
          </div>

          {projeto.concluido_em && (
            <div className="flex items-center gap-2">
              <strong>Concluído em:</strong>
              <span className="font-semibold">
                {formatarDataBR(projeto.concluido_em)}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </header>
  );
}

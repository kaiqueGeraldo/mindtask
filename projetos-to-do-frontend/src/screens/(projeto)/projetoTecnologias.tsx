import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tecnologia } from "@/models/tecnologiaModel";
import Button from "@/components/ui/button";

interface ProjetoTecnologiasProps {
  tecnologias: Tecnologia[];
  onAdicionar: () => void;
  onRemover: (id: number) => void;
}

export function ProjetoTecnologias({
  tecnologias,
  onAdicionar,
  onRemover,
}: ProjetoTecnologiasProps) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white">Tecnologias</h2>
        <Button onClick={onAdicionar}>
          <Plus size={16} />
          Adicionar
        </Button>
      </div>

      {tecnologias.length === 0 ? (
        <p className="text-white/60 text-sm">Nenhuma tecnologia adicionada.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {tecnologias.map((tec) => (
              <motion.div
                key={tec.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-white bg-gradient-to-br from-[#0B2559] to-[#113A8C] border border-white/10 backdrop-blur-md shadow hover:shadow-lg transition-all duration-200">
                  <span className="whitespace-nowrap">{tec.nome}</span>
                  <button
                    onClick={() => onRemover(tec.id)}
                    className="opacity-80 hover:opacity-100 hover:text-gray-500 transition"
                    aria-label={`Remover ${tec.nome}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

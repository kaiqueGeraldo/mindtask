import {
  statusLabels,
  statusRingColors,
  statusBgColors,
} from "@/utils/statusUtils";
import { Modal } from "@/components/ui/modal";

interface ModalSelecionarStatusProps {
  isOpen: boolean;
  onClose: () => void;
  statusAtual: number;
  onSelecionar: (novoStatus: number) => void;
}

export function ModalSelecionarStatus({
  isOpen,
  onClose,
  statusAtual,
  onSelecionar,
}: ModalSelecionarStatusProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Selecionar status">
      <div className="space-y-3">
        {Object.entries(statusLabels).map(([key, label]) => {
          const index = Number(key);
          return (
            <button
              key={index}
              onClick={() => {
                onSelecionar(index);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium border transition text-white
        ${
          statusAtual === index
            ? `bg-white/10 ${statusRingColors[index]} ring-1 ring-offset-1`
            : "bg-white/5 hover:bg-white/10 border-white/10"
        }
      `}
            >
              {label}
              <span
                className={`w-3 h-3 rounded-full ${statusBgColors[index]}`}
              />
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

import { Tecnologia } from "@/models/tecnologiaModel";
import { TecnologiaSelector } from "../tecnologias";
import { Modal } from "../ui/modal";
import { useTecnologias } from "@/hooks/useTecnologias";
import Button from "../ui/button";

interface TecnologiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tecnologias: Tecnologia[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  projetoId: number;
}

export function TecnologiaModal({
  isOpen,
  onClose,
  tecnologias,
  selectedIds,
  onChange,
  projetoId,
  onSalvar,
}: TecnologiaModalProps & { onSalvar: () => void }) {
  const { loading, salvarTecnologias } = useTecnologias();

  const handleSalvar = () => {
    salvarTecnologias({
      projetoId,
      tecnologiaIds: selectedIds,
      onSuccess: onSalvar,
      onClose,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Selecionar Tecnologias">
      <div className="w-full max-h-[70vh] overflow-y-auto custom-scroll-2">
        <TecnologiaSelector
          tecnologias={tecnologias}
          selectedIds={selectedIds}
          onChange={onChange}
        />
      </div>

      {/* Botão de salvar */}
      <div className="mt-4 flex justify-center">
        <Button onClick={handleSalvar} isLoading={loading} className="w-1/2">
          Salvar
        </Button>
      </div>
    </Modal>
  );
}

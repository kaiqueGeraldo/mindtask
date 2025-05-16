import { Modal } from "../ui/modal";
import Button from "../ui/button";

interface SucessoVinculoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SucessoVinculoModal({
  isOpen,
  onClose,
}: SucessoVinculoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Vínculo realizado com sucesso"}
    >
      <div className="flex flex-col gap-2">
        <p className="text-gray-300 text-sm">
          A nova conta foi vinculada com sucesso! Você já pode fechar este card
          e acessar as informações no menu "Gerenciar Conta".
        </p>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} className="w-1/3">
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

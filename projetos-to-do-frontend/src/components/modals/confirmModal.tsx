import { Loader2 } from "lucide-react";
import { Modal } from "../ui/modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  cancelColor?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Tem certeza?",
  message = "Essa ação não poderá ser desfeita.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "bg-red-700 hover:bg-red-600 text-white",
  cancelColor = "bg-gray-300 text-gray-800 hover:bg-gray-400",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-2">
        <p className="text-gray-300 text-sm">{message}</p>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className={`w-1/3 py-2 rounded-md transition duration-200 font-medium cursor-pointer ${cancelColor}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-1/3 py-2 rounded-md transition duration-200 font-medium cursor-pointer ${confirmColor} ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5"/> : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

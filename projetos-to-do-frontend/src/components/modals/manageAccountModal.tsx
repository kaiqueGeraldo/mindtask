import { Modal } from "../ui/modal";
import { useUser } from "@/hooks/useUser";
import { Plus } from "lucide-react";
import { UserCard } from "../userCard";
import { trocarConta } from "@/services/accountService";
import { setCookie } from "cookies-next";
import { Usuario } from "@/models/usuarioModel";
import { useModals } from "@/hooks/useModals";

interface ManageAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManageAccountModal({
  isOpen,
  onClose,
  onSuccess,
}: ManageAccountModalProps) {
  const { user } = useUser();
  const {
    setLogoutModalOpen,
    setLinkAccountModalOpen,
    setRemoverContaModalOpen,
    setContaParaRemoverId,
  } = useModals();

  async function handleTrocarConta(contaId: number) {
    try {
      const response = await trocarConta(contaId);
      setCookie("token", response?.data.token);
      onSuccess();
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao trocar de conta:", error);
    }
  }

  if (!user) return null;

  const estaEmContaVinculada = user.usandoContaVinculada;

  let contasAlternativas: Usuario[] = [];

  if (estaEmContaVinculada && user.contaOriginal) {
    contasAlternativas = [
      user.contaOriginal,
      ...user.contaOriginal.vinculadas.filter((conta) => conta.id !== user.id),
    ];
  } else {
    contasAlternativas =
      user.vinculadas?.filter((conta) => conta.id !== user.id) ?? [];
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Contas">
      <div className="flex flex-col">
        {/* Conta atual */}
        <UserCard
          nome={user.nome}
          email={user.email}
          onLogout={() => setLogoutModalOpen(true)}
          isActive={true}
        />

        {/* Contas alternativas */}
        {contasAlternativas.map((conta) => (
          <UserCard
            key={conta.id}
            nome={conta.nome}
            email={conta.email}
            onClick={() => handleTrocarConta(conta.id)}
            showLogoutButton={false}
            onRemoveVinculo={
              !estaEmContaVinculada
                ? () => {
                    setContaParaRemoverId(conta.id);
                    setRemoverContaModalOpen(true);
                  }
                : undefined
            }
          />
        ))}

        <div
          onClick={() => setLinkAccountModalOpen(true)}
          className="flex justify-center items-center p-5 my-4 rounded hover:bg-white/20 transition duration-200 text-white cursor-pointer"
        >
          <div className="flex gap-3 justify-center cursor-pointer">
            <Plus className="w-5 h-5" /> Adicionar Conta
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-[#113A8C] hover:bg-[#0B2559] text-white w-1/3 py-2 px-4 rounded-md transition duration-200 font-medium flex justify-center items-center cursor-pointer"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}

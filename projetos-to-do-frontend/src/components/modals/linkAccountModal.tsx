"use client";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { gerarVinculoToken } from "@/services/accountService";

interface LinkAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LinkAccountModal({ isOpen, onClose }: LinkAccountModalProps) {
  const router = useRouter();
  const [vinculoToken, setVinculoToken] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Gera token ao abrir o modal
    gerarVinculoToken()
      .then((response) => {
        setVinculoToken(response?.data.token);
      })
      .catch((err) => {
        console.error("Erro ao gerar token de vínculo:", err);
      });
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vincular Conta">
      <div className="flex flex-col gap-4 text-white">
        <p className="text-center">Como você gostaria de vincular uma conta?</p>

        <motion.div
          className="flex flex-col gap-3 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            disabled={!vinculoToken}
            onClick={() => {
              if (vinculoToken) {
                router.push(`/auth?modo=cadastro&vinculoToken=${vinculoToken}`);
              }
            }}
          >
            Criar Nova Conta
          </Button>

          <Button
            disabled={!vinculoToken}
            onClick={() => {
              if (vinculoToken) {
                router.push(`/auth?modo=login&vinculoToken=${vinculoToken}`);
              }
            }}
          >
            Acessar Conta Existente
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}

import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  manageAccountOpen: boolean;
  setManageAccountOpen: (open: boolean) => void;
  logoutModalOpen: boolean;
  setLogoutModalOpen: (open: boolean) => void;
  linkAccountModalOpen: boolean;
  setLinkAccountModalOpen: (open: boolean) => void;
  newGroupModalOpen: boolean;
  setNewGroupModalOpen: (open: boolean) => void;
  newProjectModalOpen: boolean;
  setNewProjectModalOpen: (open: boolean) => void;
  openNewProjectForGroup: (groupId: number) => void;
  grupoIdParaProjeto: number | null;
  setGrupoIdParaProjeto: (id: number | null) => void;
  statusProjeto: boolean;
  setStatusProjeto: (open: boolean) => void;
  contaParaRemoverId: number | null;
  setContaParaRemoverId: (id: number | null) => void;
  removerContaModalOpen: boolean;
  setRemoverContaModalOpen: (open: boolean) => void;
  sucessoVinculoModalOpen: boolean;
  setSucessoVinculoModalOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [manageAccountOpen, setManageAccountOpen] = useState(false);
  const [linkAccountModalOpen, setLinkAccountModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [newGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [grupoIdParaProjeto, setGrupoIdParaProjeto] = useState<number | null>(
    null
  );
  const [statusProjeto, setStatusProjeto] = useState(false);
  const [contaParaRemoverId, setContaParaRemoverId] = useState<number | null>(null);
  const [sucessoVinculoModalOpen, setSucessoVinculoModalOpen] = useState(false);
  const [removerContaModalOpen, setRemoverContaModalOpen] = useState(false);

  const openNewProjectForGroup = (groupId: number) => {
    setGrupoIdParaProjeto(groupId);
    setNewProjectModalOpen(true);
  };

  return (
    <ModalContext.Provider
      value={{
        manageAccountOpen,
        setManageAccountOpen,
        logoutModalOpen,
        setLogoutModalOpen,
        linkAccountModalOpen,
        setLinkAccountModalOpen,
        newGroupModalOpen,
        setNewGroupModalOpen,
        newProjectModalOpen,
        setNewProjectModalOpen,
        openNewProjectForGroup,
        grupoIdParaProjeto,
        setGrupoIdParaProjeto,
        statusProjeto,
        setStatusProjeto,
        contaParaRemoverId,
        setContaParaRemoverId,
        removerContaModalOpen,
        setRemoverContaModalOpen,
        sucessoVinculoModalOpen,
        setSucessoVinculoModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModalsContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals deve ser usado dentro de ModalProvider");
  }
  return context;
}

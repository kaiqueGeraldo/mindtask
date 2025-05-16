"use client";

import { OverlayMobile } from "./overlayMobile";
import { SidebarTopbarMobile } from "./topbarMobile";
import { SidebarUserProfile } from "./userProfile";
import { SidebarNavLinks } from "./navLinks";
import { SidebarFooter } from "./footer";
import { GruposEProjetos } from "../dragAndDrop/gruposEProjetos";
import { NewGroupModal } from "../modals/newGroupModal";
import { NewProjectModal } from "../modals/newProjectModal";
import { useEffect } from "react";
import { useSidebar } from "@/hooks/useSidebar";
import { useGroup } from "@/hooks/useGroup";
import { useProject } from "@/hooks/useProject";
import { ManageAccountModal } from "../modals/manageAccountModal";
import { ConfirmationModal } from "../modals/confirmModal";
import { useAuth } from "@/hooks/useAuth";
import { useContextMenu } from "@/hooks/useContextMenu";
import { useModals } from "@/hooks/useModals";
import { ModalSelecionarStatus } from "../modals/selectStatusModal";
import { LinkAccountModal } from "../modals/linkAccountModal";
import { useUser } from "@/hooks/useUser";
import { SucessoVinculoModal } from "../modals/sucessoVinculoModal";

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const {
    newProjectGroupId,
    setNewProjectGroupId,
    confirmandoExclusao,
    handleConfirmarExclusao,
    handleCancelarExclusao,
  } = useContextMenu();
  const {
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
    statusProjeto,
    setStatusProjeto,
    contaParaRemoverId,
    setContaParaRemoverId,
    removerContaModalOpen,
    setRemoverContaModalOpen,
    sucessoVinculoModalOpen,
    setSucessoVinculoModalOpen,
  } = useModals();

  const { handleLogout } = useAuth();
  const { handleRemoveAccount } = useUser();
  const { fetchGrupos } = useGroup();
  const { fetchProjetos, projetoSelecionado, editProjeto } = useProject();

  useEffect(() => {
    if (newProjectGroupId !== null) {
      setNewProjectModalOpen(true);
    }
  }, [newProjectGroupId]);

  return (
    <>
      <SidebarTopbarMobile />
      {sidebarOpen && <OverlayMobile onClose={() => setSidebarOpen(false)} />}

      <div
        className={`bg-[#081A40] shadow-md w-[20%] min-w-[250px] fixed h-full transition-transform z-40 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 md:relative`}
      >
        <SidebarUserProfile />

        <div className="flex-1 overflow-y-auto custom-scroll">
          <SidebarNavLinks />
          <GruposEProjetos />
        </div>

        <SidebarFooter
          onNewGroup={() => setNewGroupModalOpen(true)}
          onNewProject={() => {
            setNewProjectModalOpen(true);
          }}
        />
      </div>

      <NewGroupModal
        isOpen={newGroupModalOpen}
        onClose={() => setNewGroupModalOpen(false)}
        onSuccess={fetchGrupos}
      />

      <NewProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => {
          setNewProjectModalOpen(false);
          setNewProjectGroupId(null);
        }}
        onSuccess={() => {
          fetchProjetos();
          fetchGrupos();
        }}
        grupoId={newProjectGroupId}
      />

      <ManageAccountModal
        isOpen={manageAccountOpen}
        onClose={() => setManageAccountOpen(false)}
        onSuccess={() => window.location.reload()}
      />

      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={() =>
          handleLogout(() => {
            setLogoutModalOpen(false);
            setManageAccountOpen(false);
          })
        }
        title="Sair da Conta"
        message="Deseja realmente sair da sua conta?"
        confirmText="Sair"
        confirmColor="bg-red-700 hover:bg-red-600 text-white"
      />

      <LinkAccountModal
        isOpen={linkAccountModalOpen}
        onClose={() => setLinkAccountModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={removerContaModalOpen}
        onClose={() => {
          setRemoverContaModalOpen(false);
          setContaParaRemoverId(null);
        }}
        onConfirm={async () => {
          if (contaParaRemoverId !== null) {
            await handleRemoveAccount(contaParaRemoverId);
            setRemoverContaModalOpen(false);
            setContaParaRemoverId(null);
          }
        }}
        title="Remover Conta"
        message="Tem certeza que deseja remover essa conta? Essa ação não poderá ser desfeita."
        confirmText="Remover"
        cancelText="Cancelar"
        confirmColor="bg-red-700 hover:bg-red-600 text-white"
        cancelColor="bg-gray-300 text-gray-800 hover:bg-gray-400"
      />

      <ConfirmationModal
        isOpen={confirmandoExclusao}
        onClose={handleCancelarExclusao}
        onConfirm={handleConfirmarExclusao}
        title="Excluir Projeto"
        message="Tem certeza que deseja excluir esse projeto? Essa ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="bg-red-700 hover:bg-red-600 text-white"
        cancelColor="bg-gray-300 text-gray-800 hover:bg-gray-400"
      />

      <ModalSelecionarStatus
        isOpen={statusProjeto}
        onClose={() => setStatusProjeto(false)}
        statusAtual={projetoSelecionado?.status ?? 0}
        onSelecionar={(novoStatus) => {
          if (projetoSelecionado) {
            editProjeto(projetoSelecionado.id, { status: novoStatus });
          }
        }}
      />

      <SucessoVinculoModal
        isOpen={sucessoVinculoModalOpen}
        onClose={() => setSucessoVinculoModalOpen(false)}
      />
    </>
  );
}

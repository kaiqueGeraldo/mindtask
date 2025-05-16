import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import { ContextMenuData } from "@/models/contextMenuModel";
import { ContextMenu } from "@/components/contextMenu";
import { dispatchContextAction } from "@/dispatchers/contextMenuDispatcher";
import { useProject } from "@/hooks/useProject";
import { useGroup } from "@/hooks/useGroup";
import { deleteProjeto } from "@/services/projectService";
import { useRouter } from "next/navigation";
import { Projeto } from "@/models/projetoModel";

interface ContextMenuContextValue {
  openMenu: (
    e: React.MouseEvent,
    data: Omit<ContextMenuData, "x" | "y">
  ) => void;
  closeMenu: () => void;
  newProjectGroupId: number | null;
  setNewProjectGroupId: (id: number | null) => void;
  grupoEmEdicao: number | null;
  setGrupoEmEdicao: (id: number | null) => void;
  projetoEmEdicao: number | null;
  setProjetoEmEdicao: (id: number | null) => void;
  tarefaEmEdicao: number | null;
  setTarefaEmEdicao: (id: number | null) => void;
  projetoParaExcluir: Projeto | null;
  setProjetoParaExcluir: (open: Projeto) => void;
  confirmandoExclusao: boolean;
  setConfirmandoExclusao: (open: boolean) => void;
  handleConfirmarExclusao: () => void;
  handleCancelarExclusao: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextValue | undefined>(
  undefined
);

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [menuData, setMenuData] = useState<ContextMenuData | null>(null);
  const { projetos, fetchProjetos } = useProject();
  const { fetchGrupos, toggleGrupoExpandido } = useGroup();

  const [newProjectGroupId, setNewProjectGroupId] = useState<number | null>(
    null
  );
  const [grupoEmEdicao, setGrupoEmEdicao] = useState<number | null>(null);
  const [projetoEmEdicao, setProjetoEmEdicao] = useState<number | null>(null);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<number | null>(null);
  const [projetoParaExcluir, setProjetoParaExcluir] = useState<Projeto | null>(
    null
  );
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  const menuRef = useRef<HTMLUListElement | null>(null);

  const openMenu = useCallback(
    (e: React.MouseEvent, data: Omit<ContextMenuData, "x" | "y">) => {
      e.preventDefault();
      setMenuData({ x: e.clientX, y: e.clientY, ...data });
    },
    []
  );

  const closeMenu = useCallback(() => setMenuData(null), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [closeMenu]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [closeMenu]);

  useEffect(() => {
    document.body.style.overflow = menuData ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuData]);

  function handleAction(
    action: string,
    id: number,
    type: "grupo" | "projeto" | "tarefa"
  ) {
    const projetoAtual = projetos.find((p) => p.id === id);

    dispatchContextAction(
      action,
      id,
      type,
      fetchProjetos,
      fetchGrupos,
      setNewProjectGroupId,
      toggleGrupoExpandido,
      setGrupoEmEdicao,
      setProjetoEmEdicao,
      setTarefaEmEdicao,
      projetos
    );

    closeMenu();
  }

  const handleConfirmarExclusao = async () => {
    if (!projetoParaExcluir) return;
    try {
      await deleteProjeto(projetoParaExcluir.id);
      router.push("/");
      fetchProjetos();
      fetchGrupos();
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
    } finally {
      setConfirmandoExclusao(false);
      setProjetoParaExcluir(null);
    }
  };

  const handleCancelarExclusao = () => {
    setConfirmandoExclusao(false);
    setProjetoParaExcluir(null);
  };

  return (
    <ContextMenuContext.Provider
      value={{
        openMenu,
        closeMenu,
        newProjectGroupId,
        setNewProjectGroupId,
        grupoEmEdicao,
        setGrupoEmEdicao,
        projetoEmEdicao,
        setProjetoEmEdicao,
        tarefaEmEdicao,
        setTarefaEmEdicao,
        projetoParaExcluir,
        setProjetoParaExcluir,
        confirmandoExclusao,
        setConfirmandoExclusao,
        handleConfirmarExclusao,
        handleCancelarExclusao,
      }}
    >
      {children}
      {menuData && (
        <>
          <div className="fixed inset-0 z-99" onClick={closeMenu} />
          <ContextMenu data={menuData} onAction={handleAction} ref={menuRef} />
        </>
      )}
    </ContextMenuContext.Provider>
  );
}

export function useContextMenuContext() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error(
      "useContextMenuContext deve ser usado dentro de ContextMenuProvider"
    );
  }
  return context;
}

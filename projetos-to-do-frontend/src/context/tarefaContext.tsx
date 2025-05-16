import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Tarefa } from "@/models/tarefaModel";
import {
  atualizarOrdemTarefas,
  atualizarTarefaProjeto,
  criarTarefaProjeto,
} from "@/services/taskService";
import { useProject } from "@/hooks/useProject";
import { useContextMenu } from "@/hooks/useContextMenu";
import { arrayMove } from "@dnd-kit/sortable";

interface TarefaContextType {
  tarefas: Tarefa[];
  tarefasVisiveis: Tarefa[];
  pendentes: Tarefa[];
  concluidas: Tarefa[];
  tab: "pendentes" | "concluidas";
  setTab: (tab: "pendentes" | "concluidas") => void;
  novaTarefa: string;
  setNovaTarefa: (valor: string) => void;
  mostrarCampoAdicionar: boolean;
  setMostrarCampoAdicionar: (valor: boolean) => void;
  carregando: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleAdicionarTarefa: () => void;
  handleSalvarEdicao: (id: number, novoTitulo: string) => void;
  handleToggleFeito: (id: number) => void;
  handleDragEnd: (activeId: number, overId: number) => void;
  onChange: (tarefas: Tarefa[]) => void;
  projetoId: number;
}

const TarefaContext = createContext<TarefaContextType | null>(null);

interface Props {
  children: ReactNode;
  projetoId: number;
  tarefas: Tarefa[];
  onChange: (tarefas: Tarefa[]) => void;
}

export function TarefaProvider({
  children,
  projetoId,
  tarefas,
  onChange,
}: Props) {
  const [novaTarefa, setNovaTarefa] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarCampoAdicionar, setMostrarCampoAdicionar] = useState(false);
  const [tab, setTab] = useState<"pendentes" | "concluidas">("pendentes");
  const [tarefasLocais, setTarefasLocais] = useState<Tarefa[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { fetchProjetos } = useProject();
  const { setTarefaEmEdicao } = useContextMenu();

  useEffect(() => {
    if (Array.isArray(tarefas)) {
      const diferentes =
        JSON.stringify(tarefas) !== JSON.stringify(tarefasLocais);
      if (diferentes) setTarefasLocais([...tarefas]);
    }
  }, [tarefas]);

  useEffect(() => {
    if (tarefasLocais.length > 0) {
      const temPendentes = tarefasLocais.some((t) => !t.feito);
      const temConcluidas = tarefasLocais.some((t) => t.feito);

      if (!temPendentes && temConcluidas) {
        setTab("concluidas");
      } else if (temPendentes && !temConcluidas) {
        setTab("pendentes")
      }
    } 
  }, [tarefasLocais]);

  useEffect(() => {
    if (mostrarCampoAdicionar && !carregando && novaTarefa === "") {
      inputRef.current?.focus();
    }
  }, [mostrarCampoAdicionar, carregando, novaTarefa]);

  const pendentes = useMemo(
    () =>
      tarefasLocais
        .filter((t) => !t.feito)
        .sort(
          (a, b) =>
            (a.ordem_pendente ?? Number.MAX_SAFE_INTEGER) -
            (b.ordem_pendente ?? Number.MAX_SAFE_INTEGER)
        ),
    [tarefasLocais]
  );

  const concluidas = useMemo(
    () =>
      tarefasLocais
        .filter((t) => t.feito)
        .sort(
          (a, b) =>
            (a.ordem_concluida ?? Number.MAX_SAFE_INTEGER) -
            (b.ordem_concluida ?? Number.MAX_SAFE_INTEGER)
        ),
    [tarefasLocais]
  );

  const tarefasVisiveis = useMemo(() => {
    return tab === "pendentes" ? pendentes : concluidas;
  }, [tab, pendentes, concluidas]);

  const handleAdicionarTarefa = async () => {
    const titulo = novaTarefa.trim();
    if (!titulo) return;

    setCarregando(true);
    try {
      const novaOrdem = pendentes.length;
      const res = await criarTarefaProjeto(projetoId, titulo, novaOrdem);
      const novaLista = [...tarefasLocais, res.data];
      setTarefasLocais(novaLista);
      onChange(novaLista);
      fetchProjetos();
      setNovaTarefa("");
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarEdicao = async (id: number, novoTitulo: string) => {
    const atualizada = tarefasLocais.find((t) => t.id === id);
    if (!atualizada) return;

    const novaTarefa = { ...atualizada, titulo: novoTitulo };
    const atualizadas = tarefasLocais.map((t) =>
      t.id === id ? novaTarefa : t
    );

    setTarefasLocais(atualizadas);
    onChange(atualizadas);
    setTarefaEmEdicao(null);

    try {
      await atualizarTarefaProjeto(id, { titulo: novoTitulo });
      fetchProjetos();
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
    }
  };

  const handleToggleFeito = async (id: number) => {
    const tarefaAtual = tarefasLocais.find((t) => t.id === id);
    if (!tarefaAtual) return;

    const novoFeito = !tarefaAtual.feito;

    const tarefasAtualizadas = tarefasLocais.map((t) =>
      t.id === id ? { ...t, feito: novoFeito } : t
    );

    const novasPendentes = tarefasAtualizadas
      .filter((t) => !t.feito)
      .sort(
        (a, b) =>
          (a.ordem_pendente ?? Number.MAX_SAFE_INTEGER) -
          (b.ordem_pendente ?? Number.MAX_SAFE_INTEGER)
      )
      .map((t, i) => ({
        ...t,
        ordem_pendente: i,
        ordem_concluida: null,
      }));

    const novasConcluidas = tarefasAtualizadas
      .filter((t) => t.feito)
      .sort(
        (a, b) =>
          (a.ordem_concluida ?? Number.MAX_SAFE_INTEGER) -
          (b.ordem_concluida ?? Number.MAX_SAFE_INTEGER)
      )
      .map((t, i) => ({
        ...t,
        ordem_concluida: i,
        ordem_pendente: null,
      }));

    const todasAtualizadas = [...novasPendentes, ...novasConcluidas];

    setTarefasLocais(todasAtualizadas);
    onChange(todasAtualizadas);
    setTarefaEmEdicao(null);

    try {
      await atualizarTarefaProjeto(id, {
        feito: novoFeito,
        ordem_pendente: novoFeito
          ? null
          : novasPendentes.find((t) => t.id === id)?.ordem_pendente ?? null,
        ordem_concluida: novoFeito
          ? novasConcluidas.find((t) => t.id === id)?.ordem_concluida ?? null
          : null,
      });

      const payload = todasAtualizadas.map((t) => ({
        id: t.id,
        ...(t.ordem_pendente !== null && { ordem_pendente: t.ordem_pendente }),
        ...(t.ordem_concluida !== null && {
          ordem_concluida: t.ordem_concluida,
        }),
      }));

      await atualizarOrdemTarefas(payload);
      fetchProjetos();
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
    }
  };

  const handleDragEnd = async (activeId: number, overId: number) => {
    if (activeId === overId) return;

    const listaAtual = tab === "pendentes" ? pendentes : concluidas;
    const campoOrdem =
      tab === "pendentes" ? "ordem_pendente" : "ordem_concluida";

    const oldIndex = listaAtual.findIndex((t) => t.id === activeId);
    const newIndex = listaAtual.findIndex((t) => t.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const novaLista = arrayMove(listaAtual, oldIndex, newIndex);

    const atualizadasParciais = novaLista.map((t, i) => ({
      ...t,
      [campoOrdem]: i,
    }));

    const outras = tarefasLocais.filter((t) =>
      tab === "pendentes" ? t.feito : !t.feito
    );

    const novasTarefas = [...atualizadasParciais, ...outras];

    setTarefasLocais(novasTarefas);
    onChange(novasTarefas);

    const payload = atualizadasParciais.map((t) => ({
      id: t.id,
      [campoOrdem]: t[campoOrdem],
    }));

    try {
      await atualizarOrdemTarefas(payload);
    } catch (err) {
      console.error("Erro ao atualizar ordem:", err);
    }
  };

  return (
    <TarefaContext.Provider
      value={{
        tarefas: tarefasLocais,
        tarefasVisiveis,
        pendentes,
        concluidas,
        tab,
        setTab,
        novaTarefa,
        setNovaTarefa,
        mostrarCampoAdicionar,
        setMostrarCampoAdicionar,
        carregando,
        inputRef,
        handleAdicionarTarefa,
        handleSalvarEdicao,
        handleToggleFeito,
        handleDragEnd,
        onChange,
        projetoId,
      }}
    >
      {children}
    </TarefaContext.Provider>
  );
}

export function useTarefaContext() {
  const ctx = useContext(TarefaContext);
  if (!ctx)
    throw new Error("useTarefa deve ser usado dentro de TarefaProvider");
  return ctx;
}

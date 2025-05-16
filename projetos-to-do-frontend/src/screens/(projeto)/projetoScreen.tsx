"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getProjetoPorId,
  updateNomeProjeto,
  updateProjeto,
} from "@/services/projectService";
import { useUser } from "@/hooks/useUser";
import { ProjetoHeader } from "./projetoHeader";
import { ProjetoTecnologias } from "./projetoTecnologias";
import { ProjetoTarefas } from "./projetoTarefas/projetoTarefas";
import { Projeto } from "@/models/projetoModel";
import { TecnologiaModal } from "@/components/modals/tecnologiaModal";
import { useTecnologias } from "@/hooks/useTecnologias";
import { useProject } from "@/hooks/useProject";
import { toggleFavoritoProjeto } from "@/utils/contextMenuUtils";
import { useGroup } from "@/hooks/useGroup";
import { useContextMenu } from "@/hooks/useContextMenu";
import { Tarefa } from "@/models/tarefaModel";
import { Loader2 } from "lucide-react";
import { deletarTecnologiaProjeto } from "@/services/technologyService";
import ProjetoDetalhes from "./projetoDetalhes";

export default function ProjetoScreen() {
  const { id } = useParams();
  const { user } = useUser();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState(true);
  const [abrirModalTecnologia, setAbrirModalTecnologia] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [tecnologiasSelecionadas, setTecnologiasSelecionadas] = useState<
    number[]
  >([]);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const { tecnologiasDisponiveis } = useTecnologias();

  const { projetoEmEdicao, setProjetoEmEdicao } = useContextMenu();

  const { fetchProjetos, projetos } = useProject();
  const { fetchGrupos } = useGroup();

  useEffect(() => {
    if (!id || !projetos) return;
    const projetoAtualizado = projetos.find((p) => p.id === Number(id));
    if (projetoAtualizado) {
      setProjeto(projetoAtualizado);
    }
  }, [projetos, id]);

  useEffect(() => {
    if (!user || !id) return;

    const fetchProjeto = async () => {
      try {
        const response = await getProjetoPorId(Number(id), user.id);
        setProjeto(response?.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMensagem("Projeto não encontrado.");
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjeto();
  }, [user, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        {mensagem}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 mx-auto mt-12 md:mt-0">
      <ProjetoHeader
        projeto={projeto}
        onFavoritar={() => {
          const novoFavorito = !projeto.favorito;
          setProjeto({ ...projeto, favorito: novoFavorito });

          toggleFavoritoProjeto(
            projeto.id,
            projeto.favorito,
            fetchProjetos,
            fetchGrupos
          );
        }}
        onSalvarTitulo={(novoNome) => {
          updateNomeProjeto(projeto.id, novoNome)
            .then(() => {
              setProjetoEmEdicao(null);
              fetchProjetos();

              setProjeto((prev) => (prev ? { ...prev, nome: novoNome } : prev));
            })
            .catch((err) => console.error("Erro ao renomear projeto:", err));
        }}
        emEdicao={projetoEmEdicao === projeto.id}
        setEmEdicao={setProjetoEmEdicao}
        habilitarEdicaoDuploClique={true}
        modalAberto={modalAberto}
        setModalAberto={setModalAberto}
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Card de Detalhes */}
        <ProjetoDetalhes
          projeto={projeto}
          onSalvarDescription={(novaDescricao) => {
            updateProjeto(projeto.id, { descricao: novaDescricao })
              .then(() => {
                setProjetoEmEdicao(null);
                fetchProjetos();

                setProjeto((prev) =>
                  prev ? { ...prev, nome: novaDescricao } : prev
                );
              })
              .catch((err) =>
                console.error("Erro ao editar a descrição do projeto:", err)
              );
          }}
        />

        {/* Tecnologias */}
        <ProjetoTecnologias
          tecnologias={projeto.tecnologias}
          onAdicionar={() => {
            setTecnologiasSelecionadas(projeto.tecnologias.map((t) => t.id));
            setAbrirModalTecnologia(true);
          }}
          onRemover={(tecnologiaId) => {
            deletarTecnologiaProjeto(projeto.id, tecnologiaId)
              .then(fetchProjetos)
              .catch((err) =>
                console.error("Erro ao remover tecnologia do projeto:", err)
              );
          }}
        />
      </div>

      {/* Tarefas */}
      <ProjetoTarefas
        projetoId={projeto.id}
        tarefas={projeto?.tarefas ?? []}
        onChange={(tarefasAtualizadas: Tarefa[]) =>
          setProjeto((prev) =>
            prev ? { ...prev, tarefas: tarefasAtualizadas } : null
          )
        }
      />

      {/* Modal de Tecnologias */}
      {abrirModalTecnologia && (
        <TecnologiaModal
          projetoId={projeto.id}
          isOpen={abrirModalTecnologia}
          onClose={() => setAbrirModalTecnologia(false)}
          tecnologias={tecnologiasDisponiveis}
          selectedIds={tecnologiasSelecionadas}
          onChange={setTecnologiasSelecionadas}
          onSalvar={() => {
            fetchProjetos();
          }}
        />
      )}
    </div>
  );
}

import { statusLabels, statusBadgeColors } from "@/utils/statusUtils";
import { EditableDescription } from "@/components/editableDescription ";
import { Projeto } from "@/models/projetoModel";
import { useModals } from "@/hooks/useModals";
import { useProject } from "@/hooks/useProject";

export default function ProjetoDetalhes({
  projeto,
  onSalvarDescription,
}: {
  projeto: Projeto;
  onSalvarDescription: (novaDescricao: string) => void;
}) {
  const { setStatusProjeto } = useModals();
  const { setProjetoSelecionado } = useProject();

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-md text-white space-y-4">
      <h2 className="text-lg font-semibold">Detalhes do Projeto</h2>

      <div className="space-y-2 text-sm text-white/80">
        <div className="flex items-center gap-2">
          <strong>Status:</strong>
          <span
            onClick={() => {
              setProjetoSelecionado(projeto);
              setStatusProjeto(true);
            }}
            className={`cursor-pointer px-3 py-1 rounded-md text-xs font-semibold hover:opacity-80 transition ${
              statusBadgeColors[projeto.status]
            }`}
          >
            {statusLabels[projeto.status]}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <strong>Descrição:</strong>
          <EditableDescription
            descricao={projeto.descricao}
            aoSalvar={onSalvarDescription}
            mostrarBotaoEditar={true}
          />
        </div>
      </div>
    </div>
  );
}

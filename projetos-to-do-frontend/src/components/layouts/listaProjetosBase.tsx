"use client";

import { useRouter } from "next/navigation";
import { Ban, Star } from "lucide-react";
import { toggleFavoritoProjeto } from "@/utils/contextMenuUtils";
import { statusBadgeColors, statusLabels } from "@/utils/statusUtils";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Projeto } from "@/models/projetoModel";

interface ListaProjetosBaseProps {
  titulo: string;
  projetos: Projeto[];
  busca: string;
  setBusca: (busca: string) => void;
  mostrarFiltroStatus?: boolean;
  statusFiltro?: number | null;
  setStatusFiltro?: (status: number | null) => void;
  mostrarBotaoDetalhes?: boolean;
  fetchProjetos?: () => void;
  fetchGrupos?: () => void;
}

export default function ListaProjetosBase({
  titulo,
  projetos,
  busca,
  setBusca,
  mostrarFiltroStatus = false,
  statusFiltro,
  setStatusFiltro,
  mostrarBotaoDetalhes = true,
  fetchProjetos,
  fetchGrupos,
}: ListaProjetosBaseProps) {
  const router = useRouter();

  return (
    <div className="p-4 mt-12 md:mt-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">{titulo}</h1>

        <div className="flex justify-end items-center gap-2">
          <Input
            name={"buscar-projeto"}
            label={""}
            placeholder="Buscar projeto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            classname="mb-0"
            onClear={() => setBusca("")}
          />

          {mostrarFiltroStatus && setStatusFiltro && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  {statusFiltro === null
                    ? "Todos"
                    : statusLabels[statusFiltro as keyof typeof statusLabels] ??
                      "Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFiltro(null)}>
                  Todos
                </DropdownMenuItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setStatusFiltro(Number(key))}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projetos.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full col-span-full py-20 text-white/80">
            <Ban className="w-10 h-10 mb-4 text-white/50" />
            <p className="text-md font-medium">Nenhum projeto encontrado.</p>
            {busca && (
              <p className="text-sm mt-1 text-white/60">
                Verifique o termo digitado ou limpe a busca.
              </p>
            )}
          </div>
        ) : (
          projetos.map((projeto) => (
            <Card
              key={projeto.id}
              className="group relative p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <h2
                  className="text-lg font-medium text-white line-clamp-1"
                  title={projeto.nome}
                >
                  {projeto.nome}
                </h2>

                <button
                  onClick={() =>
                    toggleFavoritoProjeto?.(
                      projeto.id,
                      projeto.favorito,
                      fetchProjetos!,
                      fetchGrupos!
                    )
                  }
                  className="hover:scale-110 transition-transform"
                >
                  <Star
                    className="w-6 h-6"
                    fill={projeto.favorito ? "#fff" : "none"}
                    stroke={projeto.favorito ? "#fff" : "#fff"}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-md ${
                    statusBadgeColors[projeto.status]
                  }`}
                >
                  {statusLabels[projeto.status]}
                </span>

                {mostrarBotaoDetalhes && (
                  <Button
                    onClick={() => router.push(`/projeto/${projeto.id}`)}
                    className="text-xs h-8 px-3"
                  >
                    Ver detalhes
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

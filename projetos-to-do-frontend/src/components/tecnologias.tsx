import { Tecnologia } from "@/models/tecnologiaModel";
import { useState } from "react";

interface TecnologiaSelectorProps {
  tecnologias: Tecnologia[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function TecnologiaSelector({
  tecnologias,
  selectedIds,
  onChange,
}: TecnologiaSelectorProps) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const LIMITE_TECNOLOGIAS = 15;
  const limiteAtingido = selectedIds.length >= LIMITE_TECNOLOGIAS;

  const categorias = Array.from(
    new Set(tecnologias.map((t) => t.categoria))
  ).sort();

  const tecnologiasFiltradas = tecnologias.filter((t) => {
    const nomeCond = t.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaCond = categoria === "todas" || t.categoria === categoria;
    return nomeCond && categoriaCond;
  });

  const toggleSelecionado = (id: number) => {
    const jaSelecionado = selectedIds.includes(id);
    if (!jaSelecionado && limiteAtingido) return;
    onChange(
      jaSelecionado ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]
    );
  };

  function formatarCategoria(categoria: string) {
    return categoria
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  return (
    <div className="space-y-3">
      {/* Busca + Filtro de categoria */}
      <div className="p-1 flex gap-2 items-end">
        <div className="flex flex-col w-2/3">
          <label className="text-sm text-white mb-1">Buscar tecnologia</label>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar tecnologia"
            className="px-4 py-2 rounded-md bg-[#051026] border border-[#113A8C] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11468C] text-sm"
          />
        </div>

        <div className="flex flex-col w-1/3">
          <label className="text-sm text-white mb-1">Categoria</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="px-4 py-2 rounded-md bg-[#051026] border border-[#113A8C] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11468C] text-sm"
          >
            <option value="todas">Todas</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {formatarCategoria(cat)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aviso de limite */}
      {limiteAtingido && (
        <p className="text-sm text-red-500">
          Limite de {LIMITE_TECNOLOGIAS} tecnologias atingido.
        </p>
      )}

      {/* Selecionadas */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tecnologias
            .filter((tec) => selectedIds.includes(tec.id))
            .map((tec) => (
              <span
                key={tec.id}
                className="rounded border border-white/30 text-white text-sm px-3 py-1 cursor-pointer hover:bg-white/10 transition"
                onClick={() => toggleSelecionado(tec.id)}
              >
                {tec.nome} ✕
              </span>
            ))}
        </div>
      )}

      {/* Lista filtrada */}
      {tecnologiasFiltradas.length > 0 ? (
        <div className="max-h-64 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scroll-2">
          {tecnologiasFiltradas.map((tec) => {
            const selecionado = selectedIds.includes(tec.id);
            const desativado = !selecionado && limiteAtingido;

            return (
              <button
                key={tec.id}
                onClick={() => toggleSelecionado(tec.id)}
                disabled={desativado}
                className={`rounded px-4 py-3 text-left border transition duration-200 text-white
                ${
                  selecionado
                    ? "bg-blue-800/20 border-blue-500"
                    : "backdrop-blur-md bg-white/5 border border-white/10  hover:bg-white/15"
                }
                ${desativado ? "opacity-50 cursor-not-allowed" : ""}
              `}
              >
                <div className="font-medium">{tec.nome}</div>
                <div className="text-xs text-white/50">
                  {formatarCategoria(tec.categoria)}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="font-medium text-center text-white">
          Sem Resultados Para Essa Pesquisa
        </div>
      )}
    </div>
  );
}

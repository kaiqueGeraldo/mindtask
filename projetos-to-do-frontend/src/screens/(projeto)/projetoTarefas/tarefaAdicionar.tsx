import { useTask } from "@/hooks/useTask";
import { X } from "lucide-react";

export function TarefaAdicionar({ onClose }: { onClose: () => void }) {
  const {
    novaTarefa,
    setNovaTarefa,
    handleAdicionarTarefa,
    carregando,
    inputRef,
  } = useTask();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdicionarTarefa();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        ref={inputRef}
        className="flex-1 bg-zinc-900 border px-3 py-2 rounded text-sm text-white"
        placeholder="Adicionar nova tarefa"
        value={novaTarefa}
        onChange={(e) => setNovaTarefa(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={carregando}
        maxLength={255}
      />
      <button
        title="Enter"
        onClick={handleAdicionarTarefa}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={carregando || !novaTarefa.trim()}
      >
        Adicionar
      </button>
      <button
        title="Esc"
        onClick={onClose}
        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-white text-sm cursor-pointer"
        disabled={carregando}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

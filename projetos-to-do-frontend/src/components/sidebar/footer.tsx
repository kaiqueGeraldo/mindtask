import { Plus } from "lucide-react";

interface SidebarFooterProps {
  onNewProject: () => void;
  onNewGroup: () => void;
}

export function SidebarFooter({
  onNewProject,
  onNewGroup,
}: SidebarFooterProps) {
  return (
    <div className="flex p-2 gap-2">
      <button
        title="Criar Projeto"
        className="w-3/4 bg-[#113A8C] hover:bg-[#0B2559] text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 cursor-pointer"
        onClick={onNewProject}
      >
        <Plus className="w-5 h-5" />
        <span>Novo Projeto</span>
      </button>
      <button
        title="Criar Grupo"
        className="w-1/4 bg-[#1A2747] hover:bg-[#113A8C] text-white py-2 px-4 rounded-lg flex items-center justify-center transition duration-300 cursor-pointer"
        onClick={onNewGroup}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}

import { usePathname } from "next/navigation";
import { useProject } from "@/hooks/useProject";
import { Folder, Star, Archive, CheckSquare } from "lucide-react";

export function SidebarNavLinks() {
  const pathname = usePathname();
  const { projetos } = useProject();

  const favoritos = projetos.filter((p) => p.favorito).length;
  const concluidos = projetos.filter((p) => p.status === 2).length;
  const arquivados = projetos.filter((p) => p.status === 3).length;

  const projectItems = [
    {
      icon: <Folder className="w-5 h-5" />,
      text: `Projetos (${projetos.length})`,
      link: "/",
    },
    {
      icon: <Star className="w-5 h-5" />,
      text: `Favoritos (${favoritos})`,
      link: "/favoritos",
    },
    {
      icon: <Archive className="w-5 h-5" />,
      text: `Arquivados (${arquivados})`,
      link: "/arquivados",
    },
    {
      icon: <CheckSquare className="w-5 h-5" />,
      text: `Concluídos (${concluidos})`,
      link: "/concluidos",
    },
  ];

  return (
    <nav className="space-y-1 my-2">
      {projectItems.map((item, index) => {
        const isActive = pathname === item.link;
        return (
          <a
            key={index}
            href={item.link}
            className={`flex items-center space-x-3 p-2 rounded-md transition ${
              isActive
                ? "bg-[#1A2747] text-blue-400"
                : "text-gray-300 hover:bg-[#1A2747] hover:text-white"
            }`}
          >
            {isActive ? (
              <div className="w-1 h-6 bg-blue-400 rounded-r-md" />
            ) : (
              <div className="w-1 h-6" />
            )}
            {item.icon}
            <span>{item.text}</span>
          </a>
        );
      })}
    </nav>
  );
}

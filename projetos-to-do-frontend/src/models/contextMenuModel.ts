import { Projeto } from "@/models/projetoModel";

export interface ContextMenuData {
  x: number;
  y: number;
  type: "grupo" | "projeto" | "tarefa";
  id: number;
  onDelete?: () => void;
  projeto?: Projeto;
}

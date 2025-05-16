import { Projeto } from "./projetoModel";

export interface Grupo {
  id: number;
  nome: string;
  ordem: number;
  expandido: boolean;
  projetos: Projeto[];
}

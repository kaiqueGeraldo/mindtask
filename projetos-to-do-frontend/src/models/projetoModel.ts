import { Tarefa } from "./tarefaModel";
import { Tecnologia } from "./tecnologiaModel";

export interface Projeto {
  id: number;
  nome: string;
  descricao?: string;
  status: number;
  favorito: boolean;
  grupo_id?: number | null;
  ordem: number;
  tecnologias: Tecnologia[] | [];
  tarefas: Tarefa[];
  criado_em: string;
  atualizado_em: string;
  concluido_em: string | null;
}

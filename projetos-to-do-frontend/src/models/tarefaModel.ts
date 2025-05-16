export interface Tarefa {
  id: number;
  titulo: string;
  feito: boolean;
  criado_em: string;
  projeto_id: number;
  ordem_pendente: number | null;
  ordem_concluida: number | null;
}

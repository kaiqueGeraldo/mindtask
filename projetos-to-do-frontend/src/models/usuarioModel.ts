export interface Usuario {
  id: number;
  nome: string;
  email: string;
  vinculadas: Usuario[];
  usandoContaVinculada: boolean;
  contaOriginal?: Usuario;
}

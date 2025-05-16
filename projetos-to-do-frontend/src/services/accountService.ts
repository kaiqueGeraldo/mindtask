import { apiRequest } from "./api";

// Função para gerar token de vínculo
export async function gerarVinculoToken() {
  return apiRequest("/contas/token", {
    method: "GET",
  });
}

// Função para verificar o token de vínculo
export async function verificarVinculoToken(token: string) {
  return apiRequest("/contas/verificar-vinculo-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

// Função para realizar o pedido de vinculo por login
export async function vincularContaLogin(email: string, senha: string) {
  return apiRequest("/contas/vincular-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
}

// Função para aprovar o vinculo por login
export async function aprovarVinculoLogin(token: string) {
  return apiRequest("/contas/aprovar-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

// Função para vincular uma conta diretamente por cadastro
export async function vincularContaCadastro(
  nome: string,
  email: string,
  senha: string
) {
  return apiRequest("/contas/vincular-cadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
}

// Função para realizar a troca entre contas
export async function trocarConta(contaId: number) {
  return apiRequest("/contas/trocar-conta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contaId }),
  });
}

// Função para remover uma conta das vinculadas
export async function removeAccount(contaId: number) {
  return apiRequest(`/contas/${contaId}`, {
    method: "DELETE",
  });
}

import { apiRequest } from "./api";

// Função para recuperar dados do usuário logado
export async function getUserFromToken() {
  return apiRequest("/auth/user", { method: "GET" });
}

// Função para login
export async function login(email: string, senha: string) {
  return apiRequest("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
}

// Função para regristro
export async function register(nome: string, email: string, senha: string) {
  return apiRequest("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
}

// Função para logout
export async function logout() {
  return apiRequest("/auth/logout", { method: "POST" });
}

// Função para solicitar troca senha
export async function solicitarToken(email: string) {
  return apiRequest("/auth/enviar-token-recuperacao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

// Função para redefinir senha
export async function redefinirSenha(token: string, novaSenha: string) {
  return apiRequest("/auth/redefinir-senha", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, novaSenha }),
  });
}

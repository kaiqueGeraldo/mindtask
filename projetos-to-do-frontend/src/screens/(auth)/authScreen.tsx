"use client";

import BackButton from "@/components/ui/backButton";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/hooks/useAuth";

export default function AuthScreen() {
  const {
    isLogin,
    isVinculo,
    isLoading,
    formData,
    errors,
    apiError,
    handleChange,
    handleSubmit,
    toggleMode,
    modalAberto,
    modalMensagem,
    fecharModal,
  } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#051026] text-white">
      <div className="bg-[#081A40] p-8 rounded-2xl shadow-lg w-full max-w-sm relative">
        <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white">MindTask</h1>
        <p className="text-sm text-gray-400 mt-1">
          {isVinculo
            ? "Vincule uma nova conta"
            : isLogin
            ? "Bem-vindo de volta"
            : "Crie sua conta"}
        </p>
        {isVinculo && (
          <div className="absolute top-11">
            <BackButton />
          </div>
        )}
      </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col justify-center"
        >
          {!isLogin && (
            <InputField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              disabled={isLoading}
              error={errors.nome}
            />
          )}

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemplo@email.com"
            disabled={isLoading}
            error={errors.email}
          />

          <InputField
            label="Senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
            error={errors.senha}
          />

          {!isLogin && (
            <InputField
              label="Confirmar Senha"
              name="confirmarSenha"
              type="password"
              value={formData.confirmarSenha}
              onChange={handleChange}
              placeholder="Repita a senha"
              disabled={isLoading}
              error={errors.confirmarSenha}
            />
          )}

          {isVinculo
            ? null
            : isLogin && (
                <div className="flex justify-between items-center">
                  <span></span>
                  <a
                    href="/esqueci-senha"
                    className="text-white text-sm hover:underline"
                  >
                    Esqueci minha senha
                  </a>
                </div>
              )}

          {apiError && (
            <p className="text-sm text-red-400 text-center -mt-2">{apiError}</p>
          )}

          <Button type="submit" isLoading={isLoading}>
            {isVinculo ? "Vincular" : isLogin ? "Entrar" : "Cadastrar"}
          </Button>
        </form>

        {!isVinculo && (
          <p className="text-center text-sm mt-6 text-gray-300">
            {isLogin ? "Não tem uma conta?" : "Já possui uma conta?"}{" "}
            <button
              onClick={toggleMode}
              disabled={isLoading}
              className={`text-[#11468C] hover:underline ml-1 ${
                isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              {isLogin ? "Crie agora" : "Faça login"}
            </button>
          </p>
        )}
      </div>

      <Modal
        isOpen={modalAberto}
        onClose={fecharModal}
        title="Vínculo em andamento"
      >
        <p className="text-white text-center">{modalMensagem}</p>
      </Modal>
    </div>
  );
}

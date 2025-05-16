"use client";

import BackButton from "@/components/ui/backButton";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input";
import { useEsqueciSenha } from "@/hooks/useEsqueciSenha";

export default function EsqueciSenhaScreen() {
  const {
    email,
    novaSenha,
    confirmarNovaSenha,
    token,
    isLoading,
    step,
    success,
    errors,
    handleChange,
    handleSubmitEmail,
    handleSubmitSenha,
  } = useEsqueciSenha();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#051026] text-white">
      <div className="bg-[#081A40] p-8 rounded-2xl shadow-lg w-full max-w-sm relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">MindTask</h1>
          <p className="text-md text-gray-400 mt-1">
            {step === 1 ? "Confirmar e-mail" : "Alterar Senha"}
          </p>
          {step === 1 && (
            <div className="absolute top-11">
              <BackButton />
            </div>
          )}
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <p className="text-sm text-white">
              Digite o e-mail da sua conta para receber um token para
              redefinição de senha.
            </p>

            {success && <p className="text-green-500 text-center">{success}</p>}
            {errors.general && (
              <p className="text-red-500 text-center">{errors.general}</p>
            )}

            <InputField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="exemplo@email.com"
              disabled={isLoading}
              error={errors.email}
            />

            <Button isLoading={isLoading} className="flex w-full">
              Enviar
            </Button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleSubmitSenha}>
            {errors.general && (
              <p className="text-red-500 text-center">{errors.general}</p>
            )}
            {success && <p className="text-green-500 text-center">{success}</p>}

            <InputField
              label="Token"
              name="token"
              type="text"
              value={token}
              onChange={(e) => handleChange("token", e.target.value)}
              placeholder="Digite o token recebido"
              disabled={isLoading}
              error={errors.token}
            />

            <InputField
              label="Nova senha"
              name="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(e) => handleChange("novaSenha", e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              error={errors.novaSenha}
            />

            <InputField
              label="Confirmar nova senha"
              name="confirmarNovaSenha"
              type="password"
              value={confirmarNovaSenha}
              onChange={(e) =>
                handleChange("confirmarNovaSenha", e.target.value)
              }
              placeholder="••••••••"
              disabled={isLoading}
              error={errors.confirmarNovaSenha}
            />

            <Button isLoading={isLoading} className="flex w-full">
              Confirmar
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

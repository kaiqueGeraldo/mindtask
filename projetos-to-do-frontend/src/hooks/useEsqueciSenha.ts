"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { redefinirSenha, solicitarToken } from "@/services/authService";
import {
  validarEmail,
  validarSenha,
  validarToken,
} from "@/validators/inputValidator";

export function useEsqueciSenha() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    switch (field) {
      case "email":
        setEmail(value);
        break;
      case "token":
        setToken(value);
        break;
      case "novaSenha":
        setNovaSenha(value);
        break;
      case "confirmarNovaSenha":
        setConfirmarNovaSenha(value);
        break;
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const emailError = validarEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    try {
      await solicitarToken(email);
      setSuccess(
        "E-mail de recuperação enviado! Verifique sua caixa de entrada."
      );
      setStep(2);
    } catch (err: any) {
      setErrors({
        email:
          err.status === 404
            ? "E-mail não encontrado!"
            : "Erro ao enviar e-mail.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const senhaErrors = validarSenha(
      novaSenha,
      confirmarNovaSenha,
      "novaSenha"
    );
    const tokenError = validarToken(token);

    const newErrors = { ...senhaErrors };
    if (tokenError) newErrors.token = tokenError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await redefinirSenha(token, novaSenha);
      if (response?.status === 200) {
        setSuccess("Senha alterada com sucesso! Redirecionando...");
        setTimeout(() => router.push("/auth"), 1500);
      } else {
        setErrors({ general: "Erro ao alterar a senha." });
      }
    } catch (err: any) {
      setErrors({
        token: err.status === 400 ? "Token inválido." : "",
        general: err.message || "Erro ao alterar a senha.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    token,
    novaSenha,
    confirmarNovaSenha,
    isLoading,
    step,
    success,
    errors,
    handleChange,
    handleSubmitEmail,
    handleSubmitSenha,
  };
}

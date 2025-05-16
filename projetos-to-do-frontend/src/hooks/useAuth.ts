import { useEffect, useState } from "react";
import { login, logout, register } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import {
  validarEmail,
  validarSenha,
  validarNome,
} from "@/validators/inputValidator";
import {
  verificarVinculoToken,
  vincularContaCadastro,
  vincularContaLogin,
} from "@/services/accountService";
import { useUser } from "./useUser";
import { useModals } from "./useModals";

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchUser, clearUser } = useUser();
  const {
    setManageAccountOpen,
    setLinkAccountModalOpen,
    setSucessoVinculoModalOpen,
  } = useModals();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isVinculo, setIsVinculo] = useState(false);
  const [vinculoToken, setVinculoToken] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalMensagem, setModalMensagem] = useState("");

  useEffect(() => {
    const modo = searchParams.get("modo");
    const token = searchParams.get("vinculoToken");

    if (modo === "login") setIsLogin(true);
    if (modo === "cadastro") setIsLogin(false);

    if (token) {
      setIsLoading(true);

      verificarVinculoToken(token)
        .then((res) => {
          if (res!.data.valido) {
            setIsVinculo(true);
            setVinculoToken(token);
          } else {
            setModalMensagem("O link de vínculo expirou ou é inválido.");
            setModalAberto(true);
          }
        })
        .catch(() => {
          setModalMensagem("Erro ao verificar o token de vínculo.");
          setModalAberto(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setApiError(null);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    const emailError = validarEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    if (!isLogin) {
      const nomeError = validarNome(formData.nome);
      if (nomeError) newErrors.nome = nomeError;

      const senhaErrors = validarSenha(
        formData.senha,
        formData.confirmarSenha,
        "senha"
      );
      Object.assign(newErrors, senhaErrors);
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      if (isLogin) {
        if (isVinculo && vinculoToken) {
          await vincularContaLogin(formData.email, formData.senha);
          setModalMensagem(
            "Verifique seu e-mail para autorizar o vínculo da conta. Após a confirmação, você já pode fechar este modal — o redirecionamento será feito automaticamente."
          );
          setModalAberto(true);
          return;
        } else {
          await login(formData.email, formData.senha);
        }
      } else {
        if (isVinculo && vinculoToken) {
          await vincularContaCadastro(
            formData.nome,
            formData.email,
            formData.senha
          );
          setLinkAccountModalOpen(false);
          setManageAccountOpen(false);
          await refetchUser();
          router.push("/");
          setSucessoVinculoModalOpen(true);
          return;
        } else {
          await register(formData.nome, formData.email, formData.senha);
          await login(formData.email, formData.senha);
        }
      }

      await refetchUser();
      router.push("/");
    } catch (error: unknown) {
      console.log(error);

      if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as { message: string; status?: number };

        if (isLogin) {
          if (err.status === 404 || err.status === 401) {
            setErrors({
              email: "Credenciais inválidas",
              senha: "Credenciais inválidas",
            });
          } else {
            setApiError(err.message || "Erro desconhecido");
          }
        } else {
          if (err.status === 400 && err.message.includes("E-mail")) {
            setErrors({ email: err.message });
          } else {
            setApiError(err.message || "Erro ao registrar");
          }
        }
      } else {
        setApiError("Erro inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fecharModal = async () => {
    setModalAberto(false);
    setLinkAccountModalOpen(false);
    setManageAccountOpen(false);
    await refetchUser();
    router.push("/");
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    });
    setErrors({});
    setApiError(null);
  };

  const handleLogout = async (onClose: () => void) => {
    try {
      await logout();
      await clearUser();
      onClose();
      router.push("/auth");
    } catch (error) {
      alert("Erro ao sair da conta! Tente novamente.");
    }
  };

  return {
    isLogin,
    setIsLogin,
    isVinculo,
    isLoading,
    formData,
    errors,
    apiError,
    handleChange,
    handleSubmit,
    toggleMode,
    handleLogout,
    modalAberto,
    modalMensagem,
    fecharModal,
  };
}

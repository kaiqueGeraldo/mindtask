"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { LottieRefCurrentProps } from "lottie-react";
import successAnimation from "@/lottie/success-check.json";
import errorAnimation from "@/lottie/error-check.json";
import { aprovarVinculoLogin } from "@/services/accountService";
import { Loader2 } from "lucide-react";

export default function AprovarVinculoScreen() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [mensagem, setMensagem] = useState("");
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMensagem("Token inválido ou ausente.");
      return;
    }

    aprovarVinculoLogin(token)
      .then(() => {
        setStatus("success");
        setMensagem(
          "Vínculo aprovado com sucesso! Agora você pode acessar essa conta vinculada em sua área pessoal."
        );
      })
      .catch((error: unknown) => {
        if (typeof error === "object" && error !== null && "message" in error) {
          const err = error as { message: string; status?: number };
          if (err?.status === 410 || err?.status == 401) {
            setMensagem(
              "Este link já foi utilizado. Solicite um novo se precisar."
            );
          } else {
            setMensagem(
              "Erro ao aprovar vínculo. O link pode estar expirado ou inválido."
            );
          }
        }
        setStatus("error");
      });
  }, [searchParams]);

  const getAnimation = () => {
    if (status === "success") return successAnimation;
    if (status === "error") return errorAnimation;
    return null;
  };

  useEffect(() => {
    const animation = (lottieRef.current as any)?.lottie;

    if (animation) {
      const handleComplete = () => {
        animation.pause();
      };

      animation.addEventListener("complete", handleComplete);

      return () => {
        animation.removeEventListener("complete", handleComplete);
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-[#081a40] shadow-xl rounded-xl w-md h-md p-8 flex flex-col justify-center items-center text-center space-y-4 transition-all duration-300">
        <div className="w-24 h-24 flex items-center justify-center">
          {status === "loading" ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <Lottie
              lottieRef={lottieRef}
              animationData={getAnimation()}
              loop={false}
              autoplay
            />
          )}
        </div>

        {status === "loading" && (
          <>
            <h1 className="text-xl font-semibold text-white">
              Validando vínculo...
            </h1>
            <p className="text-white">Por favor, aguarde um instante.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              Vínculo aprovado!
            </h1>
            <p className="text-white">{mensagem}</p>
            <p className="text-sm text-gray-400">
              Você já pode fechar esta página.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600">Erro ao aprovar</h1>
            <p className="text-white">{mensagem}</p>
            <p className="text-sm text-gray-400">
              Verifique o link ou solicite um novo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

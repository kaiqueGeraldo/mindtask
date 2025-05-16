import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface EditableDescriptionProps {
  descricao?: string;
  maxLength?: number;
  aoSalvar: (novaDescricao: string) => void;
  className?: string;
  placeholder?: string;
  mostrarBotaoEditar?: boolean;
  truncarCaracteres?: number;
}

export function EditableDescription({
  descricao = "",
  maxLength = 500,
  aoSalvar,
  className = "",
  placeholder = "Descrição do projeto (Opcional)",
  mostrarBotaoEditar = true,
  truncarCaracteres = 180,
}: EditableDescriptionProps) {
  const [emEdicao, setEmEdicao] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const [descricaoEditada, setDescricaoEditada] = useState(descricao);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const descricaoNormalizada = descricao ?? "";


  useEffect(() => {
    setDescricaoEditada(descricaoNormalizada);
  }, [descricaoNormalizada]);

  useEffect(() => {
    if (emEdicao && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [emEdicao]);

  function salvar() {
    const textoFinal = descricaoEditada.trim();
    if (textoFinal !== descricaoNormalizada) {
      aoSalvar(textoFinal);
    }
    setEmEdicao(false);
  }

  function cancelar() {
    setDescricaoEditada(descricaoNormalizada);
    setEmEdicao(false);
  }

  const deveTruncar = descricaoNormalizada.length > truncarCaracteres;
  const semDescricao = descricaoNormalizada.length === 0;
  const textoExibido = semDescricao
    ? "[adicionar descrição]"
    : expandido || !deveTruncar
    ? descricaoNormalizada
    : descricaoNormalizada.slice(0, truncarCaracteres).trim() + "...";

  return (
    <div className="w-full">
      {emEdicao ? (
        <textarea
          ref={textareaRef}
          value={descricaoEditada}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={3}
          onChange={(e) => setDescricaoEditada(e.target.value)}
          onBlur={salvar}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              cancelar();
            } else if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              salvar();
            }
          }}
          className={`w-full bg-transparent border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#051026] transition resize-none custom-scroll-2 ${className}`}
        />
      ) : (
        <p className="text-white/70 text-base leading-relaxed">
          <span className="whitespace-pre-wrap break-words">
            {textoExibido}
          </span>
          {deveTruncar && (
            <button
              onClick={() => setExpandido(!expandido)}
              className="ml-2 inline text-white/50 hover:text-white underline text-sm transition cursor-pointer"
            >
              {expandido ? "Ver menos" : "Ver mais"}
            </button>
          )}
          {mostrarBotaoEditar && (
            <button
              onClick={() => setEmEdicao(true)}
              title="Editar descrição"
              className="ml-2 text-white/60 hover:text-white transition align-middle"
            >
              <Pencil className="w-4 h-4 inline" />
            </button>
          )}
        </p>
      )}
    </div>
  );
}

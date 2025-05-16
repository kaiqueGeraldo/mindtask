import { useEffect, useRef, useState } from "react";

interface EditableTitleProps {
  id: number;
  valor: string;
  maxLength: number;
  aoSalvar: (novoValor: string) => void;
  className?: string;
  placeholder?: string;
  habilitarEdicaoDuploClique?: boolean;
  forcarEdicao?: boolean;
  aoCancelarEdicao?: () => void;
}

export function EditableTitle({
  valor,
  maxLength,
  aoSalvar,
  className = "",
  placeholder = "Digite o nome",
  habilitarEdicaoDuploClique = false,
  forcarEdicao = false,
  aoCancelarEdicao,
}: EditableTitleProps) {
  const [emEdicao, setEmEdicao] = useState(false);
  const [valorEditado, setValorEditado] = useState(valor);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValorEditado(valor);
  }, [valor]);

  useEffect(() => {
    if (emEdicao && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [emEdicao]);

  useEffect(() => {
    if (forcarEdicao) {
      setEmEdicao(true);
    }
  }, [forcarEdicao]);

  function salvar() {
    const textoFinal = valorEditado.trim();
    if (textoFinal && textoFinal !== valor) {
      aoSalvar(textoFinal);
    } else {
      aoCancelarEdicao?.();
    }
    setEmEdicao(false);
  }

  function cancelar() {
    setValorEditado(valor);
    setEmEdicao(false);
    aoCancelarEdicao?.();
  }

  return emEdicao ? (
    <input
      ref={inputRef}
      value={valorEditado}
      maxLength={maxLength}
      placeholder={placeholder}
      onChange={(e) => setValorEditado(e.target.value)}
      onBlur={salvar}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          salvar();
        } else if (e.key === "Escape") {
          e.preventDefault();
          cancelar();
        }
      }}
      className={`bg-transparent border border-white/30 rounded px-1 py-0.5 text-white text-sm outline-none transition-all duration-150 w-full overflow-x-auto whitespace-nowrap ${className}`}
    />
  ) : (
    <span
      title={valor}
      onDoubleClick={
        habilitarEdicaoDuploClique ? () => setEmEdicao(true) : undefined
      }
      className={`font-semibold text-white truncate cursor-default ${
        habilitarEdicaoDuploClique ? "cursor-pointer" : ""
      } ${className}`}
    >
      {valor}
    </span>
  );
}

"use client";

import { ConfirmationModal } from "@/components/modals/confirmModal";
import BackButton from "@/components/ui/backButton";
import { UserCard } from "@/components/userCard";
import { useAuth } from "@/hooks/useAuth";
import { useModals } from "@/hooks/useModals";
import { useUser } from "@/hooks/useUser";
import { Github, Linkedin, Notebook } from "lucide-react";

export default function SettingsScreen() {
  const { user } = useUser();
  const { handleLogout } = useAuth();
  const { logoutModalOpen, setLogoutModalOpen, setManageAccountOpen } =
    useModals();

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10 text-white flex flex-col gap-5">
      <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
        <BackButton />
        <h1 className="text-2xl font-semibold">Configurações</h1>
      </div>

      <UserCard
        nome={user?.nome || ""}
        email={user?.email || ""}
        onLogout={() => setLogoutModalOpen(true)}
      />

      {/* Conectar */}
      <div className="mt-2 border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold mb-4">Conectar</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="https://linkedin.com/in/kaique-geraldo"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 flex flex-col items-center gap-2 hover:border-blue-500 hover:shadow-lg transition duration-300"
          >
            <Linkedin className="w-6 h-6 text-blue-400 group-hover:scale-110 transition duration-300" />
            <span className="text-sm text-gray-300 group-hover:text-blue-400 transition duration-300">
              LinkedIn
            </span>
          </a>

          <a
            href="https://github.com/kaiqueGeraldo"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 flex flex-col items-center gap-2 hover:border-blue-500 hover:shadow-lg transition duration-300"
          >
            <Github className="w-6 h-6 text-blue-400 group-hover:scale-110 transition duration-300" />
            <span className="text-sm text-gray-300 group-hover:text-blue-400 transition duration-300">
              GitHub
            </span>
          </a>

          <a
            href="https://kaiquegeraldo.github.io/portifolio"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 flex flex-col items-center gap-2 hover:border-blue-500 hover:shadow-lg transition duration-300"
          >
            <Notebook className="w-6 h-6 text-blue-400 group-hover:scale-110 transition duration-300" />
            <span className="text-sm text-gray-300 group-hover:text-blue-400 transition duration-300">
              Portfólio
            </span>
          </a>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="mt-10 text-center text-sm text-gray-500 border-t border-gray-700 pt-6">
        <p>
          Feito com ❤️ por{" "}
          <a
            href="https://kaiquegeraldo.github.io/portifolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Kaique Geraldo
          </a>
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </p>
      </footer>

      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={() =>
          handleLogout(() => {
            setLogoutModalOpen(false);
            setManageAccountOpen(false);
          })
        }
        title="Sair da Conta"
        message="Deseja realmente sair da sua conta?"
        confirmText="Sair"
        confirmColor="bg-red-700 hover:bg-red-600 text-white"
      />
    </div>
  );
}

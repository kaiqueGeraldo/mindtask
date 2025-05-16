import { Usuario } from "@/models/usuarioModel";
import { removeAccount } from "@/services/accountService";
import { getUserFromToken } from "@/services/authService";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

type UserContextType = {
  user: Usuario | null;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
  clearUser: () => void;
  handleRemoveAccount: (contaId: number) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetchUser = useCallback(async () => {
    try {
      const response = await getUserFromToken();
      setUser({
        id: response.data.id,
        nome: response.data.nome,
        email: response.data.email,
        vinculadas: response.data.vinculadas,
        usandoContaVinculada: response.data.usandoContaVinculada,
        contaOriginal: response.data.contaOriginal,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearUser = () => {
    setUser(null);
  };

  const handleRemoveAccount = async (contaId: number) => {
    try {
      await removeAccount(contaId);
      await refetchUser();
    } catch (error: any) {
      console.error("Erro ao remover conta vinculada:", error.data);
      alert(`Erro ao remover conta vinculada: ${error.data}`);
    }
  };

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  return (
    <UserContext.Provider
      value={{ user, isLoading, refetchUser, clearUser, handleRemoveAccount }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};

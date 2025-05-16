import { Suspense } from "react";
import AuthScreen from "@/screens/(auth)/authScreen";

export const metadata = {
  title: "MindTask - Autenticação",
};

export default function PublicPage() {
  return (
      <Suspense fallback={<div>Carregando...</div>}>
        <AuthScreen />
      </Suspense>
    );
}

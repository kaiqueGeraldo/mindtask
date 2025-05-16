import { Suspense } from "react";
import ProjetosScreen from "@/screens/(projetos)/projetosScreen";

export const metadata = {
  title: "MindTask - Projetos",
};

export default function ProjetosPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ProjetosScreen />
    </Suspense>
  );
}

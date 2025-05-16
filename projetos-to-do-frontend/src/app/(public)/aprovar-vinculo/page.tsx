import { Suspense } from "react";
import AprovarVinculoScreen from "@/screens/(aprovar-vinculo)/aprovar-vinculo";

export const metadata = {
  title: "MindTask - Aprovar Vinculo",
};


export default function AprovarVinculoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AprovarVinculoScreen />
    </Suspense>
  );
}

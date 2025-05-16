import { useDroppable } from "@dnd-kit/core";

export function DroppableSemGrupo({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: "sem-grupo",
    data: { type: "sem-grupo" },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-2"
    >
      {children}
    </div>
  );
}

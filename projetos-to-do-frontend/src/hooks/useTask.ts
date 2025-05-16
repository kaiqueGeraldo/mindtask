"use client";

import { useTarefaContext } from "@/context/tarefaContext";

export function useTask() {
  return useTarefaContext();
}

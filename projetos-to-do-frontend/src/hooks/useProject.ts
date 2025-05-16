"use client";

import { useProjectContext } from "@/context/projectContext";

export function useProject() {
  return useProjectContext();
}

"use client";

import { useGroupContext } from "@/context/groupContext";

export function useGroup() {
  return useGroupContext();
}

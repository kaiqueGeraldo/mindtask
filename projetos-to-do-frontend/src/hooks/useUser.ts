"use client"

import { useUserContext } from "@/context/userContext";

export function useUser() {
  return useUserContext();
}

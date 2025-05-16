"use client";

import { ReactNode } from "react";
import { ProjectProvider } from "@/context/projectContext";
import { GroupProvider } from "@/context/groupContext";
import { SidebarProvider } from "@/context/sidebarContext";
import { ContextMenuProvider } from "@/context/contextMenuContext";
import { ModalProvider } from "@/context/modalContext";
import { UserProvider } from "@/context/userContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <ProjectProvider>
        <GroupProvider>
          <SidebarProvider>
            <ContextMenuProvider>
              <ModalProvider>{children}</ModalProvider>
            </ContextMenuProvider>
          </SidebarProvider>
        </GroupProvider>
      </ProjectProvider>
    </UserProvider>
  );
}

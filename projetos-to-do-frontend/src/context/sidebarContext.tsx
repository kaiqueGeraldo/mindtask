"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  RefObject,
  useRef,
} from "react";

interface SidebarContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  scrolled: boolean;
  showAccountOptions: boolean;
  setShowAccountOptions: React.Dispatch<React.SetStateAction<boolean>>;
  menuRef: RefObject<HTMLDivElement | null>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAccountOptions, setShowAccountOptions] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.getElementById("children");
    if (!element) return;

    const handleScroll = () => setScrolled(element.scrollTop > 25);
    element.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountOptions(false);
      }
    };

    if (showAccountOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountOptions]);

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        scrolled,
        showAccountOptions,
        setShowAccountOptions,
        menuRef,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext deve ser usado dentro de SidebarProvider"
    );
  }
  return context;
}

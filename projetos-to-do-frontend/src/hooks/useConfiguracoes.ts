import { useState } from "react";

export function useConfiguracoes() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return {
    showLogoutModal,
    setShowLogoutModal,
  };
}

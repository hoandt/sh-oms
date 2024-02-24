"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface SidebarContextType {
  toggleSidebar: boolean;
  setToggleSidebar: Dispatch<SetStateAction<boolean>>;
}

const useSidebar = () => {
  const [toggleSidebar, setToggleSidebar] = useState(true);

  return {
    toggleSidebar,
    setToggleSidebar,
  };
};

export const SidebarContext = createContext<Partial<SidebarContextType>>({});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sidebar = useSidebar();

  return (
    <SidebarContext.Provider value={sidebar}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useEthereum must be used within an EthereumProvider");
  }

  return context;
};

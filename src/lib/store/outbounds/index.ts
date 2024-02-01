import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OutboundState {
  selectedCustomerTracking: any;
  setSelectedCustomerTracking: (by: any) => void;
}

export const useOutbound = create<OutboundState>()((set) => ({
  selectedCustomerTracking: {},
  setSelectedCustomerTracking: (by) =>
    set((state) => ({
      selectedCustomerTracking: by,
    })),
}));

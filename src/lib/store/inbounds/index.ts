import { create } from "zustand";

interface InboundState {
  bears: number;
  increase: (by: number) => void;
}

export const useBearStore = create<InboundState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));

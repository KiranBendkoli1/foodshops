import { create } from "zustand";

const useDiscStore = create((set, get) => ({
  item: "",
  discount: "",
  setItem: (val) => {
    set({ item: val });
  },
  setDiscount: (val) => {
    set({ discount: val });
  },
}));

export default useDiscStore;

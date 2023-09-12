import { create } from "zustand";
import { signUpApi, signInApi } from "../api/AuthAPI";
import { toast } from "react-toastify";
const useAuthStore = create((set, get) => ({
  isLoading: false,
  user: {},
  signUp: async (data) => {
    const { name, email, contact, password, userType } = data;
    set({ isLoading: true });
    const result = await signUpApi(name, email, contact, password, userType);
    if (result.data !== null) {
      set({ isLoading: false, user: result });
      return result;
    }
    set({ isLoading: false });
  },
  signIn: async (data) => {
    const { email, password } = data;
    set({ isLoading: true });
    const result = await signInApi(email, password);
    console.log(result)
    set({ isLoading: false, user: result });
    return result;
  },
  logout: async (data) => {
    localStorage.removeItem("user");
    toast.success("User logged out successfully");
    set({ user: null });
    return null;
  },
}));

export default useAuthStore;

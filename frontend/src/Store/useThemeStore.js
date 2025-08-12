import { create } from 'zustand'

 export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Saathio-theme")||"forest",
  setTheme:(theme) => {
    localStorage.setItem("Saathio-theme",theme);
    set({theme})
  },
}))
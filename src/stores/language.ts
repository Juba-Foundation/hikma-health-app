import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';
import {persist} from 'zustand/middleware';

type language = 'en' | 'ar';

type LanguageState = {
  language: language;
  setLanguage: (lng: language) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lng) => set((state) => ({language: lng})),
    }),
    {
      name: 'language-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);

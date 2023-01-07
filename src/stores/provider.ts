import create from 'zustand';
import {User} from '../types/User';

type ProviderState = {
  provider: User | null;
  setProvider: (provider: User | null) => void;
};

export const useProviderStore = create<ProviderState>((set) => ({
  provider: null,
  setProvider: (provider: User | null = null) => set(() => ({provider})),
}));

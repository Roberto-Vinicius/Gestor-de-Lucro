/**
 * @file useUIStore.ts
 * @description Store global para estados de interface gráfica (como Snackbar).
 */

import { create } from 'zustand';

export type TipoSnackbar = 'sucesso' | 'erro' | 'aviso';

interface UIState {
  snackbarVisivel: boolean;
  snackbarMensagem: string;
  snackbarTipo: TipoSnackbar;
  mostrarSnackbar: (mensagem: string, tipo?: TipoSnackbar) => void;
  esconderSnackbar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  snackbarVisivel: false,
  snackbarMensagem: '',
  snackbarTipo: 'sucesso',
  
  mostrarSnackbar: (mensagem, tipo = 'sucesso') => {
    set({ snackbarVisivel: true, snackbarMensagem: mensagem, snackbarTipo: tipo });
    
    // Auto-esconder após 3.5 segundos
    setTimeout(() => {
      set((state) => {
        // Checa se a mensagem atual ainda é a mesma antes de esconder,
        // para não conflitar caso outra mensagem tenha sido disparada
        if (state.snackbarMensagem === mensagem) {
          return { snackbarVisivel: false };
        }
        return state;
      });
    }, 3500);
  },

  esconderSnackbar: () => set({ snackbarVisivel: false }),
}));

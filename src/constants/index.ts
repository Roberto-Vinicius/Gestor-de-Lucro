/**
 * @file constants/index.ts
 * @description Constantes centralizadas do aplicativo.
 */

/** Nomes das coleções no Firestore */
export const COLECOES = {
  COMPRAS: 'compras',
  VENDAS: 'vendas',
} as const;

/** Paleta de cores do tema escuro do app */
export const CORES = {
  fundo: '#0f0f23',
  fundoSecundario: '#1a1a35',
  fundoCard: '#1e1e3a',
  primaria: '#6c63ff',
  primaryLight: '#8b83ff',
  secundaria: '#ff6584',
  sucesso: '#4caf50',
  aviso: '#ff9800',
  erro: '#f44336',
  texto: '#ffffff',
  textoSecundario: '#9ca3af',
  borda: '#2d2d5a',
  compra: '#4caf50',
  venda: '#ff6584',
} as const;

/** Espaçamento padrão */
export const ESPACAMENTO = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Border radius padrão */
export const RAIO = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

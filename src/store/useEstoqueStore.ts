/**
 * @file useEstoqueStore.ts
 * @description Store global do Zustand para gerenciamento de estado das Compras e Vendas.
 *
 * Arquitetura:
 * - Estado reativo: compras, vendas, statusCarregamento, erro
 * - Actions: funções que chamam os serviços Firebase e atualizam o estado
 * - A UI só interage com esta store, nunca com o Firebase diretamente
 */

import { create } from 'zustand';
import type {
  Compra,
  NovaCompra,
  Venda,
  NovaVenda,
  ResumoEstoque,
  StatusCarregamento,
} from '../types';
import {
  buscarCompras,
  adicionarCompra,
  buscarVendas,
  registrarVenda,
} from '../services/estoqueService';

// ─── Interface da Store ───────────────────────────────────────────────────────

interface EstoqueState {
  // Estado
  compras: Compra[];
  vendas: Venda[];
  status: StatusCarregamento;
  erro: string | null;

  // Dados derivados (calculados, não persistidos)
  resumo: ResumoEstoque;

  // Actions de Compra
  carregarDados: () => Promise<void>;
  adicionarCompra: (dados: NovaCompra) => Promise<void>;

  // Actions de Venda
  registrarVenda: (dados: NovaVenda) => Promise<void>;

  // Utilitários
  limparErro: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Calcula o resumo financeiro a partir das listas de compras e vendas.
 */
function calcularResumo(compras: Compra[], vendas: Venda[]): ResumoEstoque {
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  // 1. Valor Investido: soma do valorCompra de itens "disponíveis"
  const valorInvestido = compras
    .filter((c) => c.status === 'disponível')
    .reduce((acc, c) => acc + c.valorCompra, 0);

  let lucroMes = 0;
  let lucroAno = 0;
  let somaMargem = 0;

  vendas.forEach((v) => {
    const dataVenda = v.dataVenda;
    
    // 2. Lucro do Mês e do Ano
    if (dataVenda.getFullYear() === anoAtual) {
      lucroAno += v.lucroReais;
      if (dataVenda.getMonth() === mesAtual) {
        lucroMes += v.lucroReais;
      }
    }

    // Para calcular a média da margem de lucro
    somaMargem += v.margemLucroPorcentagem;
  });

  // 4. Média de Margem (%)
  const mediaMargemLucro = vendas.length > 0 ? somaMargem / vendas.length : 0;

  return {
    valorInvestido,
    lucroMes,
    lucroAno,
    mediaMargemLucro,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEstoqueStore = create<EstoqueState>((set, get) => ({
  // ─── Estado Inicial ──────────────────────────────────────────────────────

  compras: [],
  vendas: [],
  status: 'idle',
  erro: null,
  resumo: calcularResumo([], []),

  // ─── Actions de Compra ──────────────────────────────────────────────────

  /**
   * Carrega todas as compras e vendas do Firestore e atualiza o resumo calculado.
   */
  carregarDados: async () => {
    set({ status: 'carregando', erro: null });
    try {
      const [compras, vendas] = await Promise.all([
        buscarCompras(),
        buscarVendas()
      ]);

      set({
        compras,
        vendas,
        resumo: calcularResumo(compras, vendas),
        status: 'sucesso',
      });
    } catch (e) {
      set({
        status: 'erro',
        erro: e instanceof Error ? e.message : 'Erro ao carregar os dados.',
      });
    }
  },

  /**
   * Persiste uma nova compra no Firestore e atualiza o estado local
   * de forma otimista.
   */
  adicionarCompra: async (dados: NovaCompra) => {
    set({ status: 'carregando', erro: null });
    try {
      const novaCompra = await adicionarCompra(dados);
      const compras = [novaCompra, ...get().compras]; // Nova no topo

      set({
        compras,
        resumo: calcularResumo(compras, get().vendas),
        status: 'sucesso',
      });
    } catch (e) {
      set({
        status: 'erro',
        erro: e instanceof Error ? e.message : 'Erro ao adicionar compra.',
      });
      throw e; // Re-lança para o formulário saber que falhou
    }
  },

  // ─── Actions de Venda ──────────────────────────────────────────────────

  /**
   * Registra uma nova venda e atualiza o status da compra no Firestore.
   * Após sucesso, atualiza o estado local sem re-fetch completo.
   */
  registrarVenda: async (dados: NovaVenda) => {
    set({ status: 'carregando', erro: null });

    const compras = get().compras;
    const compra = compras.find((c) => c.id === dados.compraId);
    
    if (!compra) {
      set({ status: 'erro', erro: 'Compra não encontrada no estoque.' });
      throw new Error('Compra não encontrada no estoque.');
    }

    try {
      const novaVenda = await registrarVenda(dados, compra);

      // Atualiza o status da compra localmente
      const novasCompras = compras.map((c) =>
        c.id === compra.id ? { ...c, status: 'vendido' as const } : c
      );

      const novasVendas = [novaVenda, ...get().vendas]; // Nova no topo

      set({
        vendas: novasVendas,
        compras: novasCompras,
        resumo: calcularResumo(novasCompras, novasVendas),
        status: 'sucesso',
      });
    } catch (e) {
      set({
        status: 'erro',
        erro: e instanceof Error ? e.message : 'Erro ao registrar venda.',
      });
      throw e;
    }
  },

  // ─── Utilitários ─────────────────────────────────────────────────────────

  limparErro: () => set({ erro: null, status: 'idle' }),
}));

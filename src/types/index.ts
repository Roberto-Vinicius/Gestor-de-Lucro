/**
 * @file index.ts
 * @description Interfaces TypeScript centrais do domínio de negócio.
 * Todos os tipos do app são exportados a partir deste arquivo.
 */

// ─── Compra (Estoque Atual) ──────────────────────────────────────────────────

/**
 * Representa a compra de um produto para o estoque.
 */
export interface Compra {
  /** ID único gerado pelo Firestore */
  id: string;
  /** Nome do produto comprado */
  nomeProduto: string;
  /** Valor pago na compra (custo) */
  valorCompra: number;
  /** Detalhes do produto (texto livre) */
  detalhes: string;
  /** Observação interna */
  observacao: string;
  /** Data em que a compra foi realizada */
  dataCompra: Date;
  /** Status atual no estoque */
  status: 'disponível' | 'vendido';
}

/** Payload para criar uma compra (sem id — gerado automaticamente) */
export type NovaCompra = Omit<Compra, 'id'>;

// ─── Venda ───────────────────────────────────────────────────────────────────

/**
 * Representa a venda de um produto que estava no estoque.
 */
export interface Venda {
  /** ID único gerado pelo Firestore */
  id: string;
  /** Referência ao ID da compra do produto vendido */
  compraId: string;
  /** Valor cobrado na venda */
  valorVenda: number;
  /** Nome do comprador */
  compradorNome: string;
  /** Telefone do comprador */
  compradorTelefone: string;
  /** Observação da venda */
  observacaoVenda: string;
  /** Detalhes finais do produto, editados na hora da venda */
  detalhesFinaisProduto: string;
  /** Data em que a venda foi realizada */
  dataVenda: Date;
  /** Lucro absoluto da venda em Reais (calculado) */
  lucroReais: number;
  /** Margem de lucro em porcentagem (calculada) */
  margemLucroPorcentagem: number;
}

/** Payload para criar uma venda (sem id — gerado automaticamente) */
export type NovaVenda = Omit<Venda, 'id'>;

// ─── Estado da Store ─────────────────────────────────────────────────────────

/** Estado de carregamento de operações assíncronas */
export type StatusCarregamento = 'idle' | 'carregando' | 'sucesso' | 'erro';

/** Resumo agregado do estoque/vendas para exibir no dashboard */
export interface ResumoEstoque {
  /** Soma do valorCompra dos itens com status 'disponível' */
  valorInvestido: number;
  /** Soma do lucroReais das vendas feitas no mês atual */
  lucroMes: number;
  /** Soma do lucroReais das vendas feitas no ano atual */
  lucroAno: number;
  /** Média da margemLucroPorcentagem de todas as vendas */
  mediaMargemLucro: number;
}

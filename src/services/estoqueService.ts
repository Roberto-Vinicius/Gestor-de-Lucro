/**
 * @file estoqueService.ts
 * @description Camada de serviço para operações no Firestore.
 *
 * Toda a lógica de persistência fica aqui — a store Zustand chama estes
 * métodos e não conhece os detalhes do Firebase.
 *
 * Regra crítica: a operação de registrar venda usa Batched Write para
 * garantir que a venda seja salva E o status da compra seja atualizado
 * de forma atômica. Se qualquer parte falhar, tudo é revertido.
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  writeBatch,
  query,
  orderBy,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { COLECOES } from '../constants';
import type { Compra, NovaCompra, Venda, NovaVenda } from '../types';

// ─── Conversores (Firestore → Domínio) ───────────────────────────────────────

/**
 * Converte um documento Firestore em um objeto Compra tipado.
 * Firestore retorna Timestamps; convertemos para Date do JavaScript.
 */
function converterCompra(doc: QueryDocumentSnapshot<DocumentData>): Compra {
  const dados = doc.data();
  return {
    id: doc.id,
    nomeProduto: dados.nomeProduto,
    valorCompra: dados.valorCompra,
    detalhes: dados.detalhes || '',
    observacao: dados.observacao || '',
    dataCompra: (dados.dataCompra as Timestamp).toDate(),
    status: dados.status,
  };
}

/**
 * Converte um documento Firestore em um objeto Venda tipado.
 */
function converterVenda(doc: QueryDocumentSnapshot<DocumentData>): Venda {
  const dados = doc.data();
  return {
    id: doc.id,
    compraId: dados.compraId,
    valorVenda: dados.valorVenda,
    compradorNome: dados.compradorNome || '',
    compradorTelefone: dados.compradorTelefone || '',
    observacaoVenda: dados.observacaoVenda || '',
    detalhesFinaisProduto: dados.detalhesFinaisProduto || '',
    dataVenda: (dados.dataVenda as Timestamp).toDate(),
    lucroReais: dados.lucroReais,
    margemLucroPorcentagem: dados.margemLucroPorcentagem,
  };
}

// ─── Serviços de Compra ──────────────────────────────────────────────────────

/**
 * Busca todas as compras ordenadas por data de compra.
 */
export async function buscarCompras(): Promise<Compra[]> {
  const q = query(
    collection(db, COLECOES.COMPRAS),
    orderBy('dataCompra', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(converterCompra);
}

/**
 * Adiciona uma nova compra ao Firestore.
 * @returns A compra criada com id gerado pelo Firestore
 */
export async function adicionarCompra(dados: NovaCompra): Promise<Compra> {
  const payload = {
    ...dados,
    dataCompra: Timestamp.fromDate(dados.dataCompra),
  };
  const docRef = await addDoc(collection(db, COLECOES.COMPRAS), payload);
  return {
    id: docRef.id,
    ...dados,
  };
}

// ─── Serviços de Venda ───────────────────────────────────────────────────────

/**
 * Busca todas as vendas ordenadas por data decrescente.
 */
export async function buscarVendas(): Promise<Venda[]> {
  const q = query(
    collection(db, COLECOES.VENDAS),
    orderBy('dataVenda', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(converterVenda);
}

/**
 * Registra uma venda e atualiza o status da compra correspondente atomicamente.
 *
 * Usa Batched Write: ambas as operações (salvar venda + atualizar
 * status da compra para 'vendido') são enviadas juntas. Se uma falhar, a outra
 * também falha, evitando inconsistências de dados.
 *
 * @param dados - Dados da venda (sem id)
 * @param compra - Compra envolvida (para validar status)
 * @returns A venda criada com id gerado pelo Firestore
 */
export async function registrarVenda(
  dados: NovaVenda,
  compra: Compra
): Promise<Venda> {
  if (compra.status !== 'disponível') {
    throw new Error('Esta compra já foi vendida ou não está disponível.');
  }

  const batch = writeBatch(db);

  // 1. Prepara o documento da nova venda
  const vendaRef = doc(collection(db, COLECOES.VENDAS));
  const vendaPayload = {
    ...dados,
    dataVenda: Timestamp.fromDate(dados.dataVenda),
  };
  batch.set(vendaRef, vendaPayload);

  // 2. Atualiza o status do documento de compra para 'vendido'
  const compraRef = doc(db, COLECOES.COMPRAS, compra.id);
  batch.update(compraRef, { status: 'vendido' });

  // 3. Comita as duas operações atomicamente
  await batch.commit();

  return {
    id: vendaRef.id,
    ...dados,
  };
}

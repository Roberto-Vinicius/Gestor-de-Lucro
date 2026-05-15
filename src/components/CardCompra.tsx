/**
 * @file components/CardCompra.tsx
 * @description Card de uma compra exibido na FlashList do dashboard.
 * Mostra detalhes da compra e o status (Disponível ou Vendido).
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CORES, RAIO, ESPACAMENTO } from '../constants';
import type { Compra } from '../types';

interface Props {
  compra: Compra;
  onPress?: (compra: Compra) => void;
}

/** Formata um número como moeda brasileira */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function CardCompra({ compra, onPress }: Props) {
  const isVendido = compra.status === 'vendido';
  const corStatus = isVendido ? CORES.textoSecundario : CORES.sucesso;

  return (
    <TouchableOpacity
      style={[styles.card, isVendido && styles.cardVendido]}
      onPress={() => onPress?.(compra)}
      activeOpacity={0.75}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[styles.nome, isVendido && styles.textoVendido]} numberOfLines={1}>
          {compra.nomeProduto}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: corStatus + '22' }]}>
          <Text style={[styles.statusTexto, { color: corStatus }]}>
            {compra.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Detalhes de preço e data */}
      <View style={styles.detalhes}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Valor Investido</Text>
          <Text style={[styles.valor, isVendido && styles.textoVendido]}>
            {formatarMoeda(compra.valorCompra)}
          </Text>
        </View>
        <View style={styles.divisor} />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data</Text>
          <Text style={[styles.dataTexto, isVendido && styles.textoVendido]}>
            {compra.dataCompra.toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CORES.fundoCard,
    borderRadius: RAIO.lg,
    padding: ESPACAMENTO.md,
    marginHorizontal: ESPACAMENTO.md,
    marginVertical: ESPACAMENTO.xs,
    borderWidth: 1,
    borderColor: CORES.borda,
    gap: 12,
  },
  cardVendido: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  nome: {
    flex: 1,
    color: CORES.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  textoVendido: {
    color: CORES.textoSecundario,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RAIO.full,
  },
  statusTexto: {
    fontSize: 10,
    fontWeight: '700',
  },
  detalhes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoItem: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  infoLabel: {
    color: CORES.textoSecundario,
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valor: {
    color: CORES.texto,
    fontSize: 14,
    fontWeight: '600',
  },
  dataTexto: {
    color: CORES.textoSecundario,
    fontSize: 14,
    fontWeight: '500',
  },
  divisor: {
    width: 1,
    height: 28,
    backgroundColor: CORES.borda,
  },
});

/**
 * @file app/(drawer)/historico/index.tsx
 * @description Tela para exibir o histórico completo de compras e vendas realizadas.
 */

import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CORES, ESPACAMENTO, RAIO } from '../../../src/constants';
import { useEstoqueStore } from '../../../src/store/useEstoqueStore';
import { formatarMoeda } from '../../../src/components/CardCompra';
import { maskData, parseDataBr } from '../../../src/utils/masks';

export default function HistoricoScreen() {
  const { compras, vendas } = useEstoqueStore();
  const [abaAtiva, setAbaAtiva] = useState<'compras' | 'vendas'>('compras');
  
  // Estado dos filtros de data
  const [dataInicioStr, setDataInicioStr] = useState('');
  const [dataFimStr, setDataFimStr] = useState('');

  // Ordenar e Filtrar por data
  const comprasFiltradas = useMemo(() => {
    let resultado = [...compras];

    const dataInicio = parseDataBr(dataInicioStr);
    const dataFim = parseDataBr(dataFimStr);

    if (dataInicio) {
      // Começo do dia
      dataInicio.setHours(0, 0, 0, 0);
      resultado = resultado.filter((c) => c.dataCompra >= dataInicio);
    }
    
    if (dataFim) {
      // Final do dia
      dataFim.setHours(23, 59, 59, 999);
      resultado = resultado.filter((c) => c.dataCompra <= dataFim);
    }

    return resultado.sort((a, b) => b.dataCompra.getTime() - a.dataCompra.getTime());
  }, [compras, dataInicioStr, dataFimStr]);

  const vendasFiltradas = useMemo(() => {
    let resultado = [...vendas];

    const dataInicio = parseDataBr(dataInicioStr);
    const dataFim = parseDataBr(dataFimStr);

    if (dataInicio) {
      dataInicio.setHours(0, 0, 0, 0);
      resultado = resultado.filter((v) => v.dataVenda >= dataInicio);
    }
    
    if (dataFim) {
      dataFim.setHours(23, 59, 59, 999);
      resultado = resultado.filter((v) => v.dataVenda <= dataFim);
    }

    return resultado.sort((a, b) => b.dataVenda.getTime() - a.dataVenda.getTime());
  }, [vendas, dataInicioStr, dataFimStr]);

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Abas */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'compras' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('compras')}
        >
          <Text style={[styles.tabText, abaAtiva === 'compras' && styles.tabTextAtiva]}>
            Compras
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'vendas' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('vendas')}
        >
          <Text style={[styles.tabText, abaAtiva === 'vendas' && styles.tabTextAtiva]}>
            Vendas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros de Data */}
      <View style={styles.filterContainer}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Data Inicial</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={CORES.textoSecundario}
            keyboardType="number-pad"
            value={dataInicioStr}
            onChangeText={(txt) => setDataInicioStr(maskData(txt))}
          />
        </View>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Data Final</Text>
          <TextInput
            style={styles.filterInput}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={CORES.textoSecundario}
            keyboardType="number-pad"
            value={dataFimStr}
            onChangeText={(txt) => setDataFimStr(maskData(txt))}
          />
        </View>
      </View>

      {/* Lista */}
      <View style={styles.listContainer}>
        {abaAtiva === 'compras' ? (
          <FlatList
            data={comprasFiltradas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatlistContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma compra registrada.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.nomeProduto}</Text>
                  <Text style={styles.cardDate}>{formatarData(item.dataCompra)}</Text>
                </View>
                <Text style={styles.cardInfo}>Custo: {formatarMoeda(item.valorCompra)}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, item.status === 'disponível' ? styles.badgeDisponivel : styles.badgeVendido]}>
                    <Text style={[styles.badgeText, item.status === 'disponível' ? styles.badgeTextDisponivel : styles.badgeTextVendido]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={vendasFiltradas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatlistContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma venda registrada.</Text>
            }
            renderItem={({ item }) => {
              const produtoOriginal = compras.find((c) => c.id === item.compraId);
              const nomeProduto = produtoOriginal ? produtoOriginal.nomeProduto : 'Produto Deletado';

              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{nomeProduto}</Text>
                    <Text style={styles.cardDate}>{formatarData(item.dataVenda)}</Text>
                  </View>
                  <Text style={styles.cardInfo}>Vendido por: {formatarMoeda(item.valorVenda)}</Text>
                  {item.compradorNome ? (
                    <Text style={styles.cardInfoSecundaria}>Comprador: {item.compradorNome}</Text>
                  ) : null}
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, item.lucroReais >= 0 ? styles.badgeLucro : styles.badgePrejuizo]}>
                      <Text style={[styles.badgeText, item.lucroReais >= 0 ? styles.badgeTextLucro : styles.badgeTextPrejuizo]}>
                        {item.lucroReais >= 0 ? 'LUCRO' : 'PREJUÍZO'}: {formatarMoeda(item.lucroReais)} ({item.margemLucroPorcentagem.toFixed(1)}%)
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: ESPACAMENTO.lg,
    paddingBottom: ESPACAMENTO.sm,
    gap: ESPACAMENTO.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: ESPACAMENTO.sm,
    alignItems: 'center',
    borderRadius: RAIO.md,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.fundoCard,
  },
  tabAtiva: {
    backgroundColor: CORES.primaria,
    borderColor: CORES.primaria,
  },
  tabText: {
    color: CORES.textoSecundario,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextAtiva: {
    color: CORES.texto,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: ESPACAMENTO.lg,
    paddingBottom: ESPACAMENTO.sm,
    gap: ESPACAMENTO.md,
  },
  filterGroup: {
    flex: 1,
    gap: 4,
  },
  filterLabel: {
    color: CORES.textoSecundario,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  filterInput: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO.sm,
    padding: ESPACAMENTO.sm,
    paddingHorizontal: ESPACAMENTO.md,
    color: CORES.texto,
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
  },
  flatlistContent: {
    padding: ESPACAMENTO.lg,
    paddingTop: ESPACAMENTO.sm,
    gap: ESPACAMENTO.md,
  },
  card: {
    backgroundColor: CORES.fundoCard,
    borderRadius: RAIO.md,
    padding: ESPACAMENTO.md,
    borderWidth: 1,
    borderColor: CORES.borda,
    gap: ESPACAMENTO.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: CORES.texto,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  cardDate: {
    color: CORES.textoSecundario,
    fontSize: 12,
  },
  cardInfo: {
    color: CORES.texto,
    fontSize: 14,
    fontWeight: '500',
  },
  cardInfoSecundaria: {
    color: CORES.textoSecundario,
    fontSize: 13,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: ESPACAMENTO.xs,
  },
  badge: {
    paddingHorizontal: ESPACAMENTO.sm,
    paddingVertical: 4,
    borderRadius: RAIO.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgeDisponivel: { backgroundColor: `${CORES.sucesso}22` },
  badgeTextDisponivel: { color: CORES.sucesso },
  badgeVendido: { backgroundColor: `${CORES.textoSecundario}22` },
  badgeTextVendido: { color: CORES.textoSecundario },
  badgeLucro: { backgroundColor: `${CORES.sucesso}22` },
  badgeTextLucro: { color: CORES.sucesso },
  badgePrejuizo: { backgroundColor: `${CORES.erro}22` },
  badgeTextPrejuizo: { color: CORES.erro },
  emptyText: {
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginTop: ESPACAMENTO.xl,
  },
});

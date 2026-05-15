/**
 * @file app/(drawer)/index.tsx
 * @description Dashboard principal — exibe resumo financeiro e lista de compras em estoque.
 *
 * Usa FlashList para renderização de alta performance na lista de compras.
 * Os dados são carregados na montagem do componente via useEffect.
 */

import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardCompra, formatarMoeda } from '../../src/components/CardCompra';
import { CardResumo } from '../../src/components/CardResumo';
import { LoadingOverlay } from '../../src/components/LoadingOverlay';
import { CORES, ESPACAMENTO, RAIO } from '../../src/constants';
import { useEstoqueStore } from '../../src/store/useEstoqueStore';
import type { Compra } from '../../src/types';

export default function DashboardScreen() {
  const router = useRouter();
  const { compras, resumo, status, erro, carregarDados, limparErro } =
    useEstoqueStore();

  // Carrega dados na montagem
  useEffect(() => {
    carregarDados();
  }, []);

  // Exibe alerta de erro
  useEffect(() => {
    if (erro) {
      Alert.alert('Erro', erro, [{ text: 'OK', onPress: limparErro }]);
    }
  }, [erro]);

  // Renderiza cada item da FlashList
  const renderCompra = useCallback(
    ({ item }: { item: Compra }) => (
      <CardCompra compra={item} />
    ),
    []
  );

  // Separador entre itens
  const ItemSeparator = useCallback(
    () => <View style={{ height: 0 }} />,
    []
  );

  if (status === 'carregando' && compras.length === 0) {
    return <LoadingOverlay mensagem="Carregando dados..." />;
  }

  // Filtramos apenas as compras disponíveis para exibir na lista do dashboard
  const comprasDisponiveis = compras.filter((c) => c.status === 'disponível');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlashList
        data={comprasDisponiveis}
        renderItem={renderCompra}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        // Cabeçalho da lista (cards de resumo + botões)
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Título da seção de resumo */}
            <Text style={styles.secaoTitulo}>Visão Geral</Text>

            {/* Cards de Resumo */}
            <View style={styles.resumoGrid}>
              <CardResumo
                titulo="Valor Investido"
                valor={formatarMoeda(resumo.valorInvestido)}
                icone="📦"
                corIcone={CORES.primaria}
              />
              <CardResumo
                titulo="Lucro do Mês"
                valor={formatarMoeda(resumo.lucroMes)}
                icone="📈"
                corIcone={CORES.sucesso}
              />
            </View>
            <View style={styles.resumoGrid}>
              <CardResumo
                titulo="Lucro do Ano"
                valor={formatarMoeda(resumo.lucroAno)}
                icone="💰"
                corIcone={CORES.secundaria}
              />
              <CardResumo
                titulo="Média de Margem"
                valor={`${resumo.mediaMargemLucro.toFixed(1)}%`}
                icone="📊"
                corIcone={CORES.aviso}
              />
            </View>

            {/* Botões de Ação */}
            <View style={styles.acoesRow}>
              <TouchableOpacity
                style={[styles.btnAcao, { backgroundColor: CORES.primaria }]}
                onPress={() => router.push('/(drawer)/compra/novo')}
                activeOpacity={0.8}
              >
                <Text style={styles.btnAcaoTexto}>＋ Nova Compra</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnAcao, { backgroundColor: CORES.sucesso }]}
                onPress={() => router.push('/(drawer)/venda/nova')}
                activeOpacity={0.8}
              >
                <Text style={styles.btnAcaoTexto}>💵 Nova Venda</Text>
              </TouchableOpacity>
            </View>

            {/* Título da lista */}
            <Text style={styles.secaoTitulo}>Estoque Disponível</Text>
            {comprasDisponiveis.length === 0 && status !== 'carregando' && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyTitulo}>Nenhum item em estoque</Text>
                <Text style={styles.emptySubtitulo}>
                  Toque em "＋ Nova Compra" para adicionar um produto ao seu estoque.
                </Text>
              </View>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  listContent: {
    paddingBottom: ESPACAMENTO.xxl,
  },
  header: {
    padding: ESPACAMENTO.md,
    gap: ESPACAMENTO.md,
  },
  secaoTitulo: {
    color: CORES.texto,
    fontSize: 18,
    fontWeight: '700',
    marginTop: ESPACAMENTO.xs,
  },
  resumoGrid: {
    flexDirection: 'row',
    gap: ESPACAMENTO.sm,
  },
  acoesRow: {
    flexDirection: 'row',
    gap: ESPACAMENTO.sm,
  },
  btnAcao: {
    flex: 1,
    paddingVertical: ESPACAMENTO.md,
    borderRadius: RAIO.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAcaoTexto: {
    color: CORES.texto,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: ESPACAMENTO.xxl,
    gap: ESPACAMENTO.sm,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitulo: {
    color: CORES.texto,
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitulo: {
    color: CORES.textoSecundario,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
});

/**
 * @file app/(drawer)/venda/nova.tsx
 * @description Formulário para registro de uma Nova Venda com máscaras.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CORES, ESPACAMENTO, RAIO } from '../../../src/constants';
import { useEstoqueStore } from '../../../src/store/useEstoqueStore';
import type { Compra } from '../../../src/types';
import { formatarMoeda } from '../../../src/components/CardCompra';
import { maskMoeda, desmaskMoeda, maskTelefone } from '../../../src/utils/masks';
import { useUIStore } from '../../../src/store/useUIStore';

export default function NovaVendaScreen() {
  const { compras, registrarVenda } = useEstoqueStore();
  const { mostrarSnackbar } = useUIStore();

  const comprasDisponiveis = compras.filter((c) => c.status === 'disponível');

  const [modalVisible, setModalVisible] = useState(false);
  const [compraSelecionada, setCompraSelecionada] = useState<Compra | null>(null);
  const [detalhesFinais, setDetalhesFinais] = useState('');
  const [valorVendaStr, setValorVendaStr] = useState('');
  const [compradorNome, setCompradorNome] = useState('');
  const [compradorTelefone, setCompradorTelefone] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Cálculos em tempo real
  const valorVendaNum = desmaskMoeda(valorVendaStr);
  const lucroReal = compraSelecionada ? valorVendaNum - compraSelecionada.valorCompra : 0;
  const margemLucro = compraSelecionada && compraSelecionada.valorCompra > 0 
    ? (lucroReal / compraSelecionada.valorCompra) * 100 
    : 0;

  const limparFormulario = () => {
    setCompraSelecionada(null);
    setDetalhesFinais('');
    setValorVendaStr('');
    setCompradorNome('');
    setCompradorTelefone('');
    setObservacao('');
  };

  const handleSelecionarCompra = (compra: Compra) => {
    setCompraSelecionada(compra);
    setDetalhesFinais(compra.detalhes); // Preenche automaticamente
    setModalVisible(false);
  };

  const handleSalvar = async () => {
    if (!compraSelecionada) {
      mostrarSnackbar('Selecione um produto para vender.', 'aviso');
      return;
    }
    if (valorVendaNum <= 0) {
      mostrarSnackbar('Informe um valor de venda válido.', 'aviso');
      return;
    }

    setSalvando(true);
    try {
      await registrarVenda({
        compraId: compraSelecionada.id,
        valorVenda: valorVendaNum,
        compradorNome: compradorNome.trim(),
        compradorTelefone: compradorTelefone.trim(),
        observacaoVenda: observacao.trim(),
        detalhesFinaisProduto: detalhesFinais.trim(),
        dataVenda: new Date(),
        lucroReais: lucroReal,
        margemLucroPorcentagem: margemLucro,
      });

      mostrarSnackbar('✅ Item vendido e estoque atualizado!', 'sucesso');
      limparFormulario();
    } catch (e) {
      mostrarSnackbar('Não foi possível registrar a venda.', 'erro');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.titulo}>Registrar Venda</Text>

          {/* Selecionador de Produto */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Produto</Text>
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={compraSelecionada ? styles.selectButtonText : styles.selectButtonPlaceholder}>
                {compraSelecionada ? compraSelecionada.nomeProduto : 'Toque para selecionar um produto'}
              </Text>
              <Text style={{ color: CORES.textoSecundario }}>▼</Text>
            </TouchableOpacity>
          </View>

          {compraSelecionada && (
            <>
              <View style={styles.resumoCompraBox}>
                <Text style={styles.resumoCompraText}>
                  Custo Original: {formatarMoeda(compraSelecionada.valorCompra)}
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Valor da Venda (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 4.500,00"
                  placeholderTextColor={CORES.textoSecundario}
                  keyboardType="number-pad"
                  value={valorVendaStr}
                  onChangeText={(txt) => setValorVendaStr(maskMoeda(txt))}
                />
              </View>

              {/* Indicador de Lucro em Tempo Real */}
              {valorVendaStr.length > 0 && (
                <View style={[styles.lucroBadge, lucroReal < 0 && styles.prejuizoBadge]}>
                  <Text style={styles.lucroBadgeText}>
                    {lucroReal >= 0 ? 'Lucro Projetado:' : 'Prejuízo Projetado:'} {formatarMoeda(lucroReal)} ({margemLucro.toFixed(1)}%)
                  </Text>
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Detalhes do Produto Entregue</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Detalhes atuais da bateria, arranhões, etc"
                  placeholderTextColor={CORES.textoSecundario}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={detalhesFinais}
                  onChangeText={setDetalhesFinais}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome do Comprador (Opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: João da Silva"
                  placeholderTextColor={CORES.textoSecundario}
                  value={compradorNome}
                  onChangeText={setCompradorNome}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Telefone do Comprador (Opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: (84) 99999-9999"
                  placeholderTextColor={CORES.textoSecundario}
                  keyboardType="phone-pad"
                  value={compradorTelefone}
                  onChangeText={(txt) => setCompradorTelefone(maskTelefone(txt))}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Observação Interna (Opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ex: Pagou em PIX, garantia de 30 dias"
                  placeholderTextColor={CORES.textoSecundario}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  value={observacao}
                  onChangeText={setObservacao}
                />
              </View>

              <TouchableOpacity
                style={styles.btnSalvar}
                onPress={handleSalvar}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color={CORES.texto} />
                ) : (
                  <Text style={styles.btnSalvarTexto}>Confirmar Venda</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal para seleção de produto */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Produto</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {comprasDisponiveis.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum produto disponível em estoque.</Text>
            ) : (
              <FlatList
                data={comprasDisponiveis}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.modalItem}
                    onPress={() => handleSelecionarCompra(item)}
                  >
                    <Text style={styles.modalItemNome}>{item.nomeProduto}</Text>
                    <Text style={styles.modalItemCusto}>Custo: {formatarMoeda(item.valorCompra)}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  scrollContent: {
    padding: ESPACAMENTO.lg,
    gap: ESPACAMENTO.md,
  },
  titulo: {
    color: CORES.texto,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: ESPACAMENTO.sm,
  },
  formGroup: {
    gap: ESPACAMENTO.xs,
  },
  label: {
    color: CORES.texto,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO.md,
    padding: ESPACAMENTO.md,
    color: CORES.texto,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
  },
  selectButton: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: RAIO.md,
    padding: ESPACAMENTO.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    color: CORES.texto,
    fontSize: 16,
  },
  selectButtonPlaceholder: {
    color: CORES.textoSecundario,
    fontSize: 16,
  },
  resumoCompraBox: {
    backgroundColor: CORES.primaria + '22',
    padding: ESPACAMENTO.sm,
    borderRadius: RAIO.sm,
    alignItems: 'center',
  },
  resumoCompraText: {
    color: CORES.primaria,
    fontWeight: '600',
  },
  lucroBadge: {
    backgroundColor: CORES.sucesso + '22',
    padding: ESPACAMENTO.sm,
    borderRadius: RAIO.sm,
    alignItems: 'center',
  },
  prejuizoBadge: {
    backgroundColor: CORES.erro + '22',
  },
  lucroBadgeText: {
    color: CORES.texto,
    fontWeight: '700',
    fontSize: 15,
  },
  btnSalvar: {
    backgroundColor: CORES.sucesso,
    borderRadius: RAIO.md,
    padding: ESPACAMENTO.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ESPACAMENTO.md,
  },
  btnSalvarTexto: {
    color: CORES.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  /* Estilos do Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: CORES.fundoSecundario,
    borderTopLeftRadius: RAIO.xl,
    borderTopRightRadius: RAIO.xl,
    maxHeight: '70%',
    padding: ESPACAMENTO.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTO.md,
  },
  modalTitle: {
    color: CORES.texto,
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: ESPACAMENTO.sm,
    backgroundColor: CORES.fundoCard,
    borderRadius: RAIO.full,
  },
  modalCloseBtnText: {
    color: CORES.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: CORES.borda,
  },
  modalItem: {
    paddingVertical: ESPACAMENTO.md,
  },
  modalItemNome: {
    color: CORES.texto,
    fontSize: 16,
    fontWeight: '600',
  },
  modalItemCusto: {
    color: CORES.textoSecundario,
    fontSize: 14,
    marginTop: 4,
  },
  emptyText: {
    color: CORES.textoSecundario,
    textAlign: 'center',
    padding: ESPACAMENTO.xl,
  },
});

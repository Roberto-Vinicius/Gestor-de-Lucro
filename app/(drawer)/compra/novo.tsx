/**
 * @file app/(drawer)/compra/novo.tsx
 * @description Formulário para registro de uma Nova Compra com máscaras e validações.
 */

import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
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
import { maskMoeda, desmaskMoeda, maskData, parseDataBr } from '../../../src/utils/masks';
import { useUIStore } from '../../../src/store/useUIStore';

export default function NovaCompraScreen() {
  const { adicionarCompra } = useEstoqueStore();
  const { mostrarSnackbar } = useUIStore();

  const [dataStr, setDataStr] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [valorCompraStr, setValorCompraStr] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Preenche a data inicial com o dia de hoje
  useEffect(() => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    setDataStr(`${dia}/${mes}/${ano}`);
  }, []);

  const limparFormulario = () => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    
    setDataStr(`${dia}/${mes}/${ano}`);
    setNomeProduto('');
    setValorCompraStr('');
    setDetalhes('');
    setObservacao('');
  };

  const handleSalvar = async () => {
    if (!nomeProduto.trim()) {
      mostrarSnackbar('Informe o nome do produto.', 'aviso');
      return;
    }

    const valor = desmaskMoeda(valorCompraStr);
    if (valor <= 0) {
      mostrarSnackbar('Informe um valor de compra válido.', 'aviso');
      return;
    }

    const dataObj = parseDataBr(dataStr);
    if (!dataObj) {
      mostrarSnackbar('Data inválida. Use DD/MM/AAAA.', 'erro');
      return;
    }

    // Impede adicionar datas no futuro
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    if (dataObj > hoje) {
      mostrarSnackbar('A data não pode ser no futuro.', 'erro');
      return;
    }

    setSalvando(true);
    try {
      await adicionarCompra({
        nomeProduto: nomeProduto.trim(),
        valorCompra: valor,
        detalhes: detalhes.trim(),
        observacao: observacao.trim(),
        dataCompra: dataObj,
        status: 'disponível',
      });
      
      mostrarSnackbar('✅ Produto adicionado ao estoque!', 'sucesso');
      limparFormulario();
    } catch (e) {
      mostrarSnackbar('Não foi possível salvar a compra.', 'erro');
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
          <Text style={styles.titulo}>Registrar Compra</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data da Compra (DD/MM/AAAA)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 15/05/2026"
              placeholderTextColor={CORES.textoSecundario}
              keyboardType="number-pad"
              value={dataStr}
              onChangeText={(txt) => setDataStr(maskData(txt))}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome do Produto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: iPhone 13 128GB"
              placeholderTextColor={CORES.textoSecundario}
              value={nomeProduto}
              onChangeText={setNomeProduto}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Valor de Compra (R$)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 3.500,00"
              placeholderTextColor={CORES.textoSecundario}
              keyboardType="number-pad"
              value={valorCompraStr}
              onChangeText={(txt) => setValorCompraStr(maskMoeda(txt))}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Detalhes do Produto</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Cor Azul, Bateria 100%, sem arranhões"
              placeholderTextColor={CORES.textoSecundario}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={detalhes}
              onChangeText={setDetalhes}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Observação Interna (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Comprado do fornecedor X"
              placeholderTextColor={CORES.textoSecundario}
              multiline
              numberOfLines={3}
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
              <Text style={styles.btnSalvarTexto}>Confirmar Compra</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    minHeight: 100,
  },
  btnSalvar: {
    backgroundColor: CORES.primaria,
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
});

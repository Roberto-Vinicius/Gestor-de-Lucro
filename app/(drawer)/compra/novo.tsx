/**
 * @file app/(drawer)/compra/novo.tsx
 * @description Formulário para registro de uma Nova Compra.
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

export default function NovaCompraScreen() {
  const router = useRouter();
  const { adicionarCompra } = useEstoqueStore();

  const [nomeProduto, setNomeProduto] = useState('');
  const [valorCompraStr, setValorCompraStr] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Data atual fixada como padrão para a UI
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  const handleSalvar = async () => {
    // Validação básica
    if (!nomeProduto.trim()) {
      Alert.alert('Atenção', 'Informe o nome do produto.');
      return;
    }

    const valor = parseFloat(valorCompraStr.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Atenção', 'Informe um valor de compra válido.');
      return;
    }

    setSalvando(true);
    try {
      await adicionarCompra({
        nomeProduto: nomeProduto.trim(),
        valorCompra: valor,
        detalhes: detalhes.trim(),
        observacao: observacao.trim(),
        dataCompra: new Date(), // Padrão: exato momento da submissão
        status: 'disponível',
      });
      
      Alert.alert('Sucesso!', 'Compra registrada com sucesso.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a compra.');
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
            <Text style={styles.label}>Data da Compra</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={dataHoje}
              editable={false}
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
              placeholder="Ex: 3500.00"
              placeholderTextColor={CORES.textoSecundario}
              keyboardType="decimal-pad"
              value={valorCompraStr}
              onChangeText={setValorCompraStr}
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
  inputDisabled: {
    opacity: 0.6,
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

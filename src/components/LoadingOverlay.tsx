/**
 * @file components/LoadingOverlay.tsx
 * @description Indicador de carregamento em overlay com animação de pulso.
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CORES } from '../constants';

interface Props {
  mensagem?: string;
}

export function LoadingOverlay({ mensagem = 'Carregando...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={CORES.primaria} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CORES.fundo,
    gap: 16,
  },
  texto: {
    color: CORES.textoSecundario,
    fontSize: 14,
    fontWeight: '500',
  },
});

/**
 * @file components/CardResumo.tsx
 * @description Card de métrica para exibir um valor resumido no dashboard.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CORES, RAIO, ESPACAMENTO } from '../constants';

interface Props {
  titulo: string;
  valor: string;
  icone: string;
  corIcone?: string;
}

export function CardResumo({ titulo, valor, icone, corIcone = CORES.primaria }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: corIcone + '22' }]}>
        <Text style={[styles.icone, { color: corIcone }]}>{icone}</Text>
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: CORES.fundoCard,
    borderRadius: RAIO.lg,
    padding: ESPACAMENTO.md,
    borderWidth: 1,
    borderColor: CORES.borda,
    gap: 6,
    minWidth: 140,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RAIO.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  icone: {
    fontSize: 20,
  },
  titulo: {
    color: CORES.textoSecundario,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valor: {
    color: CORES.texto,
    fontSize: 20,
    fontWeight: '700',
  },
});

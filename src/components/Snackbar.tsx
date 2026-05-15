/**
 * @file components/Snackbar.tsx
 * @description Componente global de notificação flutuante.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, Platform } from 'react-native';
import { useUIStore } from '../store/useUIStore';
import { CORES, ESPACAMENTO, RAIO } from '../constants';

export function Snackbar() {
  const { snackbarVisivel, snackbarMensagem, snackbarTipo } = useUIStore();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (snackbarVisivel) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(translateY, {
          toValue: 50,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [snackbarVisivel]);

  // O componente fica montado de forma transparente quando inativo (opacity: 0)
  // Como ele tem pointerEvents="none" na view raiz e position: absolute, não bloqueia toques.

  const getCor = () => {
    if (snackbarTipo === 'erro') return CORES.erro;
    if (snackbarTipo === 'aviso') return CORES.aviso;
    return CORES.sucesso;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getCor(),
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.texto}>{snackbarMensagem}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: ESPACAMENTO.xl,
    left: ESPACAMENTO.lg,
    right: ESPACAMENTO.lg,
    padding: ESPACAMENTO.md,
    borderRadius: RAIO.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 9999,
  },
  texto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});

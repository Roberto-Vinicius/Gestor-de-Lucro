/**
 * @file alert.ts
 * @description Utilitário cross-platform para exibir popups (Alerts).
 *
 * No React Native Web, o Alert.alert nativo com botões muitas vezes falha
 * silenciosamente ou não dispara os callbacks. Esta função garante que
 * funcione no iOS, Android e Web.
 */

import { Alert, Platform } from 'react-native';

export function exibirPopup(titulo: string, mensagem: string, onConfirm?: () => void) {
  if (Platform.OS === 'web') {
    // No navegador, usamos o window.alert nativo
    window.alert(`${titulo}\n\n${mensagem}`);
    if (onConfirm) {
      onConfirm();
    }
  } else {
    // No iOS/Android usamos o Alert padrão do React Native
    if (onConfirm) {
      Alert.alert(titulo, mensagem, [{ text: 'OK', onPress: onConfirm }]);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }
}

/**
 * @file app/_layout.tsx
 * @description Layout raiz da aplicação — envolve o app com GestureHandlerRootView,
 * obrigatório para o Drawer Navigator funcionar corretamente.
 */

import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CORES } from '../src/constants';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={CORES.fundo} />
      <Slot />
    </GestureHandlerRootView>
  );
}

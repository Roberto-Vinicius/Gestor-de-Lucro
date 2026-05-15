/**
 * @file app/(drawer)/_layout.tsx
 * @description Configura o Menu Lateral (Drawer) com as 3 rotas principais:
 * Início, Nova Compra e Nova Venda.
 */

import { Drawer } from 'expo-router/drawer';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { CORES, ESPACAMENTO } from '../../src/constants';

// ─── Conteúdo customizado do Drawer ──────────────────────────────────────────

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
    >
      {/* Cabeçalho do Drawer */}
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderEmoji}>💰</Text>
        <Text style={styles.drawerHeaderTitulo}>GestorLucro</Text>
        <Text style={styles.drawerHeaderSubtitulo}>Gestão de Lucro e Vendas</Text>
      </View>

      {/* Linha divisória */}
      <View style={styles.divisor} />

      {/* Itens do menu gerados automaticamente pelo expo-router */}
      <DrawerItemList {...props} />

      {/* Rodapé */}
      <View style={styles.drawerRodape}>
        <Text style={styles.drawerRodapeTexto}>v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

// ─── Layout do Drawer ─────────────────────────────────────────────────────────

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        // Estilo do header (barra superior)
        headerStyle: { backgroundColor: CORES.fundoSecundario },
        headerTintColor: CORES.texto,
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,

        // Estilo do drawer em si
        drawerStyle: {
          backgroundColor: CORES.fundoSecundario,
          width: 280,
        },
        drawerActiveTintColor: CORES.primaria,
        drawerInactiveTintColor: CORES.textoSecundario,
        drawerActiveBackgroundColor: `${CORES.primaria}22`, // primaria com 13% opacidade
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          marginLeft: -8,
        },
      }}
    >
      {/* Rota 1: Início (Dashboard) */}
      <Drawer.Screen
        name="index"
        options={{
          title: 'Início',
          drawerLabel: 'Início',
          drawerIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
          headerTitle: '📦 GestorLucro',
        }}
      />

      {/* Rota 2: Nova Compra */}
      <Drawer.Screen
        name="compra/novo"
        options={{
          title: 'Nova Compra',
          drawerLabel: 'Nova Compra',
          drawerIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🛒</Text>
          ),
          headerTitle: 'Nova Compra',
        }}
      />

      {/* Rota 3: Nova Venda */}
      <Drawer.Screen
        name="venda/nova"
        options={{
          title: 'Nova Venda',
          drawerLabel: 'Nova Venda',
          drawerIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>💵</Text>
          ),
          headerTitle: 'Nova Venda',
        }}
      />

      {/* Rota 4: Histórico */}
      <Drawer.Screen
        name="historico/index"
        options={{
          title: 'Histórico',
          drawerLabel: 'Histórico',
          drawerIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📋</Text>
          ),
          headerTitle: 'Histórico Geral',
        }}
      />
    </Drawer>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 0,
  },
  drawerHeader: {
    paddingHorizontal: ESPACAMENTO.lg,
    paddingTop: ESPACAMENTO.xxl,
    paddingBottom: ESPACAMENTO.lg,
    alignItems: 'flex-start',
    gap: ESPACAMENTO.xs,
  },
  drawerHeaderEmoji: {
    fontSize: 36,
    marginBottom: ESPACAMENTO.xs,
  },
  drawerHeaderTitulo: {
    color: CORES.texto,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  drawerHeaderSubtitulo: {
    color: CORES.textoSecundario,
    fontSize: 13,
    fontWeight: '400',
  },
  divisor: {
    height: 1,
    backgroundColor: `${CORES.texto}18`,
    marginHorizontal: ESPACAMENTO.md,
    marginBottom: ESPACAMENTO.sm,
  },
  drawerRodape: {
    position: 'absolute',
    bottom: ESPACAMENTO.xl,
    left: ESPACAMENTO.lg,
  },
  drawerRodapeTexto: {
    color: CORES.textoSecundario,
    fontSize: 12,
    opacity: 0.5,
  },
});

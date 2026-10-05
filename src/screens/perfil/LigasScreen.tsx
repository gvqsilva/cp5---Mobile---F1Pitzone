import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';

export default function LigasScreen() {
  return (
    <Screen title="Minhas Ligas">
      <View style={s.empty}>
        <View style={s.icon}><Ionicons name="people-outline" size={28} color={colors.text} /></View>
        <Text style={s.title}>Nenhuma liga encontrada</Text>
        <Text style={s.message}>As ligas aparecerão aqui quando houver dados disponíveis para sua conta.</Text>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  empty: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 28, marginTop: 8 },
  icon: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  message: { color: colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 7 },
});

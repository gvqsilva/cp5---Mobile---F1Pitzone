import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';

export default function LigaDetalheScreen() {
  return (
    <Screen title="Detalhe da liga">
      <View style={s.empty}>
        <Ionicons name="information-circle-outline" size={32} color={colors.textMuted} />
        <Text style={s.title}>Dados da liga indisponíveis</Text>
        <Text style={s.message}>O ranking e os participantes serão exibidos quando essa informação vier da sua conta.</Text>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  empty: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 28, marginTop: 8 },
  title: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center', marginTop: 12 },
  message: { color: colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 7 },
});

import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../theme';

export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: colors.textMuted, marginTop: 6 }}>Tela em construção</Text>
    </View>
  );
}

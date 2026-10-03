import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

type Props = { left?: React.ReactNode; title: string; sub?: string; right?: React.ReactNode; onPress?: () => void; active?: boolean; disabled?: boolean };

export default function ListRow({ left, title, sub, right, onPress, active, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={!onPress || disabled} style={[s.row, active && s.active, disabled && { opacity: 0.45 }]}>
      {left}
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title}</Text>
        {!!sub && <Text style={s.sub}>{sub}</Text>}
      </View>
      {right}
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 20, backgroundColor: colors.surface, borderRadius: radius.md, padding: 20, minHeight: 112 },
  active: { backgroundColor: '#5E1A1F', borderWidth: 1, borderColor: colors.red },
  title: { color: colors.text, fontSize: 15, fontWeight: '700' },
  sub: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
});

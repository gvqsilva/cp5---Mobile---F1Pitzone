import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';

type Props = { tabs: string[]; value: string; onChange: (t: string) => void };

export default function Tabs({ tabs, value, onChange }: Props) {
  return (
    <View style={s.row}>
      {tabs.map((t) => (
        <Pressable key={t} onPress={() => onChange(t)} style={[s.tab, t === value && s.active]}>
          <Text style={[s.text, t === value && { color: colors.text, fontWeight: '700' }]}>{t}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  active: { borderBottomColor: colors.red },
  text: { color: colors.textMuted, fontSize: 12 },
});

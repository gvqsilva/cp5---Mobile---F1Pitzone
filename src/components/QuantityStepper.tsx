import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

type Props = { value: number; onChange: (v: number) => void; min?: number; max?: number };

export default function QuantityStepper({ value, onChange, min = 1, max = 99 }: Props) {
  return (
    <View style={s.row}>
      <Pressable onPress={() => onChange(Math.max(min, value - 1))} hitSlop={8} style={s.btn}>
        <Ionicons name="remove" size={14} color={colors.text} />
      </Pressable>
      <Text style={s.value}>{value}</Text>
      <Pressable onPress={() => onChange(Math.min(max, value + 1))} hitSlop={8} style={s.btn}>
        <Ionicons name="add" size={14} color={colors.text} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, paddingHorizontal: 4 },
  btn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  value: { color: colors.text, fontSize: 13, fontWeight: '700', width: 22, textAlign: 'center' },
});

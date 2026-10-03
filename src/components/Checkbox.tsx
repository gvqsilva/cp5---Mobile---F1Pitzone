import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

type Props = { label: string; checked: boolean; onToggle: () => void };

export default function Checkbox({ label, checked, onToggle }: Props) {
  return (
    <Pressable onPress={onToggle} style={styles.row}>
      <View style={[styles.box, checked && { backgroundColor: colors.red, borderColor: colors.red }]}>
        {checked && <Ionicons name="checkmark" size={12} color="#fff" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  box: { width: 16, height: 16, borderRadius: 3, borderWidth: 1, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  label: { color: colors.text, fontSize: 14 },
});

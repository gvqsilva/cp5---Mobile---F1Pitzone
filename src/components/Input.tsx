import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

export default function Input({ label, ...props }: { label: string } & TextInputProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.textMuted} autoCapitalize="none" style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { color: colors.text, fontSize: 14, marginBottom: 8 },
  input: { height: 44, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, color: colors.text, fontSize: 16, paddingHorizontal: 16 },
});

import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';

type Props = { title: string; onPress: () => void; variant?: 'primary' | 'outline'; style?: ViewStyle };

export default function Button({ title, onPress, variant = 'primary', style }: Props) {
  const outline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, outline ? styles.outline : styles.primary, pressed && { opacity: 0.8 }, style]}
    >
      <Text style={[styles.text, outline && { color: colors.red }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  primary: { backgroundColor: colors.redDark },
  outline: { borderWidth: 1, borderColor: colors.red },
  text: { color: colors.text, fontWeight: '600', fontSize: 15 },
});

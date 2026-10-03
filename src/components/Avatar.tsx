import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { colors } from '../theme';

// Placeholder com iniciais; passe `source` quando tiver as fotos dos pilotos/logos.
export default function Avatar({ label, size = 36, source }: { label: string; size?: number; source?: ImageSourcePropType }) {
  const initials = label.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  if (source) return <Image source={source} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.textMuted, fontSize: size * 0.34, fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}

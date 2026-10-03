import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../theme';

// Troque por <Image source={require('../assets/logo.png')} /> quando exportar o logo do Figma.
export default function Logo() {
  return (
    <View>
      <Image source={require('../assets/logos/f1.png')} style={styles.f1} resizeMode="contain" />
      <Text style={styles.text}>PitZone</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  f1: { width: 68, height: 30, marginBottom: 2 },
  text: { color: colors.text, fontSize: 22, fontWeight: '700', fontStyle: 'italic' },
});

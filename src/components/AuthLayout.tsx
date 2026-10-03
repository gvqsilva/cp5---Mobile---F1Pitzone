import React from 'react';
import { View, ImageBackground, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ImageSourcePropType } from 'react-native';
import { colors } from '../theme';
import Logo from './Logo';

type Props = { image?: ImageSourcePropType; children: React.ReactNode };

// Topo com imagem + logo e painel escuro por cima (padrão das telas de cadastro/login).
export default function AuthLayout({ image, children }: Props) {
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground source={image ?? require('../assets/intro-f1.jpg')} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.logo}><Logo /></View>
      </ImageBackground>
      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  hero: { height: 330, backgroundColor: colors.surface },
  heroImage: { opacity: 0.8, resizeMode: 'cover' },
  logo: { position: 'absolute', top: 56, left: 24 },
  panel: { flex: 1, marginTop: 0, backgroundColor: colors.surface },
  panelContent: { padding: 28, paddingTop: 40, paddingBottom: 48 },
});

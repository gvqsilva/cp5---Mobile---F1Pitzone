import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import useNav from '../hooks/useNav';

type Props = { title?: string; children: React.ReactNode; footer?: React.ReactNode; scroll?: boolean };

// Wrapper padrão: header com voltar (se tiver title), conteúdo rolável e rodapé fixo opcional.
export default function Screen({ title, children, footer, scroll = true }: Props) {
  const nav = useNav();
  return (
    <View style={s.root}>
      {title && (
        <View style={s.header}>
          <Pressable onPress={() => nav.goBack()} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={s.title}>{title}</Text>
        </View>
      )}
      {scroll ? <ScrollView contentContainerStyle={s.content}>{children}</ScrollView> : <View style={[s.content, { flex: 1 }]}>{children}</View>}
      {footer && <View style={s.footer}>{footer}</View>}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingBottom: 12 },
  title: { color: colors.text, fontSize: 16, fontWeight: '600' },
  content: { padding: 14, paddingBottom: 30, gap: 10 },
  footer: { padding: 14, paddingBottom: 20 },
});

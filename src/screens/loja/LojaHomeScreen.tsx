import React from 'react';
import { View, Text, ImageBackground, Image, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import useNav from '../../hooks/useNav';
import { useCart } from '../../context/CartContext';
import { CATEGORIAS, PRODUTOS_DESTAQUE, formatBRL } from '../../services/store';

export default function LojaHomeScreen() {
  const nav = useNav();
  const { totalItens } = useCart();

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <View style={s.topBar}>
        <View>
          <Logo />
          <Text style={s.kicker}>PITZONE STORE</Text>
        </View>
        <View style={s.actions}>
          <Pressable onPress={() => nav.navigate('Favoritos')} hitSlop={10} style={s.cartBtn}>
            <Ionicons name="heart-outline" size={21} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => nav.navigate('Carrinho')} hitSlop={10} style={s.cartBtn}>
            <Ionicons name="cart-outline" size={22} color={colors.text} />
            {totalItens > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{totalItens}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <Text style={s.greeting}>Peças para quem vive a velocidade.</Text>
      <View style={s.search}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput placeholder="Buscar na loja" placeholderTextColor={colors.textMuted} style={s.searchInput} onSubmitEditing={(event) => nav.navigate('Produtos', { busca: event.nativeEvent.text })} />
      </View>

      {/* Trocar por imagem do carro/piloto exportada do Figma */}
      <ImageBackground style={s.hero} imageStyle={{ opacity: 0.85 }}>
        <Text style={s.heroTitle}>VISTA SUA PAIXÃO</Text>
        <Button title="Ver Coleção" variant="outline" onPress={() => nav.navigate('Categorias')} style={{ width: 150, height: 34, marginTop: 10 }} />
      </ImageBackground>

      <View style={s.categoriasRow}>
        {CATEGORIAS.map((c) => (
          <Pressable key={c.id} style={s.categoriaTile} onPress={() => nav.navigate('Produtos', { categoriaId: c.id })}>
            <Ionicons name={c.icone} size={20} color={colors.red} />
            <Text style={s.categoriaLabel}>{c.nome.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>

      <View style={s.sectionHeader}>
        <Text style={s.section}>Destaques</Text>
        <Pressable onPress={() => nav.navigate('Categorias')}><Text style={s.seeAll}>Ver tudo</Text></Pressable>
      </View>
      <View style={s.grid}>
        {PRODUTOS_DESTAQUE.map((p) => (
          <Pressable key={p.id} style={s.card} onPress={() => nav.navigate('ProdutoDetalhe', { produtoId: p.id })}>
            <Image source={{ uri: p.imagem }} style={s.thumb} />
            <Text style={s.cardName} numberOfLines={2}>{p.nome}</Text>
            <Text style={s.cardPrice}>{formatBRL(p.preco)}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 14, paddingTop: 50, paddingBottom: 30, gap: 14 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 8 },
  kicker: { color: colors.red, fontSize: 8, fontWeight: '800', letterSpacing: 1.5, marginTop: 2 },
  cartBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, backgroundColor: colors.red, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: colors.text, fontSize: 9, fontWeight: '800' },
  hero: { height: 150, backgroundColor: '#000', borderRadius: radius.lg, padding: 16, justifyContent: 'flex-end' },
  heroTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  greeting: { color: colors.text, fontSize: 18, fontWeight: '700', lineHeight: 24 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, color: colors.text, fontSize: 13 },
  categoriasRow: { flexDirection: 'row', justifyContent: 'space-between' },
  categoriaTile: { alignItems: 'center', gap: 6, width: 58 },
  categoriaLabel: { color: colors.textMuted, fontSize: 8, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { color: colors.text, fontSize: 17, fontWeight: '800' },
  seeAll: { color: colors.red, fontSize: 11, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 9, gap: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, elevation: 2 },
  thumb: { height: 106, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  cardName: { color: colors.text, fontSize: 11, fontWeight: '600', minHeight: 28 },
  cardPrice: { color: colors.red, fontSize: 14, fontWeight: '800' },
});

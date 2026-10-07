import React, { useCallback, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import useNav from '../../hooks/useNav';
import { alternarFavorito, formatBRL, getProdutosFavoritos, Produto } from '../../services/store';
import { colors, radius } from '../../theme';

export default function FavoritosScreen() {
  const nav = useNav();
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const carregar = useCallback(() => {
    getProdutosFavoritos().then(setProdutos);
  }, []);

  useFocusEffect(carregar);

  const remover = async (id: string) => {
    await alternarFavorito(id);
    carregar();
  };

  return (
    <Screen title="Meus favoritos">
      <View style={s.heading}>
        <View>
          <Text style={s.title}>Sua seleção</Text>
          <Text style={s.subtitle}>{produtos.length} {produtos.length === 1 ? 'item salvo' : 'itens salvos'}</Text>
        </View>
        <Ionicons name="heart" size={24} color={colors.red} />
      </View>

      {produtos.length === 0 ? (
        <View style={s.empty}>
          <View style={s.emptyIcon}><Ionicons name="heart-outline" size={34} color={colors.red} /></View>
          <Text style={s.emptyTitle}>Você ainda não salvou produtos</Text>
          <Text style={s.emptyText}>Toque no coração de um produto para encontrá-lo aqui depois.</Text>
          <Button title="Explorar a loja" onPress={() => nav.navigate('Categorias')} style={s.emptyButton} />
        </View>
      ) : (
        <View style={s.grid}>
          {produtos.map((produto) => (
            <Pressable key={produto.id} style={s.card} onPress={() => nav.navigate('ProdutoDetalhe', { produtoId: produto.id })}>
              <View style={s.imageWrap}>
                <Image source={{ uri: produto.imagem }} style={s.image} />
                <Pressable style={s.remove} onPress={() => remover(produto.id)} hitSlop={8}>
                  <Ionicons name="heart" size={17} color={colors.red} />
                </Pressable>
              </View>
              <Text style={s.name} numberOfLines={2}>{produto.nome}</Text>
              <Text style={s.price}>{formatBRL(produto.preco)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { color: colors.text, fontSize: 21, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 9, gap: 6 },
  imageWrap: { height: 120, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: colors.surfaceAlt },
  image: { flex: 1 },
  remove: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontSize: 11, fontWeight: '600', minHeight: 30 },
  price: { color: colors.red, fontSize: 14, fontWeight: '800' },
  empty: { alignItems: 'center', paddingTop: 72, paddingHorizontal: 22 },
  emptyIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: 8 },
  emptyButton: { marginTop: 18 },
});

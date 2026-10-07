import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import useNav from '../../hooks/useNav';
import { CATEGORIAS, buscarProdutos, produtosPorCategoria, formatBRL } from '../../services/store';

type Ordenacao = 'relevancia' | 'menor_preco' | 'maior_preco';

export default function ProdutosScreen() {
  const nav = useNav();
  const { params } = useRoute<any>();
  const categoria = CATEGORIAS.find((c) => c.id === params?.categoriaId);
  const [busca, setBusca] = useState<string>(params?.busca ?? '');
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('relevancia');

  const produtos = useMemo(() => {
    const base = categoria ? produtosPorCategoria(categoria.id) : buscarProdutos(busca);
    const filtrados = categoria && busca ? base.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase())) : base;
    if (ordenacao === 'menor_preco') return [...filtrados].sort((a, b) => a.preco - b.preco);
    if (ordenacao === 'maior_preco') return [...filtrados].sort((a, b) => b.preco - a.preco);
    return filtrados;
  }, [categoria, busca, ordenacao]);

  const proximaOrdenacao = () => {
    setOrdenacao((atual) => (atual === 'relevancia' ? 'menor_preco' : atual === 'menor_preco' ? 'maior_preco' : 'relevancia'));
  };
  const rotuloOrdenacao = { relevancia: 'Relevância', menor_preco: 'Menor preço', maior_preco: 'Maior preço' }[ordenacao];

  return (
    <Screen title={categoria ? categoria.nome : 'Resultado da busca'}>
      <Text style={s.breadcrumb}>LOJA  /  {categoria ? categoria.nome.toUpperCase() : 'BUSCA'}</Text>
      <TextInput
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar produto"
        placeholderTextColor={colors.textMuted}
        style={s.search}
      />
      <View style={s.toolbar}>
        <Pressable style={s.toolbarBtn}>
          <Ionicons name="options-outline" size={14} color={colors.text} />
          <Text style={s.toolbarText}>Filtro</Text>
        </Pressable>
        <Pressable style={s.toolbarBtn} onPress={proximaOrdenacao}>
          <Ionicons name="swap-vertical-outline" size={14} color={colors.text} />
          <Text style={s.toolbarText}>Ordenar · {rotuloOrdenacao}</Text>
        </Pressable>
      </View>

      {produtos.length === 0 && <Text style={s.empty}>Nenhum produto encontrado.</Text>}
      <View style={s.grid}>
        {produtos.map((p) => (
          <Pressable key={p.id} style={s.card} onPress={() => nav.navigate('ProdutoDetalhe', { produtoId: p.id })}>
            <Image source={{ uri: p.imagem }} style={s.thumb} />
            <Text style={s.cardName} numberOfLines={2}>{p.nome}</Text>
            <Text style={s.cardPrice}>{formatBRL(p.preco)}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  breadcrumb: { color: colors.textMuted, fontSize: 10 },
  search: { height: 44, borderRadius: radius.pill, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: 16, fontSize: 13, borderWidth: 1, borderColor: colors.border },
  toolbar: { flexDirection: 'row', gap: 10 },
  toolbarBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: colors.border },
  toolbarText: { color: colors.text, fontSize: 11 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 9, gap: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, elevation: 2 },
  thumb: { height: 112, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  cardName: { color: colors.text, fontSize: 11, fontWeight: '600', minHeight: 28 },
  cardPrice: { color: colors.red, fontSize: 13, fontWeight: '800' },
});

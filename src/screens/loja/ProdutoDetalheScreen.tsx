import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import QuantityStepper from '../../components/QuantityStepper';
import { useCart } from '../../context/CartContext';
import { alternarFavorito, getFavoritos, produtoPorId, formatBRL } from '../../services/store';

export default function ProdutoDetalheScreen() {
  const { params } = useRoute<any>();
  const { adicionar } = useCart();
  const produto = produtoPorId(params?.produtoId);

  const [favorito, setFavorito] = useState(false);
  const [cor, setCor] = useState(produto?.cores?.[0]);
  const [tamanho, setTamanho] = useState(produto?.tamanhos?.[0]);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const [descricaoAberta, setDescricaoAberta] = useState(true);

  useEffect(() => {
    if (produto) getFavoritos().then((ids) => setFavorito(ids.includes(produto.id)));
  }, [produto]);

  if (!produto) {
    return (
      <Screen title="Produto">
        <Text style={s.nome}>Produto não encontrado.</Text>
      </Screen>
    );
  }

  const precoParcela = produto.preco / 10;

  const onAdicionar = async () => {
    await adicionar(produto, quantidade, cor, tamanho);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1500);
  };

  return (
    <Screen
      title="Produto"
      footer={
        <Button
          title={adicionado ? 'Adicionado ✓' : 'Adicionar ao Carrinho'}
          onPress={onAdicionar}
          style={adicionado ? { backgroundColor: '#1E4D2B' } : undefined}
        />
      }
    >
      <View style={s.imageWrap}>
        <Image source={{ uri: produto.imagem }} style={s.image} />
        <Pressable onPress={() => alternarFavorito(produto.id).then((ids) => setFavorito(ids.includes(produto.id)))} style={s.fav} hitSlop={8}>
          <Ionicons name={favorito ? 'heart' : 'heart-outline'} size={18} color={colors.red} />
        </Pressable>
        <View style={s.dots}>
          {[0, 1, 2].map((i) => <View key={i} style={[s.dot, i === 0 && s.dotActive]} />)}
        </View>
      </View>

      <View style={s.productHeader}>
        <View style={s.rating}>
          <Ionicons name="star" size={13} color="#FFC857" />
          <Text style={s.ratingText}>4,9</Text>
          <Text style={s.reviews}> · avaliações verificadas</Text>
        </View>
        <Text style={s.nome}>{produto.nome}</Text>
        {!!produto.equipe && <Text style={s.equipe}>{produto.equipe} · Coleção oficial</Text>}
      </View>
      <Text style={s.preco}>{formatBRL(produto.preco)}</Text>
      <Text style={s.parcela}>ou 10x de {formatBRL(precoParcela)} sem juros</Text>
      <View style={s.benefits}>
        <View style={s.benefit}><Ionicons name="shield-checkmark-outline" size={19} color="#2ECC71" /><Text style={s.benefitText}>Compra segura</Text></View>
        <View style={s.benefit}><Ionicons name="cube-outline" size={19} color={colors.red} /><Text style={s.benefitText}>Envio protegido</Text></View>
        <View style={s.benefit}><Ionicons name="refresh-outline" size={19} color={colors.textMuted} /><Text style={s.benefitText}>Troca em 7 dias</Text></View>
      </View>

      {!!produto.cores && (
        <View style={s.bloco}>
          <Text style={s.label}>COR</Text>
          <View style={s.swatchRow}>
            {produto.cores.map((c) => (
              <Pressable key={c} onPress={() => setCor(c)} style={[s.swatch, { backgroundColor: c }, c === cor && s.swatchOn]} />
            ))}
          </View>
        </View>
      )}

      {!!produto.tamanhos && (
        <View style={s.bloco}>
          <Text style={s.label}>TAMANHO</Text>
          <View style={s.swatchRow}>
            {produto.tamanhos.map((t) => (
              <Pressable key={t} onPress={() => setTamanho(t)} style={[s.tamanhoBtn, t === tamanho && s.tamanhoOn]}>
                <Text style={[s.tamanhoText, t === tamanho && { color: colors.text }]}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={s.bloco}>
        <Text style={s.label}>QUANTIDADE</Text>
        <QuantityStepper value={quantidade} onChange={setQuantidade} />
      </View>

      <View style={s.detailsCard}>
        <Pressable style={s.detailsHeader} onPress={() => setDescricaoAberta((aberta) => !aberta)}>
          <Text style={s.detailsTitle}>Sobre este produto</Text>
          <Ionicons name={descricaoAberta ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text} />
        </Pressable>
        {descricaoAberta && (
          <View style={s.detailsBody}>
            <Text style={s.description}>Uma peça selecionada para quem acompanha cada volta. Produto oficial {produto.equipe ?? 'PITZONE'}, com acabamento pensado para colecionar, usar e demonstrar sua paixão pelo automobilismo.</Text>
            <View style={s.specRow}><Text style={s.specLabel}>Categoria</Text><Text style={s.specValue}>{produto.categoria}</Text></View>
            <View style={s.specRow}><Text style={s.specLabel}>Referência</Text><Text style={s.specValue}>{produto.id.toUpperCase()}</Text></View>
          </View>
        )}
      </View>

      <View style={s.deliveryCard}>
        <Ionicons name="location-outline" size={22} color={colors.red} />
        <View style={{ flex: 1 }}>
          <Text style={s.deliveryTitle}>Receba em todo o Brasil</Text>
          <Text style={s.deliveryText}>O prazo e o valor do frete serão calculados no checkout.</Text>
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  imageWrap: { height: 260, borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden' },
  image: { flex: 1, backgroundColor: colors.surfaceAlt },
  fav: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  dots: { position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.red },
  productHeader: { gap: 5 },
  rating: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { color: colors.text, fontSize: 12, fontWeight: '800', marginLeft: 4 },
  reviews: { color: colors.textMuted, fontSize: 10 },
  nome: { color: colors.text, fontSize: 19, lineHeight: 25, fontWeight: '800' },
  equipe: { color: colors.textMuted, fontSize: 11 },
  preco: { color: colors.text, fontSize: 24, fontWeight: '800' },
  parcela: { color: colors.textMuted, fontSize: 11 },
  benefits: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.border },
  benefit: { alignItems: 'center', gap: 5, flex: 1 },
  benefitText: { color: colors.textMuted, fontSize: 9, textAlign: 'center' },
  bloco: { gap: 8 },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  swatchRow: { flexDirection: 'row', gap: 10 },
  swatch: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'transparent' },
  swatchOn: { borderColor: colors.text },
  tamanhoBtn: { width: 40, height: 32, borderRadius: radius.sm, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  tamanhoOn: { backgroundColor: colors.redDark, borderColor: colors.red },
  tamanhoText: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  detailsCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 14 },
  detailsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailsTitle: { color: colors.text, fontSize: 13, fontWeight: '800' },
  detailsBody: { gap: 10, marginTop: 12 },
  description: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 },
  specLabel: { color: colors.textMuted, fontSize: 11 },
  specValue: { color: colors.text, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  deliveryCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 14 },
  deliveryTitle: { color: colors.text, fontSize: 12, fontWeight: '800' },
  deliveryText: { color: colors.textMuted, fontSize: 10, marginTop: 3, lineHeight: 15 },
});

import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import QuantityStepper from '../../components/QuantityStepper';
import useNav from '../../hooks/useNav';
import { useCart } from '../../context/CartContext';
import { formatBRL } from '../../services/store';

export default function CarrinhoScreen() {
  const nav = useNav();
  const { itens, subtotal, alterarQtd, remover } = useCart();

  if (itens.length === 0) {
    return (
      <Screen title="Carrinho">
        <View style={s.vazio}>
          <Ionicons name="cart-outline" size={36} color={colors.textMuted} />
          <Text style={s.vazioTitle}>Seu carrinho está vazio</Text>
          <Text style={s.vazioText}>Adicione produtos para continuar sua compra.</Text>
          <Button title="Ver produtos" onPress={() => nav.navigate('Categorias')} style={{ marginTop: 10 }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      title="Carrinho"
      footer={
        <View style={{ gap: 10 }}>
          <View style={s.resumo}>
            <View style={s.resumoRow}><Text style={s.muted}>Subtotal</Text><Text style={s.valor}>{formatBRL(subtotal)}</Text></View>
            <View style={s.resumoRow}><Text style={s.muted}>Frete</Text><Text style={s.muted}>calculado na próxima etapa</Text></View>
          </View>
          <Button title="Finalizar Compra" onPress={() => nav.navigate('FinalizarCompra')} />
        </View>
      }
    >
      {itens.map((item) => (
        <View key={item.itemId} style={s.card}>
          <Image source={{ uri: item.imagem }} style={s.thumb} />
          <View style={{ flex: 1 }}>
            <Text style={s.nome} numberOfLines={2}>{item.nome}</Text>
            {!!(item.cor || item.tamanho) && (
              <Text style={s.variacao}>{item.tamanho ? `Tam: ${item.tamanho}` : ''}</Text>
            )}
            <View style={s.linha}>
              <QuantityStepper value={item.quantidade} onChange={(q) => alterarQtd(item.itemId, q)} />
              <Text style={s.preco}>{formatBRL(item.preco * item.quantidade)}</Text>
            </View>
          </View>
          <Pressable onPress={() => remover(item.itemId)} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      ))}
    </Screen>
  );
}

const s = StyleSheet.create({
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 80 },
  vazioTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  vazioText: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
  card: { flexDirection: 'row', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.border },
  thumb: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  nome: { color: colors.text, fontSize: 12, fontWeight: '600' },
  variacao: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  preco: { color: colors.text, fontSize: 13, fontWeight: '700' },
  resumo: { gap: 7, backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.border },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  muted: { color: colors.textMuted, fontSize: 12 },
  valor: { color: colors.text, fontSize: 14, fontWeight: '700' },
});

import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import { getPedidos, Pedido, formatBRL, METODOS_PAGAMENTO } from '../../services/store';

export default function MinhasComprasScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  useFocusEffect(useCallback(() => { getPedidos().then(setPedidos); }, []));

  return (
    <Screen title="Minhas compras">
      {pedidos.length === 0 && <Text style={s.empty}>Você ainda não fez nenhuma compra.</Text>}
      {pedidos.map((pedido) => (
        <View key={pedido.id} style={s.card}>
          <View style={s.row}><Text style={s.id}>Pedido #{pedido.id}</Text><Text style={s.status}>Confirmado</Text></View>
          <Text style={s.date}>{new Date(pedido.data).toLocaleDateString('pt-BR')} · {pedido.itens.length} item(ns)</Text>
          <View style={s.row}><Text style={s.muted}>{METODOS_PAGAMENTO.find((m) => m.id === pedido.metodoPagamentoId)?.nome}</Text><Text style={s.total}>{formatBRL(pedido.total)}</Text></View>
        </View>
      ))}
    </Screen>
  );
}

const s = StyleSheet.create({
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { color: colors.text, fontWeight: '800', fontSize: 13 },
  status: { color: '#2ECC71', fontSize: 11, fontWeight: '700' },
  date: { color: colors.textMuted, fontSize: 11 },
  muted: { color: colors.textMuted, fontSize: 11 },
  total: { color: colors.red, fontWeight: '800', fontSize: 15 },
});

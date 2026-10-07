import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import StepIndicator from '../../components/StepIndicator';
import useNav from '../../hooks/useNav';
import { useCart } from '../../context/CartContext';
import { FRETE_OPCOES, FreteOpcaoId, MetodoPagamentoId, confirmarPedido, formatBRL } from '../../services/store';

export default function ConfirmacaoScreen() {
  const nav = useNav();
  const { params } = useRoute<any>();
  const cart = useCart();
  const [enviando, setEnviando] = useState(false);

  const freteId: FreteOpcaoId = params?.freteId ?? 'padrao';
  const metodoPagamentoId: MetodoPagamentoId = params?.metodoPagamentoId ?? 'credito';
  const frete = FRETE_OPCOES.find((f) => f.id === freteId)?.preco ?? 0;
  const total = cart.subtotal + frete;

  const onConfirmar = async () => {
    if (enviando) return;
    setEnviando(true);
    if (metodoPagamentoId === 'pix') {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    const pedido = await confirmarPedido(cart.itens, freteId, metodoPagamentoId);
    await cart.limpar();
    nav.navigate('Confirmado', { pedidoId: pedido.id });
  };

  return (
    <Screen
      title="Resumo"
      footer={
        <View style={s.footer}>
          {enviando && metodoPagamentoId === 'pix' && (
            <View style={s.processando}>
              <ActivityIndicator size="small" color={colors.red} />
              <Text style={s.processandoTexto}>Confirmando pagamento PIX...</Text>
            </View>
          )}
          <Button
            title={enviando ? 'Processando pagamento...' : metodoPagamentoId === 'pix' ? 'Pagar com PIX' : 'Confirmar Pedido'}
            onPress={onConfirmar}
            style={enviando ? { opacity: 0.6 } : undefined}
          />
        </View>
      }
    >
      <View style={{ alignItems: 'center', marginBottom: 6 }}>
        <StepIndicator steps={['Carrinho', 'Pagamento', 'Confirmação']} currentIndex={2} />
      </View>

      <Text style={s.section}>Resumo do Pedido</Text>
      {cart.itens.map((item) => (
        <View key={item.itemId} style={s.card}>
          <Image source={{ uri: item.imagem }} style={s.thumb} />
          <View style={{ flex: 1 }}>
            <Text style={s.nome} numberOfLines={2}>{item.nome}</Text>
            <Text style={s.muted}>Qtd {item.quantidade}</Text>
          </View>
          <Text style={s.preco}>{formatBRL(item.preco * item.quantidade)}</Text>
        </View>
      ))}

      <View style={s.resumo}>
        <View style={s.resumoRow}><Text style={s.muted}>Subtotal</Text><Text style={s.valor}>{formatBRL(cart.subtotal)}</Text></View>
        <View style={s.resumoRow}><Text style={s.muted}>Frete</Text><Text style={s.valor}>{formatBRL(frete)}</Text></View>
        <View style={[s.resumoRow, { marginTop: 4 }]}><Text style={s.totalLabel}>TOTAL</Text><Text style={s.totalValor}>{formatBRL(total)}</Text></View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  section: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  card: { flexDirection: 'row', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, padding: 10, alignItems: 'center' },
  thumb: { width: 44, height: 44, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  nome: { color: colors.text, fontSize: 12, fontWeight: '600' },
  muted: { color: colors.textMuted, fontSize: 11 },
  preco: { color: colors.text, fontSize: 12, fontWeight: '700' },
  resumo: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, gap: 6 },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  valor: { color: colors.text, fontSize: 13, fontWeight: '700' },
  totalLabel: { color: colors.text, fontSize: 13, fontWeight: '800' },
  totalValor: { color: colors.red, fontSize: 16, fontWeight: '800' },
  footer: { gap: 10 },
  processando: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  processandoTexto: { color: colors.textMuted, fontSize: 11 },
});

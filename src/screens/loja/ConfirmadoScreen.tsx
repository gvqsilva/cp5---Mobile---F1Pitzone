import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import useNav from '../../hooks/useNav';
import { Pedido, getUltimoPedido, formatBRL } from '../../services/store';

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function formatarData(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function ConfirmadoScreen() {
  const nav = useNav();
  const { params } = useRoute<any>();
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    getUltimoPedido().then(setPedido);
  }, []);

  const voltarParaHome = () => nav.reset({ index: 0, routes: [{ name: 'Main' }] });

  return (
    <Screen scroll={false}>
      <View style={s.content}>
        <View style={s.check}>
          <Ionicons name="checkmark" size={48} color="#2ECC71" />
        </View>
        <Text style={s.titulo}>Confirmado</Text>
        <Text style={s.pedidoId}>Número do pedido #{params?.pedidoId ?? pedido?.id}</Text>
        {!!pedido && <Text style={s.muted}>Data {formatarData(pedido.data)}</Text>}

        {!!pedido && (
          <View style={s.resumo}>
            <Text style={s.resumoTitulo}>Resumo do Pedido</Text>
            <View style={s.linha}><Text style={s.muted}>Frete</Text><Text style={s.valor}>{formatBRL(pedido.frete)}</Text></View>
            <View style={s.linha}><Text style={s.totalLabel}>Total</Text><Text style={s.totalValor}>{formatBRL(pedido.total)}</Text></View>
          </View>
        )}
        {!!pedido?.comprovante && (
          <View style={s.comprovante}>
            <Text style={s.resumoTitulo}>{pedido.metodoPagamentoId === 'pix' ? 'PIX copia e cola' : pedido.metodoPagamentoId === 'boleto' ? 'Código do boleto' : 'Pagamento simulado'}</Text>
            <Text style={s.codigo}>{pedido.comprovante}</Text>
            <Text style={s.muted}>Nenhuma cobrança real foi realizada.</Text>
          </View>
        )}

        <Text style={s.aviso}>Você vai receber o acompanhamento do seu pedido por e-mail.</Text>
        <Button title="Voltar para Home" onPress={voltarParaHome} style={{ marginTop: 16, width: 220 }} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 24 },
  check: { width: 84, height: 84, borderRadius: 42, borderWidth: 2, borderColor: '#2ECC71', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  titulo: { color: colors.text, fontSize: 20, fontWeight: '800' },
  pedidoId: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
  muted: { color: colors.textMuted, fontSize: 11 },
  resumo: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, gap: 6, marginTop: 16 },
  resumoTitulo: { color: colors.text, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  valor: { color: colors.text, fontSize: 12, fontWeight: '700' },
  totalLabel: { color: colors.text, fontSize: 13, fontWeight: '800' },
  totalValor: { color: colors.red, fontSize: 15, fontWeight: '800' },
  aviso: { color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 16 },
  comprovante: { width: '100%', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 14, gap: 8, marginTop: 12 },
  codigo: { color: colors.text, fontSize: 11, lineHeight: 17 },
});

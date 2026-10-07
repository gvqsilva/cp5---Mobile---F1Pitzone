import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import useNav from '../../hooks/useNav';
import { ENDERECO_PADRAO, Endereco, FRETE_OPCOES, FreteOpcaoId, formatBRL, getEnderecos } from '../../services/store';

export default function FinalizarCompraScreen() {
  const nav = useNav();
  const { params } = useRoute<any>();
  const [freteId, setFreteId] = useState<FreteOpcaoId>('padrao');
  const [endereco, setEndereco] = useState<Endereco>(ENDERECO_PADRAO);
  useEffect(() => { getEnderecos().then((enderecos) => setEndereco(enderecos.find((item) => item.id === params?.enderecoId) ?? enderecos[0] ?? ENDERECO_PADRAO)); }, [params?.enderecoId]);

  return (
    <Screen
      title="Finalizar Compra"
      footer={<Button title="Continuar para Pagamento" onPress={() => nav.navigate('Pagamento', { freteId })} />}
    >
      <Text style={s.section}>Endereço de Entrega</Text>
      <View style={s.enderecoCard}>
        <Ionicons name="home-outline" size={20} color={colors.red} />
        <View style={{ flex: 1 }}>
          <Text style={s.enderecoRotulo}>{endereco.rotulo}</Text>
          <Text style={s.enderecoLinha}>{endereco.linha1}</Text>
          <Text style={s.enderecoLinha}>{endereco.linha2}</Text>
          <Text style={s.enderecoLinha}>{endereco.cep}</Text>
        </View>
        <Pressable onPress={() => nav.navigate('Enderecos')}><Text style={s.alterar}>Alterar</Text></Pressable>
      </View>

      <Text style={s.section}>Frete</Text>
      {FRETE_OPCOES.map((f) => {
        const selecionado = f.id === freteId;
        return (
          <Pressable key={f.id} onPress={() => setFreteId(f.id)} style={[s.freteCard, selecionado && s.freteOn]}>
            <View style={[s.radio, selecionado && s.radioOn]} />
            <View style={{ flex: 1 }}>
              <Text style={s.freteNome}>{f.nome}</Text>
              <Text style={s.fretePrazo}>{f.prazo}</Text>
            </View>
            <Text style={s.fretePreco}>{formatBRL(f.preco)}</Text>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const s = StyleSheet.create({
  section: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  enderecoCard: { flexDirection: 'row', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14 },
  enderecoRotulo: { color: colors.text, fontSize: 12, fontWeight: '800' },
  enderecoLinha: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  freteCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: 'transparent' },
  freteOn: { borderColor: colors.red },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.textMuted },
  radioOn: { borderColor: colors.red, backgroundColor: colors.red },
  freteNome: { color: colors.text, fontSize: 13, fontWeight: '700' },
  fretePrazo: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  fretePreco: { color: colors.text, fontSize: 12, fontWeight: '700' },
  alterar: { color: colors.red, fontSize: 11, fontWeight: '700' },
});

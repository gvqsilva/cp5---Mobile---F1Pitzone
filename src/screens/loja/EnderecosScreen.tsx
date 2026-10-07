import React, { useEffect, useState } from 'react';
import { Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import { Endereco, ENDERECO_PADRAO, getEnderecos, salvarEnderecos } from '../../services/store';
import useNav from '../../hooks/useNav';

export default function EnderecosScreen() {
  const nav = useNav();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [novo, setNovo] = useState({ rotulo: '', linha1: '', linha2: '', cep: '' });

  useEffect(() => { getEnderecos().then(setEnderecos); }, []);

  const adicionar = async () => {
    if (!novo.rotulo.trim() || !novo.linha1.trim() || !novo.cep.trim()) return;
    const endereco: Endereco = { id: `endereco-${Date.now()}`, ...novo };
    const atualizados = [...enderecos, endereco];
    await salvarEnderecos(atualizados);
    setEnderecos(atualizados);
    setNovo({ rotulo: '', linha1: '', linha2: '', cep: '' });
  };

  return (
    <Screen title="Meus endereços">
      {enderecos.map((endereco) => (
        <Pressable key={endereco.id} style={s.card} onPress={() => nav.navigate('FinalizarCompra', { enderecoId: endereco.id })}>
          <Text style={s.label}>{endereco.rotulo}</Text>
          <Text style={s.text}>{endereco.linha1}</Text>
          <Text style={s.muted}>{endereco.linha2}</Text>
          <Text style={s.muted}>{endereco.cep}</Text>
          {endereco.id !== ENDERECO_PADRAO.id && <Pressable onPress={() => salvarEnderecos(enderecos.filter((item) => item.id !== endereco.id)).then(() => setEnderecos(enderecos.filter((item) => item.id !== endereco.id)))}><Text style={s.remove}>Remover</Text></Pressable>}
        </Pressable>
      ))}
      <Text style={s.section}>Adicionar endereço</Text>
      {(['rotulo', 'linha1', 'linha2', 'cep'] as const).map((campo) => (
        <TextInput key={campo} value={novo[campo]} onChangeText={(value) => setNovo({ ...novo, [campo]: value })} placeholder={campo === 'rotulo' ? 'Ex.: Trabalho' : campo === 'linha1' ? 'Rua, número e complemento' : campo === 'linha2' ? 'Bairro e cidade/UF' : 'CEP'} placeholderTextColor={colors.textMuted} style={s.input} />
      ))}
      <Button title="Salvar endereço" onPress={adicionar} />
      <Button title="Voltar para a loja" variant="outline" onPress={() => nav.navigate('Main', { screen: 'Loja' })} style={{ marginTop: 10 }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, gap: 3 },
  label: { color: colors.text, fontWeight: '800', fontSize: 12 },
  text: { color: colors.text, fontSize: 12 },
  muted: { color: colors.textMuted, fontSize: 11 },
  remove: { color: '#FF6B6B', fontSize: 11, marginTop: 6 },
  section: { color: colors.textMuted, fontSize: 11, marginTop: 8 },
  input: { height: 44, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, color: colors.text, paddingHorizontal: 16, fontSize: 13 },
});

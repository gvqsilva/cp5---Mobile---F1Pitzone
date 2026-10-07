import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRoute } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Input from '../../components/Input';
import StepIndicator from '../../components/StepIndicator';
import useNav from '../../hooks/useNav';
import { METODOS_PAGAMENTO, MetodoPagamentoId } from '../../services/store';

export default function PagamentoScreen() {
  const nav = useNav();
  const { params } = useRoute<any>();
  const [metodoId, setMetodoId] = useState<MetodoPagamentoId>('credito');
  const [cartao, setCartao] = useState({ numero: '', nome: '', validade: '', cvv: '' });
  const [erro, setErro] = useState('');

  const atualizarCartao = (campo: keyof typeof cartao, valor: string) => {
    const limpo = campo === 'nome' ? valor : valor.replace(/\D/g, '');
    setCartao((atual) => ({ ...atual, [campo]: limpo }));
    setErro('');
  };

  const continuar = () => {
    if (metodoId === 'credito' || metodoId === 'debito') {
      const numero = cartao.numero.replace(/\D/g, '');
      const validadeValida = /^(0[1-9]|1[0-2])\/?(\d{2})$/.test(cartao.validade);
      if (numero.length < 13 || numero.length > 19 || !cartao.nome.trim() || !validadeValida || !/^\d{3,4}$/.test(cartao.cvv)) {
        setErro('Confira número, nome, validade (MM/AA) e CVV do cartão.');
        return;
      }
    }
    nav.navigate('Confirmacao', { freteId: params?.freteId, metodoPagamentoId: metodoId });
  };

  const numeroVisivel = cartao.numero
    ? cartao.numero.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
    : '•••• •••• •••• ••••';
  const nomeVisivel = cartao.nome.trim().toUpperCase() || 'NOME DO TITULAR';
  const cartaoDeCredito = metodoId === 'credito';

  return (
    <Screen title="Pagamento" footer={<Button title="Continuar para Confirmação" onPress={continuar} />}>
      <View style={{ alignItems: 'center', marginBottom: 6 }}>
        <StepIndicator steps={['Carrinho', 'Pagamento', 'Confirmação']} currentIndex={1} />
      </View>

      <Text style={s.heading}>Como você quer pagar?</Text>
      <Text style={s.section}>Escolha uma forma segura de pagamento</Text>
      {METODOS_PAGAMENTO.map((m) => {
        const selecionado = m.id === metodoId;
        return (
          <View key={m.id}>
            <Pressable onPress={() => setMetodoId(m.id)} style={[s.metodoCard, selecionado && s.metodoOn]}>
              <Ionicons name={m.id === 'pix' ? 'qr-code-outline' : m.id === 'boleto' ? 'barcode-outline' : 'card-outline'} size={21} color={selecionado ? colors.red : colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={s.metodoNome}>{m.nome}</Text>
                <Text style={s.metodoResumo}>
                  {m.id === 'pix' ? 'Aprovação rápida e segura' : m.id === 'boleto' ? 'Compensação em até 3 dias úteis' : 'Pagamento processado com segurança'}
                </Text>
              </View>
              <View style={[s.radio, selecionado && s.radioOn]} />
            </Pressable>
            {selecionado && (m.id === 'credito' || m.id === 'debito') && (
              <View>
                <BlurView intensity={38} tint="dark" style={[s.cartaoPreview, cartaoDeCredito ? s.creditoPreview : s.debitoPreview]}>
                  <View style={s.previewTop}>
                    <Text style={s.previewBrand}>PITZONE</Text>
                    <Ionicons name={cartaoDeCredito ? 'card' : 'card-outline'} size={24} color="rgba(255,255,255,0.9)" />
                  </View>
                  <View style={s.chip}><View style={s.chipLine} /><View style={s.chipLine} /></View>
                  <Text style={s.previewNumber}>{numeroVisivel}</Text>
                  <View style={s.previewBottom}>
                    <View><Text style={s.previewLabel}>TITULAR</Text><Text style={s.previewValue}>{nomeVisivel}</Text></View>
                    <View><Text style={s.previewLabel}>VALIDADE</Text><Text style={s.previewValue}>{cartao.validade || 'MM/AA'}</Text></View>
                  </View>
                  <View style={s.glassHighlight} />
                </BlurView>
                <BlurView intensity={22} tint="dark" style={s.cartaoForm}>
                  <Text style={s.formTitle}>{cartaoDeCredito ? 'Dados do cartão de crédito' : 'Dados do cartão de débito'}</Text>
                  <Input label="Número do cartão" keyboardType="number-pad" placeholder="0000 0000 0000 0000" value={cartao.numero} onChangeText={(v) => atualizarCartao('numero', v)} />
                  <Input label="Nome no cartão" autoCapitalize="words" value={cartao.nome} onChangeText={(v) => atualizarCartao('nome', v)} />
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Input label="Validade" placeholder="MM/AA" keyboardType="number-pad" value={cartao.validade} onChangeText={(v) => setCartao({ ...cartao, validade: v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2') })} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Input label="CVV" keyboardType="number-pad" secureTextEntry value={cartao.cvv} onChangeText={(v) => atualizarCartao('cvv', v)} />
                    </View>
                  </View>
                </BlurView>
              </View>
            )}
            {selecionado && m.id === 'pix' && (
              <View style={s.info}>
                <Text style={s.infoTitle}>Como funciona o PIX</Text>
                <Text style={s.infoText}>1. Confira o resumo e toque em “Pagar com PIX”.</Text>
                <Text style={s.infoText}>2. Aguarde a confirmação do pagamento.</Text>
                <Text style={s.infoText}>3. Copie o código PIX exibido no comprovante.</Text>
                <Text style={s.infoNote}>O código exibido é simulado para esta experiência.</Text>
              </View>
            )}
            {selecionado && m.id === 'boleto' && (
              <View style={s.info}>
                <Text style={s.infoTitle}>Pagamento por boleto</Text>
                <Text style={s.infoText}>1. Confirme seu pedido para gerar o boleto.</Text>
                <Text style={s.infoText}>2. Copie o código de barras no comprovante.</Text>
                <Text style={s.infoText}>3. O pedido segue após a compensação bancária.</Text>
                <Text style={s.infoNote}>Nenhuma cobrança real será feita nesta simulação.</Text>
              </View>
            )}
            {selecionado && (m.id === 'credito' || m.id === 'debito') && (
              <Text style={s.securityNote}><Ionicons name="lock-closed-outline" size={12} color="#2ECC71" /> Seus dados são usados apenas para simular o pagamento.</Text>
            )}
          </View>
        );
      })}
      {!!erro && <Text style={s.erro}>{erro}</Text>}
    </Screen>
  );
}

const s = StyleSheet.create({
  heading: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 4 },
  section: { color: colors.textMuted, fontSize: 11, marginTop: 2, marginBottom: 8 },
  metodoCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  metodoOn: { borderColor: colors.red },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.textMuted },
  radioOn: { borderColor: colors.red, backgroundColor: colors.red },
  metodoNome: { color: colors.text, fontSize: 13, fontWeight: '700' },
  metodoResumo: { color: colors.textMuted, fontSize: 10, marginTop: 3 },
  cartaoPreview: { height: 202, borderRadius: 22, padding: 20, overflow: 'hidden', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 16, elevation: 7 },
  creditoPreview: { backgroundColor: 'rgba(126, 20, 34, 0.78)' },
  debitoPreview: { backgroundColor: 'rgba(18, 72, 84, 0.78)' },
  previewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewBrand: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  chip: { width: 42, height: 31, borderRadius: 7, backgroundColor: 'rgba(255,220,145,0.9)', marginTop: 20, padding: 7, gap: 5 },
  chipLine: { height: 1, backgroundColor: 'rgba(92,60,20,0.5)' },
  previewNumber: { color: colors.text, fontSize: 19, letterSpacing: 2, marginTop: 16, fontWeight: '600' },
  previewBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 },
  previewLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 7, letterSpacing: 1, marginBottom: 3 },
  previewValue: { color: colors.text, fontSize: 10, fontWeight: '700', maxWidth: 190 },
  glassHighlight: { position: 'absolute', top: -70, right: -30, width: 190, height: 130, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.12)', transform: [{ rotate: '-18deg' }] },
  cartaoForm: { borderRadius: radius.md, padding: 14, marginTop: 0, marginBottom: 8, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(29,27,46,0.58)' },
  formTitle: { color: colors.text, fontSize: 12, fontWeight: '800', marginBottom: 12 },
  info: { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 14, marginBottom: 8, gap: 5 },
  infoTitle: { color: colors.text, fontSize: 12, fontWeight: '800', marginBottom: 2 },
  infoText: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  infoNote: { color: colors.red, fontSize: 10, marginTop: 3 },
  securityNote: { color: colors.textMuted, fontSize: 10, textAlign: 'center', marginBottom: 8 },
  erro: { color: '#FF6B6B', fontSize: 12, textAlign: 'center', marginTop: 4 },
});

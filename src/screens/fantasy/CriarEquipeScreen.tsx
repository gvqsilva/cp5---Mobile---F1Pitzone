import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import ListRow from '../../components/ListRow';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import BudgetBar from '../../components/BudgetBar';
import useNav from '../../hooks/useNav';
import { drivers, teams, chiefs } from '../../services/mock';
import { money } from '../../services/format';

type Opt = { id: string; name: string; sub: string; price: number };
const BUDGET = 100;
const STEPS = ['1º Piloto', '2º Piloto', 'Construtor', 'Chefe', 'Revisar'];
const asDriver = drivers.map<Opt>((d) => ({ id: d.id, name: d.name, sub: d.team, price: d.price }));
const asTeam = teams.map<Opt>((t) => ({ id: t.id, name: t.name, sub: '', price: t.price }));
const asChief = chiefs.map<Opt>((c) => ({ id: c.id, name: c.name, sub: c.team, price: c.price }));
const OPTIONS = [asDriver, asDriver, asTeam, asChief];

export default function CriarEquipeScreen() {
  const nav = useNav();
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<(Opt | undefined)[]>([undefined, undefined, undefined, undefined]);

  const spent = picks.reduce((sum, p) => sum + (p?.price ?? 0), 0);
  const remaining = BUDGET - spent;
  const review = step === 4;
  const pickedIds = picks.map((p) => p?.id);

  const choose = (o: Opt) => {
    const next = [...picks];
    next[step] = next[step]?.id === o.id ? undefined : o;
    setPicks(next);
  };
  const canPick = (o: Opt) => {
    const isOther = pickedIds.some((id, i) => i !== step && i < 2 && step < 2 && id === o.id);
    const affordable = o.price <= remaining + (picks[step]?.price ?? 0);
    return !isOther && affordable;
  };
  const back = () => (step === 0 ? nav.goBack() : setStep(step - 1));
  const advance = () => {
    if (!review) return setStep(step + 1);
    // TODO: POST /fantasy/team com picks
    nav.goBack();
  };

  return (
    <Screen
      title="Criar Equipe"
      footer={<Button title={review ? 'FINALIZAR' : 'PRÓXIMO'} onPress={advance} style={!review && !picks[step] ? { opacity: 0.4 } : undefined} />}
    >
      <View style={s.steps}>
        {STEPS.map((label, i) => (
          <Pressable key={label} onPress={() => i <= step && setStep(i)} style={s.step}>
            <View style={[s.dot, i <= step && s.dotOn]}><Text style={s.dotText}>{i + 1}</Text></View>
            <Text style={s.stepLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={back}><Text style={s.muted}>‹ Voltar</Text></Pressable>
      {!review && <Text style={s.muted}>Orçamento restante: <Text style={{ color: colors.text }}>{money(remaining)}</Text></Text>}

      {review ? (
        <>
          <Text style={s.section}>Resumo da Equipe</Text>
          {picks.map((p, i) => p && (
            <ListRow key={i} left={<Avatar label={p.name} />} title={p.name} sub={['1º Piloto', '2º Piloto', 'Construtor', 'Chefe de Equipe'][i]} right={<Text style={s.price}>{money(p.price)}</Text>} />
          ))}
          <BudgetBar used={spent} total={BUDGET} />
          <View style={s.remaining}><Text style={s.muted}>Orçamento restante</Text><Text style={s.remainingValue}>{money(remaining)}</Text></View>
        </>
      ) : (
        OPTIONS[step].map((o) => {
          const selected = picks[step]?.id === o.id;
          const taken = pickedIds.includes(o.id);
          return (
            <ListRow
              key={o.id}
              active={taken}
              disabled={!selected && !canPick(o)}
              onPress={() => choose(o)}
              left={<Avatar label={o.name} />}
              title={o.name}
              sub={o.sub || undefined}
              right={<View style={s.right}><Text style={s.price}>{money(o.price)}</Text>{selected ? <View style={s.radio} /> : <Ionicons name="add-circle-outline" size={20} color={colors.textMuted} />}</View>}
            />
          );
        })
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  steps: { flexDirection: 'row', justifyContent: 'space-between' },
  step: { alignItems: 'center', flex: 1 },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.red },
  dotText: { color: colors.text, fontSize: 11, fontWeight: '700' },
  stepLabel: { color: colors.textMuted, fontSize: 8, marginTop: 3 },
  muted: { color: colors.textMuted, fontSize: 11 },
  section: { color: colors.text, fontSize: 12, fontWeight: '700' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { color: colors.text, fontSize: 12, fontWeight: '700' },
  radio: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.red },
  remaining: { backgroundColor: '#25453A', borderRadius: radius.md, padding: 14 },
  remainingValue: { color: colors.text, fontSize: 22, fontWeight: '800' },
});

import React, { useEffect, useState } from 'react';
import { Image, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import ListRow from '../../components/ListRow';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import BudgetBar from '../../components/BudgetBar';
import useNav from '../../hooks/useNav';
import { money } from '../../services/format';
import { emptyFantasyTeam, FantasyMarketOption, FantasyPick, FantasyTeam, getFantasyMarket, getTeamDisplayName, getTeamLogoAsset, saveFantasyTeam } from '../../services/fantasy';
import { EscolhaFantasy, ORCAMENTO_TOTAL, validarEquipe } from '../../services/fantasyScoring';

type Opt = FantasyMarketOption;
const BUDGET = ORCAMENTO_TOTAL;
const STEPS = ['1º Piloto', '2º Piloto', 'Construtor', 'Chefe', 'Revisar'];

export default function CriarEquipeScreen() {
  const nav = useNav();
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<(Opt | undefined)[]>([undefined, undefined, undefined, undefined]);
  const [validationError, setValidationError] = useState('');
  const [market, setMarket] = useState<{ drivers: Opt[]; teams: Opt[]; chiefs: Opt[] } | null>(null);
  const [marketError, setMarketError] = useState('');

  useEffect(() => {
    getFantasyMarket()
      .then(setMarket)
      .catch(() => setMarketError('Não foi possível carregar o mercado atual. Tente novamente.'));
  }, []);

  const spent = picks.reduce((sum, p) => sum + (p?.price ?? 0), 0);
  const remaining = BUDGET - spent;
  const review = step === 4;
  const pickedIds = picks.map((p) => p?.id);
  const options = market ? [market.drivers, market.drivers, market.teams, market.chiefs] : [];

  const choose = (o: Opt) => {
    const next = [...picks];
    next[step] = next[step]?.id === o.id ? undefined : o;
    setPicks(next);
    setValidationError('');
  };
  const canPick = (o: Opt) => {
    const isOther = pickedIds.some((id, i) => i !== step && i < 2 && step < 2 && id === o.id);
    const affordable = o.price <= remaining + (picks[step]?.price ?? 0);
    return !isOther && affordable;
  };
  const back = () => (step === 0 ? nav.goBack() : setStep(step - 1));
  const advance = () => {
    if (!review) return setStep(step + 1);
    if (!picks[0] || !picks[1] || !picks[2] || !picks[3]) return;
    const escolha: EscolhaFantasy = {
      pilotoAId: picks[0].id,
      precoPilotoA: picks[0].price,
      pilotoBId: picks[1].id,
      precoPilotoB: picks[1].price,
      construtoraId: picks[2].id,
      precoConstrutora: picks[2].price,
      chefeDeEquipeId: picks[3].id,
      precoChefeDeEquipe: picks[3].price,
    };
    const validacao = validarEquipe(escolha);
    if (!validacao.valido) {
      setValidationError(validacao.erros[0] ?? 'Não foi possível validar sua equipe.');
      return;
    }
    const selected: FantasyPick[] = picks.map((pick) => ({ name: pick!.name, pts: 0, price: pick!.price, headshotUrl: pick!.headshotUrl, logoUrl: pick!.logoUrl, logoAsset: pick!.logoAsset }));
    const next: FantasyTeam = {
      ...emptyFantasyTeam,
      budgetUsed: spent,
      picks: { drivers: selected.slice(0, 2), constructor: selected[2], chief: selected[3] },
    };
    saveFantasyTeam(next).then(() => nav.goBack());
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
      {!review && !market && !marketError && <Text style={s.muted}>Carregando mercado atual...</Text>}
      {!review && !!marketError && <Text style={s.error}>{marketError}</Text>}
      {review && !!validationError && <Text style={s.error}>{validationError}</Text>}

      {review ? (
        <>
          <Text style={s.section}>Resumo da Equipe</Text>
          {picks.map((p, i) => p && (
            <ListRow key={i}             left={<Avatar label={p.name} source={i < 2 && p.headshotUrl ? { uri: p.headshotUrl } : i === 2 && p.logoAsset ? p.logoAsset : undefined} />} title={p.name} sub={['1º Piloto', '2º Piloto', 'Construtor', 'Chefe de Equipe'][i]} right={<Text style={s.price}>{money(p.price)}</Text>} />
          ))}
          <BudgetBar used={spent} total={BUDGET} />
          <View style={s.remaining}><Text style={s.muted}>Orçamento restante</Text><Text style={s.remainingValue}>{money(remaining)}</Text></View>
        </>
      ) : step === 2 ? (
        <View style={s.constructorOptions}>
          {(options[step] ?? []).map((o) => (
            <ConstructorOption
              key={o.id}
              option={o}
              selected={picks[step]?.id === o.id}
              disabled={!canPick(o)}
              onPress={() => choose(o)}
            />
          ))}
        </View>
      ) : (
        (options[step] ?? []).map((o) => {
          const selected = picks[step]?.id === o.id;
          const taken = pickedIds.includes(o.id);
          return (
            <ListRow
              key={o.id}
              active={taken}
              disabled={!selected && !canPick(o)}
              onPress={() => choose(o)}
              left={<Avatar label={o.name} source={o.headshotUrl ? { uri: o.headshotUrl } : o.logoAsset} />}
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

function ConstructorOption({
  option,
  selected,
  disabled,
  onPress,
}: {
  option: Opt;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const logo = getTeamLogoAsset(option.id) ?? getTeamLogoAsset(option.name);
  const displayName = getTeamDisplayName(option.name);
  const isAstonMartin = option.id.toLowerCase().includes('aston') || option.name.toLowerCase().includes('aston martin');
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled && !selected}
      style={({ pressed }) => [
        s.constructorOption,
        selected && s.constructorOptionSelected,
        disabled && !selected && s.constructorOptionDisabled,
        pressed && s.constructorOptionPressed,
      ]}
    >
      {logo ? (
        <Image source={logo} style={[s.constructorOptionLogo, isAstonMartin && s.astonMartinLogo]} resizeMode="contain" />
      ) : (
        <View style={s.constructorOptionFallback}><Text style={s.constructorOptionFallbackText}>{displayName.slice(0, 2).toUpperCase()}</Text></View>
      )}
      <View style={s.constructorOptionShade} />
      <View style={s.constructorOptionContent}>
        <View style={s.constructorOptionTop}>
          <Text style={s.constructorOptionName}>{displayName}</Text>
          {selected && <View style={s.constructorOptionCheck}><Ionicons name="checkmark" size={15} color={colors.text} /></View>}
        </View>
        <View>
          <Text style={s.constructorOptionLabel}>CONSTRUTOR</Text>
          <Text style={s.constructorOptionPrice}>{money(option.price)}</Text>
        </View>
      </View>
    </Pressable>
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
  error: { color: '#FF9B9B', backgroundColor: '#35171A', borderRadius: radius.sm, padding: 10, fontSize: 11 },
  radio: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.red },
  remaining: { backgroundColor: '#25453A', borderRadius: radius.md, padding: 14 },
  remainingValue: { color: colors.text, fontSize: 22, fontWeight: '800' },
  constructorOptions: { gap: 10 },
  constructorOption: { minHeight: 142, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E5E5' },
  constructorOptionSelected: { borderColor: colors.red, borderWidth: 2 },
  constructorOptionDisabled: { opacity: 0.4 },
  constructorOptionPressed: { opacity: 0.78 },
  constructorOptionLogo: { position: 'absolute', width: '64%', height: '64%', top: '18%', left: '18%', opacity: 0.76 },
  astonMartinLogo: { width: '76%', height: '76%', top: '12%', left: '12%' },
  constructorOptionShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255, 255, 255, 0.14)' },
  constructorOptionContent: { flex: 1, justifyContent: 'space-between', padding: 16 },
  constructorOptionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  constructorOptionName: { color: '#15151D', fontSize: 18, fontWeight: '900' },
  constructorOptionLabel: { color: '#55515F', fontSize: 9, fontWeight: '800' },
  constructorOptionPrice: { color: colors.red, fontSize: 13, fontWeight: '900', marginTop: 4 },
  constructorOptionCheck: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  constructorOptionFallback: { position: 'absolute', width: '64%', height: '64%', top: '18%', left: '18%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.md },
  constructorOptionFallbackText: { color: colors.textMuted, fontSize: 20, fontWeight: '900' },
});

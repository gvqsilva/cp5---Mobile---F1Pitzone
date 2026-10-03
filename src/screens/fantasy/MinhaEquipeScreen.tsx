import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Avatar from '../../components/Avatar';
import BudgetBar from '../../components/BudgetBar';
import useNav from '../../hooks/useNav';
import { fantasy } from '../../services/mock';
import { money, pts } from '../../services/format';

export default function MinhaEquipeScreen() {
  const nav = useNav();
  const { picks } = fantasy;
  const edit = () => nav.navigate('CriarEquipe');
  const Remove = () => <Pressable onPress={edit} hitSlop={8}><Ionicons name="close" size={14} color={colors.textMuted} /></Pressable>;

  return (
    <Screen title="Minha Equipe" footer={<BudgetBar used={fantasy.budgetUsed} />}>
      <View style={s.card}>
        <Text style={s.title}>{fantasy.teamName}</Text>
        <View style={s.between}>
          <View><Text style={s.muted}>Pontuação</Text><Text style={s.bold}>{pts(fantasy.total)}</Text></View>
          <View><Text style={s.muted}>Classificação</Text><Text style={s.bold}>{fantasy.rank}</Text></View>
        </View>
      </View>

      <Text style={s.section}>Pilotos</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {picks.drivers.map((d) => (
          <View key={d.name} style={[s.card, { flex: 1, alignItems: 'center' }]}>
            <View style={{ alignSelf: 'flex-end' }}><Remove /></View>
            <Avatar label={d.name} size={64} />
            <Text style={s.name}>{d.name}</Text>
            <Text style={s.red}>{d.pts} pts</Text>
            <Text style={s.muted}>Neste GP</Text>
          </View>
        ))}
      </View>

      <Text style={s.section}>Construtor</Text>
      <View style={[s.card, s.between]}>
        <View><Text style={s.name}>{picks.constructor.name}</Text><Text style={s.muted}>{money(picks.constructor.price)}</Text></View>
        <View style={{ alignItems: 'flex-end' }}><Text style={s.red}>{picks.constructor.pts} pts</Text><Text style={s.muted}>Neste GP</Text></View>
      </View>

      <Text style={s.section}>Chefe de equipe</Text>
      <View style={[s.card, s.between]}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Avatar label={picks.chief.name} />
          <View><Text style={s.name}>{picks.chief.name}</Text><Text style={s.muted}>{money(picks.chief.price)}</Text></View>
        </View>
        <View style={{ alignItems: 'flex-end' }}><Text style={s.red}>{picks.chief.pts} pts</Text><Text style={s.muted}>Neste GP</Text></View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 12 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  section: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  muted: { color: colors.textMuted, fontSize: 10 },
  bold: { color: colors.text, fontSize: 14, fontWeight: '700' },
  name: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 4 },
  red: { color: colors.red, fontSize: 13, fontWeight: '800', marginTop: 2 },
});

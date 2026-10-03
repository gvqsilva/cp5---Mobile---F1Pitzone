import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Tabs from '../../components/Tabs';
import { fantasy } from '../../services/mock';

export default function PontuacaoScreen() {
  const [tab, setTab] = useState('Por Corrida');
  const { lastRace, picks } = fantasy;
  const Line = ({ left, name, value }: { left?: string; name: string; value: number }) => (
    <View style={s.line}>
      {!!left && <Text style={s.pos}>{left}</Text>}
      <Text style={s.lineName}>{name}</Text>
      <Text style={s.linePts}>{value} pts</Text>
    </View>
  );
  return (
    <Screen title="Pontuação">
      <Tabs tabs={['Por Corrida', 'Acumulado']} value={tab} onChange={setTab} />
      <View style={s.hero}>
        <Text style={s.gp}>{lastRace.name.toUpperCase()}</Text>
        <Text style={s.muted}>{lastRace.circuit}</Text>
        <Text style={s.muted}>{lastRace.dates}</Text>
        <Text style={s.big}>{tab === 'Por Corrida' ? lastRace.pts : fantasy.total}<Text style={s.unit}>pts</Text></Text>
        <Text style={s.muted}>Classificação no GP  <Text style={s.rank}>{lastRace.gridRank}</Text></Text>
      </View>
      <Text style={s.section}>Pontuação Pilotos</Text>
      {picks.drivers.map((d, i) => <Line key={d.name} left={`P${i + 1}`} name={d.name.split(' ').pop()!.toUpperCase()} value={d.pts} />)}
      <Text style={s.section}>Construtor</Text>
      <Line name={picks.constructor.name.toUpperCase()} value={picks.constructor.pts} />
      <Text style={s.section}>Chefe de Equipe</Text>
      <Line name={picks.chief.name} value={picks.chief.pts} />
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14 },
  gp: { color: colors.text, fontSize: 18, fontWeight: '800' },
  muted: { color: colors.textMuted, fontSize: 11 },
  big: { color: colors.text, fontSize: 34, fontWeight: '800', marginTop: 8 },
  unit: { fontSize: 14, fontStyle: 'italic', fontWeight: '600' },
  rank: { color: colors.red, fontSize: 20, fontWeight: '800' },
  section: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 8 },
  line: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, gap: 12 },
  pos: { color: colors.textMuted, fontSize: 13, fontWeight: '700', width: 24 },
  lineName: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '700' },
  linePts: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
});

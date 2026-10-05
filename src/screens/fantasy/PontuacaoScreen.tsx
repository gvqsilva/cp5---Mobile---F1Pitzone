import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Tabs from '../../components/Tabs';
import { emptyFantasyTeam, FantasyTeam, getFantasyTeam } from '../../services/fantasy';
import { getLatestFantasyScore } from '../../services/fantasy';

export default function PontuacaoScreen() {
  const [tab, setTab] = useState('Por Corrida');
  const [fantasy, setFantasy] = useState<FantasyTeam>(emptyFantasyTeam);
  const [weekendScore, setWeekendScore] = useState<{ name: string; total: number } | null>(null);
  useFocusEffect(useCallback(() => {
    getFantasyTeam().then((team) => {
      setFantasy(team);
      if (team.picks.drivers.length === 2) getLatestFantasyScore(team).then(setWeekendScore).catch(() => setWeekendScore(null));
    });
  }, []));
  const { lastRace } = fantasy;
  return (
    <Screen title="Pontuação">
      <Tabs tabs={['Por Corrida', 'Acumulado']} value={tab} onChange={setTab} />
      <View style={s.hero}>
        <Text style={s.gp}>{weekendScore?.name.toUpperCase() ?? 'ÚLTIMO FIM DE SEMANA'}</Text>
        {lastRace && <><Text style={s.muted}>{lastRace.circuit}</Text>
        <Text style={s.muted}>{lastRace.dates}</Text></>}
        <Text style={s.big}>{weekendScore?.total ?? 0}<Text style={s.unit}>pts</Text></Text>
        <Text style={s.muted}>Pontuação total do último fim de semana</Text>
      </View>
      <View style={s.empty}>
        <Text style={s.emptyTitle}>Pontuação do Fantasy</Text>
        <Text style={s.muted}>A pontuação será calculada com os resultados de cada sessão do fim de semana.</Text>
      </View>
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
  empty: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, gap: 6 },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
});

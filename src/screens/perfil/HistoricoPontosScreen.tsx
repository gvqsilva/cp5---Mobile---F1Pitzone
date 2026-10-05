import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import { useFocusEffect } from '@react-navigation/native';
import { getFantasyTeam, getLatestFantasyScore } from '../../services/fantasy';

export default function HistoricoPontosScreen() {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<Awaited<ReturnType<typeof getLatestFantasyScore>> | null>(null);

  useFocusEffect(useCallback(() => {
    setLoading(true);
    getFantasyTeam().then((team) => {
      if (team.picks.drivers.length === 2 && team.picks.constructor && team.picks.chief) {
        return getLatestFantasyScore(team).then(setScore);
      }
      setScore(null);
      return undefined;
    }).catch(() => setScore(null)).finally(() => setLoading(false));
  }, []));

  return (
    <Screen title="Histórico de Pontos">
      {loading ? <ActivityIndicator color={colors.red} style={s.loader} /> : score ? (
        <View style={s.card}>
          <Text style={s.label}>ÚLTIMO FIM DE SEMANA</Text>
          <Text style={s.title}>{score.name}</Text>
          <Text style={s.total}>{score.total} pts Fantasy</Text>
          <View style={s.list}>
            {score.drivers.map((driver) => (
              <View key={driver.name} style={s.row}>
                <Text style={s.driver}>{driver.name}</Text>
                <Text style={s.points}>{driver.pts} pts</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={s.empty}>
          <View style={s.icon}><Text style={s.iconText}>—</Text></View>
          <Text style={s.title}>Histórico indisponível</Text>
          <Text style={s.message}>Monte sua equipe para acompanhar os pontos Fantasy do último fim de semana.</Text>
        </View>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  loader: { marginTop: 24 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18, marginTop: 8 },
  label: { color: colors.red, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  list: { marginTop: 16, gap: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 12 },
  driver: { color: colors.text, fontSize: 12, fontWeight: '700' },
  points: { color: colors.red, fontSize: 12, fontWeight: '900' },
  empty: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 28, marginTop: 8 },
  icon: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  iconText: { color: colors.textMuted, fontSize: 28, fontWeight: '800' },
  title: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  total: { color: colors.red, fontSize: 22, fontWeight: '900', marginTop: 8 },
  message: { color: colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 7 },
});

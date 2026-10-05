import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import { getOpenF1SessionResults, OpenF1Result } from '../../services/openf1';

type Props = { route: { params: { sessionKey: number; sessionName: string } } };

const formatDuration = (duration?: number) => {
  if (typeof duration !== 'number') return '—';
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = (duration % 60).toFixed(3).padStart(6, '0');
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}`
    : `${minutes}:${seconds}`;
};

const formatGap = (result: OpenF1Result) => {
  if (result.position === 1) return formatDuration(result.duration);
  if (typeof result.gapToLeader === 'number') return `+${result.gapToLeader.toFixed(3)} s`;
  return result.status;
};

export default function SessaoResultadoScreen({ route }: Props) {
  const { sessionKey, sessionName } = route.params;
  const [results, setResults] = useState<OpenF1Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getOpenF1SessionResults(sessionKey)
      .then(setResults)
      .catch(() => {
        setResults([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [sessionKey]);

  const podium = results.filter((result) => result.status === 'Classificado' && result.position <= 3);
  const remainingResults = results.filter((result) => !podium.includes(result));

  return (
    <Screen title={sessionName}>
      <View style={s.hero}>
        <Ionicons name="podium-outline" size={25} color={colors.red} />
        <View style={s.heroCopy}>
          <Text style={s.eyebrow}>RESULTADO DA SESSÃO</Text>
          <Text style={s.title}>{sessionName}</Text>
          <Text style={s.muted}>Dados oficiais da OpenF1</Text>
        </View>
      </View>

      {loading && <ActivityIndicator color={colors.red} />}
      {!loading && error && <Text style={s.empty}>Não foi possível carregar os resultados agora.</Text>}
      {!loading && !error && results.length === 0 && (
        <Text style={s.empty}>Ainda não há resultados disponíveis para esta sessão.</Text>
      )}
      {podium.length === 3 && (
        <View style={s.podiumCard}>
          <Text style={s.podiumTitle}>Pódio</Text>
          <View style={s.podium}>
            {podium.map((result) => (
              <View key={result.driverNumber} style={[s.podiumDriver, result.position === 1 && s.podiumWinner]}>
                <Text style={s.podiumPosition}>{result.position}º</Text>
                {result.headshotUrl ? (
                  <Image source={{ uri: result.headshotUrl }} style={s.podiumHeadshot} resizeMode="cover" />
                ) : (
                  <View style={[s.podiumHeadshot, s.headshotFallback]}>
                    <Ionicons name="person" size={22} color={colors.textMuted} />
                  </View>
                )}
                <Text style={s.podiumName} numberOfLines={1}>{result.name}</Text>
                <Text style={s.podiumTeam} numberOfLines={1}>{result.team}</Text>
                <View style={[s.podiumBlock, { backgroundColor: `#${result.teamColour}` }]} />
                <Text style={s.podiumTime}>{formatGap(result)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {remainingResults.map((result) => (
        <Pressable key={result.driverNumber} style={({ pressed }) => [s.row, pressed && s.pressed]}>
          <Text style={s.position}>{result.position}º</Text>
          <View style={[s.teamMark, { backgroundColor: `#${result.teamColour}` }]} />
          {result.headshotUrl ? (
            <Image source={{ uri: result.headshotUrl }} style={s.headshot} resizeMode="cover" />
          ) : (
            <View style={s.headshotFallback}>
              <Ionicons name="person" size={18} color={colors.textMuted} />
            </View>
          )}
          <View style={s.driver}>
            <Text style={s.driverName}>{result.name}</Text>
            <Text style={s.team}>{result.team} · {result.laps} voltas</Text>
          </View>
          <Text style={s.gap}>{formatGap(result)}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16 },
  heroCopy: { flex: 1, gap: 3 },
  eyebrow: { color: colors.red, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  title: { color: colors.text, fontSize: 20, fontWeight: '900' },
  muted: { color: colors.textMuted, fontSize: 11 },
  row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13 },
  pressed: { opacity: 0.78, borderColor: colors.red },
  position: { color: colors.textMuted, width: 28, fontSize: 14, fontWeight: '900' },
  teamMark: { width: 4, height: 34, borderRadius: 2 },
  headshot: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceAlt },
  headshotFallback: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  driver: { flex: 1, gap: 3 },
  driverName: { color: colors.text, fontSize: 13, fontWeight: '800' },
  team: { color: colors.textMuted, fontSize: 10 },
  gap: { color: colors.text, fontSize: 11, fontWeight: '800' },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: 20, lineHeight: 18 },
  podiumCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 14 },
  podiumTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  podium: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  podiumDriver: { flex: 1, alignItems: 'center', gap: 5, paddingTop: 8 },
  podiumWinner: { paddingTop: 0 },
  podiumPosition: { color: colors.red, fontSize: 18, fontWeight: '900' },
  podiumHeadshot: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.surfaceAlt },
  podiumName: { color: colors.text, fontSize: 11, fontWeight: '900', textAlign: 'center' },
  podiumTeam: { color: colors.textMuted, fontSize: 9, textAlign: 'center' },
  podiumBlock: { width: '100%', height: 5, borderRadius: 3, marginTop: 2 },
  podiumTime: { color: colors.text, fontSize: 10, fontWeight: '800', textAlign: 'center' },
});

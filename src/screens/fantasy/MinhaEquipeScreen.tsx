import React, { useCallback, useState } from 'react';
import { ActivityIndicator, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Avatar from '../../components/Avatar';
import BudgetBar from '../../components/BudgetBar';
import useNav from '../../hooks/useNav';
import { emptyFantasyTeam, FantasyTeam, getFantasyTeam, getLatestFantasyScore } from '../../services/fantasy';
import { money } from '../../services/format';

export default function MinhaEquipeScreen() {
  const nav = useNav();
  const [fantasy, setFantasy] = useState<FantasyTeam>(emptyFantasyTeam);
  const [weekendScore, setWeekendScore] = useState<Awaited<ReturnType<typeof getLatestFantasyScore>> | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);

  useFocusEffect(useCallback(() => {
    getFantasyTeam().then((team) => {
      setFantasy(team);
      if (team.picks.drivers.length === 2 && team.picks.constructor && team.picks.chief) {
        setLoadingScore(true);
        getLatestFantasyScore(team)
          .then(setWeekendScore)
          .catch(() => setWeekendScore(null))
          .finally(() => setLoadingScore(false));
      } else {
        setWeekendScore(null);
      }
    }).catch(() => setFantasy(emptyFantasyTeam));
  }, []));

  const { picks } = fantasy;
  const edit = () => nav.navigate('CriarEquipe');
  const remove = () => edit();

  return (
    <Screen title="Minha Equipe" footer={<BudgetBar used={fantasy.budgetUsed} />}>
      <View style={s.card}>
        <View style={s.between}>
          <View>
            <Text style={s.eyebrow}>TIME DE FANTASY</Text>
            <Text style={s.title}>{fantasy.teamName}</Text>
          </View>
          {loadingScore ? (
            <ActivityIndicator color={colors.red} />
          ) : (
            <View style={s.totalBlock}>
              <Text style={s.total}>{weekendScore?.total ?? '—'}</Text>
              <Text style={s.muted}>pontos Fantasy</Text>
            </View>
          )}
        </View>
        <View style={s.summaryRow}>
          <View><Text style={s.muted}>Último GP</Text><Text style={s.bold}>{weekendScore?.name ?? 'Aguardando cálculo'}</Text></View>
          <View><Text style={s.muted}>Classificação</Text><Text style={s.bold}>{fantasy.rank}</Text></View>
        </View>
      </View>

      <Text style={s.section}>Pilotos</Text>
      <View style={s.driverGrid}>
        {picks.drivers.map((driver) => (
          <View key={driver.name} style={s.driverCard}>
            <Pressable onPress={remove} hitSlop={8} style={s.remove}><Ionicons name="close" size={14} color={colors.textMuted} /></Pressable>
            <Avatar label={driver.name} size={82} source={driver.headshotUrl ? { uri: driver.headshotUrl } : undefined} />
            <Text style={s.driverName} numberOfLines={1}>{driver.name}</Text>
            <Text style={s.role}>PILOTO</Text>
            <Text style={s.price}>{money(driver.price)}</Text>
            <Text style={s.points}>{weekendScore?.drivers.find((score) => score.name === driver.name)?.pts ?? '—'} pts no GP</Text>
          </View>
        ))}
      </View>

      {!!picks.constructor && (
        <>
          <Text style={s.section}>Construtor</Text>
          <View style={[s.card, s.assetCard]}>
            {picks.constructor.logoAsset || picks.constructor.logoUrl ? (
              <Image source={picks.constructor.logoAsset ?? { uri: picks.constructor.logoUrl }} style={s.constructorLogo} resizeMode="contain" />
            ) : (
              <View style={s.constructorFallback}><Text style={s.fallbackText}>{picks.constructor.name.slice(0, 2).toUpperCase()}</Text></View>
            )}
            <View style={s.assetInfo}>
              <Text style={s.name}>{picks.constructor.name}</Text>
              <Text style={s.muted}>Construtor · {money(picks.constructor.price)}</Text>
            </View>
            <Text style={s.points}>—</Text>
          </View>
        </>
      )}

      {!!picks.chief && (
        <>
          <Text style={s.section}>Chefe de equipe</Text>
          <View style={[s.card, s.assetCard]}>
            <Avatar label={picks.chief.name} size={48} />
            <View style={s.assetInfo}>
              <Text style={s.name}>{picks.chief.name}</Text>
              <Text style={s.muted}>Chefe de equipe · {money(picks.chief.price)}</Text>
            </View>
            <Text style={s.points}>—</Text>
          </View>
        </>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.border },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  eyebrow: { color: colors.red, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginBottom: 3 },
  title: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 14 },
  totalBlock: { alignItems: 'flex-end' },
  total: { color: colors.red, fontSize: 22, fontWeight: '900' },
  section: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  muted: { color: colors.textMuted, fontSize: 10 },
  bold: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 3 },
  driverGrid: { flexDirection: 'row', gap: 10 },
  driverCard: { flex: 1, alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.lg, padding: 12, minHeight: 190 },
  remove: { alignSelf: 'flex-end', padding: 2 },
  driverName: { color: colors.text, fontSize: 13, fontWeight: '800', marginTop: 9, maxWidth: '100%' },
  role: { color: colors.textMuted, fontSize: 9, fontWeight: '800', marginTop: 3 },
  price: { color: colors.text, fontSize: 13, fontWeight: '800', marginTop: 7 },
  points: { color: colors.red, fontSize: 11, fontWeight: '900', marginTop: 4 },
  name: { color: colors.text, fontSize: 13, fontWeight: '800' },
  assetCard: { minHeight: 76, flexDirection: 'row', alignItems: 'center' },
  assetInfo: { flex: 1, marginHorizontal: 12 },
  constructorLogo: { width: 52, height: 52, borderRadius: 14, backgroundColor: colors.text },
  constructorFallback: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#35171A', alignItems: 'center', justifyContent: 'center' },
  fallbackText: { color: colors.red, fontSize: 14, fontWeight: '900' },
});

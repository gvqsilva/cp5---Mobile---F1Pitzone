import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Avatar from '../../components/Avatar';
import BudgetBar from '../../components/BudgetBar';
import RaceCard from '../../components/RaceCard';
import Button from '../../components/Button';
import useNav from '../../hooks/useNav';
import { emptyFantasyTeam, FantasyTeam, getFantasyTeam, getLatestFantasyScore } from '../../services/fantasy';

export default function FantasyHomeScreen() {
  const nav = useNav();
  const [fantasy, setFantasy] = useState<FantasyTeam>(emptyFantasyTeam);
  const [weekendScore, setWeekendScore] = useState<Awaited<ReturnType<typeof getLatestFantasyScore>> | null>(null);

  useFocusEffect(useCallback(() => {
    getFantasyTeam().then((team) => {
      setFantasy(team);
      if (team.picks.drivers.length === 2) {
        getLatestFantasyScore(team).then(setWeekendScore).catch(() => setWeekendScore(null));
      } else {
        setWeekendScore(null);
      }
    });
  }, []));
  const { picks } = fantasy;
  const hasTeam = picks.drivers.length === 2 && !!picks.constructor && !!picks.chief;

  return (
    <Screen footer={<Button title={hasTeam ? 'Gerenciar equipe' : 'Criar minha equipe'} onPress={() => nav.navigate(hasTeam ? 'MinhaEquipe' : 'CriarEquipe')} />}>
      <View style={s.header}>
        <View><Text style={s.eyebrow}>PITZONE</Text><Text style={s.logo}>FANTASY</Text></View>
        <View style={s.seasonBadge}><Ionicons name="trophy-outline" size={15} color={colors.red} /><Text style={s.season}>2026</Text></View>
      </View>
      <RaceCard />

      {hasTeam ? (
        <View style={s.summaryCard}>
          <View style={s.cardAccent} />
          <View style={s.between}>
            <View style={s.teamIdentity}>
              <View style={s.teamMark}><Ionicons name="flag" size={18} color={colors.text} /></View>
              <View>
                <Text style={s.muted}>Time atual</Text>
                <Text style={s.title}>{fantasy.teamName}</Text>
              </View>
            </View>
            <Pressable onPress={() => nav.navigate('CriarEquipe')} hitSlop={8} style={s.editButton}>
              <Ionicons name="create-outline" size={17} color={colors.textMuted} />
            </Pressable>
          </View>
          <View style={s.rankRow}>
            <View><Text style={s.muted}>Ranking geral</Text><Text style={s.rank}>{fantasy.rank}</Text></View>
            <View style={s.totalPoints}><Text style={s.metricValue}>{weekendScore ? weekendScore.total : '—'}</Text><Text style={s.muted}>pontos Fantasy</Text></View>
          </View>
          <View style={s.metrics}>
            <Metric label="Último fim de semana" value={weekendScore ? `${weekendScore.total} pts` : '—'} />
            <Metric label="Orçamento" value={`$${fantasy.budgetUsed.toFixed(1)}M`} />
            <Metric label="Escolhas" value="4/4" />
          </View>
          <BudgetBar used={fantasy.budgetUsed} />
          <View style={s.lineupHeader}>
            <Text style={s.section}>Escalação atual</Text>
            <Pressable onPress={() => nav.navigate('MinhaEquipe')} hitSlop={8}>
              <Text style={s.link}>Ver equipe</Text>
            </Pressable>
          </View>
          <View style={s.lineup}>
            {picks.drivers.map((driver, index) => (
              <LineupItem
                key={driver.name}
                role={`Piloto ${index + 1}`}
                label={driver.name.split(' ').pop() ?? driver.name}
                avatar={driver.name}
                source={driver.headshotUrl}
                points={weekendScore?.drivers.find((score) => score.name === driver.name)?.pts ?? null}
              />
            ))}
            {picks.chief && <LineupItem role="Chefe de equipe" label={picks.chief.name.split(' ').pop() ?? picks.chief.name} avatar={picks.chief.name} points={null} />}
          </View>
          {picks.constructor && (
            <View style={s.constructorCard}>
              <View style={s.constructorIdentity}>
                {picks.constructor.logoAsset || picks.constructor.logoUrl ? (
                  <Image source={picks.constructor.logoAsset ?? { uri: picks.constructor.logoUrl }} style={s.constructorLogo} resizeMode="contain" />
                ) : (
                  <View style={s.constructorIcon}><Text style={s.constructorFallback}>{picks.constructor.name.slice(0, 2).toUpperCase()}</Text></View>
                )}
                <View>
                  <Text style={s.constructorRole}>CONSTRUTOR</Text>
                  <Text style={s.constructorName}>{picks.constructor.name}</Text>
                </View>
              </View>
              <Text style={s.constructorPoints}>—</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={s.emptyTeamCard}>
          <View style={s.emptyIcon}><Ionicons name="flag-outline" size={25} color={colors.red} /></View>
          <Text style={s.emptyTitle}>Monte seu time de Fantasy</Text>
          <Text style={s.emptyDescription}>Escolha seus pilotos, construtor e chefe de equipe para começar a competir.</Text>
          <Button title="Criar equipe" onPress={() => nav.navigate('CriarEquipe')} />
        </View>
      )}

      <Text style={s.section}>Acesso rápido</Text>
      <View style={s.actions}>
        <Action icon="create-outline" label="Editar escalação" onPress={() => nav.navigate('CriarEquipe')} />
        <Action icon="stats-chart-outline" label="Pontuação" onPress={() => nav.navigate('Pontuacao')} />
      </View>

      <View style={s.card}>
        <View style={s.between}>
          <View><Text style={s.muted}>Último fim de semana</Text><Text style={s.title}>{weekendScore?.name ?? 'Aguardando cálculo'}</Text></View>
          <Pressable onPress={() => nav.navigate('Pontuacao')} hitSlop={8}><Ionicons name="chevron-forward" size={20} color={colors.textMuted} /></Pressable>
        </View>
        {weekendScore ? <Text style={s.pts}>{weekendScore.total} pts Fantasy</Text> : <Text style={s.muted}>A pontuação será calculada com os resultados das sessões.</Text>}
      </View>

    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={s.metric}><Text style={s.metricValue}>{value}</Text><Text style={s.muted}>{label}</Text></View>;
}

function Action({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [s.action, pressed && s.actionPressed]}><Ionicons name={icon} size={21} color={colors.red} /><Text style={s.actionLabel}>{label}</Text></Pressable>;
}

function LineupItem({ role, label, avatar, source, points }: { role: string; label: string; avatar: string; source?: string; points: number | null }) {
  return (
    <View style={s.lineupItem}>
      <Avatar label={avatar} size={54} source={source ? { uri: source } : undefined} />
      <Text style={s.lineupName} numberOfLines={1}>{label}</Text>
      <Text style={s.lineupRole}>{role}</Text>
      <Text style={s.lineupPoints}>{points === null ? '—' : `${points} pts`}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: colors.red, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  logo: { color: colors.text, fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  seasonBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.surface, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 7 },
  season: { color: colors.text, fontSize: 11, fontWeight: '800' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14 },
  summaryCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 14, overflow: 'hidden' },
  cardAccent: { height: 3, backgroundColor: colors.red, borderRadius: 2, marginHorizontal: -16, marginTop: -16, marginBottom: 1 },
  emptyTeamCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18, alignItems: 'center', gap: 10 },
  emptyIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#35171A', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptyDescription: { color: colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center', maxWidth: 280, marginBottom: 4 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamIdentity: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  teamMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  editButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 2 },
  muted: { color: colors.textMuted, fontSize: 11 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  rank: { color: colors.text, fontSize: 30, fontWeight: '800' },
  totalPoints: { alignItems: 'flex-end' },
  metrics: { flexDirection: 'row', gap: 8 },
  metric: { flex: 1, gap: 3 },
  metricValue: { color: colors.text, fontSize: 14, fontWeight: '900' },
  section: { color: colors.text, fontSize: 13, fontWeight: '800' },
  lineupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  link: { color: colors.red, fontSize: 11, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8 },
  action: { flex: 1, minHeight: 72, alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 5 },
  actionPressed: { opacity: 0.75, borderColor: colors.red },
  actionLabel: { color: colors.text, fontSize: 10, fontWeight: '700', textAlign: 'center' },
  pts: { color: colors.red, fontSize: 18, fontWeight: '800', marginTop: 4 },
  lineup: { flexDirection: 'row', gap: 7, marginTop: 10 },
  lineupItem: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: colors.surfaceAlt, borderRadius: 12, paddingHorizontal: 4, paddingVertical: 9 },
  lineupRole: { color: colors.textMuted, fontSize: 8, textAlign: 'center' },
  lineupName: { color: colors.text, fontSize: 10, fontWeight: '800', textAlign: 'center' },
  lineupPoints: { color: colors.red, fontSize: 10, fontWeight: '900', marginTop: 2 },
  constructorCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceAlt, borderRadius: 12, padding: 10, marginTop: 8 },
  constructorIdentity: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  constructorIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#35171A', alignItems: 'center', justifyContent: 'center' },
  constructorLogo: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.text },
  constructorFallback: { color: colors.red, fontSize: 11, fontWeight: '900' },
  constructorRole: { color: colors.textMuted, fontSize: 8, fontWeight: '700' },
  constructorName: { color: colors.text, fontSize: 14, fontWeight: '800', marginTop: 1 },
  constructorPoints: { color: colors.red, fontSize: 14, fontWeight: '900' },
});

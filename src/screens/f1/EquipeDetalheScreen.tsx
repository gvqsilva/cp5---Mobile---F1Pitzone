import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import Avatar from '../../components/Avatar';
import { colors, radius } from '../../theme';
import { getOpenF1Drivers, OpenF1DriverProfile } from '../../services/openf1';
import { getTeamDetail, TeamDetail } from '../../services/jolpica';
import useNav from '../../hooks/useNav';
import { getTeamDisplayName, getTeamLogoAsset } from '../../services/fantasy';

const normalizeName = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9 ]/g, '')
  .trim();

function findHeadshot(name: string, drivers: OpenF1DriverProfile[]) {
  const parts = normalizeName(name).split(' ');
  return drivers.find((driver) => {
    const driverParts = normalizeName(driver.name).split(' ');
    return parts.some((part) => part.length > 3 && driverParts.includes(part));
  })?.headshotUrl;
}

export default function EquipeDetalheScreen() {
  const route = useRoute<any>();
  const nav = useNav();
  const teamId = String(route.params?.id ?? '');
  const [detail, setDetail] = useState<TeamDetail | null>(null);
  const [headshots, setHeadshots] = useState<OpenF1DriverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setDetail(null);
    setError(false);
    Promise.all([getTeamDetail(teamId), getOpenF1Drivers()])
      .then(([team, drivers]) => {
        if (!active) return;
        setDetail(team);
        setHeadshots(drivers);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [teamId]);

  if (loading) {
    return <Screen title="Detalhes da equipe"><ActivityIndicator color={colors.red} /></Screen>;
  }

  if (error || !detail) {
    return (
      <Screen title="Detalhes da equipe">
        <View style={s.empty}>
          <Ionicons name="cloud-offline-outline" size={34} color={colors.textMuted} />
          <Text style={s.emptyTitle}>Não foi possível carregar a equipe</Text>
          <Text style={s.emptyText}>Tente novamente quando a conexão estiver disponível.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title={getTeamDisplayName(detail.name)}>
      <View style={s.hero}>
        {getTeamLogoAsset(detail.id) || getTeamLogoAsset(detail.name) ? (
          <Image source={getTeamLogoAsset(detail.id) ?? getTeamLogoAsset(detail.name)} style={s.teamLogo} resizeMode="contain" />
        ) : (
          <Avatar label={detail.name} size={70} />
        )}
        <View style={s.heroCopy}>
          <Text style={s.teamName}>{getTeamDisplayName(detail.name)}</Text>
          <Text style={s.country}>{detail.nationality}</Text>
          <Text style={s.season}>Temporada {detail.season}</Text>
        </View>
      </View>

      <View style={s.statsGrid}>
        <Stat label="Posição" value={`${detail.position}º`} />
        <Stat label="Pontos" value={`${detail.points}`} />
        <Stat label="Vitórias" value={`${detail.wins}`} />
        <Stat label="Títulos" value={`${detail.titles}`} />
      </View>

      <SectionTitle title="Pilotos principais" />
      {detail.drivers.length > 0 ? detail.drivers.map((driver) => (
        <Pressable
          key={driver.id}
          style={s.driverRow}
          onPress={() => nav.navigate('PilotoDetalhe', { id: driver.id })}
        >
          <Avatar label={driver.name} size={46} source={findHeadshot(driver.name, headshots) ? { uri: findHeadshot(driver.name, headshots) } : undefined} />
          <View style={s.driverCopy}>
            <Text style={s.driverName}>{driver.name}</Text>
            <Text style={s.driverMeta}>{driver.position}º no campeonato · {driver.points} pts</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
      )) : <Text style={s.muted}>Nenhum piloto encontrado para esta temporada.</Text>}

      <SectionTitle title="Chefe de equipe" />
      <View style={s.principalCard}>
        <Ionicons name="person-circle-outline" size={30} color={colors.red} />
        <View style={s.principalCopy}>
          <Text style={s.principalName}>{detail.teamPrincipal}</Text>
          <Text style={s.principalMeta}>Responsável pela {detail.name}</Text>
        </View>
      </View>

      <SectionTitle title="Histórico de construtores" />
      <View style={s.historyCard}>
        <Text style={s.historyNumber}>{detail.titles}</Text>
        <Text style={s.historyLabel}>títulos mundiais de construtores</Text>
        {detail.titleYears.length > 0 && (
          <Text style={s.years}>{detail.titleYears.join(' · ')}</Text>
        )}
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={s.sectionTitle}>{title}</Text>;
}

const s = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16 },
  heroCopy: { flex: 1, gap: 3 },
  teamLogo: { width: 104, height: 76, borderRadius: 18, backgroundColor: colors.text, padding: 10 },
  teamName: { color: colors.text, fontSize: 21, fontWeight: '900' },
  country: { color: colors.textMuted, fontSize: 12 },
  season: { color: colors.red, fontSize: 12, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stat: { width: '48%', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 13 },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '900' },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: 8 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 10 },
  driverCopy: { flex: 1, gap: 4 },
  driverName: { color: colors.text, fontSize: 14, fontWeight: '800' },
  driverMeta: { color: colors.textMuted, fontSize: 11 },
  historyCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 16 },
  historyNumber: { color: colors.red, fontSize: 30, fontWeight: '900' },
  historyLabel: { color: colors.text, fontSize: 13, fontWeight: '700' },
  years: { color: colors.textMuted, fontSize: 12, marginTop: 9, lineHeight: 19 },
  muted: { color: colors.textMuted, fontSize: 12 },
  principalCard: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 13 },
  principalCopy: { flex: 1, gap: 4 },
  principalName: { color: colors.text, fontSize: 14, fontWeight: '800' },
  principalMeta: { color: colors.textMuted, fontSize: 11 },
  empty: { alignItems: 'center', gap: 8, padding: 28 },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});

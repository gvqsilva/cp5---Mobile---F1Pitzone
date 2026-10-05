import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Tabs from '../../components/Tabs';
import Avatar from '../../components/Avatar';
import { drivers, driverProfile as fallbackProfile } from '../../services/mock';
import { DriverDetail, getDriverDetail } from '../../services/jolpica';
import { getOpenF1Drivers, OpenF1DriverProfile } from '../../services/openf1';

const normalizeName = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9 ]/g, '')
  .trim();

export default function PilotoDetalheScreen() {
  const { params } = useRoute<any>();
  const routeId = String(params?.id ?? '');
  const selectedDriver = drivers.find((d) => d.id === routeId);
  const [detail, setDetail] = useState<DriverDetail | null>(null);
  const [openF1Driver, setOpenF1Driver] = useState<OpenF1DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Temporada 2026');
  const [headshotUrl, setHeadshotUrl] = useState<string>();

  useEffect(() => {
    if (routeId.startsWith('openf1-')) {
      setDetail(null);
      setLoading(false);
    } else {
      getDriverDetail(routeId)
        .then(setDetail)
        .catch(() => setDetail(null))
        .finally(() => setLoading(false));
    }
    getOpenF1Drivers()
      .then((openF1Drivers) => {
        const selectedNumber = routeId.startsWith('openf1-') ? routeId.replace('openf1-', '') : '';
        const normalizedName = normalizeName(selectedDriver?.name ?? routeId.replace(/_/g, ' '));
        const selectedParts = normalizedName.split(' ');
        const match = openF1Drivers.find((item) => (
          selectedNumber
            ? String(item.number) === selectedNumber
            : normalizeName(item.name) === normalizedName
              || normalizeName(item.name).split(' ').slice(-1)[0] === selectedParts.slice(-1)[0]
        ));
        setOpenF1Driver(match ?? null);
        setHeadshotUrl(match?.headshotUrl);
      })
      .catch(() => setHeadshotUrl(undefined));
  }, [routeId, selectedDriver?.id]);

  const stats = tab === 'Carreira' ? detail?.career ?? fallbackProfile.career : detail?.season ?? fallbackProfile.season;
  const lastRaces = detail?.lastRaces ?? fallbackProfile.lastRaces;
  const teams = detail?.teams ?? fallbackProfile.teams;
  const displayName = openF1Driver?.name ?? detail?.name ?? selectedDriver?.name ?? routeId;
  const currentTeam = openF1Driver?.team ?? detail?.team ?? selectedDriver?.team ?? 'Equipe não informada';
  const visibleTeams = tab === 'Carreira' ? teams : [{ name: currentTeam, years: 'Temporada atual' }];

  return (
    <Screen title="Piloto">
      <View style={s.hero}>
        <Avatar label={displayName} size={84} source={headshotUrl ? { uri: headshotUrl } : undefined} />
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.muted}>{currentTeam}</Text>
          <Text style={s.muted}>{detail?.nationality ?? fallbackProfile.nationality}  ·  {detail?.birth ?? fallbackProfile.birth}</Text>
        </View>
        <Ionicons name="heart-outline" size={20} color={colors.text} />
      </View>

      <Tabs tabs={['Temporada 2026', 'Carreira']} value={tab} onChange={setTab} />
      {loading && <ActivityIndicator color={colors.red} />}
      <View style={s.grid}>
        {Object.entries(stats).map(([k, v]) => (
          <View key={k} style={s.stat}><Text style={s.value}>{v}</Text><Text style={s.muted}>{k}</Text></View>
        ))}
      </View>

      <Text style={s.section}>Últimas corridas</Text>
      <View style={s.grid}>
        {lastRaces.map((r) => (
          <View key={r.gp} style={s.raceCard}><Text style={s.muted}>{r.gp}</Text><Text style={s.value}>{r.pos}</Text></View>
        ))}
      </View>

      <Text style={s.section}>Equipes</Text>
      <View style={s.teams}>
        {visibleTeams.map((t) => (
          <View key={`${t.name}-${t.years}`} style={s.teamCard}><Text style={s.name}>{t.name}</Text><Text style={s.muted}>{t.years}</Text></View>
        ))}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18 },
  name: { color: colors.text, fontSize: 16, fontWeight: '800' },
  muted: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
  section: { color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 10, marginBottom: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  teams: { gap: 10 },
  teamCard: { width: '100%', minHeight: 104, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 20, justifyContent: 'center' },
  stat: { width: '48%', minHeight: 72, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12, alignItems: 'center', justifyContent: 'center', gap: 4 },
  raceCard: { width: '48%', minHeight: 66, backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  value: { color: colors.text, fontSize: 18, fontWeight: '800' },
});

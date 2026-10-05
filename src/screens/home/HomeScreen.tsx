import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, spacing } from '../../theme';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import { nextRace, news } from '../../services/mock';
import { getProfile } from '../../services/storage';
import { CalendarRace, getCalendar, getRaceDetail, RaceDetail } from '../../services/jolpica';
import { getOpenF1Sessions } from '../../services/openf1';
import { emptyFantasyTeam, FantasyTeam, getFantasyTeam, getLatestFantasyScore } from '../../services/fantasy';
import { getCircuitImage } from '../../services/circuitImages';
import useNav from '../../hooks/useNav';
import useCountdown from '../../hooks/useCountdown';

const SHORTCUTS = [
  { label: 'F1', icon: 'flag-outline' as const, route: 'F1' },
  { label: 'Calendário', icon: 'calendar-outline' as const, route: 'Calendario' },
  { label: 'Pilotos', icon: 'person-outline' as const, route: 'Pilotos' },
  { label: 'Equipes', icon: 'people-outline' as const, route: 'Equipes' },
];

const Card = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <View style={[styles.card, style]}>{children}</View>
);

type AgendaSession = RaceDetail['sessions'][string][number] & { day: 'SEX' | 'SÁB' | 'DOM' };

const localDateKey = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const agendaDayName = (day: AgendaSession['day']) => ({
  SEX: 'SEX',
  SÁB: 'SÁB',
  DOM: 'DOM',
}[day]);

export default function HomeScreen() {
  const nav = useNav();
  const [profileName, setProfileName] = useState('Usuário');
  const [upcomingRace, setUpcomingRace] = useState<CalendarRace | null>(null);
  const [raceSessions, setRaceSessions] = useState<AgendaSession[]>([]);
  const [agendaNow, setAgendaNow] = useState(() => Date.now());
  const [fantasyTeam, setFantasyTeam] = useState<FantasyTeam>(emptyFantasyTeam);
  const [fantasyScore, setFantasyScore] = useState<Awaited<ReturnType<typeof getLatestFantasyScore>> | null>(null);
  const fallbackRace = { ...nextRace, id: 'ned', flag: '🇳🇱', country: 'Holanda', status: 'next' as const };
  const race = upcomingRace ?? fallbackRace;
  const countdown = useCountdown(race.startsAt);
  const hasFantasyTeam = fantasyTeam.picks.drivers.length === 2
    && !!fantasyTeam.picks.constructor
    && !!fantasyTeam.picks.chief;

  useFocusEffect(useCallback(() => {
    getCalendar().then((races) => {
      const next = races.find((item) => item.status === 'next');
      setUpcomingRace(next ?? null);
    }).catch(() => undefined);
    getFantasyTeam().then((team) => {
      setFantasyTeam(team);
      if (team.picks.drivers.length === 2 && team.picks.constructor && team.picks.chief) {
        getLatestFantasyScore(team).then(setFantasyScore).catch(() => setFantasyScore(null));
      } else {
        setFantasyScore(null);
      }
    }).catch(() => {
      setFantasyTeam(emptyFantasyTeam);
      setFantasyScore(null);
    });
  }, []));

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile?.name) setProfileName(profile.name);
    }).catch(() => undefined);

    getCalendar().then((races) => {
      const next = races.find((item) => item.status === 'next');
      if (next) setUpcomingRace(next);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgendaNow(Date.now());
      getCalendar().then((races) => {
        const next = races.find((item) => item.status === 'next');
        setUpcomingRace(next ?? null);
      }).catch(() => undefined);
    }, 5 * 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!upcomingRace) {
      setRaceSessions([]);
      return;
    }

    getRaceDetail(upcomingRace.id).then((detail) => {
      const days = ['SEX', 'SÁB', 'DOM'] as const;
      const jolpicaSessions = days.flatMap((day) => detail.sessions[day].map((session) => ({ ...session, day })));
      return getOpenF1Sessions(detail.raceDate, detail.circuit).then((openF1Sessions) => {
        if (openF1Sessions.length === 0) {
          setRaceSessions(jolpicaSessions);
          return;
        }
        setRaceSessions(openF1Sessions.map((session) => ({
          day: session.day,
          name: session.name,
          time: new Date(session.startsAt).toLocaleTimeString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            hour: '2-digit',
            minute: '2-digit',
          }),
          tv: 'F1 TV e SporTV',
          startsAt: session.startsAt,
        })));
      }).catch(() => setRaceSessions(jolpicaSessions));
    }).catch(() => setRaceSessions([]));
  }, [upcomingRace]);

  const raceAgenda = React.useMemo(() => {
    if (raceSessions.length === 0) return [];

    const now = new Date(agendaNow);
    const today = localDateKey(now);
    const remainingToday = raceSessions
      .filter((session) => localDateKey(new Date(session.startsAt)) === today && new Date(session.startsAt) >= now)
      .sort((first, second) => first.startsAt.localeCompare(second.startsAt));

    if (remainingToday.length > 0) return remainingToday;

    const nextDate = raceSessions
      .map((session) => localDateKey(new Date(session.startsAt)))
      .filter((date) => date > today)
      .sort()[0];

    return nextDate
      ? raceSessions
        .filter((session) => localDateKey(new Date(session.startsAt)) === nextDate)
        .sort((first, second) => first.startsAt.localeCompare(second.startsAt))
      : [];
  }, [agendaNow, raceSessions]);

  const countdownBox = (value: number, label: string) => (
    <View style={styles.countdownBox}>
      <Text style={styles.countdownValue}>{countdown.ended ? '—' : value}</Text>
      <Text style={styles.countdownLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ImageBackground source={require('../../assets/home-bemvindo.png')} style={styles.header} imageStyle={styles.headerImage}>
        <View style={styles.headerShade} />
        <View style={styles.headerTop}>
          <Logo />
          <Pressable style={styles.notification} onPress={() => nav.navigate('Noticias')} hitSlop={8}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.welcome}>BEM-VINDO DE VOLTA</Text>
          <Text style={styles.name}>{profileName}</Text>
          <Text style={styles.sub}>Acompanhe a temporada e monte sua melhor equipe.</Text>
          <Button
            title={hasFantasyTeam ? 'MINHA EQUIPE' : 'CRIAR EQUIPE'}
            variant="outline"
            onPress={() => nav.navigate(hasFantasyTeam ? 'MinhaEquipe' : 'CriarEquipe')}
            style={styles.headerButton}
          />
        </View>
      </ImageBackground>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Próxima corrida</Text>
          <Text style={styles.sectionHint}>A contagem já começou</Text>
        </View>
        <Pressable onPress={() => nav.navigate('Calendario')}><Text style={styles.link}>Calendário</Text></Pressable>
      </View>
      <Pressable style={({ pressed }) => [styles.raceCard, pressed && styles.pressed]} onPress={() => nav.navigate('Sessoes', { raceId: race.id })}>
        <ImageBackground
          source={getCircuitImage(race.name, race.circuit, race.country)}
          style={styles.raceImage}
          imageStyle={styles.raceImageContent}
        >
          <View style={styles.raceImageShade} />
          <View style={styles.raceHeader}>
            <View style={styles.raceTitleBlock}>
              <Text style={styles.cardLabel}>GRANDE PRÊMIO</Text>
              <Text style={styles.raceName}>{race.name.replace(/^GP da /, 'GP ').toUpperCase()}</Text>
              <Text style={styles.circuit} numberOfLines={1}>{race.circuit}</Text>
            </View>
          </View>
          <View style={styles.countdownRow}>
            {countdownBox(countdown.dias, 'DIAS')}
            {countdownBox(countdown.horas, 'HORAS')}
            {countdownBox(countdown.min, 'MIN')}
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={15} color={colors.red} />
            <Text style={styles.date}>{race.dates}</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
          </View>
        </ImageBackground>
      </Pressable>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Agenda do GP</Text>
          <Text style={styles.sectionHint}>Horários oficiais em Brasília</Text>
        </View>
        <Pressable onPress={() => nav.navigate('Sessoes', { raceId: race.id })}><Text style={styles.link}>Ver sessões</Text></Pressable>
      </View>
      <Card style={styles.agendaCard}>
        {raceAgenda.length > 0 ? raceAgenda.map((item, index) => (
          <View key={`${item.startsAt}-${item.name}`} style={[styles.agendaItem, index === raceAgenda.length - 1 && styles.lastAgendaItem]}>
            <View style={styles.agendaInfo}>
              <View style={styles.agendaTitleRow}>
                <Text style={styles.agendaDayText}>{agendaDayName(item.day)}</Text>
                <Text style={styles.agendaSeparator}>|</Text>
                <Text style={styles.agendaTitle} numberOfLines={1}>{item.name}</Text>
              </View>
              <Text style={styles.agendaBroadcast} numberOfLines={1}>Transmissão: {item.tv}</Text>
            </View>
            <Text style={styles.agendaTime}>{item.time}</Text>
          </View>
        )) : (
          <View style={styles.emptyAgenda}>
            <Ionicons name="time-outline" size={20} color={colors.textMuted} />
            <Text style={styles.emptyAgendaText}>Agenda indisponível no momento.</Text>
          </View>
        )}
      </Card>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Atalhos rápidos</Text>
          <Text style={styles.sectionHint}>Acesse as principais áreas do app</Text>
        </View>
      </View>
      <View style={styles.shortcutGrid}>
        {SHORTCUTS.map((shortcut) => (
          <Pressable key={shortcut.label} onPress={() => nav.navigate(shortcut.route)} style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}>
            <View style={styles.shortcutIcon}><Ionicons name={shortcut.icon} size={16} color={colors.red} /></View>
            <Text style={styles.shortcutLabel} numberOfLines={1}>{shortcut.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Minha equipe</Text>
          <Text style={styles.sectionHint}>Seu time atual da temporada</Text>
        </View>
        <Pressable onPress={() => nav.navigate('MinhaEquipe')}><Text style={styles.link}>Gerenciar</Text></Pressable>
      </View>
      {fantasyTeam.picks.drivers.length === 2 && fantasyTeam.picks.constructor && fantasyTeam.picks.chief ? (
        <Card>
          <View style={styles.teamCardHeader}>
            <View>
              <Text style={styles.cardLabel}>TIME ATUAL</Text>
              <Text style={styles.teamName}>{fantasyTeam.teamName}</Text>
            </View>
            <Text style={styles.teamTotal}>{fantasyScore ? `${fantasyScore.total} pts` : '—'}</Text>
          </View>
          <View style={styles.driverGrid}>
            {fantasyTeam.picks.drivers.map((driver, index) => (
              <View key={driver.name} style={styles.driver}>
                <Avatar label={driver.name} size={48} source={driver.headshotUrl ? { uri: driver.headshotUrl } : undefined} />
                <Text style={styles.driverName} numberOfLines={1}>{driver.name.split(' ').pop() ?? driver.name}</Text>
                <Text style={styles.driverRole}>PILOTO {index + 1}</Text>
                <Text style={styles.driverPts}>
                  {fantasyScore?.drivers.find((score) => score.name === driver.name)?.pts ?? '—'} pts Fantasy
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.constructor}>
            {fantasyTeam.picks.constructor.logoUrl ? (
              <Image source={{ uri: fantasyTeam.picks.constructor.logoUrl }} style={styles.constructorLogo} resizeMode="contain" />
            ) : (
              <View style={styles.constructorIcon}><Text style={styles.constructorFallback}>{fantasyTeam.picks.constructor.name.slice(0, 2).toUpperCase()}</Text></View>
            )}
            <View style={styles.constructorInfo}>
              <Text style={styles.driverRole}>CONSTRUTOR</Text>
              <Text style={styles.constructorName}>{fantasyTeam.picks.constructor.name}</Text>
            </View>
            <Text style={styles.constructorPts}>—</Text>
          </View>
          <View style={styles.chiefRow}>
            <Ionicons name="person-outline" size={16} color={colors.textMuted} />
            <Text style={styles.chiefLabel}>CHEFE DE EQUIPE</Text>
            <Text style={styles.chiefName}>{fantasyTeam.picks.chief.name}</Text>
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={styles.teamName}>Você ainda não montou sua equipe</Text>
          <Text style={styles.emptyTeamText}>Escolha seus pilotos, construtor e chefe para começar no Fantasy.</Text>
          <Button title="Criar equipe" onPress={() => nav.navigate('CriarEquipe')} />
        </Card>
      )}

      <View style={styles.splitColumn}>
        <Card style={styles.newsCard}>
          <View style={styles.cardHeading}><Ionicons name="newspaper-outline" size={18} color={colors.red} /><Text style={styles.cardTitle}>Notícias</Text></View>
          <Text style={styles.newsTag}>{news.tag}</Text>
          <Text style={styles.newsTitle} numberOfLines={4}>{news.title}</Text>
          <Pressable onPress={() => nav.navigate('Noticias')}><Text style={styles.readMore}>Ler notícias <Text style={styles.arrow}>›</Text></Text></Pressable>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.md, paddingBottom: 40, gap: 10 },
  header: { height: 270, marginHorizontal: -spacing.md, paddingHorizontal: spacing.lg, paddingTop: 48, overflow: 'hidden', justifyContent: 'space-between' },
  headerImage: { opacity: 0.9, resizeMode: 'cover' },
  headerShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.28)' },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notification: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(7, 7, 13, 0.58)', alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.red },
  headerCopy: { paddingBottom: spacing.lg },
  welcome: { color: colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  name: { color: colors.text, fontSize: 27, fontWeight: '900', marginTop: 3 },
  sub: { color: colors.text, fontSize: 11, maxWidth: 235, lineHeight: 16, marginTop: 3 },
  headerButton: { minWidth: 160, height: 38, marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 9, marginBottom: 2 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  sectionHint: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  link: { color: colors.red, fontSize: 11, fontWeight: '800', paddingBottom: 2 },
  raceCard: { minHeight: 238, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  raceImage: { flex: 1, minHeight: 238, padding: 20, justifyContent: 'space-between' },
  raceImageContent: { resizeMode: 'cover' },
  raceImageShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(5, 6, 12, 0.68)' },
  pressed: { opacity: 0.78, borderColor: colors.red },
  raceHeader: { alignItems: 'flex-start' },
  raceTitleBlock: { flex: 1, minWidth: 0 },
  cardLabel: { color: colors.red, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  raceName: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: 6, lineHeight: 29 },
  circuit: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  countdownRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  countdownBox: { flex: 1, height: 64, borderRadius: radius.md, backgroundColor: 'rgba(24, 26, 36, 0.5)', alignItems: 'center', justifyContent: 'center' },
  countdownValue: { color: colors.text, fontSize: 24, fontWeight: '900' },
  countdownLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '700', marginTop: 2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  date: { color: colors.text, fontSize: 13, fontWeight: '700', flex: 1 },
  shortcutGrid: { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
  shortcut: { width: '23.5%', height: 50, minWidth: 0, backgroundColor: colors.surface, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 1 },
  shortcutIcon: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#35171A', alignItems: 'center', justifyContent: 'center' },
  shortcutLabel: { color: colors.textMuted, fontSize: 7, fontWeight: '700', maxWidth: '100%', flexShrink: 1, textAlign: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14 },
  teamCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  teamName: { color: colors.text, fontSize: 15, fontWeight: '900', marginTop: 3 },
  teamTotal: { color: colors.red, fontSize: 17, fontWeight: '900' },
  emptyTeamText: { color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 5, marginBottom: 12 },
  driverGrid: { flexDirection: 'row', gap: 8 },
  driver: { flex: 1, alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 8 },
  driverName: { color: colors.text, fontSize: 10, fontWeight: '800', marginTop: 6, maxWidth: 70 },
  driverRole: { color: colors.textMuted, fontSize: 8, marginTop: 2 },
  driverPts: { color: colors.red, fontSize: 10, fontWeight: '800', marginTop: 3 },
  constructor: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 10, marginTop: 9 },
  constructorIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#35171A', alignItems: 'center', justifyContent: 'center' },
  constructorLogo: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.text },
  constructorFallback: { color: colors.red, fontSize: 11, fontWeight: '900' },
  constructorInfo: { flex: 1, marginLeft: 9 },
  constructorName: { color: colors.text, fontSize: 14, fontWeight: '900', marginTop: 2 },
  constructorPts: { color: colors.red, fontSize: 16, fontWeight: '900' },
  chiefRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10 },
  chiefLabel: { color: colors.textMuted, fontSize: 8, fontWeight: '800' },
  chiefName: { color: colors.text, fontSize: 10, fontWeight: '700', flex: 1, textAlign: 'right' },
  splitColumn: { gap: 10, marginTop: 2 },
  newsCard: { minHeight: 150 },
  agendaCard: { paddingVertical: 5 },
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 9 },
  cardTitle: { color: colors.text, fontSize: 12, fontWeight: '800' },
  newsTag: { color: colors.textMuted, fontSize: 8, fontWeight: '700', textTransform: 'uppercase' },
  newsTitle: { color: colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', marginTop: 6, minHeight: 62 },
  readMore: { color: colors.red, fontSize: 10, fontWeight: '800', marginTop: 9 },
  arrow: { fontSize: 16 },
  agendaItem: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 12 },
  lastAgendaItem: { borderBottomWidth: 0 },
  agendaInfo: { flex: 1, minWidth: 0, gap: 4 },
  agendaTitleRow: { flexDirection: 'row', alignItems: 'center', minWidth: 0, gap: 7 },
  agendaDayText: { color: colors.red, fontSize: 13, fontWeight: '900' },
  agendaSeparator: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
  agendaTitle: { color: colors.text, fontSize: 15, fontWeight: '800', flex: 1 },
  agendaBroadcast: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  agendaTime: { color: colors.textMuted, fontSize: 15, fontWeight: '800' },
  emptyAgenda: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyAgendaText: { color: colors.textMuted, fontSize: 11 },
});

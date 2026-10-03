import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { nextRace, myTeam, news, agenda } from '../../services/mock';
import { getProfile } from '../../services/storage';
import { getCalendar } from '../../services/jolpica';
import useNav from '../../hooks/useNav';

const SHORTCUTS = [
  { label: 'F1', icon: 'flag-outline' as const, route: 'F1' },
  { label: 'Calendário', icon: 'calendar-outline' as const, route: 'Calendario' },
  { label: 'Pilotos', icon: 'person-outline' as const, route: 'Pilotos' },
  { label: 'Equipes', icon: 'people-outline' as const, route: 'Equipes' },
  { label: 'Notícias', icon: 'newspaper-outline' as const, route: 'Noticias' },
];

function useCountdown(target: string) {
  const calc = () => Math.max(0, new Date(target).getTime() - Date.now());
  const [ms, setMs] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setMs(calc()), 30000);
    return () => clearInterval(t);
  }, [target]);
  return { dias: Math.floor(ms / 86400000), horas: Math.floor(ms / 3600000) % 24, min: Math.floor(ms / 60000) % 60, ended: ms === 0 };
}

const Card = ({ children, style }: { children: React.ReactNode; style?: object }) => <View style={[styles.card, style]}>{children}</View>;

export default function HomeScreen() {
  const nav = useNav();
  const [profileName, setProfileName] = useState('Usuário');
  const [upcomingRace, setUpcomingRace] = useState(nextRace);
  const cd = useCountdown(upcomingRace.startsAt);

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile?.name) setProfileName(profile.name);
    });
  }, []);

  useEffect(() => {
    getCalendar().then((races) => {
      const next = races.find((race) => race.status === 'next');
      if (next?.startsAt) setUpcomingRace(next);
    }).catch(() => undefined);
  }, []);
  const box = (v: number, label: string) => (
    <View style={styles.cdBox}>
      <Text style={styles.cdValue}>{cd.ended ? '-' : v}</Text>
      <Text style={styles.cdLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ImageBackground source={require('../../assets/home-bemvindo.png')} style={styles.header} imageStyle={styles.headerImage}>
        <View style={styles.headerShade} />
        <Logo />
        <View style={{ marginTop: 14 }}>
          <Text style={styles.welcome}>Bem-Vindo de Volta,</Text>
          <Text style={styles.name}>{profileName.toUpperCase()}</Text>
          <Text style={styles.sub}>Monte sua equipe e fique por dentro da F1 de um jeito diferente</Text>
          <Button title="MEU TIME" variant="outline" onPress={() => nav.navigate('MinhaEquipe')} style={{ width: 140, height: 34, marginTop: 10 }} />
        </View>
      </ImageBackground>

      <Card style={styles.nextRaceCard}>
        <Text style={styles.cardLabel}>Próxima Corrida</Text>
        <Text style={styles.raceName}>{upcomingRace.name.toUpperCase()}</Text>
        <Text style={styles.cardLabel}>{upcomingRace.circuit}</Text>
        <View style={styles.cdRow}>{box(cd.dias, 'DIAS')}{box(cd.horas, 'HORAS')}{box(cd.min, 'MIN')}</View>
        <Text style={styles.datePill}>{upcomingRace.dates}</Text>
      </Card>

      <Text style={styles.section}>Minha equipe</Text>
      <Card>
        <View style={styles.row}>
          {myTeam.drivers.map((d) => (
            <View key={d.id} style={styles.driver}>
              <View style={styles.avatar}><Ionicons name="person" size={28} color={colors.textMuted} /></View>
              <Text style={styles.driverName}>{d.name}</Text>
              <Text style={styles.driverRole}>{d.role}</Text>
              <Text style={styles.driverPts}>{d.points} pts</Text>
            </View>
          ))}
        </View>
        <View style={styles.constructor}>
          <View>
            <Text style={styles.driverRole}>{myTeam.constructor.name}</Text>
            <Text style={styles.constructorName}>{myTeam.constructor.label.toUpperCase()}</Text>
            <Text style={styles.driverRole}>Construtor</Text>
          </View>
          <Text style={styles.constructorPts}>{myTeam.constructor.points} pts</Text>
        </View>
        <Button title="GERENCIAR EQUIPE" variant="outline" onPress={() => nav.navigate('MinhaEquipe')} style={{ marginTop: 10, height: 34 }} />
      </Card>

      <Text style={styles.section}>Atalhos</Text>
      <View style={styles.row}>
        {SHORTCUTS.map((shortcut) => (
          <Pressable key={shortcut.label} onPress={() => nav.navigate(shortcut.route)} style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}>
            <Ionicons name={shortcut.icon} size={20} color={colors.text} />
            <Text style={styles.shortcutLabel}>{shortcut.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        <Card style={{ flex: 1.3 }}>
          <Text style={styles.cardTitle}>Notícias e Novidades</Text>
          <Text style={styles.driverRole}>{news.tag}</Text>
          <Text style={styles.newsTitle}>{news.title}</Text>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Agenda do dia</Text>
          {agenda.map((a) => (
            <View key={a.id} style={styles.agendaItem}>
              <Text style={styles.agendaTitle}>{a.title}</Text>
              <Text style={styles.driverRole}>{a.time}</Text>
            </View>
          ))}
        </Card>
      </View>

      <Text style={styles.section}>Destaques</Text>
      <View style={styles.row}>
        <View style={[styles.shortcut, { height: 90 }]} />
        <View style={[styles.shortcut, { height: 90, flex: 1.4 }]} />
        <View style={[styles.shortcut, { height: 90 }]} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingTop: 0, paddingBottom: 44, gap: 24 },
  header: { height: 280, marginHorizontal: -16, backgroundColor: '#000', paddingHorizontal: 32, paddingTop: 50, paddingBottom: 16, overflow: 'hidden' },
  headerImage: { opacity: 0.88, resizeMode: 'cover' },
  headerShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.18)' },
  nextRaceCard: { marginTop: 12 },
  welcome: { color: colors.text, fontSize: 11 },
  name: { color: colors.text, fontSize: 24, fontWeight: '800' },
  sub: { color: colors.text, fontSize: 10, maxWidth: 170, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18 },
  cardLabel: { color: colors.textMuted, fontSize: 12 },
  raceName: { color: colors.text, fontSize: 22, fontWeight: '800', marginVertical: 2 },
  cdRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cdBox: { flex: 1, height: 56, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  cdValue: { color: colors.text, fontSize: 20, fontWeight: '700' },
  cdLabel: { color: colors.textMuted, fontSize: 9 },
  datePill: { color: colors.text, fontSize: 12, marginTop: 12, alignSelf: 'flex-start', backgroundColor: colors.surfaceAlt, paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.pill },
  section: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 4 },
  row: { flexDirection: 'row', gap: 16 },
  shortcut: { flex: 1, height: 66, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 4 },
  shortcutPressed: { opacity: 0.72, borderColor: colors.red },
  shortcutLabel: { color: colors.textMuted, fontSize: 8, fontWeight: '600' },
  driver: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 8, alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  driverName: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 6 },
  driverRole: { color: colors.textMuted, fontSize: 10 },
  driverPts: { color: colors.red, fontSize: 11, fontWeight: '700', marginTop: 2 },
  constructor: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 12, marginTop: 10 },
  constructorName: { color: colors.text, fontSize: 16, fontWeight: '800' },
  constructorPts: { color: colors.red, fontSize: 22, fontWeight: '800' },
  cardTitle: { color: colors.text, fontSize: 11, fontWeight: '700', marginBottom: 6 },
  newsTitle: { color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 4 },
  agendaItem: { marginBottom: 8 },
  agendaTitle: { color: colors.text, fontSize: 11, fontWeight: '600' },
});

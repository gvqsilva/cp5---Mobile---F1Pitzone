import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import RaceCard from '../../components/RaceCard';
import useNav from '../../hooks/useNav';

const SHORTCUTS: { label: string; icon: keyof typeof Ionicons.glyphMap; route: string }[] = [
  { label: 'Pilotos', icon: 'people-outline', route: 'Pilotos' },
  { label: 'Equipes', icon: 'shield-outline', route: 'Equipes' },
  { label: 'Calendário', icon: 'calendar-outline', route: 'Calendario' },
  { label: 'Notícias', icon: 'newspaper-outline', route: 'Noticias' },
];

export default function F1HomeScreen() {
  const nav = useNav();
  return (
    <Screen>
      <View style={s.hero}>
        <View style={s.heroTop}>
          <View style={s.logoBadge}>
            <Image source={require('../../assets/logos/f1.png')} style={s.logoImage} resizeMode="contain" />
          </View>
          <View style={s.liveBadge}>
            <View style={s.liveDot} />
            <Text style={s.liveText}>TEMPORADA 2026</Text>
          </View>
        </View>
        <Text style={s.title}>Universo da F1</Text>
        <Text style={s.subtitle}>Tudo sobre a temporada, em um só lugar.</Text>
      </View>
      <View style={s.sectionHeading}>
        <View>
          <Text style={s.sectionTitle}>Próximo GP</Text>
          <Text style={s.sectionHint}>Acompanhe a contagem regressiva</Text>
        </View>
      </View>
      <RaceCard onPress={(raceId) => nav.navigate('Sessoes', { raceId })} />
      <View style={s.sectionHeading}>
        <View>
          <Text style={s.sectionTitle}>Explore a F1</Text>
          <Text style={s.sectionHint}>Acesse as principais informações</Text>
        </View>
      </View>
      <View style={s.grid}>
        {SHORTCUTS.map((x) => (
          <Pressable key={x.route} style={s.tile} onPress={() => nav.navigate(x.route)}>
            <View style={s.tileIcon}><Ionicons name={x.icon} size={19} color={colors.red} /></View>
            <View style={s.tileCopy}>
              <Text style={s.tileText}>{x.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18, marginBottom: 5 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoBadge: { width: 76, height: 42, borderRadius: radius.md, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  logoImage: { width: 64, height: 30 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#35171A', borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.red },
  liveText: { color: '#F2B7B7', fontSize: 8, fontWeight: '800', letterSpacing: 0.4 },
  title: { color: colors.text, fontSize: 25, fontWeight: '900', marginTop: 20 },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8, marginBottom: 1 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  sectionHint: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48%', minHeight: 82, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12, justifyContent: 'space-between' },
  tileIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: '#35171A', alignItems: 'center', justifyContent: 'center' },
  tileCopy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  tileText: { color: colors.text, fontSize: 13, fontWeight: '700' },
});

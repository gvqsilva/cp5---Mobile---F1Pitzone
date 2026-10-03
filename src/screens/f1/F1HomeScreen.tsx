import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
      <Text style={s.logo}>F1</Text>
      <RaceCard onPress={(raceId) => nav.navigate('Sessoes', { raceId })} />
      <View style={s.grid}>
        {SHORTCUTS.map((x) => (
          <Pressable key={x.route} style={s.tile} onPress={() => nav.navigate(x.route)}>
            <Ionicons name={x.icon} size={18} color={colors.red} />
            <Text style={s.tileText}>{x.label}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  logo: { color: colors.red, fontSize: 30, fontWeight: '900', fontStyle: 'italic' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48%', height: 70, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12, justifyContent: 'space-between' },
  tileText: { color: colors.text, fontSize: 13, fontWeight: '600' },
});

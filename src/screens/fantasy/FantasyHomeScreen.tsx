import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import RaceCard from '../../components/RaceCard';
import Button from '../../components/Button';
import useNav from '../../hooks/useNav';
import { fantasy } from '../../services/mock';
import { pts } from '../../services/format';

export default function FantasyHomeScreen() {
  const nav = useNav();
  return (
    <Screen footer={<Button title="Gerenciar Equipe" onPress={() => nav.navigate('MinhaEquipe')} />}>
      <Text style={s.logo}>FANTASY</Text>
      <RaceCard />
      <View style={s.card}>
        <View>
          <Text style={s.muted}>Minha Equipe</Text>
          <Text style={s.title}>{fantasy.teamName}</Text>
          <Text style={[s.muted, { marginTop: 8 }]}>Pontuação</Text>
          <Text style={s.title}>{pts(fantasy.total)}</Text>
        </View>
        <Text style={s.rank}>{fantasy.rank}</Text>
      </View>
      <View style={s.card}>
        <View>
          <Text style={s.muted}>Última Pontuação</Text>
          <Text style={s.title}>{fantasy.lastRace.name.toUpperCase()}</Text>
          <Text style={s.pts}>{fantasy.lastRace.pts} pts</Text>
        </View>
        <Button title="Ver Detalhes" variant="outline" onPress={() => nav.navigate('Pontuacao')} style={{ height: 32 }} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  logo: { color: colors.text, fontSize: 24, fontWeight: '800', fontStyle: 'italic', textAlign: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  muted: { color: colors.textMuted, fontSize: 11 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  rank: { color: colors.text, fontSize: 30, fontWeight: '800' },
  pts: { color: colors.red, fontSize: 18, fontWeight: '800', marginTop: 4 },
});

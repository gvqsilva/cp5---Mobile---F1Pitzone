import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import ListRow from '../../components/ListRow';
import useNav from '../../hooks/useNav';
import { calendar as fallbackCalendar } from '../../services/mock';
import { CalendarRace, getCalendar } from '../../services/jolpica';

const fallbackRaces = fallbackCalendar as CalendarRace[];

export default function CalendarioScreen() {
  const nav = useNav();
  const [races, setRaces] = useState<CalendarRace[]>(fallbackRaces);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCalendar()
      .then(setRaces)
      .catch(() => setRaces(fallbackRaces))
      .finally(() => setLoading(false));
  }, []);

  const renderRace = (r: CalendarRace) => (
    <ListRow
      key={r.id}
      active={r.status === 'next'}
      onPress={() => nav.navigate('Sessoes', { raceId: r.id })}
      left={<Text style={{ fontSize: 26 }}>{r.flag}</Text>}
      title={r.name}
      sub={`${r.dates}  ·  ${r.circuit}`}
      right={
        r.status === 'todo' ? <Ionicons name="chevron-forward" size={16} color={colors.textMuted} /> : (
          <View style={s.badge}><Text style={s.badgeText}>{r.status === 'next' ? 'Próxima' : 'Concluído'}</Text></View>
        )
      }
    />
  );
  const currentRace = races.find((race) => race.status === 'next');

  return (
    <Screen title="Calendário">
      <View style={s.intro}>
        <Text style={s.heading}>Calendário da temporada</Text>
        <Text style={s.hint}>Datas e circuitos oficiais dos GPs.</Text>
      </View>
      {loading && <ActivityIndicator color={colors.red} />}
      {currentRace && (
        <View style={s.currentSection}>
          <View>
            <Text style={s.currentEyebrow}>AGORA NA TEMPORADA</Text>
            <Text style={s.currentTitle}>Próximo GP</Text>
          </View>
          {renderRace(currentRace)}
        </View>
      )}
      <View style={s.calendarHeader}>
        <Text style={s.seasonTitle}>Calendário completo</Text>
        <Text style={s.calendarHint}>O próximo GP aparece destacado na ordem do calendário.</Text>
      </View>
      {races.map(renderRace)}
    </Screen>
  );
}

const s = StyleSheet.create({
  intro: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 15, gap: 3 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '900' },
  hint: { color: colors.textMuted, fontSize: 11 },
  currentSection: { backgroundColor: '#241416', borderRadius: radius.lg, borderWidth: 1, borderColor: '#5E2529', padding: 12, gap: 8, marginTop: 8 },
  currentEyebrow: { color: colors.red, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  currentTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 2 },
  calendarHeader: { gap: 3, marginTop: 8 },
  seasonTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 8 },
  calendarHint: { color: colors.textMuted, fontSize: 11 },
  badge: { backgroundColor: colors.red, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: colors.text, fontSize: 9, fontWeight: '700' },
});

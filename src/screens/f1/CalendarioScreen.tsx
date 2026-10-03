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

  return (
    <Screen title="Calendário">
      {loading && <ActivityIndicator color={colors.red} />}
      {races.map((r) => (
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
      ))}
    </Screen>
  );
}

const s = StyleSheet.create({
  badge: { backgroundColor: colors.red, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: colors.text, fontSize: 9, fontWeight: '700' },
});

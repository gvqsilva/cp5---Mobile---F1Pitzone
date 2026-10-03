import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import useCountdown from '../hooks/useCountdown';
import { nextRace } from '../services/mock';
import { CalendarRace, getCalendar } from '../services/jolpica';

export default function RaceCard({ onPress }: { onPress?: (raceId: string) => void }) {
  const [upcomingRace, setUpcomingRace] = useState<CalendarRace>({ ...nextRace, id: 'ned', flag: '🏁', status: 'next' });
  const cd = useCountdown(upcomingRace.startsAt);

  useEffect(() => {
    getCalendar().then((races) => {
      const next = races.find((race) => race.status === 'next');
      if (next?.startsAt) setUpcomingRace(next);
    }).catch(() => undefined);
  }, []);

  const box = (v: number, l: string) => (
    <View style={s.cdBox}>
      <Text style={s.cdValue}>{cd.ended ? '-' : v}</Text>
      <Text style={s.cdLabel}>{l}</Text>
    </View>
  );
  return (
    <Pressable onPress={() => onPress?.(upcomingRace.id)} style={s.card}>
      <Text style={s.cardLabel}>Próxima Corrida</Text>
      <Text style={s.raceName}>{upcomingRace.name.toUpperCase()}</Text>
      <Text style={s.cardLabel}>{upcomingRace.circuit}</Text>
      <View style={s.cdRow}>{box(cd.dias, 'DIAS')}{box(cd.horas, 'HORAS')}{box(cd.min, 'MIN')}</View>
      <Text style={s.datePill}>{upcomingRace.dates}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18, overflow: 'hidden' },
  cardLabel: { color: colors.textMuted, fontSize: 12 },
  raceName: { color: colors.text, fontSize: 22, fontWeight: '800', marginVertical: 2 },
  cdRow: { flexDirection: 'row', gap: 10, marginTop: 14, alignSelf: 'stretch' },
  cdBox: { flex: 1, height: 56, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  cdValue: { color: colors.text, fontSize: 20, fontWeight: '700' },
  cdLabel: { color: colors.textMuted, fontSize: 9 },
  datePill: { color: colors.text, fontSize: 12, marginTop: 12, alignSelf: 'flex-start', backgroundColor: colors.surfaceAlt, paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.pill },
});

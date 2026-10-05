import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { colors, radius } from '../theme';
import useCountdown from '../hooks/useCountdown';
import { nextRace } from '../services/mock';
import { CalendarRace, getCalendar } from '../services/jolpica';
import { getCircuitImage } from '../services/circuitImages';

export default function RaceCard({ onPress }: { onPress?: (raceId: string) => void }) {
  const [upcomingRace, setUpcomingRace] = useState<CalendarRace>({ ...nextRace, id: 'ned', flag: '🇳🇱', country: 'Holanda', status: 'next' });
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
      <ImageBackground
        source={getCircuitImage(upcomingRace.name, upcomingRace.circuit, upcomingRace.country)}
        style={s.image}
        imageStyle={s.imageContent}
      >
        <View style={s.imageShade} />
        <View style={s.content}>
          <Text style={s.cardLabel}>PRÓXIMA CORRIDA</Text>
          <Text style={s.raceName}>{upcomingRace.name.replace(/^GP da /, 'GP ').toUpperCase()}</Text>
          <Text style={s.circuit}>{upcomingRace.circuit}</Text>
          <View style={s.cdRow}>{box(cd.dias, 'DIAS')}{box(cd.horas, 'HORAS')}{box(cd.min, 'MIN')}</View>
          <Text style={s.datePill}>{upcomingRace.dates}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { minHeight: 238, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  image: { flex: 1, minHeight: 238, padding: 20, justifyContent: 'space-between' },
  imageContent: { resizeMode: 'cover' },
  imageShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(5, 6, 12, 0.68)' },
  content: { flex: 1, justifyContent: 'space-between' },
  cardLabel: { color: colors.red, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  raceName: { color: colors.text, fontSize: 24, lineHeight: 29, fontWeight: '900', marginTop: 6 },
  circuit: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  cdRow: { flexDirection: 'row', gap: 10, marginTop: 24, alignSelf: 'stretch' },
  cdBox: { flex: 1, height: 64, borderRadius: radius.md, backgroundColor: 'rgba(24, 26, 36, 0.5)', alignItems: 'center', justifyContent: 'center' },
  cdValue: { color: colors.text, fontSize: 24, fontWeight: '900' },
  cdLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '700', marginTop: 2 },
  datePill: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 18, alignSelf: 'stretch' },
});

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Tabs from '../../components/Tabs';
import { calendar, sessions as fallbackSessions } from '../../services/mock';
import { getRaceDetail, RaceDetail } from '../../services/jolpica';

export default function SessoesScreen() {
  const { params } = useRoute<any>();
  const race = calendar.find((r) => r.id === params?.raceId) ?? calendar[1];
  const round = /^\d+$/.test(String(params?.raceId ?? '')) ? String(params.raceId) : '1';
  const [detail, setDetail] = useState<RaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState('SÁB');

  useEffect(() => {
    getRaceDetail(round)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [round]);

  const raceSessions = detail?.sessions ?? fallbackSessions;

  return (
    <Screen title={`${(detail?.name ?? race.name).toUpperCase()} ${race.flag}`}>
      {loading && <ActivityIndicator color={colors.red} />}
      <Text style={s.muted}>{detail?.dates ?? race.dates}</Text>
      <Text style={s.muted}>{detail?.circuit ?? race.circuit}</Text>
      {!!detail && <Text style={s.muted}>{detail.locality} · {detail.country}</Text>}
      {/* Trocar por SVG/imagem do traçado exportado do Figma */}
      <View style={s.track}><Ionicons name="map-outline" size={42} color={colors.textMuted} /></View>

      <Tabs tabs={['SEX', 'SÁB', 'DOM']} value={day} onChange={setDay} />
      {raceSessions[day].map((x) => (
        <View key={x.name} style={s.session}>
          <View><Text style={s.name}>{x.name}</Text><Text style={s.muted}>{x.time}</Text></View>
          <View style={s.tv}><Text style={s.tvText}>{x.tv}</Text></View>
        </View>
      ))}

      <View style={s.info}>
        <Text style={s.name}>Informações do Circuito</Text>
        <View style={s.infoRow}>
          {([['Circuito', detail?.circuit ?? race.circuit], ['Local', detail?.locality ?? '-'], ['País', detail?.country ?? '-']] as const).map(([k, v]) => (
            <View key={k} style={s.infoItem}><Text style={s.muted}>{k}</Text><Text style={s.value}>{v}</Text></View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  muted: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  track: { height: 200, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginVertical: 6 },
  session: { minHeight: 68, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 16 },
  name: { color: colors.text, fontSize: 15, fontWeight: '800' },
  tv: { backgroundColor: colors.text, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6 },
  tvText: { color: colors.bg, fontSize: 11, fontWeight: '800' },
  info: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 16, marginTop: 8 },
  infoRow: { gap: 14 },
  infoItem: { width: '100%' },
  value: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 4 },
});

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Tabs from '../../components/Tabs';
import { calendar, sessions as fallbackSessions } from '../../services/mock';
import { getRaceDetail, RaceDetail } from '../../services/jolpica';
import { getOpenF1Sessions, OpenF1SessionInfo } from '../../services/openf1';
import useNav from '../../hooks/useNav';
import { getCircuitDetailImage } from '../../services/circuitImages';

const translateSessionName = (name: string) => ({
  'Practice 1': 'Treino Livre 1',
  'Practice 2': 'Treino Livre 2',
  'Practice 3': 'Treino Livre 3',
  Qualifying: 'Classificação',
  Race: 'Corrida',
  Sprint: 'Sprint',
}[name] ?? name);

export default function SessoesScreen() {
  const nav = useNav();
  const { params } = useRoute<any>();
  const race = calendar.find((r) => r.id === params?.raceId) ?? calendar[1];
  const round = /^\d+$/.test(String(params?.raceId ?? '')) ? String(params.raceId) : '1';
  const [detail, setDetail] = useState<RaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [openF1Sessions, setOpenF1Sessions] = useState<OpenF1SessionInfo[]>([]);
  const [openF1Loading, setOpenF1Loading] = useState(true);
  const [day, setDay] = useState('SÁB');

  useEffect(() => {
    getRaceDetail(round)
      .then((nextDetail) => {
        setDetail(nextDetail);
        return getOpenF1Sessions(nextDetail.raceDate, nextDetail.circuit)
          .then(setOpenF1Sessions)
          .catch(() => setOpenF1Sessions([]))
          .finally(() => setOpenF1Loading(false));
      })
      .catch(() => setDetail(null))
      .finally(() => {
        setLoading(false);
        setOpenF1Loading(false);
      });
  }, [round]);

  const raceSessions = detail?.sessions ?? fallbackSessions;
  const sessionsByDay = openF1Sessions.length > 0
    ? openF1Sessions.reduce<Record<string, OpenF1SessionInfo[]>>((grouped, session) => {
      grouped[session.day] = [...(grouped[session.day] ?? []), session];
      return grouped;
    }, {})
    : raceSessions;
  const circuitValues = [detail?.country, detail?.circuit, detail?.name, race.country, race.name];
  const circuitImage = getCircuitDetailImage(...circuitValues);

  return (
    <Screen title={`${(detail?.name ?? race.name).toUpperCase()} ${race.flag}`}>
      {loading && <ActivityIndicator color={colors.red} />}
      {!openF1Loading && openF1Sessions.length > 0 && (
        <View style={s.sourceBadge}>
          <Ionicons name="radio-outline" size={14} color={colors.red} />
          <Text style={s.sourceText}>Sessões atualizadas pela OpenF1</Text>
        </View>
      )}
      <View style={s.hero}>
        <Text style={s.eyebrow}>FIM DE SEMANA DO GP</Text>
        <Text style={s.heroTitle}>{detail?.dates ?? race.dates}</Text>
        <Text style={s.muted}>{detail?.circuit ?? race.circuit}</Text>
        {!!detail && <Text style={s.muted}>{detail.locality} · {detail.country}</Text>}
      </View>
      <View style={s.track}>
        <Image source={circuitImage} style={s.trackImage} resizeMode="contain" />
      </View>

      <Tabs tabs={['SEX', 'SÁB', 'DOM']} value={day} onChange={setDay} />
      {sessionsByDay[day]?.length === 0 && <Text style={s.empty}>Nenhuma sessão disponível para este dia.</Text>}
      {(sessionsByDay[day] ?? []).map((x) => (
        <Pressable
          key={x.name}
          style={({ pressed }) => [s.session, pressed && s.sessionPressed]}
          disabled={!('sessionKey' in x)}
          onPress={() => {
            if ('sessionKey' in x) nav.navigate('SessaoResultado', { sessionKey: x.sessionKey, sessionName: translateSessionName(x.name) });
          }}
        >
          <View style={s.sessionInfo}>
            <Text style={s.name}>{translateSessionName(x.name)}</Text>
            <Text style={s.muted}>{'startsAt' in x ? new Date(x.startsAt).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }) : x.time}</Text>
          </View>
          <View style={s.tv}><Text style={s.tvText}>{'tv' in x ? x.tv : 'F1 TV e SporTV'}</Text></View>
          {'sessionKey' in x && <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />}
        </Pressable>
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
  hero: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 4 },
  eyebrow: { color: colors.red, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  heroTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  muted: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  track: { height: 200, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginVertical: 6 },
  trackImage: { width: '92%', height: '92%', borderRadius: radius.lg },
  session: { minHeight: 72, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 16 },
  sessionPressed: { opacity: 0.78, borderColor: colors.red },
  sessionInfo: { flex: 1, gap: 3 },
  name: { color: colors.text, fontSize: 15, fontWeight: '800' },
  tv: { backgroundColor: colors.text, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6 },
  tvText: { color: colors.bg, fontSize: 11, fontWeight: '800' },
  info: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 16, marginTop: 8 },
  infoRow: { gap: 14 },
  infoItem: { width: '100%' },
  value: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 4 },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: 12, fontSize: 12 },
  sourceBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#35171A', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 7, alignSelf: 'flex-start' },
  sourceText: { color: '#F2B7B7', fontSize: 10, fontWeight: '700' },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Tabs from '../../components/Tabs';
import { newsList } from '../../services/mock';

export default function NoticiasScreen() {
  const [tab, setTab] = useState('Destaques');
  const items = newsList.filter((n) => n.kind === tab);
  return (
    <Screen title="Notícias">
      <View style={s.intro}>
        <Text style={s.heading}>Últimas da F1</Text>
        <Text style={s.hint}>Confira os destaques e atualizações da temporada.</Text>
      </View>
      <Tabs tabs={['Destaques', 'Recentes', 'Vídeos']} value={tab} onChange={setTab} />
      {items.length === 0 && <Text style={s.empty}>Sem itens por enquanto.</Text>}
      {items.map((n) =>
        n.featured ? (
          <View key={n.id} style={s.card}>
            <View style={s.hero}><Text style={s.tag}>DESTAQUE</Text></View>
            <Text style={s.title}>{n.title}</Text>
            <Text style={s.ago}>{n.ago}</Text>
          </View>
        ) : (
          <View key={n.id} style={[s.card, { flexDirection: 'row', gap: 10 }]}>
            <View style={s.thumb} />
            <View style={{ flex: 1 }}><Text style={s.title}>{n.title}</Text><Text style={s.ago}>{n.ago}</Text></View>
          </View>
        )
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  intro: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 15, gap: 3 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '900' },
  hint: { color: colors.textMuted, fontSize: 11 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12 },
  hero: { height: 130, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, marginBottom: 8, padding: 8 },
  tag: { color: colors.text, backgroundColor: colors.red, alignSelf: 'flex-start', fontSize: 9, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  thumb: { width: 84, height: 60, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt },
  title: { color: colors.text, fontSize: 12, fontWeight: '600' },
  ago: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },
});

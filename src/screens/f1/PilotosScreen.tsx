import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TextInput, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Tabs from '../../components/Tabs';
import ListRow from '../../components/ListRow';
import Avatar from '../../components/Avatar';
import useNav from '../../hooks/useNav';
import { drivers as fallbackDrivers } from '../../services/mock';
import { Driver, getDrivers } from '../../services/jolpica';
import { getOpenF1Drivers } from '../../services/openf1';

const fallbackDriverList = fallbackDrivers.map((driver) => ({ ...driver, price: driver.price }));

const normalizeName = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9 ]/g, '')
  .trim();

const findOpenF1Driver = (name: string, openF1Drivers: Awaited<ReturnType<typeof getOpenF1Drivers>>) => {
  const normalizedName = normalizeName(name);
  const nameParts = normalizedName.split(' ');
  return openF1Drivers.find((item) => {
    const normalizedOpenName = normalizeName(item.name);
    return normalizedOpenName === normalizedName
      || nameParts.some((part) => part.length > 3 && normalizedOpenName.split(' ').includes(part));
  });
};

export default function PilotosScreen() {
  const nav = useNav();
  const [drivers, setDrivers] = useState<Driver[]>(fallbackDriverList);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('TODOS');
  const [query, setQuery] = useState('');
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([getDrivers(), getOpenF1Drivers()])
      .then(([data, openF1Drivers]) => {
        const source = data.length > 0 ? data : fallbackDriverList;
        const matchedOpenF1Numbers = new Set<number>();
        const enriched = source.map((driver) => {
          const match = findOpenF1Driver(driver.name, openF1Drivers);
          if (match) matchedOpenF1Numbers.add(match.number);
          return { ...driver, headshotUrl: match?.headshotUrl };
        });
        const additionalDrivers = openF1Drivers
          .filter((driver) => !matchedOpenF1Numbers.has(driver.number))
          .map((driver) => ({
            id: `openf1-${driver.number}`,
            name: driver.name,
            team: driver.team,
            pts: 0,
            price: 0,
            headshotUrl: driver.headshotUrl,
          }));
        setDrivers([...enriched, ...additionalDrivers]);
      })
      .catch(() => setDrivers(fallbackDriverList))
      .finally(() => setLoading(false));
  }, []);

  const ranked = useMemo(() => [...drivers].sort((a, b) => b.pts - a.pts), [drivers]);
  const list = useMemo(() => {
    let l = ranked.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
    if (tab === 'POR EQUIPE') l = [...l].sort((a, b) => a.team.localeCompare(b.team));
    if (tab === 'FAVORITOS') l = l.filter((d) => favs.includes(d.id));
    return l;
  }, [ranked, query, tab, favs]);

  const toggle = (id: string) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <Screen title="Pilotos">
      <View style={s.intro}>
        <Text style={s.heading}>Pilotos da temporada</Text>
        <Text style={s.hint}>Acompanhe posições, equipes e pontuação.</Text>
      </View>
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={17} color={colors.textMuted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Buscar piloto" placeholderTextColor={colors.textMuted} style={s.search} />
      </View>
      <Tabs tabs={['TODOS', 'POR EQUIPE', 'FAVORITOS']} value={tab} onChange={setTab} />
      {loading && <ActivityIndicator color={colors.red} />}
      {list.length === 0 && <Text style={s.empty}>Nenhum piloto encontrado.</Text>}
      {list.map((d) => (
        <ListRow
          key={d.id}
          onPress={() => nav.navigate('PilotoDetalhe', { id: d.id })}
          left={<><Text style={s.pos}>{ranked.indexOf(d) + 1}º</Text><Avatar label={d.name} size={52} source={d.headshotUrl ? { uri: d.headshotUrl } : undefined} /></>}
          title={d.name}
          sub={d.team}
          right={
            <>
              <Text style={s.pts}>{d.pts} pts</Text>
              <Pressable onPress={() => toggle(d.id)} hitSlop={8}>
                <Ionicons name={favs.includes(d.id) ? 'heart' : 'heart-outline'} size={16} color={colors.red} />
              </Pressable>
            </>
          }
        />
      ))}
    </Screen>
  );
}

const s = StyleSheet.create({
  intro: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 15, gap: 3 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '900' },
  hint: { color: colors.textMuted, fontSize: 11 },
  searchWrap: { height: 44, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 },
  search: { flex: 1, height: 42, color: colors.text, paddingHorizontal: 0, fontSize: 12 },
  pos: { color: colors.textMuted, fontSize: 12, width: 22 },
  pts: { color: colors.text, fontSize: 13, fontWeight: '700' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },
});

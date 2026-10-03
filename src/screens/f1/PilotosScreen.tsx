import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Tabs from '../../components/Tabs';
import ListRow from '../../components/ListRow';
import Avatar from '../../components/Avatar';
import useNav from '../../hooks/useNav';
import { drivers as fallbackDrivers } from '../../services/mock';
import { Driver, getDrivers } from '../../services/jolpica';

const fallbackDriverList = fallbackDrivers.map((driver) => ({ ...driver, price: driver.price }));

export default function PilotosScreen() {
  const nav = useNav();
  const [drivers, setDrivers] = useState<Driver[]>(fallbackDriverList);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('TODOS');
  const [query, setQuery] = useState('');
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    getDrivers()
      .then((data) => setDrivers(data.length > 0 ? data : fallbackDriverList))
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
      <TextInput value={query} onChangeText={setQuery} placeholder="Buscar piloto" placeholderTextColor={colors.textMuted} style={s.search} />
      <Tabs tabs={['TODOS', 'POR EQUIPE', 'FAVORITOS']} value={tab} onChange={setTab} />
      {loading && <ActivityIndicator color={colors.red} />}
      {list.length === 0 && <Text style={s.empty}>Nenhum piloto encontrado.</Text>}
      {list.map((d) => (
        <ListRow
          key={d.id}
          onPress={() => nav.navigate('PilotoDetalhe', { id: d.id })}
          left={<><Text style={s.pos}>{ranked.indexOf(d) + 1}º</Text><Avatar label={d.name} /></>}
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
  search: { height: 38, borderRadius: radius.md, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: 14, fontSize: 12 },
  pos: { color: colors.textMuted, fontSize: 12, width: 22 },
  pts: { color: colors.text, fontSize: 13, fontWeight: '700' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },
});

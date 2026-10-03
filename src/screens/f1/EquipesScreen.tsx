import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import Screen from '../../components/Screen';
import ListRow from '../../components/ListRow';
import Avatar from '../../components/Avatar';
import { teams as fallbackTeams } from '../../services/mock';
import { getTeams, Team } from '../../services/jolpica';

const fallbackTeamList = fallbackTeams as Team[];

export default function EquipesScreen() {
  const [teams, setTeams] = useState<Team[]>(fallbackTeamList);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeams()
      .then((data) => setTeams(data.length > 0 ? data : fallbackTeamList))
      .catch(() => setTeams(fallbackTeamList))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen title="Equipes">
      {loading && <ActivityIndicator color={colors.red} />}
      {[...teams].sort((a, b) => b.pts - a.pts).map((t, i) => (
        <ListRow
          key={t.id}
          left={<><Text style={s.pos}>{i + 1}º</Text><Avatar label={t.name} /></>}
          title={t.name}
          sub={`${t.pts} pts`}
        />
      ))}
    </Screen>
  );
}

const s = StyleSheet.create({ pos: { color: colors.textMuted, fontSize: 12, width: 22 } });

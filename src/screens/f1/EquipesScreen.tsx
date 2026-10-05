import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, StyleSheet, View, Pressable } from 'react-native';
import { colors, radius } from '../../theme';
import Screen from '../../components/Screen';
import Avatar from '../../components/Avatar';
import useNav from '../../hooks/useNav';
import { teams as fallbackTeams } from '../../services/mock';
import { getTeams, Team } from '../../services/jolpica';
import { getTeamDisplayName, getTeamLogoAsset } from '../../services/fantasy';

const fallbackTeamList = fallbackTeams as Team[];

export default function EquipesScreen() {
  const nav = useNav();
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
      <View style={s.intro}>
        <Text style={s.heading}>Construtores</Text>
        <Text style={s.hint}>Classificação atual das equipes da F1.</Text>
      </View>
      {loading && <ActivityIndicator color={colors.red} />}
      {[...teams].sort((a, b) => b.pts - a.pts).map((t, i) => (
        <Pressable
          key={t.id}
          onPress={() => nav.navigate('EquipeDetalhe', { id: t.id })}
          style={({ pressed }) => [s.teamCard, pressed && s.teamCardPressed]}
        >
          {getTeamLogoAsset(t.id) ?? getTeamLogoAsset(t.name) ? (
            <>
              <Image
                source={getTeamLogoAsset(t.id) ?? getTeamLogoAsset(t.name)}
                style={[
                  s.teamBackgroundImage,
                  (t.id.toLowerCase().includes('aston') || t.name.toLowerCase().includes('aston martin')) && s.astonMartinLogo,
                ]}
                resizeMode="contain"
              />
              <View style={s.teamShade} />
              <TeamCardContent position={i + 1} name={getTeamDisplayName(t.name)} points={t.pts} />
            </>
          ) : (
            <TeamCardContentFallback position={i + 1} name={getTeamDisplayName(t.name)} points={t.pts} />
          )}
        </Pressable>
      ))}
    </Screen>
  );
}

function TeamCardContent({ position, name, points }: { position: number; name: string; points: number }) {
  return (
    <View style={s.teamContent}>
      <View style={s.teamTop}>
        <Text style={s.pos}>{position}º</Text>
        <Text style={s.more}>Ver detalhes</Text>
      </View>
      <View>
        <Text style={s.teamName}>{name}</Text>
        <Text style={s.teamPoints}>{points} pts</Text>
      </View>
    </View>
  );
}

function TeamCardContentFallback({ position, name, points }: { position: number; name: string; points: number }) {
  return (
    <View style={s.teamContent}>
      <View style={s.teamTop}>
        <View style={s.fallbackMark}><Avatar label={name} size={34} /></View>
        <Text style={s.more}>Ver detalhes</Text>
      </View>
      <View>
        <Text style={s.teamName}>{name}</Text>
        <Text style={s.teamPoints}>{points} pts</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  intro: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 15, gap: 3 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '900' },
  hint: { color: colors.textMuted, fontSize: 11 },
  pos: { color: colors.textMuted, fontSize: 12, width: 22 },
  more: { color: '#55515F', fontSize: 11, fontWeight: '700' },
  teamCard: { minHeight: 142, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E5E5' },
  teamCardPressed: { opacity: 0.78, borderColor: colors.red },
  teamBackgroundImage: { position: 'absolute', width: '64%', height: '64%', top: '18%', left: '18%', opacity: 0.76 },
  astonMartinLogo: { width: '76%', height: '140%', top: '-16%', left: '12%' },
  teamShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255, 255, 255, 0.14)' },
  teamContent: { flex: 1, justifyContent: 'space-between', padding: 16 },
  teamTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamName: { color: '#15151D', fontSize: 18, fontWeight: '900' },
  teamPoints: { color: colors.red, fontSize: 12, fontWeight: '900', marginTop: 4 },
  fallbackMark: { backgroundColor: colors.surfaceAlt, borderRadius: 18, padding: 3 },
});

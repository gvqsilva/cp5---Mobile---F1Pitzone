import React, { useCallback, useState } from 'react';
import { View, Text, ImageBackground, Pressable, StyleSheet, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radius, spacing } from '../../theme';
import Screen from '../../components/Screen';
import ListRow from '../../components/ListRow';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import useNav from '../../hooks/useNav';
import { clearAuthSession, getAuthSession, getProfile, saveProfile, StoredProfile } from '../../services/storage';
import { emptyFantasyTeam, FantasyTeam, getFantasyTeam, getLatestFantasyScore } from '../../services/fantasy';

const SHORTCUTS = [
  { label: 'Histórico', icon: 'bar-chart-outline' as const, onPress: 'HistoricoPontos' },
  { label: 'Minhas ligas', icon: 'people-outline' as const, onPress: 'Ligas' },
];

const SETTINGS = [
  { label: 'Configurações', description: 'Preferências do aplicativo', route: 'Configuracoes', icon: 'settings-outline' as const },
  { label: 'Conquistas', description: 'Veja seus troféus', route: 'Conquistas', icon: 'ribbon-outline' as const },
  { label: 'Minhas compras', description: 'Produtos e pedidos', route: 'MinhasCompras', icon: 'bag-outline' as const },
  { label: 'Ajuda e suporte', description: 'Fale com a equipe PitZone', route: 'AjudaSuporte', icon: 'help-circle-outline' as const },
  { label: 'Gerenciar assinatura', description: 'Plano atual e pagamentos', route: 'GerenciarAssinatura', icon: 'card-outline' as const },
];

export default function PerfilScreen() {
  const nav = useNav();
  const [storedProfile, setStoredProfile] = useState<StoredProfile | null>(null);
  const [memberSince, setMemberSince] = useState('Data de entrada indisponível');
  const [fantasy, setFantasy] = useState<FantasyTeam>(emptyFantasyTeam);
  const [fantasyScore, setFantasyScore] = useState<Awaited<ReturnType<typeof getLatestFantasyScore>> | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    Promise.all([getProfile(), getAuthSession()]).then(([profile, session]) => {
      setStoredProfile(profile);
      setDraftName(profile?.name ?? '');
      if (session?.createdAt) {
        setMemberSince(`Membro desde ${new Date(session.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`);
      }
    }).catch(() => undefined);
    getFantasyTeam().then((team) => {
      setFantasy(team);
      if (team.picks.drivers.length === 2 && team.picks.constructor && team.picks.chief) {
        getLatestFantasyScore(team).then(setFantasyScore).catch(() => setFantasyScore(null));
      } else {
        setFantasyScore(null);
      }
    }).catch(() => {
      setFantasy(emptyFantasyTeam);
      setFantasyScore(null);
    });
  }, []));

  const editarPerfil = async () => {
    const name = draftName.trim();
    if (!name || !storedProfile) return;
    setSaving(true);
    try {
      const profile = { ...storedProfile, name };
      await saveProfile(profile);
      setStoredProfile(profile);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const sair = async () => {
    await clearAuthSession();
    nav.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  return (
    <Screen scroll>
      <ImageBackground source={require('../../assets/intro-f1.jpg')} style={s.hero} imageStyle={s.heroImage}>
        <View style={s.heroShade} />
        <View style={s.heroContent}>
          <Text style={s.eyebrow}>MEU PERFIL</Text>
          <Text style={s.heroTitle}>Sua temporada em foco</Text>
        </View>
      </ImageBackground>

      <View style={s.profileCard}>
        <Avatar label={storedProfile?.name ?? 'Usuário'} size={76} />
        <View style={s.profileInfo}>
          <Text style={s.name}>{storedProfile?.name ?? 'Usuário'}</Text>
          <Text style={s.email}>{storedProfile?.email ?? 'E-mail indisponível'}</Text>
          <Text style={s.muted}>{memberSince}</Text>
        </View>
        <Pressable onPress={() => setEditing(true)} hitSlop={10} style={s.editProfile}>
          <Ionicons name="create-outline" size={19} color={colors.red} />
        </Pressable>
      </View>

      <View style={s.statsCard}>
        <View style={s.stat}><Text style={s.statValue}>{fantasyScore?.total ?? '—'}</Text><Text style={s.statLabel}>ÚLTIMO GP</Text></View>
        <View style={s.divider} />
        <Pressable style={s.stat} onPress={() => nav.navigate('HistoricoPontos')}>
          <Text style={s.statValue}>{fantasy.rank}</Text><Text style={s.statLabel}>RANKING</Text>
        </Pressable>
        <View style={s.divider} />
        <View style={s.stat}><Text style={s.statValue}>{fantasy.picks.drivers.length + (fantasy.picks.constructor ? 1 : 0) + (fantasy.picks.chief ? 1 : 0)}/4</Text><Text style={s.statLabel}>ESCOLHAS</Text></View>
      </View>

      <Pressable style={({ pressed }) => [s.teamBanner, pressed && s.pressed]} onPress={() => nav.navigate(fantasy.picks.drivers.length === 2 ? 'MinhaEquipe' : 'CriarEquipe')}>
        <View style={s.teamBannerIcon}><Ionicons name="game-controller-outline" size={19} color={colors.red} /></View>
        <View style={s.teamBannerInfo}>
          <Text style={s.teamBannerLabel}>FANTASY</Text>
          <Text style={s.teamBannerTitle}>{fantasy.picks.drivers.length === 2 ? fantasy.teamName : 'Monte sua equipe'}</Text>
          <Text style={s.teamBannerSub}>{fantasyScore ? `${fantasyScore.name} · ${fantasyScore.total} pontos` : 'Escolha pilotos, construtor e chefe'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>

      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Acesso rápido</Text>
        <Text style={s.sectionHint}>Tudo em um toque</Text>
      </View>
      <View style={s.shortcutGrid}>
        {SHORTCUTS.map((shortcut) => (
          <Pressable key={shortcut.label} style={({ pressed }) => [s.shortcut, pressed && s.pressed]} onPress={() => nav.navigate(shortcut.onPress)}>
            <View style={s.shortcutIcon}><Ionicons name={shortcut.icon} size={20} color={colors.red} /></View>
            <Text style={s.shortcutLabel}>{shortcut.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Minhas ligas</Text>
        <Pressable onPress={() => nav.navigate('Ligas')}><Text style={s.link}>Ver todas</Text></Pressable>
      </View>
      <View style={s.emptyCard}>
        <Ionicons name="people-outline" size={22} color={colors.textMuted} />
        <Text style={s.emptyText}>Você ainda não participa de nenhuma liga.</Text>
      </View>

      <Text style={[s.sectionTitle, s.settingsTitle]}>Configurações</Text>
      <View style={s.settingsCard}>
        {SETTINGS.map((item) => (
          <ListRow key={item.route} onPress={() => nav.navigate(item.route)} left={<View style={s.settingIcon}><Ionicons name={item.icon} size={19} color={colors.textMuted} /></View>} title={item.label} sub={item.description} right={<Ionicons name="chevron-forward" size={17} color={colors.textMuted} />} />
        ))}
      </View>

      <Button title="Sair da conta" variant="outline" onPress={sair} style={s.logout} />

      <Modal visible={editing} transparent animationType="fade" onRequestClose={() => setEditing(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Editar perfil</Text>
              <Pressable onPress={() => setEditing(false)} hitSlop={8}><Ionicons name="close" size={21} color={colors.textMuted} /></Pressable>
            </View>
            <Text style={s.inputLabel}>NOME</Text>
            <TextInput value={draftName} onChangeText={setDraftName} placeholder="Como devemos chamar você?" placeholderTextColor={colors.textMuted} autoCapitalize="words" style={s.input} maxLength={40} />
            <Text style={s.inputLabel}>E-MAIL</Text>
            <Text style={s.readonly}>{storedProfile?.email ?? 'E-mail indisponível'}</Text>
            <Button title={saving ? 'Salvando...' : 'Salvar alterações'} onPress={editarPerfil} />
            {saving && <ActivityIndicator color={colors.red} style={s.loader} />}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { height: 150, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'flex-end' },
  heroImage: { opacity: 0.58 },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(7, 7, 13, 0.45)' },
  heroContent: { padding: spacing.md },
  eyebrow: { color: colors.red, fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  heroTitle: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 5 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, marginTop: -18, marginHorizontal: 8 },
  profileInfo: { flex: 1 },
  editProfile: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#35171A', alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontSize: 17, fontWeight: '800' },
  email: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  muted: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
  statsCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingVertical: 15 },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.8, marginTop: 3 },
  divider: { width: 1, height: 30, backgroundColor: colors.border },
  teamBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12 },
  teamBannerIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#35171A', alignItems: 'center', justifyContent: 'center' },
  teamBannerInfo: { flex: 1 },
  teamBannerLabel: { color: colors.red, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  teamBannerTitle: { color: colors.text, fontSize: 13, fontWeight: '800', marginTop: 2 },
  teamBannerSub: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  sectionHint: { color: colors.textMuted, fontSize: 10 },
  link: { color: colors.red, fontSize: 11, fontWeight: '700' },
  shortcutGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  shortcut: { width: '48%', minHeight: 68, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10 },
  pressed: { opacity: 0.72, borderColor: colors.red },
  shortcutIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#35171A', alignItems: 'center', justifyContent: 'center' },
  shortcutLabel: { color: colors.text, fontSize: 12, fontWeight: '700', flex: 1 },
  emptyCard: { minHeight: 74, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', padding: 14, gap: 7 },
  emptyText: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
  settingsTitle: { marginTop: 10 },
  settingsCard: { gap: 8 },
  settingIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  logout: { marginTop: 4, marginBottom: 6 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.72)', justifyContent: 'center', padding: 18 },
  modalCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  inputLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 6, marginTop: 6 },
  input: { height: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt, color: colors.text, paddingHorizontal: 12, fontSize: 14, marginBottom: 8 },
  readonly: { color: colors.textMuted, fontSize: 13, paddingVertical: 12, marginBottom: 12 },
  loader: { position: 'absolute', bottom: 30, right: 30 },
});

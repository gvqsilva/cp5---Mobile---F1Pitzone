import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { getAuthSession } from '../services/storage';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import PlaceholderScreen from '../screens/placeholder/PlaceholderScreen';
import F1HomeScreen from '../screens/f1/F1HomeScreen';
import CalendarioScreen from '../screens/f1/CalendarioScreen';
import SessoesScreen from '../screens/f1/SessoesScreen';
import SessaoResultadoScreen from '../screens/f1/SessaoResultadoScreen';
import PilotosScreen from '../screens/f1/PilotosScreen';
import EquipesScreen from '../screens/f1/EquipesScreen';
import EquipeDetalheScreen from '../screens/f1/EquipeDetalheScreen';
import NoticiasScreen from '../screens/f1/NoticiasScreen';
import PilotoDetalheScreen from '../screens/f1/PilotoDetalheScreen';
import FantasyHomeScreen from '../screens/fantasy/FantasyHomeScreen';
import MinhaEquipeScreen from '../screens/fantasy/MinhaEquipeScreen';
import PontuacaoScreen from '../screens/fantasy/PontuacaoScreen';
import CriarEquipeScreen from '../screens/fantasy/CriarEquipeScreen';
import PerfilScreen from '../screens/perfil/PerfilScreen';
import LigasScreen from '../screens/perfil/LigasScreen';
import LigaDetalheScreen from '../screens/perfil/LigaDetalheScreen';
import HistoricoPontosScreen from '../screens/perfil/HistoricoPontosScreen';

export type RootStackParamList = {
  Onboarding: undefined; Login: undefined; Register: undefined; Main: undefined;
  MinhaEquipe: undefined; Pontuacao: undefined; CriarEquipe: undefined;
  Calendario: undefined; Sessoes: { raceId: string }; SessaoResultado: { sessionKey: number; sessionName: string }; Pilotos: undefined; Equipes: undefined; EquipeDetalhe: { id: string }; Noticias: undefined; PilotoDetalhe: { id: string };
  Ligas: undefined; LigaDetalhe: { id: string }; HistoricoPontos: undefined;
  Configuracoes: undefined; Conquistas: undefined; MinhasCompras: undefined; AjudaSuporte: undefined; GerenciarAssinatura: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
type MainTabParamList = {
  Home: undefined;
  F1: undefined;
  Fantasy: undefined;
  Loja: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Home: ['home', 'home-outline'],
  F1: ['flag', 'flag-outline'],
  Fantasy: ['game-controller', 'game-controller-outline'],
  Loja: ['bag', 'bag-outline'],
  Perfil: ['person', 'person-outline'],
};

const placeholder = (title: string) => () => <PlaceholderScreen title={title} />;

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="F1" component={F1HomeScreen} />
      <Tab.Screen name="Fantasy" component={FantasyHomeScreen} />
      <Tab.Screen name="Loja" component={placeholder('Loja')} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Main' | null>(null);

  useEffect(() => {
    getAuthSession()
      .then((session) => setInitialRoute(session?.remember ? 'Main' : 'Onboarding'))
      .catch(() => setInitialRoute('Onboarding'));
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.red} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="MinhaEquipe" component={MinhaEquipeScreen} />
        <Stack.Screen name="Pontuacao" component={PontuacaoScreen} />
        <Stack.Screen name="CriarEquipe" component={CriarEquipeScreen} />
        <Stack.Screen name="Calendario" component={CalendarioScreen} />
        <Stack.Screen name="Sessoes" component={SessoesScreen} />
        <Stack.Screen name="SessaoResultado" component={SessaoResultadoScreen} />
        <Stack.Screen name="Pilotos" component={PilotosScreen} />
        <Stack.Screen name="Equipes" component={EquipesScreen} />
        <Stack.Screen name="EquipeDetalhe" component={EquipeDetalheScreen} />
        <Stack.Screen name="Noticias" component={NoticiasScreen} />
        <Stack.Screen name="PilotoDetalhe" component={PilotoDetalheScreen} />
        <Stack.Screen name="Ligas" component={LigasScreen} />
        <Stack.Screen name="LigaDetalhe" component={LigaDetalheScreen} />
        <Stack.Screen name="HistoricoPontos" component={HistoricoPontosScreen} />
        <Stack.Screen name="Configuracoes" component={placeholder('Configurações')} />
        <Stack.Screen name="Conquistas" component={placeholder('Conquistas')} />
        <Stack.Screen name="MinhasCompras" component={placeholder('Minhas Compras')} />
        <Stack.Screen name="AjudaSuporte" component={placeholder('Ajuda & Suporte')} />
        <Stack.Screen name="GerenciarAssinatura" component={placeholder('Gerenciar assinatura')} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

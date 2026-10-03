import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import PlaceholderScreen from '../screens/placeholder/PlaceholderScreen';
import F1HomeScreen from '../screens/f1/F1HomeScreen';
import CalendarioScreen from '../screens/f1/CalendarioScreen';
import SessoesScreen from '../screens/f1/SessoesScreen';
import PilotosScreen from '../screens/f1/PilotosScreen';
import EquipesScreen from '../screens/f1/EquipesScreen';
import NoticiasScreen from '../screens/f1/NoticiasScreen';
import PilotoDetalheScreen from '../screens/f1/PilotoDetalheScreen';
import FantasyHomeScreen from '../screens/fantasy/FantasyHomeScreen';
import MinhaEquipeScreen from '../screens/fantasy/MinhaEquipeScreen';
import PontuacaoScreen from '../screens/fantasy/PontuacaoScreen';
import CriarEquipeScreen from '../screens/fantasy/CriarEquipeScreen';
import { getAuthSession } from '../services/storage';

export type RootStackParamList = {
  Onboarding: undefined; Login: undefined; Register: undefined; Main: undefined;
  MinhaEquipe: undefined; Pontuacao: undefined; CriarEquipe: undefined;
  Calendario: undefined; Sessoes: { raceId: string }; Pilotos: undefined; Equipes: undefined; Noticias: undefined; PilotoDetalhe: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const ICONS: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
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
      <Tab.Screen name="Perfil" component={placeholder('Perfil')} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Main' | null>(null);

  useEffect(() => {
    getAuthSession().then((session) => setInitialRoute(session ? 'Main' : 'Onboarding'));
  }, []);

  if (!initialRoute) {
    return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.red} /></View>;
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
        <Stack.Screen name="Pilotos" component={PilotosScreen} />
        <Stack.Screen name="Equipes" component={EquipesScreen} />
        <Stack.Screen name="Noticias" component={NoticiasScreen} />
        <Stack.Screen name="PilotoDetalhe" component={PilotoDetalheScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Dados mockados. Trocar por chamadas à API (FastAPI) depois.
export const user = { name: 'Gabriel' };

export const nextRace = { name: 'GP da Holanda', circuit: 'Circuito de Park Zandvoort', dates: '21 - 23 AGO 2026', startsAt: '2026-08-23T13:00:00' };

export const myTeam = {
  drivers: [
    { id: '1', name: 'Bortoleto', role: 'Piloto 1', points: 30 },
    { id: '2', name: 'Hamilton', role: 'Piloto 2', points: 30 },
    { id: '3', name: 'Wolff', role: 'Chefe de equipe', points: 12 },
  ],
  constructor: { name: 'McLaren', label: 'MasterCard', points: 64 },
};

export const news = { tag: 'F1 · Há 1 dia', title: 'McLaren explica por que não consegue tirar 100% do motor Mercedes em 2026' };

export const agenda = [
  { id: '1', title: 'Treino Livre', time: '07:30' },
  { id: '2', title: 'Classificação Sprint', time: '11:30' },
];

// ---------- F1 ----------
export const drivers = [
  { id: 'antonelli', name: 'Kimi Antonelli', team: 'Mercedes AMG', pts: 219, price: 28 },
  { id: 'hamilton', name: 'Lewis Hamilton', team: 'Scuderia Ferrari', pts: 169, price: 28 },
  { id: 'russell', name: 'George Russell', team: 'Mercedes AMG', pts: 160, price: 28 },
  { id: 'leclerc', name: 'Charles Leclerc', team: 'Scuderia Ferrari', pts: 138, price: 28 },
  { id: 'norris', name: 'Lando Norris', team: 'McLaren', pts: 128, price: 28 },
  { id: 'bortoleto', name: 'Gabriel Bortoleto', team: 'Audi', pts: 56, price: 15 },
  { id: 'sainz', name: 'Carlos Sainz', team: 'Williams Racing', pts: 40, price: 28 },
  { id: 'alonso', name: 'Fernando Alonso', team: 'Aston Martin', pts: 33, price: 28 },
];

export const teams = [
  { id: 'mercedes', name: 'Mercedes AMG', pts: 378, price: 28 },
  { id: 'ferrari', name: 'Scuderia Ferrari', pts: 307, price: 28 },
  { id: 'mclaren', name: 'McLaren', pts: 220, price: 25.5 },
  { id: 'redbull', name: 'Red Bull Racing', pts: 177, price: 28 },
  { id: 'alphatauri', name: 'Alphatauri', pts: 66, price: 28 },
  { id: 'alpine', name: 'Alpine F1 Team', pts: 61, price: 28 },
];

export const chiefs = [
  { id: 'wolff', name: 'Toto Wolff', team: 'Mercedes AMG', price: 30.1 },
  { id: 'vasseur', name: 'Frédéric Vasseur', team: 'Scuderia Ferrari', price: 28 },
  { id: 'vowles', name: 'James Vowles', team: 'Williams Racing', price: 28 },
  { id: 'newey', name: 'Adrian Newey', team: 'Aston Martin', price: 28 },
];

export const calendar = [
  { id: 'hun', dates: '24 - 26 JUL', flag: '🇭🇺', country: 'Hungria', name: 'GP da Hungria', circuit: 'Hungaroring', status: 'done' },
  { id: 'ned', dates: '21 - 23 AGO', flag: '🇳🇱', country: 'Holanda', name: 'GP da Holanda', circuit: 'Circuito de Park Zandvoort', status: 'next' },
  { id: 'ita', dates: '04 - 06 SET', flag: '🇮🇹', country: 'Itália', name: 'GP da Itália', circuit: 'Autodromo Nazionale Monza', status: 'todo' },
  { id: 'esp', dates: '11 - 13 SET', flag: '🇪🇸', country: 'Espanha', name: 'GP da Espanha', circuit: 'Circuit de Barcelona-Catalunya', status: 'todo' },
  { id: 'aze', dates: '24 - 26 SET', flag: '🇦🇿', country: 'Azerbaijão', name: 'GP do Azerbaijão', circuit: 'Baku City Circuit', status: 'todo' },
  { id: 'bhr', dates: '02 - 04 OUT', flag: '🇧🇭', country: 'Bahrein', name: 'GP do Bahrein', circuit: 'Bahrain International Circuit', status: 'todo' },
];

export const sessions: Record<string, { name: string; time: string; tv: string }[]> = {
  SEX: [{ name: 'Treino Livre 1', time: '06:30', tv: 'sportv3' }, { name: 'Treino Livre 2', time: '10:00', tv: 'sportv3' }],
  SÁB: [{ name: 'Corrida Sprint', time: '07:00', tv: 'sportv3' }, { name: 'Classificação', time: '11:00', tv: 'sportv3' }],
  DOM: [{ name: 'Corrida', time: '10:00', tv: 'Globo' }],
};
export const circuitInfo = { voltas: 72, extensao: '4.259 m', recorde: '1:11.097' };

export const newsList = [
  { id: '1', kind: 'Destaques', title: 'Hadjar avalia início na Red Bull e identifica o que falta para alcançar Verstappen.', ago: 'Há 1 hora', featured: true },
  { id: '2', kind: 'Destaques', title: 'FIA suspende restrições a pilotos e equipes da Rússia em competições internacionais.', ago: 'Há 14 horas' },
  { id: '3', kind: 'Recentes', title: 'McLaren explica por que não consegue tirar 100% do motor Mercedes em 2026.', ago: 'Há 1 dia' },
  { id: '4', kind: 'Vídeos', title: 'Bastidores do GP da Hungria: os melhores momentos.', ago: 'Há 2 dias' },
];

export const driverProfile = {
  nationality: 'MON', birth: '16/10/1997 (29 anos)',
  season: { Corridas: 11, Vitórias: 1, Pódios: 4, Poles: 0, Pontos: 138, 'Posição no campeonato': '4º', 'Melhor grid': '1º', DNFs: 2 },
  career: { Corridas: 190, Vitórias: 8, Pódios: 50, Poles: 26, Pontos: 1500, Títulos: 0, 'Posição no campeonato': '-', 'Melhor grid': '1º', DNFs: 20 },
  lastRaces: [{ gp: 'Hungria', pos: '4º' }, { gp: 'Bélgica', pos: '2º' }, { gp: 'Grã-Bretanha', pos: '4º' }, { gp: 'Áustria', pos: '8º' }],
  teams: [{ name: 'Alfa Romeo Sauber', years: '2018 - 2019' }, { name: 'Scuderia Ferrari', years: '2019 - atual' }],
};

// ---------- Perfil / Ligas ----------
export const profile = {
  name: 'Gabriel Vasquez',
  memberSince: 'Membro desde Ago de 2026',
  pts: 1253,
  position: '2º',
  leaguesCount: 2,
};

export const myLeagues = [
  { id: 'f1fiap', name: 'F1 Fiap', rankLabel: '1º lugar', members: 5 },
  { id: 'bortoletobr', name: 'Bortoleto BR', rankLabel: '3º lugar', members: 18 },
];

export const leagueDetail: Record<string, { name: string; members: number; season: string; ranking: { name: string; pts: number; team: string }[] }> = {
  f1fiap: {
    name: 'F1 Fiap', members: 5, season: 'Temp. 2026',
    ranking: [
      { name: 'Gabriel Vasquez', pts: 1253, team: 'Vasquez FC' },
      { name: 'Gustavo', pts: 1140, team: 'Gustavo Racing' },
      { name: 'Augusto', pts: 1082, team: 'Augusto GP' },
      { name: 'Guilherme', pts: 1056, team: 'Guilherme F1' },
      { name: 'Lucas', pts: 1047, team: 'Lucas Team' },
    ],
  },
  bortoletobr: {
    name: 'Bortoleto BR', members: 18, season: 'Temp. 2026',
    ranking: [
      { name: 'Rafael', pts: 1480, team: 'Rafa Racing' },
      { name: 'Bianca', pts: 1390, team: 'Bianca GP' },
      { name: 'Gabriel Vasquez', pts: 1253, team: 'Vasquez FC' },
    ],
  },
};

export const pointsHistory = {
  total: 1253,
  chart: [
    { label: 'BAH', value: 70 },
    { label: 'JED', value: 300 },
    { label: 'AUS', value: 442 },
    { label: 'JAP', value: 502 },
    { label: 'HUN', value: 764 },
    { label: 'HOL', value: 1253 },
  ],
  races: [
    { id: 'GP 1', pts: 70 },
    { id: 'GP 2', pts: 230 },
    { id: 'GP 3', pts: 142 },
    { id: 'GP 4', pts: 60 },
    { id: 'GP 5', pts: 262 },
  ],
};

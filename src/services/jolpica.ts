import AsyncStorage from '@react-native-async-storage/async-storage';
import { raceWeekendDates } from './format';

const API_URL = 'https://api.jolpi.ca/ergast/f1';
const CACHE_KEY = '@pitzone/cache/calendar-v3';
const DRIVERS_CACHE_KEY = '@pitzone/cache/drivers';
const TEAMS_CACHE_KEY = '@pitzone/cache/teams';
const DRIVER_DETAIL_CACHE_PREFIX = '@pitzone/cache/driver-detail-v2/';
const RACE_DETAIL_CACHE_PREFIX = '@pitzone/cache/race-detail-v3/';
const CACHE_TTL = 1000 * 60 * 60;

export type CalendarRace = {
  id: string;
  dates: string;
  flag: string;
  name: string;
  circuit: string;
  startsAt: string;
  status: 'done' | 'next' | 'todo';
};

type JolpicaResponse = {
  MRData: {
    RaceTable: {
      Races: Array<{
        round: string;
        raceName: string;
        date: string;
        time?: string;
        Circuit: { circuitName: string };
      }>;
    };
  };
};

type CachedCalendar = { savedAt: number; data: CalendarRace[] };

export type Driver = {
  id: string;
  name: string;
  team: string;
  pts: number;
  price: number;
};

type StandingsResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        DriverStandings: Array<{
          points: string;
          Driver: { driverId: string; givenName: string; familyName: string };
          Constructors: Array<{ name: string }>;
        }>;
      }>;
    };
  };
};

type CachedDrivers = { savedAt: number; data: Driver[] };

export type Team = {
  id: string;
  name: string;
  pts: number;
  price: number;
};

type ConstructorStandingsResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        ConstructorStandings: Array<{
          points: string;
          Constructor: { constructorId: string; name: string };
        }>;
      }>;
    };
  };
};

type CachedTeams = { savedAt: number; data: Team[] };

export type DriverDetail = {
  id: string;
  name: string;
  team: string;
  nationality: string;
  birth: string;
  season: Record<string, number | string>;
  career: Record<string, number | string>;
  lastRaces: Array<{ gp: string; pos: string }>;
  teams: Array<{ name: string; years: string }>;
};

type DriverProfileResponse = {
  MRData: {
    DriverTable: {
      Drivers: Array<{
        driverId: string;
        givenName: string;
        familyName: string;
        dateOfBirth: string;
        nationality: string;
      }>;
    };
  };
};

type DriverStandingsResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        DriverStandings: Array<{
          position: string;
          points: string;
          wins: string;
          Driver: { driverId: string; givenName: string; familyName: string; dateOfBirth: string; nationality: string };
          Constructors: Array<{ name: string }>;
        }>;
      }>;
    };
  };
};

type DriverResultsResponse = {
  MRData: {
    total: string;
    limit: string;
    offset: string;
    RaceTable: {
      Races: Array<{
        season: string;
        raceName: string;
        Results: Array<{
          position: string;
          grid: string;
          points: string;
          status: string;
          FastestLap?: { rank?: string };
          Constructor: { name: string };
        }>;
      }>;
    };
  };
};

type DriverStatRow = DriverResultsResponse['MRData']['RaceTable']['Races'][number];

type CachedDriverDetail = { savedAt: number; data: DriverDetail };

export type RaceDetail = {
  name: string;
  dates: string;
  circuit: string;
  locality: string;
  country: string;
  sessions: Record<string, Array<{ name: string; time: string; tv: string }>>;
};

type RaceDetailResponse = {
  MRData: {
    RaceTable: {
      Races: Array<{
        raceName: string;
        date: string;
        time?: string;
        Circuit: { circuitName: string; Location: { locality: string; country: string } };
        FirstPractice?: { date: string; time?: string };
        SecondPractice?: { date: string; time?: string };
        ThirdPractice?: { date: string; time?: string };
        Sprint?: { date: string; time?: string };
        Qualifying?: { date: string; time?: string };
      }>;
    };
  };
};

type CachedRaceDetail = { savedAt: number; data: RaceDetail };

function formatDates(date: string) {
  return raceWeekendDates(date);
}

function mapCalendar(races: JolpicaResponse['MRData']['RaceTable']['Races']): CalendarRace[] {
  const today = new Date().toISOString().slice(0, 10);
  let nextFound = false;

  return races.map((race) => {
    const status = race.date < today ? 'done' : !nextFound ? 'next' : 'todo';
    if (status === 'next') nextFound = true;
    return {
      id: race.round,
      dates: formatDates(race.date),
      flag: '🏁',
      name: race.raceName,
      circuit: race.Circuit.circuitName,
      startsAt: race.time ? `${race.date}T${race.time}` : `${race.date}T00:00:00Z`,
      status,
    };
  });
}

async function fetchCalendar(season: number) {
  const response = await fetch(`${API_URL}/${season}.json?limit=100`);
  if (!response.ok) throw new Error(`Jolpica respondeu ${response.status}`);
  const payload = await response.json() as JolpicaResponse;
  return mapCalendar(payload.MRData.RaceTable.Races);
}

export async function getCalendar(season = new Date().getFullYear()) {
  const cached = await AsyncStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached) as CachedCalendar;
    if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const data = await fetchCalendar(season);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedCalendar));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as CachedCalendar).data;
    throw error;
  }
}

async function fetchDrivers(season: number) {
  const response = await fetch(`${API_URL}/${season}/driverstandings.json?limit=100`);
  if (!response.ok) throw new Error(`Jolpica respondeu ${response.status}`);
  const payload = await response.json() as StandingsResponse;
  const standings = payload.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
  return standings.map((standing): Driver => ({
    id: standing.Driver.driverId,
    name: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
    team: standing.Constructors[0]?.name ?? 'Sem equipe',
    pts: Number(standing.points),
    price: 0,
  }));
}

export async function getDrivers(season = new Date().getFullYear()) {
  const cached = await AsyncStorage.getItem(DRIVERS_CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached) as CachedDrivers;
    if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const data = await fetchDrivers(season);
    await AsyncStorage.setItem(DRIVERS_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedDrivers));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as CachedDrivers).data;
    throw error;
  }
}

async function fetchTeams(season: number) {
  const response = await fetch(`${API_URL}/${season}/constructorstandings.json?limit=100`);
  if (!response.ok) throw new Error(`Jolpica respondeu ${response.status}`);
  const payload = await response.json() as ConstructorStandingsResponse;
  const standings = payload.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
  return standings.map((standing): Team => ({
    id: standing.Constructor.constructorId,
    name: standing.Constructor.name,
    pts: Number(standing.points),
    price: 0,
  }));
}

export async function getTeams(season = new Date().getFullYear()) {
  const cached = await AsyncStorage.getItem(TEAMS_CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached) as CachedTeams;
    if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const data = await fetchTeams(season);
    await AsyncStorage.setItem(TEAMS_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedTeams));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as CachedTeams).data;
    throw error;
  }
}

function calculateStats(races: DriverStatRow[]) {
  const results = races.flatMap((race) => race.Results.map((result) => ({ ...result, season: race.season, raceName: race.raceName })));
  const positions = results.map((result) => Number(result.position)).filter((position) => position > 0);
  const grids = results.map((result) => Number(result.grid)).filter((grid) => grid > 0);
  return {
    Corridas: results.length,
    Vitórias: results.filter((result) => result.position === '1').length,
    Pódios: results.filter((result) => positions.includes(Number(result.position)) && Number(result.position) <= 3).length,
    Poles: results.filter((result) => result.grid === '1').length,
    Pontos: results.reduce((sum, result) => sum + Number(result.points), 0),
    'Melhor grid': grids.length ? `${Math.min(...grids)}º` : '-',
    DNFs: results.filter((result) => result.status !== 'Finished' && result.status !== 'Lapped').length,
  };
}

async function fetchDriverResults(path: string) {
  const races: DriverStatRow[] = [];
  let offset = 0;
  let total = 0;

  do {
    const response = await fetch(`${path}?limit=100&offset=${offset}`);
    if (!response.ok) throw new Error(`Jolpica respondeu ${response.status}`);
    const payload = await response.json() as DriverResultsResponse;
    races.push(...payload.MRData.RaceTable.Races);
    total = Number(payload.MRData.total);
    offset += Number(payload.MRData.limit);
  } while (offset < total);

  return races;
}

export async function getDriverDetail(driverId: string, season = new Date().getFullYear()) {
  const cacheKey = `${DRIVER_DETAIL_CACHE_PREFIX}${driverId}-${season}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached) as CachedDriverDetail;
    if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const [profileResponse, standingsResponse, seasonRaces, careerRaces] = await Promise.all([
      fetch(`${API_URL}/drivers/${driverId}.json`),
      fetch(`${API_URL}/${season}/drivers/${driverId}/driverstandings.json`),
      fetchDriverResults(`${API_URL}/${season}/drivers/${driverId}/results.json`),
      fetchDriverResults(`${API_URL}/drivers/${driverId}/results.json`),
    ]);
    if (!profileResponse.ok || !standingsResponse.ok) {
      throw new Error('Não foi possível carregar o detalhe do piloto');
    }

    const profile = (await profileResponse.json() as DriverProfileResponse).MRData.DriverTable.Drivers[0];
    const standing = (await standingsResponse.json() as DriverStandingsResponse).MRData.StandingsTable.StandingsLists[0]?.DriverStandings[0];
    const seasonStats = calculateStats(seasonRaces);
    const careerStats = calculateStats(careerRaces);
    seasonStats.Pontos = Number(standing?.points ?? seasonStats.Pontos);
    const teamYears = new Map<string, Set<string>>();
    careerRaces.forEach((race) => race.Results.forEach((result) => {
      if (!teamYears.has(result.Constructor.name)) teamYears.set(result.Constructor.name, new Set());
      teamYears.get(result.Constructor.name)?.add(race.season);
    }));
    const data: DriverDetail = {
      id: driverId,
      name: `${profile.givenName} ${profile.familyName}`,
      team: standing?.Constructors[0]?.name ?? 'Sem equipe',
      nationality: profile.nationality,
      birth: profile.dateOfBirth,
      season: { ...seasonStats, 'Posição no campeonato': standing?.position ?? '-' },
      career: careerStats,
      lastRaces: seasonRaces.slice(-4).reverse().map((race) => ({ gp: race.raceName.replace(/^GP da /, ''), pos: `${race.Results[0]?.position ?? '-'}º` })),
      teams: [...teamYears.entries()].map(([name, years]) => ({ name, years: [...years].join(' - ') })),
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedDriverDetail));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as CachedDriverDetail).data;
    throw error;
  }
}

function formatSessionTime(date: string, time?: string) {
  const isoDate = time ? `${date}T${time}` : `${date}T00:00:00Z`;
  return new Date(isoDate).toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function getRaceDetail(round: string, season = new Date().getFullYear()) {
  const cacheKey = `${RACE_DETAIL_CACHE_PREFIX}${season}-${round}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached) as CachedRaceDetail;
    if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const response = await fetch(`${API_URL}/${season}/${round}.json`);
    if (!response.ok) throw new Error(`Jolpica respondeu ${response.status}`);
    const payload = await response.json() as RaceDetailResponse;
    const race = payload.MRData.RaceTable.Races[0];
    if (!race) throw new Error('GP não encontrado');
    const sessions: RaceDetail['sessions'] = { SEX: [], SÁB: [], DOM: [] };
    const addSession = (day: keyof typeof sessions, name: string, session?: { date: string; time?: string }) => {
      if (session) sessions[day].push({ name, time: formatSessionTime(session.date, session.time), tv: 'F1 TV' });
    };
    addSession('SEX', 'Treino Livre', race.FirstPractice);
    addSession('SEX', 'Treino Livre 2', race.SecondPractice);
    addSession('SÁB', 'Treino Livre 3', race.ThirdPractice);
    addSession('SÁB', 'Sprint', race.Sprint);
    addSession('SÁB', 'Classificação', race.Qualifying);
    addSession('DOM', 'Corrida', { date: race.date, time: race.time });
    const data: RaceDetail = {
      name: race.raceName,
      dates: raceWeekendDates(race.date),
      circuit: race.Circuit.circuitName,
      locality: race.Circuit.Location.locality,
      country: race.Circuit.Location.country,
      sessions,
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedRaceDetail));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as CachedRaceDetail).data;
    throw error;
  }
}

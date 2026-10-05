import AsyncStorage from '@react-native-async-storage/async-storage';
import { raceWeekendDates } from './format';

const API_URL = 'https://api.jolpi.ca/ergast/f1';
const CACHE_KEY_PREFIX = '@pitzone/cache/calendar-v6/';
const DRIVERS_CACHE_KEY = '@pitzone/cache/drivers';
const TEAMS_CACHE_KEY_PREFIX = '@pitzone/cache/teams-v2/';
const DRIVER_DETAIL_CACHE_PREFIX = '@pitzone/cache/driver-detail-v4/';
const RACE_DETAIL_CACHE_PREFIX = '@pitzone/cache/race-detail-v8/';
const TEAM_DETAIL_CACHE_PREFIX = '@pitzone/cache/team-detail-v3/';
const CACHE_TTL = 1000 * 60 * 60;

export type CalendarRace = {
  id: string;
  dates: string;
  flag: string;
  country: string;
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
        Circuit: { circuitName: string; Location: { country: string } };
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
  headshotUrl?: string;
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

export type TeamDriver = {
  id: string;
  name: string;
  position: string;
  points: number;
  wins: number;
};

export type TeamDetail = {
  id: string;
  name: string;
  nationality: string;
  season: number;
  position: string;
  points: number;
  wins: number;
  drivers: TeamDriver[];
  teamPrincipal: string;
  titles: number;
  titleYears: number[];
};

type ConstructorStandingsResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        ConstructorStandings: Array<{
          position: string;
          points: string;
          wins: string;
          Constructor: { constructorId: string; name: string; nationality?: string };
        }>;
      }>;
    };
  };
};

type CachedTeams = { savedAt: number; data: Team[] };
type CachedTeamDetail = { savedAt: number; data: TeamDetail };

const CONSTRUCTOR_TITLE_YEARS: Record<string, number[]> = {
  ferrari: [1961, 1964, 1975, 1976, 1977, 1979, 1982, 1983, 1999, 2000, 2001, 2002, 2003, 2004, 2007, 2008],
  mclaren: [1974, 1984, 1985, 1988, 1989, 1990, 1991, 1998, 1999],
  mercedes: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
  red_bull: [2010, 2011, 2012, 2013, 2022, 2023],
  williams: [1980, 1981, 1986, 1987, 1992, 1993, 1994, 1996, 1997],
  alpine: [2005, 2006],
};

export const TEAM_PRINCIPALS: Record<string, string> = {
  alpine: 'Oliver Oakes',
  aston_martin: 'Andy Cowell',
  audi: 'Jonathan Wheatley',
  ferrari: 'Frédéric Vasseur',
  haas: 'Ayao Komatsu',
  mclaren: 'Andrea Stella',
  mercedes: 'Toto Wolff',
  rb: 'Alan Permane',
  red_bull: 'Laurent Mekies',
  williams: 'James Vowles',
};

const DRIVER_TITLE_COUNTS: Record<string, number> = {
  prost: 4,
  ascari: 2,
  senna: 3,
  emerson_fittipaldi: 2,
  alonso: 2,
  fangio: 5,
  hamilton: 7,
  jack_brabham: 3,
  stewart: 3,
  clark: 2,
  max_verstappen: 4,
  michael_schumacher: 7,
  lauda: 3,
  vettel: 4,
  mika_hakkinen: 2,
};

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
  raceDate: string;
  dates: string;
  circuit: string;
  locality: string;
  country: string;
  sessions: Record<string, Array<{ name: string; time: string; tv: string; startsAt: string }>>;
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

function countryFlag(country: string) {
  const flags: Record<string, string> = {
    Australia: '🇦🇺',
    Austria: '🇦🇹',
    Azerbaijan: '🇦🇿',
    Bahrain: '🇧🇭',
    Belgium: '🇧🇪',
    Brazil: '🇧🇷',
    Canada: '🇨🇦',
    China: '🇨🇳',
    Hungary: '🇭🇺',
    Italy: '🇮🇹',
    Japan: '🇯🇵',
    Malaysia: '🇲🇾',
    Mexico: '🇲🇽',
    Monaco: '🇲🇨',
    Netherlands: '🇳🇱',
    Portugal: '🇵🇹',
    Qatar: '🇶🇦',
    Saudi: '🇸🇦',
    'Saudi Arabia': '🇸🇦',
    Singapore: '🇸🇬',
    Spain: '🇪🇸',
    UAE: '🇦🇪',
    USA: '🇺🇸',
    UK: '🇬🇧',
    'Great Britain': '🇬🇧',
    'United Arab Emirates': '🇦🇪',
    'United Kingdom': '🇬🇧',
    'United States': '🇺🇸',
  };
  return flags[country] ?? '🏁';
}

function countryName(country: string) {
  const names: Record<string, string> = {
    Australia: 'Austrália',
    Austria: 'Áustria',
    Azerbaijan: 'Azerbaijão',
    Bahrain: 'Bahrein',
    Belgium: 'Bélgica',
    Brazil: 'Brasil',
    Canada: 'Canadá',
    China: 'China',
    Hungary: 'Hungria',
    Italy: 'Itália',
    Japan: 'Japão',
    Malaysia: 'Malásia',
    Mexico: 'México',
    Monaco: 'Mônaco',
    Netherlands: 'Holanda',
    Portugal: 'Portugal',
    Qatar: 'Catar',
    Saudi: 'Arábia Saudita',
    'Saudi Arabia': 'Arábia Saudita',
    Singapore: 'Singapura',
    Spain: 'Espanha',
    UAE: 'Emirados Árabes Unidos',
    USA: 'Estados Unidos',
    UK: 'Grã-Bretanha',
    'Great Britain': 'Grã-Bretanha',
    'United Arab Emirates': 'Emirados Árabes Unidos',
    'United Kingdom': 'Reino Unido',
    'United States': 'Estados Unidos',
  };
  return names[country] ?? country;
}

function raceNamePortuguese(name: string) {
  const names: Record<string, string> = {
    'Australian Grand Prix': 'GP da Austrália',
    'Azerbaijan Grand Prix': 'GP do Azerbaijão',
    'Austrian Grand Prix': 'GP da Áustria',
    'Barcelona Grand Prix': 'GP da Espanha',
    'Bahrain Grand Prix': 'GP do Bahrein',
    'Bahrain Grand Prix in Malaysia': 'GP da Malásia',
    'Belgian Grand Prix': 'GP da Bélgica',
    'Brazilian Grand Prix': 'GP do Brasil',
    'British Grand Prix': 'GP da Grã-Bretanha',
    'Canadian Grand Prix': 'GP do Canadá',
    'Chinese Grand Prix': 'GP da China',
    'Dutch Grand Prix': 'GP da Holanda',
    'Hungarian Grand Prix': 'GP da Hungria',
    'Italian Grand Prix': 'GP da Itália',
    'Japanese Grand Prix': 'GP do Japão',
    'Las Vegas Grand Prix': 'GP de Las Vegas',
    'Mexico City Grand Prix': 'GP da Cidade do México',
    'Miami Grand Prix': 'GP de Miami',
    'Monaco Grand Prix': 'GP de Mônaco',
    'Qatar Grand Prix': 'GP do Catar',
    'Saudi Arabian Grand Prix': 'GP da Arábia Saudita',
    'Singapore Grand Prix': 'GP de Singapura',
    'Spanish Grand Prix': 'GP da Espanha',
    'United States Grand Prix': 'GP dos Estados Unidos',
    'Abu Dhabi Grand Prix': 'GP de Abu Dhabi',
  };
  return names[name] ?? name;
}

function raceCompletionTime(startsAt: string) {
  const start = new Date(startsAt);
  const hasScheduledTime = !startsAt.endsWith('T00:00:00Z') && !startsAt.endsWith('T00:00:00');
  if (!hasScheduledTime) {
    const endOfRaceDay = new Date(`${startsAt.slice(0, 10)}T23:30:00`);
    return endOfRaceDay.getTime();
  }
  return start.getTime() + 4.5 * 60 * 60 * 1000;
}

function applyCalendarStatuses(races: CalendarRace[]): CalendarRace[] {
  const now = Date.now();
  let nextFound = false;

  return races.map((race) => {
    const status = now >= raceCompletionTime(race.startsAt) ? 'done' : !nextFound ? 'next' : 'todo';
    if (status === 'next') nextFound = true;
    return { ...race, status };
  });
}

function mapCalendar(races: JolpicaResponse['MRData']['RaceTable']['Races']): CalendarRace[] {
  const mapped = races.map((race): CalendarRace => ({
    id: race.round,
    dates: formatDates(race.date),
    flag: countryFlag(race.Circuit.Location.country),
    country: countryName(race.Circuit.Location.country),
    name: raceNamePortuguese(race.raceName),
    circuit: race.Circuit.circuitName,
    startsAt: race.time ? `${race.date}T${race.time}` : `${race.date}T00:00:00Z`,
    status: 'todo',
  }));
  return applyCalendarStatuses(mapped);
}

async function fetchCalendar(season: number) {
  const response = await fetch(`${API_URL}/${season}.json?limit=100`);
  if (!response.ok) throw new Error(`Jolpica respondeu ${response.status}`);
  const payload = await response.json() as JolpicaResponse;
  return mapCalendar(payload.MRData.RaceTable.Races);
}

export async function getCalendar(season = new Date().getFullYear()) {
  const cacheKey = `${CACHE_KEY_PREFIX}${season}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached) as CachedCalendar;
    if (Date.now() - parsed.savedAt < CACHE_TTL) return applyCalendarStatuses(parsed.data);
  }

  try {
    const data = await fetchCalendar(season);
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedCalendar));
    return applyCalendarStatuses(data);
  } catch (error) {
    if (cached) return applyCalendarStatuses((JSON.parse(cached) as CachedCalendar).data);
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
  const cacheKey = `${TEAMS_CACHE_KEY_PREFIX}${season}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached) as CachedTeams;
    if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const data = await fetchTeams(season);
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedTeams));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as CachedTeams).data;
    throw error;
  }
}

export async function getTeamDetail(teamId: string, season = new Date().getFullYear()) {
  const cacheKey = `${TEAM_DETAIL_CACHE_PREFIX}${teamId}-${season}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached) as CachedTeamDetail;
    if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const [currentResponse, standingsResponse] = await Promise.all([
      fetch(`${API_URL}/${season}/constructors/${teamId}/constructorstandings.json`),
      fetch(`${API_URL}/${season}/driverstandings.json?limit=100`),
    ]);
    if (!currentResponse.ok || !standingsResponse.ok) {
      throw new Error('Não foi possível carregar os dados da equipe');
    }

    const currentPayload = await currentResponse.json() as ConstructorStandingsResponse;
    const currentStanding = currentPayload.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings[0];
    if (!currentStanding) throw new Error('Equipe não encontrada');

    const standingsPayload = await standingsResponse.json() as DriverStandingsResponse;
    const standings = standingsPayload.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
    const constructorName = currentStanding.Constructor.name.toLowerCase();
    const teamDrivers = standings
      .filter((standing) => standing.Constructors.some(({ name }) => name.toLowerCase() === constructorName))
      .sort((first, second) => Number(first.position) - Number(second.position))
      .slice(0, 2);
    const titleYears = CONSTRUCTOR_TITLE_YEARS[teamId] ?? [];

    const data: TeamDetail = {
      id: teamId,
      name: currentStanding.Constructor.name,
      nationality: currentStanding.Constructor.nationality ?? 'Não informada',
      season,
      position: currentStanding.position ?? '-',
      points: Number(currentStanding.points),
      wins: Number(currentStanding.wins),
      drivers: teamDrivers.map((standing) => {
        const driver = standing.Driver;
        return {
          id: driver.driverId,
          name: `${driver.givenName} ${driver.familyName}`,
          position: standing.position ?? '-',
          points: Number(standing.points ?? 0),
          wins: Number(standing.wins ?? 0),
        };
      }),
      teamPrincipal: TEAM_PRINCIPALS[teamId] ?? 'Não informado',
      titles: titleYears.length,
      titleYears,
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedTeamDetail));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as CachedTeamDetail).data;
    throw error;
  }
}

function calculateStats(races: DriverStatRow[]): Record<string, number | string> {
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

async function calculateDriverTitles(driverId: string, races: DriverStatRow[]) {
  const knownTitles = DRIVER_TITLE_COUNTS[driverId];
  if (knownTitles !== undefined) return knownTitles;

  const currentSeason = new Date().getFullYear();
  const seasons = [...new Set(races.map((race) => race.season))]
    .filter((season) => Number(season) < currentSeason);
  const standings = await Promise.all(seasons.map(async (season) => {
    const response = await fetch(`${API_URL}/${season}/drivers/${driverId}/driverstandings.json`);
    if (!response.ok) return null;
    const payload = await response.json() as DriverStandingsResponse;
    return payload.MRData.StandingsTable.StandingsLists[0]?.DriverStandings[0];
  }));

  return standings.filter((standing) => String(standing?.position) === '1').length;
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
    const [careerStats, titles] = await Promise.all([
      Promise.resolve(calculateStats(careerRaces)),
      calculateDriverTitles(driverId, careerRaces),
    ]);
    careerStats.Títulos = titles;
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

function sessionStartsAt(date: string, time?: string) {
  const normalizedTime = time ?? '00:00:00Z';
  return new Date(`${date}T${normalizedTime}${normalizedTime.endsWith('Z') ? '' : 'Z'}`).toISOString();
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
    const addSession = (name: string, session?: { date: string; time?: string }) => {
      if (!session) return;
      const sessionDate = new Date(sessionStartsAt(session.date, session.time));
      const weekdayName = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'short',
      }).format(sessionDate);
      const weekday = weekdayName === 'Fri' ? 5 : weekdayName === 'Sat' ? 6 : 0;
      const day: keyof typeof sessions = weekday === 5 ? 'SEX' : weekday === 6 ? 'SÁB' : 'DOM';
      sessions[day].push({
        name,
        time: formatSessionTime(session.date, session.time),
        tv: 'F1 TV e SporTV',
        startsAt: sessionStartsAt(session.date, session.time),
      });
    };
    addSession('Treino Livre', race.FirstPractice);
    addSession('Treino Livre 2', race.SecondPractice);
    addSession('Treino Livre 3', race.ThirdPractice);
    addSession('Sprint', race.Sprint);
    addSession('Classificação', race.Qualifying);
    addSession('Corrida', { date: race.date, time: race.time });
    const data: RaceDetail = {
      name: raceNamePortuguese(race.raceName),
      raceDate: race.date,
      dates: raceWeekendDates(race.date),
      circuit: race.Circuit.circuitName,
      locality: race.Circuit.Location.locality,
      country: countryName(race.Circuit.Location.country),
      sessions,
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedRaceDetail));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as CachedRaceDetail).data;
    throw error;
  }
}

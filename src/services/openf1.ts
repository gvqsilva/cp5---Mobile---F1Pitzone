import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.openf1.org/v1';
const CACHE_PREFIX = '@pitzone/cache/openf1/sessions-v2/';
const CACHE_TTL = 1000 * 60 * 10;
const DRIVERS_CACHE_PREFIX = '@pitzone/cache/openf1/drivers-v5/';

type OpenF1Meeting = {
  meeting_key: number;
  meeting_name: string;
  circuit_short_name: string;
  date_start: string;
  date_end: string;
  year: number;
};

type OpenF1Session = {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  meeting_key: number;
  circuit_short_name: string;
};

type OpenF1Driver = {
  session_key: number;
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  headshot_url?: string;
};

type OpenF1SessionResult = {
  position: number;
  driver_number: number;
  number_of_laps: number;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  duration?: number;
  gap_to_leader?: number;
};

export type OpenF1SessionInfo = {
  sessionKey: number;
  name: string;
  type: string;
  tv: string;
  startsAt: string;
  endsAt: string;
  day: 'SEX' | 'SÁB' | 'DOM';
};

export type OpenF1Result = {
  position: number;
  driverNumber: number;
  name: string;
  acronym: string;
  team: string;
  teamColour: string;
  headshotUrl?: string;
  laps: number;
  status: string;
  duration?: number;
  gapToLeader?: number;
};

export type OpenF1DriverProfile = {
  number: number;
  name: string;
  acronym: string;
  team: string;
  headshotUrl?: string;
};

type CachedSessions = { savedAt: number; data: OpenF1SessionInfo[] };

async function getJson<T>(path: string) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`OpenF1 respondeu ${response.status}`);
  return response.json() as Promise<T>;
}

function localDateKey(value: string | Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function sessionDay(startsAt: string): OpenF1SessionInfo['day'] {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
  }).format(new Date(startsAt));
  return weekday === 'Fri' ? 'SEX' : weekday === 'Sat' ? 'SÁB' : 'DOM';
}

function matchMeeting(meeting: OpenF1Meeting, raceDate: string, circuit: string) {
  const circuitName = circuit.toLowerCase();
  const meetingCircuit = meeting.circuit_short_name.toLowerCase();
  const circuitMatches = circuitName.includes(meetingCircuit) || meetingCircuit.includes(circuitName);
  const dateMatches = localDateKey(meeting.date_end) >= raceDate && localDateKey(meeting.date_start) <= raceDate;
  return circuitMatches || dateMatches;
}

export async function getOpenF1Sessions(raceDate: string, circuit: string, year = new Date().getFullYear()) {
  const cacheKey = `${CACHE_PREFIX}${year}-${raceDate}-${circuit}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached) as CachedSessions;
    if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const meetings = await getJson<OpenF1Meeting[]>(`/meetings?year=${year}`);
    const meeting = meetings
      .filter((item) => !item.meeting_name.toLowerCase().includes('testing'))
      .find((item) => matchMeeting(item, raceDate, circuit));
    if (!meeting) return [];

    const sessions = await getJson<OpenF1Session[]>(`/sessions?meeting_key=${meeting.meeting_key}`);
    const data = sessions
      .filter((session) => !session.session_name.toLowerCase().includes('testing'))
      .map((session): OpenF1SessionInfo => ({
        sessionKey: session.session_key,
        name: session.session_name,
        type: session.session_type,
        tv: 'F1 TV e SporTV',
        startsAt: session.date_start,
        endsAt: session.date_end,
        day: sessionDay(session.date_start),
      }))
      .sort((first, second) => first.startsAt.localeCompare(second.startsAt));
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedSessions));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as CachedSessions).data;
    throw error;
  }
}

export async function getOpenF1SessionResults(sessionKey: number) {
  const [results, drivers] = await Promise.all([
    getJson<OpenF1SessionResult[]>(`/session_result?session_key=${sessionKey}`),
    getJson<OpenF1Driver[]>(`/drivers?session_key=${sessionKey}`),
  ]);
  const driversByNumber = new Map(drivers.map((driver) => [driver.driver_number, driver]));

  const mappedResults = results.map((result): OpenF1Result => {
      const driver = driversByNumber.get(result.driver_number);
      return {
        position: result.position,
        driverNumber: result.driver_number,
        name: driver?.full_name ?? `Piloto #${result.driver_number}`,
        acronym: driver?.name_acronym ?? '-',
        team: driver?.team_name ?? 'Equipe não informada',
        teamColour: driver?.team_colour ?? '777777',
        headshotUrl: driver?.headshot_url,
        laps: result.number_of_laps,
        status: result.dsq ? 'Desclassificado' : result.dns ? 'Não largou' : result.dnf ? 'Abandonou' : 'Classificado',
        duration: result.duration,
        gapToLeader: result.gap_to_leader,
      };
    });

  return mappedResults.sort((first, second) => {
    const firstFinished = first.status === 'Classificado';
    const secondFinished = second.status === 'Classificado';
    if (firstFinished !== secondFinished) return firstFinished ? -1 : 1;
    return first.position - second.position;
  });
}

export async function getOpenF1Drivers(year = new Date().getFullYear()) {
  const cacheKey = `${DRIVERS_CACHE_PREFIX}${year}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached) as { savedAt: number; data: OpenF1DriverProfile[] };
    if (Date.now() - parsed.savedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const sessions = await getJson<OpenF1Session[]>(`/sessions?year=${year}`);
    const latestRace = sessions
      .filter((session) => !session.session_name.toLowerCase().includes('testing'))
      .filter((session) => new Date(session.date_start).getTime() <= Date.now())
      .filter((session) => session.session_name.toLowerCase() === 'race')
      .sort((first, second) => second.date_start.localeCompare(first.date_start))[0];
    if (!latestRace) throw new Error('Nenhuma corrida concluída encontrada');

    const drivers = await getJson<OpenF1Driver[]>(`/drivers?session_key=${latestRace.session_key}`);
    const data = drivers.map((driver) => ({
      number: driver.driver_number,
      name: driver.full_name,
      acronym: driver.name_acronym,
      team: driver.team_name,
      headshotUrl: driver.headshot_url,
    }));
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data }));
    return data;
  } catch (error) {
    if (cached) return (JSON.parse(cached) as { savedAt: number; data: OpenF1DriverProfile[] }).data;
    throw error;
  }
}

export async function getLatestCompletedFantasyWeekend(year = new Date().getFullYear()) {
  const sessions = await getJson<OpenF1Session[]>(`/sessions?year=${year}`);
  const races = sessions
    .filter((session) => session.session_name.toLowerCase() === 'race')
    .filter((session) => new Date(session.date_end).getTime() <= Date.now())
    .sort((first, second) => second.date_end.localeCompare(first.date_end));
  const race = races[0];
  if (!race) throw new Error('Nenhum fim de semana concluído encontrado');

  const weekendSessions = sessions
    .filter((session) => session.meeting_key === race.meeting_key)
    .filter((session) => new Date(session.date_end).getTime() <= Date.now())
    .filter((session) => !session.session_name.toLowerCase().includes('testing'))
    .sort((first, second) => first.date_start.localeCompare(second.date_start));

  const results = await Promise.all(weekendSessions.map(async (session) => ({
    session,
    results: await getOpenF1SessionResults(session.session_key),
  })));

  return { name: race.circuit_short_name, sessions: results };
}

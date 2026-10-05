import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDrivers, getTeams, TEAM_PRINCIPALS } from './jolpica';
import { getOpenF1Drivers } from './openf1';
import { getLatestCompletedFantasyWeekend } from './openf1';
import { calcularPontuacaoFimDeSemana, SessaoTipo, ResultadoSessao } from './fantasyScoring';
import { CategoriaFantasy, FAIXAS, precoBasePorClassificacao } from './fantasyScoring';

const KEY = '@pitzone/fantasy-team';

export type FantasyPick = { name: string; pts: number; price: number; headshotUrl?: string; logoUrl?: string; logoAsset?: number };

export function getTeamLogoUrl(name: string) {
  const slug = normalizeName(name).replace(/ /g, '');
  return `https://cdn.simpleicons.org/${slug}`;
}

const TEAM_LOGOS: Record<string, number> = {
  alpine: require('../assets/logos/alpine.png'),
  astonmartin: require('../assets/logos/astonmartin.png'),
  audi: require('../assets/logos/audi.webp'),
  cadillac: require('../assets/logos/cadillac.png'),
  ferrari: require('../assets/logos/ferrari.png'),
  haas: require('../assets/logos/haas.png'),
  mclaren: require('../assets/logos/mclaren.png'),
  mercedes: require('../assets/logos/mercedes.webp'),
  redbull: require('../assets/logos/redbull.png'),
  visa: require('../assets/logos/visa.png'),
  williams: require('../assets/logos/williams.png'),
};

export function getTeamLogoAsset(name: string) {
  const normalized = normalizeName(name).replace(/[^a-z0-9]/g, '');
  const key = normalized.includes('astonmartin') ? 'astonmartin'
    : normalized.includes('redbull') ? 'redbull'
      : normalized.includes('visacashapprb') || normalized === 'rb' || normalized.includes('racingbulls') || normalized.includes('vcarb') ? 'visa'
      : normalized;
  return TEAM_LOGOS[key];
}

export function getTeamDisplayName(name: string) {
  const normalized = normalizeName(name).replace(/[^a-z0-9]/g, '');
  return normalized.includes('visacashapprb') || normalized === 'rb' || normalized.includes('racingbulls')
    ? 'RB'
    : name;
}

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

function findHeadshot(name: string, profiles: Awaited<ReturnType<typeof getOpenF1Drivers>>) {
  const normalizedName = normalizeName(name);
  const nameParts = normalizedName.split(' ');
  return profiles.find((profile) => {
    const normalizedProfile = normalizeName(profile.name);
    const profileParts = normalizedProfile.split(' ');
    return normalizedProfile === normalizedName
      || (nameParts.length > 0 && profileParts[profileParts.length - 1] === nameParts[nameParts.length - 1])
      || nameParts.some((part) => part.length > 3 && profileParts.includes(part));
  })?.headshotUrl;
}

function isFantasyEligibleDriver(id: string, name: string) {
  return id !== 'tsunoda' && !normalizeName(name).includes('yuki tsunoda');
}

export type FantasyMarketOption = {
  id: string;
  name: string;
  sub: string;
  price: number;
  points: number;
  category: CategoriaFantasy;
  headshotUrl?: string;
  logoUrl?: string;
  logoAsset?: number;
};

export type FantasyMarket = {
  drivers: FantasyMarketOption[];
  teams: FantasyMarketOption[];
  chiefs: FantasyMarketOption[];
};

export async function getFantasyMarket(season = new Date().getFullYear()): Promise<FantasyMarket> {
  const [drivers, teams] = await Promise.all([getDrivers(season), getTeams(season)]);
  let openF1Drivers: Awaited<ReturnType<typeof getOpenF1Drivers>> = [];
  try {
    openF1Drivers = await getOpenF1Drivers(season);
  } catch {
    // O mercado continua disponível mesmo quando o serviço de imagens está indisponível.
  }
  const eligibleDrivers = drivers.filter((driver) => isFantasyEligibleDriver(driver.id, driver.name));
  const driverOptions = eligibleDrivers.map((driver, index) => ({
    id: driver.id,
    name: driver.name,
    sub: driver.team,
    price: precoBasePorClassificacao(index + 1, eligibleDrivers.length, FAIXAS.piloto),
    points: driver.pts,
    category: 'piloto' as const,
    headshotUrl: findHeadshot(driver.name, openF1Drivers),
  }));
  const teamOptions = teams.map((team, index) => ({
    id: team.id,
    name: team.name,
    sub: '',
    price: precoBasePorClassificacao(index + 1, teams.length, FAIXAS.construtora),
    points: team.pts,
    category: 'construtora' as const,
    logoUrl: getTeamLogoUrl(team.name),
    logoAsset: getTeamLogoAsset(team.id) ?? getTeamLogoAsset(team.name),
  }));
  const chiefs = teams
    .map((team, index) => {
      const name = TEAM_PRINCIPALS[team.id];
      if (!name) return null;
      return {
        id: team.id,
        name,
        sub: team.name,
        price: precoBasePorClassificacao(index + 1, teams.length, FAIXAS.chefeDeEquipe),
        points: 0,
        category: 'chefeDeEquipe' as const,
      };
    })
    .filter((chief): chief is NonNullable<typeof chief> => chief !== null);

  return { drivers: driverOptions, teams: teamOptions, chiefs };
}

export type FantasyTeam = {
  teamName: string;
  rank: string;
  total: number;
  budgetUsed: number;
  lastRace: {
    name: string;
    circuit: string;
    dates: string;
    pts: number;
    gridRank: string;
  } | null;
  picks: {
    drivers: FantasyPick[];
    constructor: FantasyPick | null;
    chief: FantasyPick | null;
  };
};

export const emptyFantasyTeam: FantasyTeam = {
  teamName: 'Minha equipe',
  rank: '-',
  total: 0,
  budgetUsed: 0,
  lastRace: null,
  picks: { drivers: [], constructor: null, chief: null },
};

export async function getFantasyTeam(): Promise<FantasyTeam> {
  const stored = await AsyncStorage.getItem(KEY);
  if (!stored) return emptyFantasyTeam;

  try {
    const parsed = JSON.parse(stored) as Partial<FantasyTeam>;
    const team = {
      ...emptyFantasyTeam,
      ...parsed,
      picks: { ...emptyFantasyTeam.picks, ...parsed.picks },
    };
    if (team.picks.constructor && !team.picks.constructor.logoAsset) {
      team.picks.constructor = {
        ...team.picks.constructor,
        logoAsset: getTeamLogoAsset(team.picks.constructor.name),
        logoUrl: getTeamLogoUrl(team.picks.constructor.name),
      };
      await saveFantasyTeam(team);
    }
    if (team.picks.drivers.some((driver) => !driver.headshotUrl)) {
      try {
        const profiles = await getOpenF1Drivers();
        team.picks.drivers = team.picks.drivers.map((driver) => ({
          ...driver,
          headshotUrl: driver.headshotUrl ?? findHeadshot(driver.name, profiles),
        }));
        await saveFantasyTeam(team);
      } catch {
        // A equipe salva continua disponível mesmo sem a atualização das imagens.
      }
    }
    return team;
  } catch {
    return emptyFantasyTeam;
  }
}

export async function saveFantasyTeam(team: FantasyTeam) {
  await AsyncStorage.setItem(KEY, JSON.stringify(team));
}

export async function clearFantasyTeam() {
  await AsyncStorage.removeItem(KEY);
}

function sessionType(name: string): SessaoTipo | null {
  const normalized = name.toLowerCase();
  if (normalized === 'race') return SessaoTipo.Corrida;
  if (normalized.includes('sprint') && normalized.includes('qualifying')) return SessaoTipo.ClassificacaoSprint;
  if (normalized.includes('sprint')) return SessaoTipo.CorridaSprint;
  if (normalized === 'qualifying') return SessaoTipo.Classificacao;
  if (normalized.includes('practice') || normalized.includes('treino')) return SessaoTipo.TreinoLivre;
  return null;
}

function sameDriver(first: string, second: string) {
  return first.toLowerCase().replace(/[^a-z]/g, '') === second.toLowerCase().replace(/[^a-z]/g, '');
}

export async function getLatestFantasyScore(team: FantasyTeam) {
  const weekend = await getLatestCompletedFantasyWeekend();
  const driverScores = team.picks.drivers.map((driver) => {
    const results: ResultadoSessao[] = [];
    for (const session of weekend.sessions) {
      const type = sessionType(session.session.session_name);
      const result = session.results.find((item) => sameDriver(item.name, driver.name));
      if (!type || !result) continue;
      results.push({
        sessao: type,
        posicao: result.position,
        dnf: result.status === 'Abandonou',
        desclassificado: result.status === 'Desclassificado',
      });
    }
    return { ...driver, pts: calcularPontuacaoFimDeSemana(results) };
  });
  const total = driverScores.reduce((sum, driver) => sum + driver.pts, 0);
  return { name: weekend.name, drivers: driverScores, total };
}

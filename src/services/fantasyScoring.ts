/**
 * fantasyScoring.ts
 * Motor de pontuação e precificação dinâmica do Fantasy do PitZone.
 *
 * Cobre:
 *   1. Pontuação de pilotos no fim de semana inteiro (TL1, TL2, TL3,
 *      Classificação, Classificação Sprint, Corrida Sprint, Corrida), com
 *      bônus extra pro pódio (top 3).
 *   2. Pontuação de Construtoras e Chefes de Equipe, derivada dos pilotos.
 *   3. Precificação dinâmica (posição no campeonato + desempenho recente).
 *
 * Este módulo é puro cálculo — não faz nenhuma chamada de rede. Dá pra usar
 * tanto no back-end (se virar Node/TS) quanto direto no app, em
 * src/services/fantasyScoring.ts, alimentado pelos dados que vierem da API.
 *
 * Ajuste N_PILOTOS_GRID se o jogo de vocês usar um tamanho de grid diferente
 * do atual da F1 (20 carros).
 */

export const N_PILOTOS_GRID = 20; // ajuste aqui se o grid do jogo tiver outro tamanho

// ---------------------------------------------------------------------------
// 1. PONTUAÇÃO DE SESSÕES (pilotos)
// ---------------------------------------------------------------------------

export enum SessaoTipo {
  TreinoLivre = 'treino_livre',
  Classificacao = 'classificacao',
  ClassificacaoSprint = 'classificacao_sprint',
  CorridaSprint = 'corrida_sprint',
  Corrida = 'corrida',
}

export interface PesoSessao {
  /** pontos do 1º colocado, antes do bônus de pódio */
  pesoMax: number;
  /** bônus extra pra P1, P2, P3 */
  bonusTop3: [number, number, number];
  /** null = grid inteiro pontua; N = só os N primeiros pontuam */
  posicoesPontuam: number | null;
  /** ganho/perda de posição, companheiro, volta rápida, penalidade */
  permiteBonusCorrida: boolean;
  /** pontos perdidos em caso de abandono (0 = sessão não penaliza DNF) */
  penalidadeDnf: number;
  /** só faz sentido em corrida de verdade */
  permiteDesclassificacao: boolean;
}

// Pesos pensados pra: grid pontua inteiro na Corrida e na Classificação (o
// que mais pesa na temporada), a Corrida Sprint pontua só do 1º ao 10º com
// valores menores, e os Treinos Livres pontuam pouco (top 5), só pra manter
// o fã engajado o fim de semana todo.
export const PESOS: Record<SessaoTipo, PesoSessao> = {
  [SessaoTipo.TreinoLivre]: {
    pesoMax: 5, bonusTop3: [0, 0, 0], posicoesPontuam: 5,
    permiteBonusCorrida: false, penalidadeDnf: 0, permiteDesclassificacao: false,
  },
  [SessaoTipo.ClassificacaoSprint]: {
    pesoMax: 8, bonusTop3: [4, 2, 1], posicoesPontuam: null,
    permiteBonusCorrida: false, penalidadeDnf: 0, permiteDesclassificacao: false,
  },
  [SessaoTipo.CorridaSprint]: {
    pesoMax: 10, bonusTop3: [6, 4, 2], posicoesPontuam: 10,
    permiteBonusCorrida: true, penalidadeDnf: 5, permiteDesclassificacao: false,
  },
  [SessaoTipo.Classificacao]: {
    pesoMax: 15, bonusTop3: [6, 3, 1], posicoesPontuam: null,
    permiteBonusCorrida: false, penalidadeDnf: 0, permiteDesclassificacao: false,
  },
  [SessaoTipo.Corrida]: {
    pesoMax: N_PILOTOS_GRID, bonusTop3: [15, 10, 6], posicoesPontuam: null,
    permiteBonusCorrida: true, penalidadeDnf: 10, permiteDesclassificacao: true,
  },
};

export interface ResultadoSessao {
  sessao: SessaoTipo;
  /** posição final/classificada nessa sessão */
  posicao: number;
  /** posição de largada — só Corrida e Corrida Sprint */
  grid?: number;
  /** só Corrida */
  voltaMaisRapida?: boolean;
  /** só Corrida */
  aFrenteDoCompanheiro?: boolean;
  dnf?: boolean;
  desclassificado?: boolean;
  penalidadeTempoOuGrid?: boolean;
}

/**
 * Calcula os pontos de UMA sessão pra um piloto.
 *
 * base(posição) = 1 + (pesoMax - 1) * (N - posição) / (N - 1)
 * + bônus de pódio pra P1/P2/P3
 * + bônus/penalidades de corrida (quando a sessão permitir)
 */
export function calcularPontosSessao(resultado: ResultadoSessao, nPilotos: number = N_PILOTOS_GRID): number {
  const peso = PESOS[resultado.sessao];
  const nEfetivo = peso.posicoesPontuam ?? nPilotos;

  const foraDaFaixa = resultado.posicao > nEfetivo;
  const desclassificou = peso.permiteDesclassificacao && !!resultado.desclassificado;
  const naoPontuaBase = foraDaFaixa || !!resultado.dnf || desclassificou;

  let base: number;
  if (naoPontuaBase) {
    base = 0;
  } else if (nEfetivo <= 1) {
    base = peso.pesoMax;
  } else {
    base = Math.round(1 + ((peso.pesoMax - 1) * (nEfetivo - resultado.posicao)) / (nEfetivo - 1));
    if (resultado.posicao <= 3) {
      base += peso.bonusTop3[resultado.posicao - 1];
    }
  }

  let pontos = base;

  if (peso.permiteBonusCorrida) {
    if (!naoPontuaBase) {
      if (resultado.grid !== undefined) {
        pontos += resultado.grid - resultado.posicao; // +1 por posição ganha, -1 por perdida
      }
      if (resultado.voltaMaisRapida) pontos += 5;
      if (resultado.aFrenteDoCompanheiro) pontos += 3;
    }
    if (resultado.penalidadeTempoOuGrid) pontos -= 5;
  }

  if (resultado.dnf) pontos -= peso.penalidadeDnf;
  if (desclassificou) pontos -= 15;

  return pontos;
}

/**
 * Soma os pontos de todas as sessões que aconteceram naquele GP pra um piloto.
 *
 * Só inclua em `resultados` as sessões que de fato ocorreram (num fds sem
 * sprint não existe ClassificacaoSprint nem CorridaSprint; num fds com
 * sprint normalmente não existe TL2/TL3) — o endpoint /sessions da OpenF1
 * já informa quais sessões existiram naquele meeting_key.
 */
export function calcularPontuacaoFimDeSemana(resultados: ResultadoSessao[], nPilotos: number = N_PILOTOS_GRID): number {
  return resultados.reduce((soma, r) => soma + calcularPontosSessao(r, nPilotos), 0);
}

/** Atalho pra calcular a pontuação do fim de semana de vários pilotos de uma vez. */
export function calcularPontuacaoPilotosFds(
  resultadosPorPiloto: Record<string, ResultadoSessao[]>,
  nPilotos: number = N_PILOTOS_GRID,
): Record<string, number> {
  const saida: Record<string, number> = {};
  for (const [pilotoId, resultados] of Object.entries(resultadosPorPiloto)) {
    saida[pilotoId] = calcularPontuacaoFimDeSemana(resultados, nPilotos);
  }
  return saida;
}

// ---------------------------------------------------------------------------
// 2. PONTUAÇÃO — CONSTRUTORA E CHEFE DE EQUIPE
//    (derivadas da pontuação do fim de semana dos 2 pilotos da equipe)
// ---------------------------------------------------------------------------

export interface BonusConstrutora {
  doisCarrosTerminaram?: boolean;
  dobradinhaTop10?: boolean;
  pitStopMaisRapido?: boolean;
  pitStopAbaixo2_5s?: boolean;
  umCarroDnf?: boolean;
}

/** Pontuação da construtora = soma dos pontos (fds) dos 2 carros + bônus de equipe. */
export function calcularPontosConstrutora(pontosPilotoA: number, pontosPilotoB: number, bonus: BonusConstrutora): number {
  let pontos = pontosPilotoA + pontosPilotoB;
  if (bonus.doisCarrosTerminaram) pontos += 5;
  if (bonus.dobradinhaTop10) pontos += 5;
  if (bonus.pitStopMaisRapido) pontos += 5;
  if (bonus.pitStopAbaixo2_5s) pontos += 2;
  if (bonus.umCarroDnf) pontos -= 5;
  return pontos;
}

export interface BonusChefeDeEquipe {
  semPenalidadesInvestigacoes?: boolean;
  /** corrida vs. classificação, média dos 2 carros (pode ser negativo) */
  posicoesGanhasMedia?: number;
  /** nº de paradas abaixo de 4s no fds */
  pitStopsRapidos?: number;
  carroNoPodio?: boolean;
}

/** Pontuação do chefe = média dos pontos (fds) dos 2 pilotos + bônus de gestão. */
export function calcularPontosChefeDeEquipe(pontosPilotoA: number, pontosPilotoB: number, bonus: BonusChefeDeEquipe): number {
  let pontos = Math.round((pontosPilotoA + pontosPilotoB) / 2);
  if (bonus.semPenalidadesInvestigacoes) pontos += 5;
  pontos += (bonus.posicoesGanhasMedia ?? 0) * 1;
  pontos += (bonus.pitStopsRapidos ?? 0) * 3;
  if (bonus.carroNoPodio) pontos += 5;
  return pontos;
}

// ---------------------------------------------------------------------------
// 3. PRECIFICAÇÃO DINÂMICA
//    preço = base pela posição no campeonato  +  ajuste pelo desempenho recente
// ---------------------------------------------------------------------------

export interface FaixaDePreco {
  minimo: number;
  maximo: number;
}

export const FAIXAS = {
  piloto: { minimo: 9.0, maximo: 35.0 },
  construtora: { minimo: 8.0, maximo: 35.0 },
  chefeDeEquipe: { minimo: 4.0, maximo: 20.0 },
} as const satisfies Record<string, FaixaDePreco>;

export type CategoriaFantasy = keyof typeof FAIXAS;

export const MULTIPLICADOR_AJUSTE = 0.15; // $M por ponto de diferença entre o esperado e o realizado
export const TETO_AJUSTE_SEMANAL = 2.0;   // variação máxima (pra cima ou pra baixo) por GP
export const PESO_SUAVIZACAO = 0.3;       // peso do preço novo sobre o preço anterior (0 a 1)

function clamp(valor: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(maximo, valor));
}

/** Preço-base de acordo com a posição no campeonato (1º = teto, último = piso). */
export function precoBasePorClassificacao(posicaoCampeonato: number, nTotal: number, faixa: FaixaDePreco): number {
  if (nTotal <= 1) return faixa.maximo;
  const passo = (faixa.maximo - faixa.minimo) / (nTotal - 1);
  return faixa.maximo - (posicaoCampeonato - 1) * passo;
}

/** Quantos pontos ele "deveria" fazer, de acordo com a posição no campeonato. */
export function pontosEsperados(posicaoCampeonato: number, nTotal: number): number {
  return nTotal - posicaoCampeonato + 1;
}

/**
 * Recalcula o preço depois de um fim de semana de corrida.
 *
 * Uso aqui a pontuação TOTAL do fim de semana (já inclui a Corrida dentro
 * dela) como sinal de desempenho recente. Se preferirem basear o ajuste só
 * na Corrida isoladamente, é só passar os pontos da Corrida no lugar de
 * pontosDoFimDeSemana.
 */
export function calcularNovoPreco(
  precoAnterior: number,
  posicaoCampeonato: number,
  nTotal: number,
  pontosDoFimDeSemana: number,
  categoria: CategoriaFantasy,
): number {
  const faixa = FAIXAS[categoria];
  const base = precoBasePorClassificacao(posicaoCampeonato, nTotal, faixa);
  const esperado = pontosEsperados(posicaoCampeonato, nTotal);
  const ajuste = clamp(
    (pontosDoFimDeSemana - esperado) * MULTIPLICADOR_AJUSTE,
    -TETO_AJUSTE_SEMANAL,
    TETO_AJUSTE_SEMANAL,
  );

  const precoDaSemana = clamp(base + ajuste, faixa.minimo, faixa.maximo);
  const precoFinal = (1 - PESO_SUAVIZACAO) * precoAnterior + PESO_SUAVIZACAO * precoDaSemana;
  return Math.round(clamp(precoFinal, faixa.minimo, faixa.maximo) * 10) / 10;
}

// ---------------------------------------------------------------------------
// 4. ORÇAMENTO E COMPOSIÇÃO DO TIME
// ---------------------------------------------------------------------------

export const ORCAMENTO_TOTAL = 100.0; // $M

/** As 4 escolhas que formam uma equipe de Fantasy. */
export interface EscolhaFantasy {
  pilotoAId: string;
  precoPilotoA: number;
  pilotoBId: string;
  precoPilotoB: number;
  construtoraId: string;
  precoConstrutora: number;
  chefeDeEquipeId: string;
  precoChefeDeEquipe: number;
}

export interface ResultadoValidacao {
  valido: boolean;
  erros: string[];
  orcamentoUtilizado: number;
  orcamentoRestante: number;
}

/** Confere se os 4 slots da equipe (2 pilotos distintos + 1 construtora + 1 chefe) estão preenchidos. */
function validarComposicao(escolha: EscolhaFantasy): string[] {
  const erros: string[] = [];
  if (!escolha.pilotoAId) erros.push('Falta escolher o 1º piloto.');
  if (!escolha.pilotoBId) erros.push('Falta escolher o 2º piloto.');
  if (escolha.pilotoAId && escolha.pilotoBId && escolha.pilotoAId === escolha.pilotoBId) {
    erros.push('Os dois pilotos precisam ser diferentes.');
  }
  if (!escolha.construtoraId) erros.push('Falta escolher a construtora.');
  if (!escolha.chefeDeEquipeId) erros.push('Falta escolher o chefe de equipe.');
  return erros;
}

/** Confere se a soma dos 4 preços cabe no orçamento. */
function validarOrcamento(
  escolha: EscolhaFantasy,
  orcamentoTotal: number,
): { erros: string[]; orcamentoUtilizado: number; orcamentoRestante: number } {
  const orcamentoUtilizado =
    (escolha.precoPilotoA || 0) +
    (escolha.precoPilotoB || 0) +
    (escolha.precoConstrutora || 0) +
    (escolha.precoChefeDeEquipe || 0);
  const orcamentoRestante = orcamentoTotal - orcamentoUtilizado;

  const erros: string[] = [];
  if (orcamentoUtilizado > orcamentoTotal) {
    erros.push(
      `Orçamento estourado: $${orcamentoUtilizado.toFixed(1)}M de $${orcamentoTotal.toFixed(1)}M ` +
        `(excedeu em $${(orcamentoUtilizado - orcamentoTotal).toFixed(1)}M).`,
    );
  }

  return {
    erros,
    orcamentoUtilizado: Math.round(orcamentoUtilizado * 10) / 10,
    orcamentoRestante: Math.round(orcamentoRestante * 10) / 10,
  };
}

// ---------------------------------------------------------------------------
// 5. JANELA DE MERCADO
//    O time só pode ser montado/alterado a partir do dia seguinte à corrida
//    anterior, até 1h antes do Treino Livre 1 do próximo fim de semana.
// ---------------------------------------------------------------------------

export interface JanelaDeMercado {
  abreEm: Date; // dia seguinte à corrida anterior, 00:00
  fechaEm: Date; // 1h antes do Treino Livre 1 do próximo GP
}

/**
 * Calcula a janela em que o time pode ser montado/alterado.
 *
 * @param dataHoraCorridaAnterior horário de largada (ou término) da última Corrida
 * @param dataHoraTreinoLivre1Proximo horário do Treino Livre 1 do próximo GP
 */
export function calcularJanelaDeMercado(
  dataHoraCorridaAnterior: Date,
  dataHoraTreinoLivre1Proximo: Date,
): JanelaDeMercado {
  const abreEm = new Date(dataHoraCorridaAnterior);
  abreEm.setDate(abreEm.getDate() + 1);
  abreEm.setHours(0, 0, 0, 0);

  const fechaEm = new Date(dataHoraTreinoLivre1Proximo.getTime() - 60 * 60 * 1000); // 1h antes do TL1

  return { abreEm, fechaEm };
}

/** Diz se o mercado está aberto num instante (por padrão, agora). */
export function mercadoEstaAberto(janela: JanelaDeMercado, agora: Date = new Date()): boolean {
  return agora >= janela.abreEm && agora <= janela.fechaEm;
}

/** Mensagem amigável pra mostrar na tela quando o mercado estiver fechado. */
export function mensagemJanelaDeMercado(janela: JanelaDeMercado, agora: Date = new Date()): string {
  if (agora < janela.abreEm) {
    return `O mercado abre em ${janela.abreEm.toLocaleString('pt-BR')}, no dia seguinte à última corrida.`;
  }
  if (agora > janela.fechaEm) {
    return `O mercado fechou em ${janela.fechaEm.toLocaleString('pt-BR')}, 1h antes do Treino Livre 1.`;
  }
  return 'Mercado aberto — dá pra montar ou alterar sua equipe.';
}

// ---------------------------------------------------------------------------
// Validação completa — composição + orçamento + janela de mercado
// ---------------------------------------------------------------------------

export interface ValidarEquipeOpcoes {
  orcamentoTotal?: number;
  /** se informada, também valida se o mercado está aberto nesse instante */
  janela?: JanelaDeMercado;
  agora?: Date;
}

export function validarEquipe(escolha: EscolhaFantasy, opcoes: ValidarEquipeOpcoes = {}): ResultadoValidacao {
  const orcamentoTotal = opcoes.orcamentoTotal ?? ORCAMENTO_TOTAL;

  const errosComposicao = validarComposicao(escolha);
  const { erros: errosOrcamento, orcamentoUtilizado, orcamentoRestante } = validarOrcamento(escolha, orcamentoTotal);

  const erros = [...errosComposicao, ...errosOrcamento];

  if (opcoes.janela && !mercadoEstaAberto(opcoes.janela, opcoes.agora)) {
    erros.push(mensagemJanelaDeMercado(opcoes.janela, opcoes.agora));
  }

  return { valido: erros.length === 0, erros, orcamentoUtilizado, orcamentoRestante };
}

// ---------------------------------------------------------------------------
// Exemplo de uso — comentado, só pra referência de como chamar as funções
// ---------------------------------------------------------------------------
//
// const resultadosBortoleto: ResultadoSessao[] = [
//   { sessao: SessaoTipo.TreinoLivre, posicao: 4 },
//   { sessao: SessaoTipo.TreinoLivre, posicao: 6 },
//   { sessao: SessaoTipo.TreinoLivre, posicao: 3 },
//   { sessao: SessaoTipo.Classificacao, posicao: 9 },
//   { sessao: SessaoTipo.Corrida, posicao: 5, grid: 9, aFrenteDoCompanheiro: true },
// ];
// const totalFds = calcularPontuacaoFimDeSemana(resultadosBortoleto); // 37
//
// const novoPreco = calcularNovoPreco(18.0, 8, 20, totalFds, 'piloto'); // 19.3
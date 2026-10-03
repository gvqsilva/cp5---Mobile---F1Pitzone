export const money = (n: number) => `$${n.toFixed(1)}M`;
export const pts = (n: number) => `${n.toLocaleString('pt-BR')} pts`;

const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export function raceWeekendDates(raceDate: string) {
  const end = new Date(`${raceDate}T12:00:00`);
  const start = new Date(end);
  start.setDate(end.getDate() - 2);

  const pad = (day: number) => String(day).padStart(2, '0');
  return `${pad(start.getDate())} - ${pad(end.getDate())} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
}

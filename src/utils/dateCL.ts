import type {DayOfWeek} from '../types/classtime';

export const DAYS_OF_WEEK: {id: DayOfWeek; label: string; shortLabel: string}[] = [
  {id: 'lunes', label: 'Lunes', shortLabel: 'Lun'},
  {id: 'martes', label: 'Martes', shortLabel: 'Mar'},
  {id: 'miercoles', label: 'Miércoles', shortLabel: 'Mié'},
  {id: 'jueves', label: 'Jueves', shortLabel: 'Jue'},
  {id: 'viernes', label: 'Viernes', shortLabel: 'Vie'},
];

const WEEKDAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

const MONTH_NAMES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const SHORT_MONTH_NAMES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

export function toLocalISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  return toLocalISODate(new Date());
}

export function addDaysISO(baseDate: Date, offsetDays: number): string {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + offsetDays);
  return toLocalISODate(d);
}

export function parseISODateLocal(isoDate: string): Date | null {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function formatCurrentDateCL(date: Date = new Date()): string {
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday} ${day} de ${month} de ${year}`;
}

export function formatShortDateCL(isoDate: string): string {
  const d = parseISODateLocal(isoDate);
  if (!d) return isoDate;
  return `${d.getDate()} ${SHORT_MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatCompactDateCL(isoDate: string): string {
  const d = parseISODateLocal(isoDate);
  if (!d) return isoDate;
  const weekday = WEEKDAY_NAMES[d.getDay()].slice(0, 3);
  return `${weekday} ${d.getDate()} ${SHORT_MONTH_NAMES[d.getMonth()]}`;
}

export function getGreetingCL(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Buenos días';
  if (hour >= 12 && hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export function getDayDiffFromToday(isoDate: string): number {
  const target = parseISODateLocal(isoDate);
  if (!target) return 0;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function isTaskOverdue(dueDate: string, completed: boolean): boolean {
  if (completed) return false;
  return getDayDiffFromToday(dueDate) < 0;
}

export function formatRelativeDayCL(isoDate: string): string {
  const diff = getDayDiffFromToday(isoDate);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff === -1) return 'Ayer';
  if (diff < -1) return `Hace ${Math.abs(diff)} días`;
  return `En ${diff} días`;
}

export function getCurrentWeekdayCL(date: Date = new Date()): DayOfWeek | null {
  const map: Record<number, DayOfWeek> = {
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes',
  };
  return map[date.getDay()] ?? null;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

export function isCurrentTimeBetween(
  startTime: string,
  endTime: string,
  now: Date = new Date()
): boolean {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= timeToMinutes(startTime) && currentMinutes < timeToMinutes(endTime);
}

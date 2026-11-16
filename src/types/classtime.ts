export type SectionId =
  | 'inicio'
  | 'horario'
  | 'asignaturas'
  | 'tareas'
  | 'evaluaciones'
  | 'configuracion';

export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

export type EvaluationType = 'prueba' | 'control' | 'trabajo';

export type ThemeMode = 'light' | 'dark';

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  room: string;
  color: string;
}

export interface ScheduleBlock {
  id: string;
  subjectId: string;
  day: DayOfWeek;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  room: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
}

export interface Evaluation {
  id: string;
  title: string;
  type: EvaluationType;
  subjectId: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export interface StudentSettings {
  studentName: string;
  institution: string;
  academicYear: string;
  theme: ThemeMode;
}

export interface ClassTimeData {
  subjects: Subject[];
  schedule: ScheduleBlock[];
  tasks: Task[];
  evaluations: Evaluation[];
  settings: StudentSettings;
}

export type ActiveModal =
  | { type: 'subject'; item?: Subject }
  | { type: 'schedule'; item?: ScheduleBlock; defaultDay?: DayOfWeek }
  | { type: 'task'; item?: Task }
  | { type: 'evaluation'; item?: Evaluation }
  | null;

export interface ToastMessage {
  id: string;
  text: string;
  tone: 'success' | 'info' | 'error';
}

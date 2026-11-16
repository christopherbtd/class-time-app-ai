import type {ClassTimeData, StudentSettings} from '../types/classtime';
import {addDaysISO} from './dateCL';

export const STORAGE_KEY = 'classtime_data_v1';

export const SUBJECT_COLORS: {label: string; hex: string}[] = [
  {label: 'Azul Académico', hex: '#4778E8'},
  {label: 'Esmeralda', hex: '#10B981'},
  {label: 'Ámbar', hex: '#F59E0B'},
  {label: 'Coral', hex: '#EF4444'},
  {label: 'Índigo', hex: '#6366F1'},
  {label: 'Turquesa', hex: '#06B6D4'},
  {label: 'Violeta', hex: '#8B5CF6'},
  {label: 'Rosa', hex: '#EC4899'},
  {label: 'Pizarra', hex: '#475569'},
];

export const DEFAULT_SETTINGS: StudentSettings = {
  studentName: 'Martín Valenzuela',
  institution: 'Liceo Bicentenario',
  academicYear: String(new Date().getFullYear()),
  theme: 'light',
};

export function createEmptyData(settings: StudentSettings = DEFAULT_SETTINGS): ClassTimeData {
  return {
    subjects: [],
    schedule: [],
    tasks: [],
    evaluations: [],
    settings,
  };
}

export function createDemoData(): ClassTimeData {
  const now = new Date();
  return {
    settings: {...DEFAULT_SETTINGS},
    subjects: [
      {
        id: 'subj-mat',
        name: 'Matemática',
        teacher: 'Prof. Carolina Méndez',
        room: 'Sala 204',
        color: '#4778E8',
      },
      {
        id: 'subj-len',
        name: 'Lenguaje y Literatura',
        teacher: 'Prof. Rodrigo Fuentes',
        room: 'Sala 108',
        color: '#F59E0B',
      },
      {
        id: 'subj-bio',
        name: 'Biología Celular',
        teacher: 'Prof. Andrea Soto',
        room: 'Laboratorio 2',
        color: '#10B981',
      },
      {
        id: 'subj-his',
        name: 'Historia y Ciencias Sociales',
        teacher: 'Prof. Sebastián Lagos',
        room: 'Sala 301',
        color: '#8B5CF6',
      },
      {
        id: 'subj-ing',
        name: 'Inglés',
        teacher: 'Prof. Daniela Rojas',
        room: 'Sala 112',
        color: '#06B6D4',
      },
    ],
    schedule: [
      {
        id: 'sch-1',
        subjectId: 'subj-mat',
        day: 'lunes',
        startTime: '08:30',
        endTime: '10:00',
        room: 'Sala 204',
      },
      {
        id: 'sch-2',
        subjectId: 'subj-len',
        day: 'lunes',
        startTime: '10:15',
        endTime: '11:45',
        room: 'Sala 108',
      },
      {
        id: 'sch-3',
        subjectId: 'subj-bio',
        day: 'lunes',
        startTime: '14:00',
        endTime: '15:30',
        room: 'Laboratorio 2',
      },
      {
        id: 'sch-4',
        subjectId: 'subj-his',
        day: 'martes',
        startTime: '08:30',
        endTime: '10:00',
        room: 'Sala 301',
      },
      {
        id: 'sch-5',
        subjectId: 'subj-ing',
        day: 'martes',
        startTime: '10:15',
        endTime: '11:45',
        room: 'Sala 112',
      },
      {
        id: 'sch-6',
        subjectId: 'subj-mat',
        day: 'miercoles',
        startTime: '08:30',
        endTime: '10:00',
        room: 'Sala 204',
      },
      {
        id: 'sch-7',
        subjectId: 'subj-bio',
        day: 'miercoles',
        startTime: '11:00',
        endTime: '12:30',
        room: 'Laboratorio 2',
      },
      {
        id: 'sch-8',
        subjectId: 'subj-len',
        day: 'jueves',
        startTime: '09:00',
        endTime: '10:30',
        room: 'Sala 108',
      },
      {
        id: 'sch-9',
        subjectId: 'subj-his',
        day: 'jueves',
        startTime: '11:00',
        endTime: '12:30',
        room: 'Sala 301',
      },
      {
        id: 'sch-10',
        subjectId: 'subj-ing',
        day: 'viernes',
        startTime: '08:30',
        endTime: '10:00',
        room: 'Sala 112',
      },
      {
        id: 'sch-11',
        subjectId: 'subj-mat',
        day: 'viernes',
        startTime: '10:15',
        endTime: '11:45',
        room: 'Sala 204',
      },
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Guía de ejercicios: Funciones cuadráticas',
        description: 'Resolver los problemas del 1 al 12 del cuadernillo de álgebra.',
        subjectId: 'subj-mat',
        dueDate: addDaysISO(now, 1),
        completed: false,
        createdAt: addDaysISO(now, -3),
      },
      {
        id: 'task-2',
        title: 'Resumen capítulo 4: Mitosis y Meiosis',
        description: 'Elaborar mapa conceptual con las fases de división celular.',
        subjectId: 'subj-bio',
        dueDate: addDaysISO(now, -1),
        completed: false,
        createdAt: addDaysISO(now, -5),
      },
      {
        id: 'task-3',
        title: 'Ensayo breve sobre literatura contemporánea',
        description: 'Extensión de 2 planas en formato carta con citas bibliográficas.',
        subjectId: 'subj-len',
        dueDate: addDaysISO(now, 4),
        completed: false,
        createdAt: addDaysISO(now, -2),
      },
      {
        id: 'task-4',
        title: 'Cuestionario de vocabulario Unidad 3',
        description: 'Completar la ficha interactiva y revisar pronunciación.',
        subjectId: 'subj-ing',
        dueDate: addDaysISO(now, -2),
        completed: true,
        createdAt: addDaysISO(now, -6),
      },
    ],
    evaluations: [
      {
        id: 'eval-1',
        title: 'Prueba de Unidad: Funciones y Gráficos',
        type: 'prueba',
        subjectId: 'subj-mat',
        date: addDaysISO(now, 3),
        description: 'Entra función lineal, afín, cuadrática y resolución de problemas.',
      },
      {
        id: 'eval-2',
        title: 'Control de Lectura: La Amortajada',
        type: 'control',
        subjectId: 'subj-len',
        date: addDaysISO(now, 6),
        description: 'Evaluación de comprensión lectora y análisis de personajes.',
      },
      {
        id: 'eval-3',
        title: 'Trabajo de Investigación: Chile en el Siglo XX',
        type: 'trabajo',
        subjectId: 'subj-his',
        date: addDaysISO(now, 10),
        description: 'Informe escrito y exposición grupal de 10 minutos.',
      },
    ],
  };
}

export function isValidClassTimeData(raw: unknown): raw is ClassTimeData {
  if (!raw || typeof raw !== 'object') return false;
  const obj = raw as Record<string, unknown>;
  return (
    Array.isArray(obj.subjects) &&
    Array.isArray(obj.schedule) &&
    Array.isArray(obj.tasks) &&
    Array.isArray(obj.evaluations) &&
    !!obj.settings &&
    typeof obj.settings === 'object'
  );
}

export function loadFromStorage(): ClassTimeData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const demo = createDemoData();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      return demo;
    }
    const parsed: unknown = JSON.parse(raw);
    if (isValidClassTimeData(parsed)) {
      return parsed;
    }
  } catch {
    // Fallback if localStorage is corrupted or inaccessible
  }
  return createDemoData();
}

export function saveToStorage(data: ClassTimeData): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

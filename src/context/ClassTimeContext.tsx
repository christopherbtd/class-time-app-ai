import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type {
  ActiveModal,
  ClassTimeData,
  Evaluation,
  ScheduleBlock,
  SectionId,
  StudentSettings,
  Subject,
  Task,
  ToastMessage,
} from '../types/classtime';
import {
  createDemoData,
  createEmptyData,
  generateId,
  isValidClassTimeData,
  loadFromStorage,
  saveToStorage,
} from '../utils/storage';

interface ClassTimeContextValue {
  data: ClassTimeData;
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  activeModal: ActiveModal;
  setActiveModal: (modal: ActiveModal) => void;
  settingsDraft: StudentSettings;
  hasUnsavedSettings: boolean;
  updateSettingsDraft: (patch: Partial<StudentSettings>) => void;
  commitSettings: () => boolean;
  discardSettingsDraft: () => void;
  getSubjectById: (id: string) => Subject | undefined;
  saveSubject: (input: Omit<Subject, 'id'>, existingId?: string) => void;
  deleteSubject: (id: string) => void;
  saveScheduleBlock: (input: Omit<ScheduleBlock, 'id'>, existingId?: string) => void;
  deleteScheduleBlock: (id: string) => void;
  saveTask: (input: Omit<Task, 'id' | 'createdAt' | 'completed'>, existingId?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  saveEvaluation: (input: Omit<Evaluation, 'id'>, existingId?: string) => void;
  deleteEvaluation: (id: string) => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonText: string) => boolean;
  resetAllData: () => void;
  loadDemoData: () => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  addToast: (text: string, tone?: ToastMessage['tone']) => void;
}

const ClassTimeContext = createContext<ClassTimeContextValue | null>(null);

export const ClassTimeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [data, setData] = useState<ClassTimeData>(() => loadFromStorage());
  const [activeSection, setActiveSection] = useState<SectionId>('inicio');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [settingsDraft, setSettingsDraft] = useState<StudentSettings>(() => data.settings);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, tone: ToastMessage['tone'] = 'success') => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, {id, text, tone}]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const persistData = useCallback(
    (next: ClassTimeData, successMessage?: string) => {
      setData(next);
      const ok = saveToStorage(next);
      if (ok && successMessage) {
        addToast(successMessage, 'success');
      } else if (!ok) {
        addToast('No se pudo guardar en el almacenamiento local del navegador.', 'error');
      }
      return ok;
    },
    [addToast]
  );

  // Apply theme preview based on settingsDraft (reverts automatically if user cancels settings)
  const previewTheme = activeSection === 'configuracion' ? settingsDraft.theme : data.settings.theme;

  useEffect(() => {
    const root = document.documentElement;
    if (previewTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', previewTheme === 'dark' ? '#0F172A' : '#4778E8');
    }
  }, [previewTheme]);

  const hasUnsavedSettings = useMemo(() => {
    return (
      settingsDraft.studentName !== data.settings.studentName ||
      settingsDraft.institution !== data.settings.institution ||
      settingsDraft.academicYear !== data.settings.academicYear ||
      settingsDraft.theme !== data.settings.theme
    );
  }, [settingsDraft, data.settings]);

  const updateSettingsDraft = useCallback((patch: Partial<StudentSettings>) => {
    setSettingsDraft((prev) => ({...prev, ...patch}));
  }, []);

  const commitSettings = useCallback(() => {
    const trimmedName = settingsDraft.studentName.trim();
    const trimmedInstitution = settingsDraft.institution.trim();
    const trimmedYear = settingsDraft.academicYear.trim();

    if (!trimmedName || !trimmedInstitution || !trimmedYear) {
      addToast('Completa todos los campos de configuración antes de guardar.', 'error');
      return false;
    }

    const cleanedSettings: StudentSettings = {
      studentName: trimmedName,
      institution: trimmedInstitution,
      academicYear: trimmedYear,
      theme: settingsDraft.theme,
    };

    setSettingsDraft(cleanedSettings);
    persistData({...data, settings: cleanedSettings}, 'Configuración guardada correctamente.');
    return true;
  }, [settingsDraft, data, persistData, addToast]);

  const discardSettingsDraft = useCallback(() => {
    setSettingsDraft(data.settings);
    addToast('Cambios descartados sin guardar.', 'info');
  }, [data.settings, addToast]);

  const getSubjectById = useCallback(
    (id: string) => data.subjects.find((s) => s.id === id),
    [data.subjects]
  );

  const saveSubject = useCallback(
    (input: Omit<Subject, 'id'>, existingId?: string) => {
      const nextSubjects = existingId
        ? data.subjects.map((s) => (s.id === existingId ? {...input, id: existingId} : s))
        : [...data.subjects, {...input, id: generateId('subj')}];

      persistData(
        {...data, subjects: nextSubjects},
        existingId ? 'Asignatura actualizada.' : 'Asignatura guardada.'
      );
    },
    [data, persistData]
  );

  const deleteSubject = useCallback(
    (id: string) => {
      const next: ClassTimeData = {
        ...data,
        subjects: data.subjects.filter((s) => s.id !== id),
        schedule: data.schedule.filter((b) => b.subjectId !== id),
        tasks: data.tasks.filter((t) => t.subjectId !== id),
        evaluations: data.evaluations.filter((e) => e.subjectId !== id),
      };
      persistData(next, 'Asignatura eliminada.');
    },
    [data, persistData]
  );

  const saveScheduleBlock = useCallback(
    (input: Omit<ScheduleBlock, 'id'>, existingId?: string) => {
      const nextSchedule = existingId
        ? data.schedule.map((b) => (b.id === existingId ? {...input, id: existingId} : b))
        : [...data.schedule, {...input, id: generateId('sch')}];

      persistData(
        {...data, schedule: nextSchedule},
        existingId ? 'Clase actualizada en el horario.' : 'Clase agregada al horario.'
      );
    },
    [data, persistData]
  );

  const deleteScheduleBlock = useCallback(
    (id: string) => {
      persistData(
        {...data, schedule: data.schedule.filter((b) => b.id !== id)},
        'Clase eliminada del horario.'
      );
    },
    [data, persistData]
  );

  const saveTask = useCallback(
    (input: Omit<Task, 'id' | 'createdAt' | 'completed'>, existingId?: string) => {
      const nextTasks = existingId
        ? data.tasks.map((t) => (t.id === existingId ? {...t, ...input} : t))
        : [
            ...data.tasks,
            {
              ...input,
              id: generateId('task'),
              completed: false,
              createdAt: new Date().toISOString().slice(0, 10),
            },
          ];

      persistData(
        {...data, tasks: nextTasks},
        existingId ? 'Tarea actualizada.' : 'Tarea guardada.'
      );
    },
    [data, persistData]
  );

  const toggleTask = useCallback(
    (id: string) => {
      const nextTasks = data.tasks.map((t) =>
        t.id === id ? {...t, completed: !t.completed} : t
      );
      const target = nextTasks.find((t) => t.id === id);
      persistData(
        {...data, tasks: nextTasks},
        target?.completed ? 'Tarea marcada como completada.' : 'Tarea marcada como pendiente.'
      );
    },
    [data, persistData]
  );

  const deleteTask = useCallback(
    (id: string) => {
      persistData({...data, tasks: data.tasks.filter((t) => t.id !== id)}, 'Tarea eliminada.');
    },
    [data, persistData]
  );

  const saveEvaluation = useCallback(
    (input: Omit<Evaluation, 'id'>, existingId?: string) => {
      const nextEvaluations = existingId
        ? data.evaluations.map((ev) => (ev.id === existingId ? {...input, id: existingId} : ev))
        : [...data.evaluations, {...input, id: generateId('eval')}];

      persistData(
        {...data, evaluations: nextEvaluations},
        existingId ? 'Evaluación actualizada.' : 'Evaluación guardada.'
      );
    },
    [data, persistData]
  );

  const deleteEvaluation = useCallback(
    (id: string) => {
      persistData(
        {...data, evaluations: data.evaluations.filter((ev) => ev.id !== id)},
        'Evaluación eliminada.'
      );
    },
    [data, persistData]
  );

  const exportDataJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `classtime-respaldo-${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Respaldo descargado en formato JSON.', 'success');
  }, [data, addToast]);

  const importDataJSON = useCallback(
    (jsonText: string) => {
      try {
        const parsed: unknown = JSON.parse(jsonText);
        if (!isValidClassTimeData(parsed)) {
          addToast('El archivo no tiene un formato válido de ClassTime.', 'error');
          return false;
        }
        setSettingsDraft(parsed.settings);
        persistData(parsed, 'Datos importados y guardados correctamente.');
        return true;
      } catch {
        addToast('Error al leer el archivo JSON seleccionado.', 'error');
        return false;
      }
    },
    [persistData, addToast]
  );

  const resetAllData = useCallback(() => {
    const empty = createEmptyData(data.settings);
    persistData(empty, 'Se han eliminado tus asignaturas, clases, tareas y evaluaciones.');
  }, [data.settings, persistData]);

  const loadDemoData = useCallback(() => {
    const demo = createDemoData();
    const preserved = {...demo, settings: data.settings};
    persistData(preserved, 'Datos de ejemplo cargados correctamente.');
  }, [data.settings, persistData]);

  const value: ClassTimeContextValue = {
    data,
    activeSection,
    setActiveSection,
    activeModal,
    setActiveModal,
    settingsDraft,
    hasUnsavedSettings,
    updateSettingsDraft,
    commitSettings,
    discardSettingsDraft,
    getSubjectById,
    saveSubject,
    deleteSubject,
    saveScheduleBlock,
    deleteScheduleBlock,
    saveTask,
    toggleTask,
    deleteTask,
    saveEvaluation,
    deleteEvaluation,
    exportDataJSON,
    importDataJSON,
    resetAllData,
    loadDemoData,
    toasts,
    dismissToast,
    addToast,
  };

  return <ClassTimeContext.Provider value={value}>{children}</ClassTimeContext.Provider>;
};

export function useClassTime() {
  const ctx = useContext(ClassTimeContext);
  if (!ctx) throw new Error('useClassTime debe usarse dentro de ClassTimeProvider');
  return ctx;
}

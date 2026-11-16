import React, {useMemo, useState} from 'react';
import {BookOpen, MapPin, Pencil, Plus, Search, Trash2, User} from 'lucide-react';
import {ConfirmModal} from '../components/ui/ConfirmModal';
import {useClassTime} from '../context/ClassTimeContext';
import type {Subject} from '../types/classtime';

export const AsignaturasPage: React.FC = () => {
  const {data, setActiveModal, deleteSubject} = useClassTime();
  const [query, setQuery] = useState('');
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  const filteredSubjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.subjects;
    return data.subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.teacher.toLowerCase().includes(q) ||
        s.room.toLowerCase().includes(q)
    );
  }, [data.subjects, query]);

  const getSubjectStats = (subjectId: string) => {
    const classCount = data.schedule.filter((b) => b.subjectId === subjectId).length;
    const pendingTaskCount = data.tasks.filter(
      (t) => t.subjectId === subjectId && !t.completed
    ).length;
    const evalCount = data.evaluations.filter((e) => e.subjectId === subjectId).length;
    return {classCount, pendingTaskCount, evalCount};
  };

  const getDeleteMessage = (subject: Subject) => {
    const stats = getSubjectStats(subject.id);
    const totalLinked = stats.classCount + stats.pendingTaskCount + stats.evalCount;
    if (totalLinked === 0) {
      return `¿Estás seguro de eliminar la asignatura «${subject.name}»?`;
    }
    return `¿Estás seguro de eliminar «${subject.name}»? También se eliminarán sus clases del horario, tareas y evaluaciones asociadas.`;
  };

  return (
    <div className="space-y-6">
      {data.subjects.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por asignatura, profesor o sala..."
              className="input-field w-full pl-10"
              aria-label="Buscar asignaturas"
            />
          </div>

          <p className="text-sm text-[#475569] dark:text-slate-400 tabular-nums">
            {filteredSubjects.length} {filteredSubjects.length === 1 ? 'asignatura' : 'asignaturas'}
          </p>
        </div>
      )}

      {data.subjects.length === 0 ? (
        <div className="card-surface rounded-2xl p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#4778E8]/10 text-[#4778E8] flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#1E293B] dark:text-slate-100">
            Aún no tienes asignaturas registradas
          </h2>
          <p className="mt-1.5 text-sm text-[#475569] dark:text-slate-400 max-w-md mx-auto">
            Agrega tus ramos con su profesor, sala y color identificador para asociarlos a tu
            horario, tareas y evaluaciones.
          </p>
          <button
            type="button"
            onClick={() => setActiveModal({type: 'subject'})}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4778E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar primera asignatura</span>
          </button>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="card-surface rounded-2xl p-8 text-center">
          <p className="text-sm text-[#475569] dark:text-slate-400">
            No se encontraron asignaturas que coincidan con «{query}».
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => {
            const {classCount, pendingTaskCount} = getSubjectStats(subject.id);
            return (
              <article
                key={subject.id}
                className="card-surface card-interactive rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-4 h-4 rounded-md shrink-0"
                        style={{backgroundColor: subject.color}}
                        aria-hidden="true"
                      />
                      <h2 className="text-base font-semibold text-[#1E293B] dark:text-slate-100 truncate">
                        {subject.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveModal({type: 'subject', item: subject})}
                        aria-label={`Editar ${subject.name}`}
                        className="p-2 rounded-lg text-[#475569] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 hover:text-[#1E293B] dark:hover:text-slate-100 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingSubject(subject)}
                        aria-label={`Eliminar ${subject.name}`}
                        className="p-2 rounded-lg text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-[#475569] dark:text-slate-300">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#94A3B8] shrink-0" />
                      <span className="truncate">{subject.teacher}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" />
                      <span className="truncate">{subject.room}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#F1F5F9] dark:border-slate-800 flex items-center gap-2 text-xs text-[#475569] dark:text-slate-400 tabular-nums">
                  <span>
                    {classCount} {classCount === 1 ? 'clase semanal' : 'clases semanales'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {pendingTaskCount}{' '}
                    {pendingTaskCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingSubject}
        title="Eliminar asignatura"
        message={deletingSubject ? getDeleteMessage(deletingSubject) : ''}
        onConfirm={() => {
          if (deletingSubject) {
            deleteSubject(deletingSubject.id);
            setDeletingSubject(null);
          }
        }}
        onCancel={() => setDeletingSubject(null)}
      />
    </div>
  );
};

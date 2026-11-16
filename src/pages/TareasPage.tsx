import React, {useMemo, useState} from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {ConfirmModal} from '../components/ui/ConfirmModal';
import {useClassTime} from '../context/ClassTimeContext';
import type {Task} from '../types/classtime';
import {
  formatRelativeDayCL,
  formatShortDateCL,
  getDayDiffFromToday,
  isTaskOverdue,
} from '../utils/dateCL';

type TaskFilter = 'todas' | 'pendientes' | 'vencidas' | 'completadas';

export const TareasPage: React.FC = () => {
  const {data, toggleTask, deleteTask, setActiveModal, getSubjectById} = useClassTime();

  const [statusFilter, setStatusFilter] = useState<TaskFilter>('todas');
  const [subjectFilter, setSubjectFilter] = useState<string>('todas');
  const [query, setQuery] = useState('');
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const counts = useMemo(() => {
    const pendientes = data.tasks.filter((t) => !t.completed).length;
    const vencidas = data.tasks.filter((t) => isTaskOverdue(t.dueDate, t.completed)).length;
    const completadas = data.tasks.filter((t) => t.completed).length;
    return {
      todas: data.tasks.length,
      pendientes,
      vencidas,
      completadas,
    };
  }, [data.tasks]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.tasks
      .filter((t) => {
        if (statusFilter === 'pendientes' && t.completed) return false;
        if (statusFilter === 'completadas' && !t.completed) return false;
        if (statusFilter === 'vencidas' && !isTaskOverdue(t.dueDate, t.completed)) return false;
        if (subjectFilter !== 'todas' && t.subjectId !== subjectFilter) return false;
        if (
          q &&
          !t.title.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [data.tasks, statusFilter, subjectFilter, query]);

  const filterTabs: {id: TaskFilter; label: string; count: number}[] = [
    {id: 'todas', label: 'Todas', count: counts.todas},
    {id: 'pendientes', label: 'Pendientes', count: counts.pendientes},
    {id: 'vencidas', label: 'Vencidas', count: counts.vencidas},
    {id: 'completadas', label: 'Completadas', count: counts.completadas},
  ];

  return (
    <div className="space-y-6">
      {data.tasks.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Segmented status tabs */}
          <div
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#E2E8F0]/70 dark:bg-slate-800"
            role="tablist"
            aria-label="Filtrar tareas por estado"
          >
            {filterTabs.map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white shadow-xs font-semibold'
                      : 'text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-1.5 text-xs opacity-70 tabular-nums">{tab.count}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Subject select */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar tarea..."
                className="input-field w-full pl-10"
                aria-label="Buscar tareas"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="input-field sm:w-48"
              aria-label="Filtrar por asignatura"
            >
              <option value="todas">Todas las asignaturas</option>
              {data.subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {data.tasks.length === 0 ? (
        <div className="card-surface rounded-2xl p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#4778E8]/10 text-[#4778E8] flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#1E293B] dark:text-slate-100">
            No tienes tareas registradas
          </h2>
          <p className="mt-1.5 text-sm text-[#475569] dark:text-slate-400 max-w-md mx-auto">
            Agrega tus tareas, guías o entregas con su fecha límite para mantener tus pendientes bajo
            control.
          </p>
          <button
            type="button"
            onClick={() => setActiveModal({type: 'task'})}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4778E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear primera tarea</span>
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card-surface rounded-2xl p-8 text-center">
          <p className="text-sm text-[#475569] dark:text-slate-400">
            No hay tareas que coincidan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="card-surface rounded-2xl overflow-hidden divide-y divide-[#F1F5F9] dark:divide-slate-800">
          {filteredTasks.map((task) => {
            const subject = getSubjectById(task.subjectId);
            const overdue = isTaskOverdue(task.dueDate, task.completed);
            const diff = getDayDiffFromToday(task.dueDate);

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                  overdue
                    ? 'bg-red-50/45 dark:bg-red-950/15'
                    : 'hover:bg-[#F7F8FC]/70 dark:hover:bg-slate-800/30'
                }`}
              >
                {/* 20x20px checkbox with 6px radius */}
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={
                    task.completed
                      ? `Marcar "${task.title}" como pendiente`
                      : `Marcar "${task.title}" como completada`
                  }
                  className={`mt-0.5 w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    task.completed
                      ? 'bg-[#10B981] border border-[#10B981]'
                      : 'border-[1.5px] border-[#CBD5E1] dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-[#10B981]'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3
                        className={`text-sm sm:text-base font-semibold ${
                          task.completed
                            ? 'line-through text-[#94A3B8]'
                            : 'text-[#1E293B] dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`mt-1 text-sm ${
                            task.completed
                              ? 'text-[#94A3B8]'
                              : 'text-[#475569] dark:text-slate-400'
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                      {/* Semantic status label (color + icon + text) */}
                      {task.completed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#047857] dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completada</span>
                        </span>
                      ) : overdue ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B91C1C] dark:text-red-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Vencida</span>
                        </span>
                      ) : diff === 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B45309] dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Para hoy</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B45309] dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pendiente</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveModal({type: 'task', item: task})}
                          aria-label={`Editar tarea "${task.title}"`}
                          className="p-2 rounded-lg text-[#475569] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 hover:text-[#1E293B] dark:hover:text-slate-100 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingTask(task)}
                          aria-label={`Eliminar tarea "${task.title}"`}
                          className="p-2 rounded-lg text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Clean unboxed metadata row */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-[#475569] dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#1E293B] dark:text-slate-200">
                      <span
                        className="w-2.5 h-2.5 rounded-xs"
                        style={{backgroundColor: subject?.color ?? '#4778E8'}}
                      />
                      <span>{subject?.name ?? 'Sin asignatura'}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">
                      Entrega: {formatShortDateCL(task.dueDate)}
                    </span>
                    {!task.completed && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className={overdue ? 'text-[#EF4444] font-semibold' : ''}>
                          {formatRelativeDayCL(task.dueDate)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingTask}
        title="Eliminar tarea"
        message={
          deletingTask
            ? `¿Estás seguro de eliminar la tarea «${deletingTask.title}»?`
            : ''
        }
        onConfirm={() => {
          if (deletingTask) {
            deleteTask(deletingTask.id);
            setDeletingTask(null);
          }
        }}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
};

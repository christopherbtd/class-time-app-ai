import React, {useMemo, useState} from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import {ConfirmModal} from '../components/ui/ConfirmModal';
import {useClassTime} from '../context/ClassTimeContext';
import type {Evaluation, EvaluationType} from '../types/classtime';
import {
  formatCompactDateCL,
  formatRelativeDayCL,
  getDayDiffFromToday,
  getTodayISO,
} from '../utils/dateCL';

type TypeFilter = 'todas' | EvaluationType;
type TimeFilter = 'proximas' | 'todas' | 'anteriores';

const EVAL_LABELS: Record<EvaluationType, string> = {
  prueba: 'Prueba',
  control: 'Control',
  trabajo: 'Trabajo',
};

export const EvaluacionesPage: React.FC = () => {
  const {data, deleteEvaluation, setActiveModal, getSubjectById} = useClassTime();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todas');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('proximas');
  const [subjectFilter, setSubjectFilter] = useState<string>('todas');
  const [deletingEval, setDeletingEval] = useState<Evaluation | null>(null);

  const todayISO = getTodayISO();

  const filteredEvaluations = useMemo(() => {
    return data.evaluations
      .filter((ev) => {
        if (typeFilter !== 'todas' && ev.type !== typeFilter) return false;
        if (subjectFilter !== 'todas' && ev.subjectId !== subjectFilter) return false;
        if (timeFilter === 'proximas' && ev.date < todayISO) return false;
        if (timeFilter === 'anteriores' && ev.date >= todayISO) return false;
        return true;
      })
      .sort((a, b) =>
        timeFilter === 'anteriores'
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date)
      );
  }, [data.evaluations, typeFilter, timeFilter, subjectFilter, todayISO]);

  const typeTabs: {id: TypeFilter; label: string}[] = [
    {id: 'todas', label: 'Todas'},
    {id: 'prueba', label: 'Pruebas'},
    {id: 'control', label: 'Controles'},
    {id: 'trabajo', label: 'Trabajos'},
  ];

  const timeTabs: {id: TimeFilter; label: string}[] = [
    {id: 'proximas', label: 'Próximas'},
    {id: 'todas', label: 'Todas'},
    {id: 'anteriores', label: 'Anteriores'},
  ];

  return (
    <div className="space-y-6">
      {data.evaluations.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#E2E8F0]/70 dark:bg-slate-800"
              role="tablist"
              aria-label="Filtrar por tipo de evaluación"
            >
              {typeTabs.map((tab) => {
                const active = typeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTypeFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white shadow-xs font-semibold'
                        : 'text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#E2E8F0]/70 dark:bg-slate-800"
              role="tablist"
              aria-label="Filtrar por periodo"
            >
              {timeTabs.map((tab) => {
                const active = timeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTimeFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white shadow-xs font-semibold'
                        : 'text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="input-field sm:w-52"
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
      )}

      {data.evaluations.length === 0 ? (
        <div className="card-surface rounded-2xl p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#4778E8]/10 text-[#4778E8] flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#1E293B] dark:text-slate-100">
            No tienes evaluaciones registradas
          </h2>
          <p className="mt-1.5 text-sm text-[#475569] dark:text-slate-400 max-w-md mx-auto">
            Registra tus próximas pruebas, controles o trabajos con su temario para prepararte con
            anticipación.
          </p>
          <button
            type="button"
            onClick={() => setActiveModal({type: 'evaluation'})}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4778E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar primera evaluación</span>
          </button>
        </div>
      ) : filteredEvaluations.length === 0 ? (
        <div className="card-surface rounded-2xl p-8 text-center">
          <p className="text-sm text-[#475569] dark:text-slate-400">
            No hay evaluaciones que coincidan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvaluations.map((ev) => {
            const subject = getSubjectById(ev.subjectId);
            const diff = getDayDiffFromToday(ev.date);
            const isPast = diff < 0;
            const isUrgent = diff >= 0 && diff <= 3;

            return (
              <article
                key={ev.id}
                className="card-surface card-interactive rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{backgroundColor: subject?.color ?? '#4778E8'}}
                      />
                      <span className="text-[#1E293B] dark:text-slate-200">
                        {subject?.name ?? 'Asignatura'}
                      </span>
                      <span className="text-[#94A3B8]" aria-hidden="true">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#4778E8] dark:text-[#7BA3F7]">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{EVAL_LABELS[ev.type]}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveModal({type: 'evaluation', item: ev})}
                        aria-label={`Editar "${ev.title}"`}
                        className="p-2 rounded-lg text-[#475569] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 hover:text-[#1E293B] dark:hover:text-slate-100 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingEval(ev)}
                        aria-label={`Eliminar "${ev.title}"`}
                        className="p-2 rounded-lg text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h2 className="mt-2 text-base font-semibold text-[#1E293B] dark:text-slate-100">
                    {ev.title}
                  </h2>

                  {ev.description && (
                    <p className="mt-1.5 text-sm text-[#475569] dark:text-slate-400 leading-relaxed">
                      {ev.description}
                    </p>
                  )}
                </div>

                <div className="pt-3.5 border-t border-[#F1F5F9] dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-mono-tabular text-[#475569] dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>{formatCompactDateCL(ev.date)}</span>
                  </span>

                  {isPast ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-[#047857] dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Rendida ({formatRelativeDayCL(ev.date)})</span>
                    </span>
                  ) : isUrgent ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-[#B91C1C] dark:text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{formatRelativeDayCL(ev.date)}</span>
                    </span>
                  ) : (
                    <span className="font-semibold text-[#475569] dark:text-slate-400">
                      {formatRelativeDayCL(ev.date)}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingEval}
        title="Eliminar evaluación"
        message={
          deletingEval
            ? `¿Estás seguro de eliminar la evaluación «${deletingEval.title}»?`
            : ''
        }
        onConfirm={() => {
          if (deletingEval) {
            deleteEvaluation(deletingEval.id);
            setDeletingEval(null);
          }
        }}
        onCancel={() => setDeletingEval(null)}
      />
    </div>
  );
};

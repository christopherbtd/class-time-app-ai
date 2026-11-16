import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckSquare,
  ClipboardCheck,
  Clock,
  Plus,
} from 'lucide-react';
import {useClassTime} from '../context/ClassTimeContext';
import type {EvaluationType} from '../types/classtime';
import {
  DAYS_OF_WEEK,
  formatCompactDateCL,
  formatCurrentDateCL,
  formatRelativeDayCL,
  getCurrentWeekdayCL,
  getDayDiffFromToday,
  getGreetingCL,
  getTodayISO,
  isCurrentTimeBetween,
  isTaskOverdue,
  timeToMinutes,
} from '../utils/dateCL';

const EVAL_TYPE_LABELS: Record<EvaluationType, string> = {
  prueba: 'Prueba',
  control: 'Control',
  trabajo: 'Trabajo',
};

export const InicioPage: React.FC = () => {
  const {data, setActiveSection, setActiveModal, getSubjectById, toggleTask} = useClassTime();

  const now = new Date();
  const greeting = getGreetingCL(now);
  const currentDateText = formatCurrentDateCL(now);
  const todayISO = getTodayISO();

  const currentWeekday = getCurrentWeekdayCL(now);
  const isWeekend = currentWeekday === null;
  const scheduleDay = currentWeekday ?? 'lunes';
  const scheduleDayLabel =
    DAYS_OF_WEEK.find((d) => d.id === scheduleDay)?.label ?? 'Lunes';

  const todayClasses = data.schedule
    .filter((b) => b.day === scheduleDay)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const pendingTasks = data.tasks
    .filter((t) => !t.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const overdueCount = pendingTasks.filter((t) => isTaskOverdue(t.dueDate, t.completed)).length;

  const upcomingEvaluations = data.evaluations
    .filter((ev) => ev.date >= todayISO)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Actions */}
      <section className="card-surface rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-[#4778E8] dark:text-[#7BA3F7]">
              {currentDateText}
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B] dark:text-slate-100">
              ¡{greeting}, {data.settings.studentName}!
            </h2>
            <p className="mt-1.5 text-sm text-[#475569] dark:text-slate-400">
              {data.settings.institution} · Año académico {data.settings.academicYear}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveModal({type: 'task'})}
              className="inline-flex items-center gap-2 rounded-lg bg-[#4778E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Agregar tarea</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModal({type: 'schedule'})}
              className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-[#1E293B] dark:text-slate-100 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 shrink-0 text-[#4778E8] dark:text-[#7BA3F7]" />
              <span>Agregar clase</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModal({type: 'evaluation'})}
              className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-[#1E293B] dark:text-slate-100 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4 shrink-0 text-[#4778E8] dark:text-[#7BA3F7]" />
              <span>Agregar evaluación</span>
            </button>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="mt-6 pt-6 border-t border-[#F1F5F9] dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveSection('tareas')}
            className="text-left rounded-xl p-4 bg-[#F7F8FC] dark:bg-slate-800/60 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#475569] dark:text-slate-400">
              <span>Tareas pendientes</span>
              <CheckSquare className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="text-2xl font-bold text-[#1E293B] dark:text-slate-100 tabular-nums">
                {pendingTasks.length}
              </span>
              {overdueCount > 0 && (
                <span className="text-xs font-semibold text-[#EF4444]">
                  {overdueCount} {overdueCount === 1 ? 'vencida' : 'vencidas'}
                </span>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('evaluaciones')}
            className="text-left rounded-xl p-4 bg-[#F7F8FC] dark:bg-slate-800/60 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#475569] dark:text-slate-400">
              <span>Próximas evaluaciones</span>
              <ClipboardCheck className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="text-2xl font-bold text-[#1E293B] dark:text-slate-100 tabular-nums">
                {upcomingEvaluations.length}
              </span>
              <span className="text-xs text-[#475569] dark:text-slate-400">
                {upcomingEvaluations[0]
                  ? `Próxima: ${formatRelativeDayCL(upcomingEvaluations[0].date).toLowerCase()}`
                  : 'Sin evaluaciones programadas'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('horario')}
            className="text-left rounded-xl p-4 bg-[#F7F8FC] dark:bg-slate-800/60 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#475569] dark:text-slate-400">
              <span>{isWeekend ? 'Clases del lunes' : 'Clases de hoy'}</span>
              <BookOpen className="w-4 h-4 text-[#4778E8]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="text-2xl font-bold text-[#1E293B] dark:text-slate-100 tabular-nums">
                {todayClasses.length}
              </span>
              <span className="text-xs text-[#475569] dark:text-slate-400">
                {data.subjects.length} asignaturas registradas
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Main Dashboard Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Today's Schedule + Pending Tasks */}
        <div className="lg:col-span-7 space-y-6">
          {/* Próximas clases del día */}
          <section className="card-surface rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-[#1E293B] dark:text-slate-100">
                  {isWeekend ? `Próximas clases (${scheduleDayLabel})` : 'Clases de hoy'}
                </h3>
                <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">
                  {isWeekend
                    ? 'Fin de semana: vista previa del inicio de semana'
                    : `Jornada del día ${scheduleDayLabel.toLowerCase()}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('horario')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4778E8] dark:text-[#7BA3F7] hover:underline whitespace-nowrap cursor-pointer"
              >
                <span>Ver horario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayClasses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#475569] dark:text-slate-400">
                  No tienes clases registradas para el {scheduleDayLabel.toLowerCase()}.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal({type: 'schedule', defaultDay: scheduleDay})}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4778E8] dark:text-[#7BA3F7] hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar clase</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9] dark:divide-slate-800">
                {todayClasses.map((block) => {
                  const subject = getSubjectById(block.subjectId);
                  const isActiveNow =
                    !isWeekend && isCurrentTimeBetween(block.startTime, block.endTime, now);
                  return (
                    <div
                      key={block.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="font-mono-tabular text-sm font-medium text-[#475569] dark:text-slate-400 w-28 shrink-0">
                          {block.startTime} – {block.endTime}
                        </span>
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{backgroundColor: subject?.color ?? '#4778E8'}}
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100 truncate">
                            {subject?.name ?? 'Asignatura'}
                          </p>
                          <p className="text-xs text-[#475569] dark:text-slate-400 truncate">
                            {block.room}
                            {subject?.teacher ? ` · ${subject.teacher}` : ''}
                          </p>
                        </div>
                      </div>

                      {isActiveNow && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4778E8] dark:text-[#7BA3F7] shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          <span>En curso</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Resumen de tareas pendientes */}
          <section className="card-surface rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-[#1E293B] dark:text-slate-100">
                  Tareas pendientes
                </h3>
                <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">
                  Marca tus entregas completadas o revisa las más próximas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('tareas')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4778E8] dark:text-[#7BA3F7] hover:underline whitespace-nowrap cursor-pointer"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#475569] dark:text-slate-400">
                  ¡Estás al día! No tienes tareas pendientes por ahora.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal({type: 'task'})}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4778E8] dark:text-[#7BA3F7] hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar nueva tarea</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9] dark:divide-slate-800">
                {pendingTasks.slice(0, 5).map((task) => {
                  const subject = getSubjectById(task.subjectId);
                  const overdue = isTaskOverdue(task.dueDate, task.completed);
                  const diff = getDayDiffFromToday(task.dueDate);
                  return (
                    <div key={task.id} className="py-3.5 flex items-start gap-3.5">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-label={`Marcar "${task.title}" como completada`}
                        className="mt-0.5 w-5 h-5 rounded-[6px] border-[1.5px] border-[#CBD5E1] dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-[#10B981] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100">
                            {task.title}
                          </p>
                          {overdue ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#EF4444] shrink-0">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Vencida</span>
                            </span>
                          ) : diff === 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] dark:text-amber-400 shrink-0">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Para hoy</span>
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#475569] dark:text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-xs inline-block"
                              style={{backgroundColor: subject?.color ?? '#4778E8'}}
                            />
                            <span>{subject?.name ?? 'Sin asignatura'}</span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">
                            {formatCompactDateCL(task.dueDate)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{formatRelativeDayCL(task.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right: Upcoming Evaluations */}
        <div className="lg:col-span-5">
          <section className="card-surface rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-[#1E293B] dark:text-slate-100">
                  Próximas evaluaciones
                </h3>
                <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">
                  Pruebas, controles y trabajos por rendir
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('evaluaciones')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4778E8] dark:text-[#7BA3F7] hover:underline whitespace-nowrap cursor-pointer"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingEvaluations.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#475569] dark:text-slate-400">
                  No tienes evaluaciones próximas registradas.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal({type: 'evaluation'})}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4778E8] dark:text-[#7BA3F7] hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar evaluación</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9] dark:divide-slate-800">
                {upcomingEvaluations.slice(0, 5).map((ev) => {
                  const subject = getSubjectById(ev.subjectId);
                  const diff = getDayDiffFromToday(ev.date);
                  const isUrgent = diff <= 3;
                  return (
                    <div key={ev.id} className="py-4 space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#475569] dark:text-slate-300">
                          <span
                            className="w-2.5 h-2.5 rounded-xs"
                            style={{backgroundColor: subject?.color ?? '#4778E8'}}
                          />
                          <span>
                            {EVAL_TYPE_LABELS[ev.type]} · {subject?.name ?? 'Asignatura'}
                          </span>
                        </span>

                        <span
                          className={`font-semibold shrink-0 ${
                            isUrgent
                              ? 'text-[#EF4444]'
                              : 'text-[#475569] dark:text-slate-400'
                          }`}
                        >
                          {formatRelativeDayCL(ev.date)}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100">
                        {ev.title}
                      </p>

                      <p className="text-xs font-mono-tabular text-[#475569] dark:text-slate-400">
                        {formatCompactDateCL(ev.date)}
                      </p>

                      {ev.description && (
                        <p className="text-xs text-[#475569] dark:text-slate-400 line-clamp-2">
                          {ev.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

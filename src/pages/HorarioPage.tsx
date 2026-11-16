import React, {useMemo, useState} from 'react';
import {CalendarDays, MapPin, Pencil, Plus, Trash2} from 'lucide-react';
import {ConfirmModal} from '../components/ui/ConfirmModal';
import {useClassTime} from '../context/ClassTimeContext';
import type {DayOfWeek, ScheduleBlock} from '../types/classtime';
import {DAYS_OF_WEEK, getCurrentWeekdayCL, timeToMinutes} from '../utils/dateCL';

const PIXELS_PER_HOUR = 64;

export const HorarioPage: React.FC = () => {
  const {data, setActiveModal, deleteScheduleBlock, getSubjectById} = useClassTime();

  const initialDay: DayOfWeek = getCurrentWeekdayCL(new Date()) ?? 'lunes';
  const [mobileDay, setMobileDay] = useState<DayOfWeek>(initialDay);
  const [deletingBlock, setDeletingBlock] = useState<ScheduleBlock | null>(null);

  // Determine hour range dynamically (default 08:00 to 18:00, expands if classes fall outside)
  const {startHour, endHour} = useMemo(() => {
    let minH = 8;
    let maxH = 18;
    for (const block of data.schedule) {
      const sh = Math.floor(timeToMinutes(block.startTime) / 60);
      const eh = Math.ceil(timeToMinutes(block.endTime) / 60);
      if (sh < minH) minH = sh;
      if (eh > maxH) maxH = eh;
    }
    return {startHour: Math.max(6, minH), endHour: Math.min(23, maxH)};
  }, [data.schedule]);

  const hoursList = useMemo(() => {
    const arr: number[] = [];
    for (let h = startHour; h <= endHour; h++) {
      arr.push(h);
    }
    return arr;
  }, [startHour, endHour]);

  const gridHeight = (endHour - startHour) * PIXELS_PER_HOUR;

  const blocksByDay = useMemo(() => {
    const map: Record<DayOfWeek, ScheduleBlock[]> = {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
    };
    for (const block of data.schedule) {
      map[block.day].push(block);
    }
    for (const day of DAYS_OF_WEEK) {
      map[day.id].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    }
    return map;
  }, [data.schedule]);

  const todayWeekday = getCurrentWeekdayCL(new Date());

  return (
    <div className="space-y-6">
      {data.schedule.length === 0 ? (
        <div className="card-surface rounded-2xl p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#4778E8]/10 text-[#4778E8] flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#1E293B] dark:text-slate-100">
            Tu horario semanal está vacío
          </h2>
          <p className="mt-1.5 text-sm text-[#475569] dark:text-slate-400 max-w-md mx-auto">
            Agrega tus clases de lunes a viernes con su asignatura, horario y sala para visualizar tu
            semana académica.
          </p>
          <button
            type="button"
            onClick={() => setActiveModal({type: 'schedule'})}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4778E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar primera clase</span>
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Day Carousel Tabs (< 768px) */}
          <div className="md:hidden space-y-4">
            <div
              className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-[#E2E8F0]/70 dark:bg-slate-800"
              role="tablist"
              aria-label="Días de la semana"
            >
              {DAYS_OF_WEEK.map((day) => {
                const active = mobileDay === day.id;
                const count = blocksByDay[day.id].length;
                return (
                  <button
                    key={day.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMobileDay(day.id)}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-slate-700 text-[#4778E8] dark:text-white shadow-xs'
                        : 'text-[#475569] dark:text-slate-400'
                    }`}
                  >
                    <span>{day.shortLabel}</span>
                    {count > 0 && (
                      <span className="ml-1 text-[10px] opacity-75 tabular-nums">({count})</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="card-surface rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#1E293B] dark:text-slate-100">
                  {DAYS_OF_WEEK.find((d) => d.id === mobileDay)?.label}
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveModal({type: 'schedule', defaultDay: mobileDay})}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#4778E8] dark:text-[#7BA3F7] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              {blocksByDay[mobileDay].length === 0 ? (
                <p className="py-6 text-center text-sm text-[#475569] dark:text-slate-400">
                  No hay clases programadas para este día.
                </p>
              ) : (
                <div className="divide-y divide-[#F1F5F9] dark:divide-slate-800">
                  {blocksByDay[mobileDay].map((block) => {
                    const subject = getSubjectById(block.subjectId);
                    return (
                      <div key={block.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className="mt-1.5 w-2.5 h-2.5 rounded-xs shrink-0"
                            style={{backgroundColor: subject?.color ?? '#4778E8'}}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100 truncate">
                              {subject?.name ?? 'Asignatura'}
                            </p>
                            <p className="text-xs font-mono-tabular text-[#475569] dark:text-slate-400 mt-0.5">
                              {block.startTime} – {block.endTime} · {block.room}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveModal({type: 'schedule', item: block})}
                            aria-label="Editar clase"
                            className="p-2 rounded-lg text-[#475569] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingBlock(block)}
                            aria-label="Eliminar clase"
                            className="p-2 rounded-lg text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop & Tablet Weekly Grid (>= 768px) */}
          <div className="hidden md:block card-surface rounded-2xl overflow-hidden">
            {/* Day Column Headers */}
            <div className="grid grid-cols-[72px_repeat(5,minmax(0,1fr))] border-b border-[#E2E8F0] dark:border-slate-800 bg-[#F7F8FC] dark:bg-slate-900/80">
              <div className="p-3 text-xs font-semibold text-[#94A3B8] text-center self-center">
                Hora
              </div>
              {DAYS_OF_WEEK.map((day) => {
                const isToday = todayWeekday === day.id;
                return (
                  <div
                    key={day.id}
                    className={`px-3 py-3 border-l border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between gap-2 ${
                      isToday ? 'bg-[#4778E8]/6 dark:bg-[#4778E8]/15' : ''
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isToday
                          ? 'text-[#4778E8] dark:text-[#7BA3F7]'
                          : 'text-[#1E293B] dark:text-slate-100'
                      }`}
                    >
                      {day.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveModal({type: 'schedule', defaultDay: day.id})}
                      aria-label={`Agregar clase el ${day.label}`}
                      title={`Agregar clase el ${day.label}`}
                      className="p-1 rounded-md text-[#94A3B8] hover:text-[#4778E8] hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Time Grid Body */}
            <div className="grid grid-cols-[72px_repeat(5,minmax(0,1fr))] overflow-x-auto">
              {/* Time Axis */}
              <div className="relative select-none" style={{height: `${gridHeight}px`}}>
                {hoursList.slice(0, -1).map((hour, idx) => (
                  <div
                    key={hour}
                    style={{
                      top: `${idx * PIXELS_PER_HOUR}px`,
                      height: `${PIXELS_PER_HOUR}px`,
                    }}
                    className="absolute inset-x-0 px-2 pt-1.5 text-right border-b border-[#F1F5F9] dark:border-slate-800/80"
                  >
                    <span className="text-xs font-mono-tabular text-[#94A3B8]">
                      {String(hour).padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {DAYS_OF_WEEK.map((day) => {
                const dayBlocks = blocksByDay[day.id];
                const isToday = todayWeekday === day.id;

                return (
                  <div
                    key={day.id}
                    style={{height: `${gridHeight}px`}}
                    className={`relative border-l border-[#E2E8F0] dark:border-slate-800 ${
                      isToday ? 'bg-[#4778E8]/[0.025] dark:bg-[#4778E8]/[0.04]' : ''
                    }`}
                  >
                    {/* Horizontal Hour Guides */}
                    {hoursList.slice(0, -1).map((hour, idx) => (
                      <div
                        key={hour}
                        style={{
                          top: `${idx * PIXELS_PER_HOUR}px`,
                          height: `${PIXELS_PER_HOUR}px`,
                        }}
                        className="absolute inset-x-0 border-b border-[#F1F5F9] dark:border-slate-800/80 pointer-events-none"
                      />
                    ))}

                    {/* Class Blocks */}
                    {dayBlocks.map((block) => {
                      const subject = getSubjectById(block.subjectId);
                      const startMin = timeToMinutes(block.startTime);
                      const endMin = timeToMinutes(block.endTime);
                      const topPx = ((startMin - startHour * 60) / 60) * PIXELS_PER_HOUR;
                      const heightPx = Math.max(
                        44,
                        ((endMin - startMin) / 60) * PIXELS_PER_HOUR
                      );
                      const color = subject?.color ?? '#4778E8';

                      return (
                        <div
                          key={block.id}
                          style={{
                            top: `${topPx + 2}px`,
                            height: `${heightPx - 4}px`,
                            backgroundColor: `${color}16`,
                            borderColor: `${color}45`,
                          }}
                          className="group absolute inset-x-1.5 rounded-xl border p-2.5 flex flex-col justify-between overflow-hidden transition-shadow hover:shadow-md z-10"
                        >
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span
                                  className="w-2 h-2 rounded-xs shrink-0"
                                  style={{backgroundColor: color}}
                                />
                                <p className="text-xs font-bold text-[#1E293B] dark:text-slate-100 truncate">
                                  {subject?.name ?? 'Asignatura'}
                                </p>
                              </div>

                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveModal({type: 'schedule', item: block})
                                  }
                                  aria-label={`Editar clase de ${subject?.name ?? 'asignatura'}`}
                                  className="p-1 rounded-md bg-white/85 dark:bg-slate-900/85 text-[#475569] dark:text-slate-300 hover:text-[#4778E8] cursor-pointer"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingBlock(block)}
                                  aria-label={`Eliminar clase de ${subject?.name ?? 'asignatura'}`}
                                  className="p-1 rounded-md bg-white/85 dark:bg-slate-900/85 text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <p className="mt-0.5 text-[11px] font-mono-tabular font-medium text-[#475569] dark:text-slate-300">
                              {block.startTime} – {block.endTime}
                            </p>
                          </div>

                          {heightPx >= 64 && (
                            <p className="flex items-center gap-1 text-[11px] text-[#475569] dark:text-slate-300 truncate">
                              <MapPin className="w-3 h-3 shrink-0 opacity-70" />
                              <span className="truncate">{block.room}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={!!deletingBlock}
        title="Eliminar clase del horario"
        message={
          deletingBlock
            ? `¿Deseas eliminar la clase de ${
                getSubjectById(deletingBlock.subjectId)?.name ?? 'esta asignatura'
              } (${deletingBlock.startTime} – ${deletingBlock.endTime})?`
            : ''
        }
        onConfirm={() => {
          if (deletingBlock) {
            deleteScheduleBlock(deletingBlock.id);
            setDeletingBlock(null);
          }
        }}
        onCancel={() => setDeletingBlock(null)}
      />
    </div>
  );
};

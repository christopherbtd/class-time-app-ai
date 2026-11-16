import React, {useEffect, useState} from 'react';
import {useClassTime} from '../../context/ClassTimeContext';
import type {DayOfWeek, ScheduleBlock} from '../../types/classtime';
import {DAYS_OF_WEEK, timeToMinutes} from '../../utils/dateCL';
import {Modal} from '../ui/Modal';

interface ScheduleModalProps {
  isOpen: boolean;
  editingBlock?: ScheduleBlock;
  defaultDay?: DayOfWeek;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  editingBlock,
  defaultDay = 'lunes',
  onClose,
}) => {
  const {data, saveScheduleBlock, setActiveSection} = useClassTime();

  const [subjectId, setSubjectId] = useState('');
  const [day, setDay] = useState<DayOfWeek>('lunes');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingBlock) {
      setSubjectId(editingBlock.subjectId);
      setDay(editingBlock.day);
      setStartTime(editingBlock.startTime);
      setEndTime(editingBlock.endTime);
      setRoom(editingBlock.room);
    } else {
      const firstSubj = data.subjects[0];
      setSubjectId(firstSubj?.id ?? '');
      setDay(defaultDay);
      setStartTime('08:30');
      setEndTime('10:00');
      setRoom(firstSubj?.room ?? '');
    }
    setError('');
  }, [isOpen, editingBlock, defaultDay, data.subjects]);

  const handleSubjectChange = (nextId: string) => {
    setSubjectId(nextId);
    const subj = data.subjects.find((s) => s.id === nextId);
    if (subj && (!editingBlock || !room.trim())) {
      setRoom(subj.room);
    }
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      setError('Selecciona una asignatura.');
      return;
    }
    if (!startTime || !endTime) {
      setError('Indica la hora de inicio y término.');
      return;
    }
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      setError('La hora de término debe ser posterior a la hora de inicio.');
      return;
    }
    const cleanRoom = room.trim();
    if (!cleanRoom) {
      setError('Ingresa la sala donde se realiza la clase.');
      return;
    }

    saveScheduleBlock(
      {
        subjectId,
        day,
        startTime,
        endTime,
        room: cleanRoom,
      },
      editingBlock?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={editingBlock ? 'Editar clase del horario' : 'Agregar clase al horario'}
      subtitle="Organiza tus bloques de lunes a viernes."
      onClose={onClose}
    >
      {data.subjects.length === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-[#475569] dark:text-slate-300">
            Antes de agregar una clase al horario necesitas registrar al menos una asignatura.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E2E8F0] dark:border-slate-700 px-4 py-2 text-sm font-medium text-[#1E293B] dark:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                setActiveSection('asignaturas');
              }}
              className="rounded-lg bg-[#4778E8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3B67D1] cursor-pointer"
            >
              Ir a Asignaturas
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3.5 py-2.5 text-sm text-[#B91C1C] dark:text-red-300"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="sch-subject"
              className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
            >
              Asignatura
            </label>
            <select
              id="sch-subject"
              value={subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="input-field w-full"
            >
              {data.subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sch-day"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Día de la semana
              </label>
              <select
                id="sch-day"
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="input-field w-full"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sch-room"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Sala
              </label>
              <input
                id="sch-room"
                type="text"
                value={room}
                onChange={(e) => {
                  setRoom(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ej. Sala 204"
                className="input-field w-full"
                maxLength={35}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sch-start"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Hora de inicio
              </label>
              <input
                id="sch-start"
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  if (error) setError('');
                }}
                className="input-field w-full font-mono-tabular"
              />
            </div>

            <div>
              <label
                htmlFor="sch-end"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Hora de término
              </label>
              <input
                id="sch-end"
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  if (error) setError('');
                }}
                className="input-field w-full font-mono-tabular"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-[#1E293B] dark:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#4778E8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

import React, {useEffect, useState} from 'react';
import {useClassTime} from '../../context/ClassTimeContext';
import type {Task} from '../../types/classtime';
import {getTodayISO} from '../../utils/dateCL';
import {Modal} from '../ui/Modal';

interface TaskModalProps {
  isOpen: boolean;
  editingTask?: Task;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({isOpen, editingTask, onClose}) => {
  const {data, saveTask, setActiveSection} = useClassTime();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState(getTodayISO());
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setSubjectId(editingTask.subjectId);
      setDueDate(editingTask.dueDate);
    } else {
      setTitle('');
      setDescription('');
      setSubjectId(data.subjects[0]?.id ?? '');
      setDueDate(getTodayISO());
    }
    setError('');
  }, [isOpen, editingTask, data.subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Ingresa un título para la tarea.');
      return;
    }
    if (!subjectId) {
      setError('Selecciona una asignatura.');
      return;
    }
    if (!dueDate) {
      setError('Selecciona la fecha de entrega.');
      return;
    }

    saveTask(
      {
        title: cleanTitle,
        description: description.trim(),
        subjectId,
        dueDate,
      },
      editingTask?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={editingTask ? 'Editar tarea' : 'Nueva tarea'}
      subtitle="Registra tus pendientes y fechas de entrega."
      onClose={onClose}
    >
      {data.subjects.length === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-[#475569] dark:text-slate-300">
            Para crear una tarea primero debes registrar al menos una asignatura.
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
              htmlFor="task-title"
              className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
            >
              Título de la tarea
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ej. Guía de ejercicios unidad 2"
              className="input-field w-full"
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-subject"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Asignatura
              </label>
              <select
                id="task-subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="input-field w-full"
              >
                {data.subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="task-due"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Fecha de entrega
              </label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (error) setError('');
                }}
                className="input-field w-full font-mono-tabular"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="task-desc"
              className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
            >
              Descripción
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instrucciones, páginas del libro o detalles de la entrega..."
              className="textarea-field w-full resize-none"
              maxLength={350}
            />
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

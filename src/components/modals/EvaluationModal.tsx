import React, {useEffect, useState} from 'react';
import {useClassTime} from '../../context/ClassTimeContext';
import type {Evaluation, EvaluationType} from '../../types/classtime';
import {getTodayISO} from '../../utils/dateCL';
import {Modal} from '../ui/Modal';

interface EvaluationModalProps {
  isOpen: boolean;
  editingEvaluation?: Evaluation;
  onClose: () => void;
}

const EVALUATION_TYPES: {id: EvaluationType; label: string}[] = [
  {id: 'prueba', label: 'Prueba'},
  {id: 'control', label: 'Control'},
  {id: 'trabajo', label: 'Trabajo'},
];

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  isOpen,
  editingEvaluation,
  onClose,
}) => {
  const {data, saveEvaluation, setActiveSection} = useClassTime();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EvaluationType>('prueba');
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingEvaluation) {
      setTitle(editingEvaluation.title);
      setType(editingEvaluation.type);
      setSubjectId(editingEvaluation.subjectId);
      setDate(editingEvaluation.date);
      setDescription(editingEvaluation.description);
    } else {
      setTitle('');
      setType('prueba');
      setSubjectId(data.subjects[0]?.id ?? '');
      setDate(getTodayISO());
      setDescription('');
    }
    setError('');
  }, [isOpen, editingEvaluation, data.subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Ingresa un título para la evaluación.');
      return;
    }
    if (!subjectId) {
      setError('Selecciona una asignatura.');
      return;
    }
    if (!date) {
      setError('Selecciona la fecha de la evaluación.');
      return;
    }

    saveEvaluation(
      {
        title: cleanTitle,
        type,
        subjectId,
        date,
        description: description.trim(),
      },
      editingEvaluation?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={editingEvaluation ? 'Editar evaluación' : 'Nueva evaluación'}
      subtitle="Registra pruebas, controles o trabajos con sus contenidos."
      onClose={onClose}
    >
      {data.subjects.length === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-[#475569] dark:text-slate-300">
            Para registrar una evaluación primero debes crear al menos una asignatura.
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
            <span className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5">
              Tipo de evaluación
            </span>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#F1F5F9] dark:bg-slate-800">
              {EVALUATION_TYPES.map((item) => {
                const active = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-slate-700 text-[#1E293B] dark:text-white shadow-xs'
                        : 'text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="eval-title"
              className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
            >
              Título
            </label>
            <input
              id="eval-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ej. Prueba coeficiente 2: Geometría"
              className="input-field w-full"
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="eval-subject"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Asignatura
              </label>
              <select
                id="eval-subject"
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
                htmlFor="eval-date"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Fecha
              </label>
              <input
                id="eval-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (error) setError('');
                }}
                className="input-field w-full font-mono-tabular"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="eval-desc"
              className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
            >
              Temario o descripción
            </label>
            <textarea
              id="eval-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contenidos a evaluar, modalidad o requisitos..."
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

import React, {useEffect, useState} from 'react';
import {Check} from 'lucide-react';
import {useClassTime} from '../../context/ClassTimeContext';
import type {Subject} from '../../types/classtime';
import {SUBJECT_COLORS} from '../../utils/storage';
import {Modal} from '../ui/Modal';

interface SubjectModalProps {
  isOpen: boolean;
  editingSubject?: Subject;
  onClose: () => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  editingSubject,
  onClose,
}) => {
  const {saveSubject} = useClassTime();

  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [color, setColor] = useState(SUBJECT_COLORS[0].hex);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingSubject) {
      setName(editingSubject.name);
      setTeacher(editingSubject.teacher);
      setRoom(editingSubject.room);
      setColor(editingSubject.color);
    } else {
      setName('');
      setTeacher('');
      setRoom('');
      setColor(SUBJECT_COLORS[0].hex);
    }
    setError('');
  }, [isOpen, editingSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanTeacher = teacher.trim();
    const cleanRoom = room.trim();

    if (!cleanName) {
      setError('Ingresa el nombre de la asignatura.');
      return;
    }
    if (!cleanTeacher) {
      setError('Ingresa el nombre del profesor o profesora.');
      return;
    }
    if (!cleanRoom) {
      setError('Ingresa la sala o laboratorio habitual.');
      return;
    }

    saveSubject(
      {
        name: cleanName,
        teacher: cleanTeacher,
        room: cleanRoom,
        color,
      },
      editingSubject?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={editingSubject ? 'Editar asignatura' : 'Nueva asignatura'}
      subtitle="Los cambios se guardarán cuando presiones el botón Guardar."
      onClose={onClose}
    >
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
            htmlFor="subj-name"
            className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
          >
            Nombre de la asignatura
          </label>
          <input
            id="subj-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ej. Matemática, Física, Historia"
            className="input-field w-full"
            maxLength={60}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="subj-teacher"
              className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
            >
              Profesor o profesora
            </label>
            <input
              id="subj-teacher"
              type="text"
              value={teacher}
              onChange={(e) => {
                setTeacher(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ej. Prof. Carolina Méndez"
              className="input-field w-full"
              maxLength={60}
            />
          </div>

          <div>
            <label
              htmlFor="subj-room"
              className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
            >
              Sala habitual
            </label>
            <input
              id="subj-room"
              type="text"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ej. Sala 204 o Lab 1"
              className="input-field w-full"
              maxLength={35}
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-2">
            Color identificador
          </span>
          <div className="flex flex-wrap gap-2.5">
            {SUBJECT_COLORS.map((swatch) => {
              const selected = color.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => setColor(swatch.hex)}
                  aria-label={swatch.label}
                  title={swatch.label}
                  style={{backgroundColor: swatch.hex}}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform cursor-pointer ${
                    selected
                      ? 'ring-2 ring-offset-2 ring-[#4778E8] dark:ring-offset-slate-900 scale-105'
                      : 'hover:scale-105 opacity-90 hover:opacity-100'
                  }`}
                >
                  {selected && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
                </button>
              );
            })}
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
    </Modal>
  );
};

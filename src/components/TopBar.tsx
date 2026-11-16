import React from 'react';
import {Plus} from 'lucide-react';
import {useClassTime} from '../context/ClassTimeContext';
import type {SectionId} from '../types/classtime';
import {formatCurrentDateCL} from '../utils/dateCL';

const SECTION_TITLES: Record<SectionId, string> = {
  inicio: 'Inicio',
  horario: 'Horario semanal',
  asignaturas: 'Asignaturas',
  tareas: 'Tareas',
  evaluaciones: 'Evaluaciones',
  configuracion: 'Configuración',
};

export const TopBar: React.FC = () => {
  const {activeSection, setActiveModal} = useClassTime();

  const renderPrimaryAction = () => {
    switch (activeSection) {
      case 'horario':
        return (
          <button
            type="button"
            onClick={() => setActiveModal({type: 'schedule'})}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4778E8] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Agregar clase</span>
          </button>
        );
      case 'asignaturas':
        return (
          <button
            type="button"
            onClick={() => setActiveModal({type: 'subject'})}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4778E8] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Nueva asignatura</span>
          </button>
        );
      case 'tareas':
        return (
          <button
            type="button"
            onClick={() => setActiveModal({type: 'task'})}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4778E8] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Nueva tarea</span>
          </button>
        );
      case 'evaluaciones':
        return (
          <button
            type="button"
            onClick={() => setActiveModal({type: 'evaluation'})}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4778E8] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Nueva evaluación</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-20 h-13 lg:h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/icon.svg"
          alt="ClassTime"
          className="w-7 h-7 rounded-lg lg:hidden shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-[#1E293B] dark:text-slate-100 truncate">
            {SECTION_TITLES[activeSection]}
          </h1>
          <p className="hidden sm:block text-xs text-[#475569] dark:text-slate-400 truncate">
            {formatCurrentDateCL(new Date())}
          </p>
        </div>
      </div>

      <div className="shrink-0">{renderPrimaryAction()}</div>
    </header>
  );
};

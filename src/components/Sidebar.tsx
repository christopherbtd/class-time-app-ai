import React from 'react';
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  Home,
  Settings,
} from 'lucide-react';
import {useClassTime} from '../context/ClassTimeContext';
import type {SectionId} from '../types/classtime';
import {PWAInstallButton} from './PWAInstallButton';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.FC<{className?: string}>;
}

export const NAV_ITEMS: NavItem[] = [
  {id: 'inicio', label: 'Inicio', icon: Home},
  {id: 'horario', label: 'Horario', icon: CalendarDays},
  {id: 'asignaturas', label: 'Asignaturas', icon: BookOpen},
  {id: 'tareas', label: 'Tareas', icon: CheckSquare},
  {id: 'evaluaciones', label: 'Evaluaciones', icon: ClipboardCheck},
  {id: 'configuracion', label: 'Configuración', icon: Settings},
];

export const Sidebar: React.FC = () => {
  const {data, activeSection, setActiveSection, hasUnsavedSettings} = useClassTime();

  const pendingTasksCount = data.tasks.filter((t) => !t.completed).length;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:fixed lg:inset-y-0 lg:left-0 bg-white dark:bg-slate-900 border-r border-[#E2E8F0] dark:border-slate-800 z-30">
      {/* Brand */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-[#F1F5F9] dark:border-slate-800">
        <img
          src="/icon.svg"
          alt="ClassTime"
          className="w-8 h-8 rounded-lg shrink-0"
          referrerPolicy="no-referrer"
        />
        <span className="text-lg font-bold tracking-tight text-[#1E293B] dark:text-slate-100 whitespace-nowrap">
          ClassTime
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Menú principal">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[#4778E8]/10 text-[#4778E8] dark:bg-[#4778E8]/20 dark:text-[#7BA3F7] font-semibold'
                  : 'text-[#475569] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-slate-800/70 hover:text-[#1E293B] dark:hover:text-slate-100'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${
                    active ? 'text-[#4778E8] dark:text-[#7BA3F7]' : 'text-[#94A3B8]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </span>

              {item.id === 'tareas' && pendingTasksCount > 0 && (
                <span
                  className={`text-xs font-mono-tabular ${
                    active ? 'text-[#4778E8] dark:text-[#7BA3F7]' : 'text-[#94A3B8]'
                  }`}
                >
                  {pendingTasksCount}
                </span>
              )}

              {item.id === 'configuracion' && hasUnsavedSettings && (
                <span className="text-xs font-medium text-[#F59E0B]" title="Cambios sin guardar">
                  Sin guardar
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Student Profile + PWA */}
      <div className="p-4 border-t border-[#F1F5F9] dark:border-slate-800 space-y-3">
        <div className="px-1">
          <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100 truncate">
            {data.settings.studentName}
          </p>
          <p className="text-xs text-[#475569] dark:text-slate-400 truncate mt-0.5">
            {data.settings.institution} · {data.settings.academicYear}
          </p>
        </div>
        <PWAInstallButton variant="sidebar" />
      </div>
    </aside>
  );
};

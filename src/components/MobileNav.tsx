import React from 'react';
import {useClassTime} from '../context/ClassTimeContext';
import {NAV_ITEMS} from './Sidebar';

export const MobileNav: React.FC = () => {
  const {activeSection, setActiveSection, hasUnsavedSettings} = useClassTime();

  return (
    <nav
      aria-label="Navegación móvil"
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#E2E8F0] dark:border-slate-800 px-1 flex items-center justify-around"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveSection(item.id)}
            aria-current={active ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[52px] transition-colors cursor-pointer ${
              active
                ? 'text-[#4778E8] dark:text-[#7BA3F7]'
                : 'text-[#475569] dark:text-slate-400 hover:text-[#1E293B] dark:hover:text-slate-200'
            }`}
          >
            <Icon className="w-[18px] h-[18px]" />
            <span className="text-[10px] font-medium leading-tight whitespace-nowrap">
              {item.id === 'configuracion' ? 'Ajustes' : item.label}
            </span>
            {item.id === 'configuracion' && hasUnsavedSettings && (
              <span
                className="absolute top-1 right-2.5 w-1.5 h-1.5 rounded-full bg-[#F59E0B]"
                aria-label="Cambios sin guardar"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

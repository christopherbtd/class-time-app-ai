import React, {useState} from 'react';
import {Download, Share, X} from 'lucide-react';
import {usePWAInstall} from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'sidebar' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({variant = 'sidebar'}) => {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    if (variant === 'card') {
      return (
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          ClassTime ya está instalada en este dispositivo.
        </p>
      );
    }
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={
          variant === 'sidebar'
            ? 'w-full flex items-center justify-center gap-2 rounded-lg bg-[#4778E8] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors whitespace-nowrap shrink-0 cursor-pointer'
            : 'inline-flex items-center gap-2 rounded-lg bg-[#4778E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors whitespace-nowrap shrink-0 cursor-pointer'
        }
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Instalar ClassTime</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={
            variant === 'sidebar'
              ? 'w-full flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-[#1E293B] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer'
              : 'inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-[#1E293B] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer'
          }
        >
          <Share className="w-4 h-4 shrink-0" />
          <span>Instalar en iPhone / iPad</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <h3
                  id="ios-install-title"
                  className="text-lg font-semibold text-[#1E293B] dark:text-slate-100"
                >
                  Instalar en iPhone o iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Cerrar guía de instalación"
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="mt-4 space-y-2.5 text-sm text-[#475569] dark:text-slate-300 list-decimal list-inside">
                <li>
                  Toca el botón <strong className="text-[#1E293B] dark:text-white">Compartir</strong>{' '}
                  en la barra inferior o superior de Safari.
                </li>
                <li>
                  Desliza hacia abajo y selecciona{' '}
                  <strong className="text-[#1E293B] dark:text-white">
                    Agregar a pantalla de inicio
                  </strong>
                  .
                </li>
                <li>
                  Confirma tocando{' '}
                  <strong className="text-[#1E293B] dark:text-white">Agregar</strong> para usar
                  ClassTime como aplicación.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-lg bg-[#4778E8] py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (variant === 'card') {
    return (
      <p className="text-sm text-[#475569] dark:text-slate-400">
        Si tu navegador lo permite, puedes instalar ClassTime desde el menú de Chrome o Edge
        mediante la opción «Instalar aplicación».
      </p>
    );
  }

  return null;
};

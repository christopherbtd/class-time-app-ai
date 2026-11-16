import React, {useRef, useState} from 'react';
import {
  Download,
  Moon,
  RotateCcw,
  Save,
  Smartphone,
  Sun,
  Trash2,
  Upload,
} from 'lucide-react';
import {PWAInstallButton} from '../components/PWAInstallButton';
import {ConfirmModal} from '../components/ui/ConfirmModal';
import {useClassTime} from '../context/ClassTimeContext';

export const ConfiguracionPage: React.FC = () => {
  const {
    settingsDraft,
    hasUnsavedSettings,
    updateSettingsDraft,
    commitSettings,
    discardSettingsDraft,
    exportDataJSON,
    importDataJSON,
    resetAllData,
    loadDemoData,
  } = useClassTime();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [confirmAction, setConfirmAction] = useState<'reset' | 'demo' | null>(null);
  const [formError, setFormError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsDraft.studentName.trim()) {
      setFormError('Ingresa tu nombre de estudiante.');
      return;
    }
    if (!settingsDraft.institution.trim()) {
      setFormError('Ingresa el nombre de tu establecimiento.');
      return;
    }
    if (!settingsDraft.academicYear.trim()) {
      setFormError('Ingresa el año académico.');
      return;
    }
    setFormError('');
    commitSettings();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        importDataJSON(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Perfil Académico y Apariencia */}
      <section className="card-surface rounded-2xl p-6">
        <div className="pb-4 border-b border-[#F1F5F9] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[#1E293B] dark:text-slate-100">
              Perfil académico y apariencia
            </h2>
            <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">
              Los cambios se guardarán en tu dispositivo únicamente cuando presiones «Guardar».
            </p>
          </div>
          {hasUnsavedSettings && (
            <span className="text-xs font-semibold text-[#B45309] dark:text-amber-400">
              Cambios pendientes sin guardar
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5" noValidate>
          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3.5 py-2.5 text-sm text-[#B91C1C] dark:text-red-300"
            >
              {formError}
            </div>
          )}

          <div>
            <label
              htmlFor="cfg-name"
              className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
            >
              Nombre del estudiante
            </label>
            <input
              id="cfg-name"
              type="text"
              value={settingsDraft.studentName}
              onChange={(e) => {
                updateSettingsDraft({studentName: e.target.value});
                if (formError) setFormError('');
              }}
              placeholder="Ej. Martín Valenzuela"
              className="input-field w-full"
              maxLength={80}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="cfg-institution"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Establecimiento
              </label>
              <input
                id="cfg-institution"
                type="text"
                value={settingsDraft.institution}
                onChange={(e) => {
                  updateSettingsDraft({institution: e.target.value});
                  if (formError) setFormError('');
                }}
                placeholder="Ej. Liceo Bicentenario o Universidad"
                className="input-field w-full"
                maxLength={80}
              />
            </div>

            <div>
              <label
                htmlFor="cfg-year"
                className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-1.5"
              >
                Año académico
              </label>
              <input
                id="cfg-year"
                type="text"
                inputMode="numeric"
                value={settingsDraft.academicYear}
                onChange={(e) => {
                  updateSettingsDraft({academicYear: e.target.value});
                  if (formError) setFormError('');
                }}
                placeholder="2026"
                className="input-field w-full font-mono-tabular"
                maxLength={12}
              />
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-[#1E293B] dark:text-slate-200 mb-2">
              Apariencia
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateSettingsDraft({theme: 'light'})}
                aria-pressed={settingsDraft.theme === 'light'}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                  settingsDraft.theme === 'light'
                    ? 'border-[#4778E8] bg-[#4778E8]/8 text-[#1E293B] dark:text-white'
                    : 'border-[#E2E8F0] dark:border-slate-700 hover:bg-[#F7F8FC] dark:hover:bg-slate-800/60 text-[#475569] dark:text-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#F59E0B] shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Modo claro</p>
                  <p className="text-xs text-[#475569] dark:text-slate-400">
                    Superficie luminosa de estudio
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateSettingsDraft({theme: 'dark'})}
                aria-pressed={settingsDraft.theme === 'dark'}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                  settingsDraft.theme === 'dark'
                    ? 'border-[#4778E8] bg-[#4778E8]/12 text-[#1E293B] dark:text-white'
                    : 'border-[#E2E8F0] dark:border-slate-700 hover:bg-[#F7F8FC] dark:hover:bg-slate-800/60 text-[#475569] dark:text-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-[#7BA3F7] shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Modo oscuro</p>
                  <p className="text-xs text-[#475569] dark:text-slate-400">
                    Descanso visual nocturno
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormError('');
                discardSettingsDraft();
              }}
              disabled={!hasUnsavedSettings}
              className="rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-[#1E293B] dark:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-700 disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#4778E8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3B67D1] transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </section>

      {/* Administración de datos */}
      <section className="card-surface rounded-2xl p-6 space-y-4">
        <div className="pb-4 border-b border-[#F1F5F9] dark:border-slate-800">
          <h2 className="text-base font-semibold text-[#1E293B] dark:text-slate-100">
            Administración de datos
          </h2>
          <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">
            Toda tu información académica se guarda localmente en este navegador.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={exportDataJSON}
            className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800/70 px-4 py-3 text-left hover:bg-[#F7F8FC] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#4778E8] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100">
                Exportar respaldo
              </p>
              <p className="text-xs text-[#475569] dark:text-slate-400">
                Descarga un archivo JSON con tus datos
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800/70 px-4 py-3 text-left hover:bg-[#F7F8FC] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#4778E8] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100">
                Importar respaldo
              </p>
              <p className="text-xs text-[#475569] dark:text-slate-400">
                Restaura desde un archivo JSON guardado
              </p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setConfirmAction('demo')}
            className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800/70 px-4 py-3 text-left hover:bg-[#F7F8FC] dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#475569] dark:text-slate-300 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100">
                Cargar datos de ejemplo
              </p>
              <p className="text-xs text-[#475569] dark:text-slate-400">
                Restaura asignaturas y tareas demostrativas
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setConfirmAction('reset')}
            className="flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-[#EF4444] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#B91C1C] dark:text-red-400">
                Borrar todos los datos
              </p>
              <p className="text-xs text-[#475569] dark:text-slate-400">
                Deja tu organizador completamente vacío
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Aplicación Instalable (PWA) */}
      <section className="card-surface rounded-2xl p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#4778E8]/10 text-[#4778E8] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="space-y-3">
            <div>
              <h2 className="text-base font-semibold text-[#1E293B] dark:text-slate-100">
                Aplicación web progresiva (PWA)
              </h2>
              <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">
                Instala ClassTime en tu computador o celular para acceder más rápido y consultar tu
                horario incluso sin conexión.
              </p>
            </div>
            <PWAInstallButton variant="card" />
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={confirmAction === 'reset'}
        title="Borrar todos los datos"
        message="Esta acción eliminará todas tus asignaturas, clases, tareas y evaluaciones guardadas en este navegador. Tu nombre y configuración se conservarán."
        confirmLabel="Sí, borrar todo"
        isDestructive={true}
        onConfirm={() => {
          resetAllData();
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmModal
        isOpen={confirmAction === 'demo'}
        title="Cargar datos de ejemplo"
        message="Se reemplazarán tus asignaturas, horario, tareas y evaluaciones actuales por un conjunto de datos académicos de ejemplo."
        confirmLabel="Cargar ejemplos"
        isDestructive={false}
        onConfirm={() => {
          loadDemoData();
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
};

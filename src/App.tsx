import React from 'react';
import {MobileNav} from './components/MobileNav';
import {OfflineIndicator} from './components/OfflineIndicator';
import {Sidebar} from './components/Sidebar';
import {TopBar} from './components/TopBar';
import {EvaluationModal} from './components/modals/EvaluationModal';
import {ScheduleModal} from './components/modals/ScheduleModal';
import {SubjectModal} from './components/modals/SubjectModal';
import {TaskModal} from './components/modals/TaskModal';
import {ToastContainer} from './components/ui/ToastContainer';
import {ClassTimeProvider, useClassTime} from './context/ClassTimeContext';
import {AsignaturasPage} from './pages/AsignaturasPage';
import {ConfiguracionPage} from './pages/ConfiguracionPage';
import {EvaluacionesPage} from './pages/EvaluacionesPage';
import {HorarioPage} from './pages/HorarioPage';
import {InicioPage} from './pages/InicioPage';
import {TareasPage} from './pages/TareasPage';

const ClassTimeShell: React.FC = () => {
  const {activeSection, activeModal, setActiveModal, toasts, dismissToast} = useClassTime();

  const renderPage = () => {
    switch (activeSection) {
      case 'inicio':
        return <InicioPage />;
      case 'horario':
        return <HorarioPage />;
      case 'asignaturas':
        return <AsignaturasPage />;
      case 'tareas':
        return <TareasPage />;
      case 'evaluaciones':
        return <EvaluacionesPage />;
      case 'configuracion':
        return <ConfiguracionPage />;
    }
  };

  return (
    <div className="min-h-dvh bg-[#F7F8FC] dark:bg-[#0F172A] text-[#1E293B] dark:text-slate-100 flex">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopBar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-10 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>

      <MobileNav />
      <OfflineIndicator />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Modals */}
      <SubjectModal
        isOpen={activeModal?.type === 'subject'}
        editingSubject={activeModal?.type === 'subject' ? activeModal.item : undefined}
        onClose={() => setActiveModal(null)}
      />
      <ScheduleModal
        isOpen={activeModal?.type === 'schedule'}
        editingBlock={activeModal?.type === 'schedule' ? activeModal.item : undefined}
        defaultDay={activeModal?.type === 'schedule' ? activeModal.defaultDay : undefined}
        onClose={() => setActiveModal(null)}
      />
      <TaskModal
        isOpen={activeModal?.type === 'task'}
        editingTask={activeModal?.type === 'task' ? activeModal.item : undefined}
        onClose={() => setActiveModal(null)}
      />
      <EvaluationModal
        isOpen={activeModal?.type === 'evaluation'}
        editingEvaluation={activeModal?.type === 'evaluation' ? activeModal.item : undefined}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ClassTimeProvider>
      <ClassTimeShell />
    </ClassTimeProvider>
  );
}

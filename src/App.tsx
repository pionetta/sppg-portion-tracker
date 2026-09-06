import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { seedInitialDataIfNeeded } from './db/seedData';
import { ToastProvider } from './components/common/ToastContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNavigation, NavTab } from './components/layout/BottomNavigation';
import { DashboardView } from './components/dashboard/DashboardView';
import { PortioningView } from './components/portioning/PortioningView';
import { SchoolListView } from './components/schools/SchoolListView';
import { DailyDistributionView } from './components/distribution/DailyDistributionView';
import { HistoryView } from './components/history/HistoryView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { LoadingState } from './components/common/States';
import { Truck, School } from 'lucide-react';

export function AppContent() {
  const [currentDate, setCurrentDate] = useState<string>(() => format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [historySubTab, setHistorySubTab] = useState<'history' | 'reports'>('history');
  const [schoolsSubTab, setSchoolsSubTab] = useState<'daily' | 'master'>('daily');

  useEffect(() => {
    seedInitialDataIfNeeded().finally(() => {
      setIsInitializing(false);
    });
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <LoadingState message="Menyiapkan database SPPG Portion Tracker..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col text-[#111111] selection:bg-indigo-100">
      {/* Top Mobile Header */}
      <AppHeader
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onRefresh={handleRefresh}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full" key={`${currentDate}-${refreshKey}`}>
        {activeTab === 'dashboard' && (
          <DashboardView currentDate={currentDate} onNavigate={setActiveTab} />
        )}

        {activeTab === 'production' && (
          <PortioningView currentDate={currentDate} />
        )}

        {activeTab === 'schools' && (
          <div className="space-y-3">
            <div className="max-w-2xl mx-auto px-4 pt-2">
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-200/80 shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_2px_rgba(255,255,255,0.8)] backdrop-blur-md">
                <button
                  onClick={() => setSchoolsSubTab('daily')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                    schoolsSubTab === 'daily'
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0_4px_12px_-2px_rgba(79,70,229,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2)] scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  Pengantaran Harian
                </button>
                <button
                  onClick={() => setSchoolsSubTab('master')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                    schoolsSubTab === 'master'
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0_4px_12px_-2px_rgba(79,70,229,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2)] scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  Master Data Sekolah
                </button>
              </div>
            </div>

            {schoolsSubTab === 'daily' ? (
              <DailyDistributionView currentDate={currentDate} />
            ) : (
              <SchoolListView />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="max-w-2xl mx-auto px-4 pt-2">
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-200/80 shadow-[inset_0_2px_4px_rgba(15,23,42,0.06),inset_0_-1px_2px_rgba(255,255,255,0.8)] backdrop-blur-md">
                <button
                  onClick={() => setHistorySubTab('history')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                    historySubTab === 'history'
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0_4px_12px_-2px_rgba(79,70,229,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2)] scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  Riwayat Produksi
                </button>
                <button
                  onClick={() => setHistorySubTab('reports')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                    historySubTab === 'reports'
                      ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0_4px_12px_-2px_rgba(79,70,229,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2)] scale-[1.01]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  Laporan & Ekspor
                </button>
              </div>
            </div>

            {historySubTab === 'history' ? <HistoryView /> : <ReportsView />}
          </div>
        )}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

import React from 'react';
import { LayoutDashboard, ClipboardList, School, History, Settings } from 'lucide-react';

export type NavTab = 'dashboard' | 'production' | 'schools' | 'history' | 'settings';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'production' as NavTab,
      label: 'Produksi',
      icon: ClipboardList,
    },
    {
      id: 'schools' as NavTab,
      label: 'Sekolah',
      icon: School,
    },
    {
      id: 'history' as NavTab,
      label: 'Riwayat',
      icon: History,
    },
    {
      id: 'settings' as NavTab,
      label: 'Pengaturan',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-40 px-3.5 sm:px-6 pointer-events-none no-print">
      <nav className="max-w-md mx-auto pointer-events-auto bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-full px-3 py-2 border border-slate-200/90 shadow-[0_16px_38px_-6px_rgba(15,23,42,0.18),0_6px_16px_-2px_rgba(15,23,42,0.08),inset_0_2px_3px_#fff,inset_0_-2px_4px_rgba(15,23,42,0.04)]">
        <div className="grid grid-cols-5 gap-1 items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl sm:rounded-full transition-all cursor-pointer select-none min-h-[48px] active:scale-95 ${
                  isActive
                    ? 'text-indigo-600 font-bold'
                    : 'text-[#8A8A8A] hover:text-[#111111] font-medium'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl sm:rounded-full transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 shadow-[0_2px_8px_rgba(99,102,241,0.18),inset_0_2px_3px_#fff,inset_0_-1px_2px_rgba(99,102,241,0.1)]'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-2'}`} />
                </div>
                <span className="text-[10px] sm:text-[10.5px] mt-0.5 tracking-tight truncate w-full text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

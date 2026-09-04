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
    <nav className="fixed bottom-0 left-0 right-0 z-40 clay-dock px-3 py-1.5 pb-safe no-print">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1.5 h-14 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer select-none min-h-[48px] active:scale-95 ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-[#8A8A8A] hover:text-[#111111] font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-600 border border-indigo-200/70 shadow-[inset_0_2px_4px_rgba(99,102,241,0.14),0_1px_2px_rgba(0,0,0,0.03)]'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10.5px] mt-0.5 tracking-tight truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

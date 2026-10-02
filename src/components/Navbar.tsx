import React from 'react';
import { Shield, Bell, User, Plus, RefreshCw, GraduationCap, Building, UserPlus, LogIn, ChevronDown } from 'lucide-react';
import { UserRole, Notification, AppUser } from '../types';

interface NavbarProps {
  currentUser: AppUser;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenReportModal: () => void;
  notifications: Notification[];
  onOpenNotifications: () => void;
  onResetData: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenReportModal,
  notifications,
  onOpenNotifications,
  onResetData,
  onOpenAuthModal
}) => {
  const unreadCount = notifications.filter(n => {
    if (n.read) return false;
    if (currentRole === 'admin') return n.user_role === 'admin';
    if (currentRole === 'security') return n.user_role === 'security';
    return n.user_role === 'student' && n.user_id === currentUser.id;
  }).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onTabChange(currentRole === 'student' ? 'catalog' : currentRole === 'security' ? 'claims' : 'overview')}
            className="text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#5C1D2D] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
                UF
              </span>
              <div>
                <span className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-[#5C1D2D] transition-colors">
                  UniFound
                </span>
                <span className="hidden xl:inline-block ml-2 text-xs font-normal text-neutral-500">
                  Campus Custody & Recovery
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links for 3 Users */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-neutral-600">
          {currentRole === 'student' && (
            <>
              <button
                onClick={() => onTabChange('catalog')}
                className={`py-1 transition-colors hover:text-neutral-900 cursor-pointer ${
                  activeTab === 'catalog' ? 'text-[#5C1D2D] font-bold border-b-2 border-[#5C1D2D]' : ''
                }`}
              >
                Browse Registry
              </button>
              <button
                onClick={() => onTabChange('my-reports')}
                className={`py-1 transition-colors hover:text-neutral-900 cursor-pointer ${
                  activeTab === 'my-reports' ? 'text-[#5C1D2D] font-bold border-b-2 border-[#5C1D2D]' : ''
                }`}
              >
                My Reports & Claims
              </button>
              <button
                onClick={() => onTabChange('matching')}
                className={`py-1 transition-colors hover:text-neutral-900 cursor-pointer ${
                  activeTab === 'matching' ? 'text-[#5C1D2D] font-bold border-b-2 border-[#5C1D2D]' : ''
                }`}
              >
                Smart Match Radar
              </button>
            </>
          )}

          {currentRole === 'security' && (
            <>
              <button
                onClick={() => onTabChange('claims')}
                className={`py-1 transition-colors hover:text-neutral-900 cursor-pointer ${
                  activeTab === 'claims' ? 'text-[#5C1D2D] font-bold border-b-2 border-[#5C1D2D]' : ''
                }`}
              >
                Gatehouse Verification Desk
              </button>
              <button
                onClick={() => onTabChange('inventory')}
                className={`py-1 transition-colors hover:text-neutral-900 cursor-pointer ${
                  activeTab === 'inventory' ? 'text-[#5C1D2D] font-bold border-b-2 border-[#5C1D2D]' : ''
                }`}
              >
                Vault Custody Registry
              </button>
              <button
                onClick={() => onTabChange('overview')}
                className={`py-1 transition-colors hover:text-neutral-900 cursor-pointer ${
                  activeTab === 'overview' ? 'text-[#5C1D2D] font-bold border-b-2 border-[#5C1D2D]' : ''
                }`}
              >
                Custody KPIs
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => onTabChange('overview')}
                className={`py-1 transition-colors hover:text-neutral-900 cursor-pointer ${
                  activeTab === 'overview' ? 'text-[#5C1D2D] font-bold border-b-2 border-[#5C1D2D]' : ''
                }`}
              >
                Executive Overview
              </button>
              <button
                onClick={() => onTabChange('reports')}
                className={`py-1 transition-colors hover:text-neutral-900 cursor-pointer ${
                  activeTab === 'reports' ? 'text-[#5C1D2D] font-bold border-b-2 border-[#5C1D2D]' : ''
                }`}
              >
                Custody & Recovery Audit
              </button>
              <button
                onClick={() => onTabChange('inventory')}
                className={`py-1 transition-colors hover:text-neutral-900 cursor-pointer ${
                  activeTab === 'inventory' ? 'text-[#5C1D2D] font-bold border-b-2 border-[#5C1D2D]' : ''
                }`}
              >
                Property Ledger
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Three User Role Selector, Auth Switcher, Notifications & CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Three Users Role Switcher */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl text-xs font-semibold text-neutral-600">
            <button
              onClick={() => {
                onRoleChange('student');
                onTabChange('catalog');
              }}
              title="Student Portal"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentRole === 'student' ? 'bg-white text-[#5C1D2D] shadow-xs font-bold' : 'hover:text-neutral-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student</span>
            </button>
            
            <button
              onClick={() => {
                onRoleChange('security');
                onTabChange('claims');
              }}
              title="Campus Security Desk"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentRole === 'security' ? 'bg-white text-[#5C1D2D] shadow-xs font-bold' : 'hover:text-neutral-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Security</span>
            </button>

            <button
              onClick={() => {
                onRoleChange('admin');
                onTabChange('overview');
              }}
              title="Dean / Senate Administration"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentRole === 'admin' ? 'bg-white text-[#5C1D2D] shadow-xs font-bold' : 'hover:text-neutral-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dean / Admin</span>
            </button>
          </div>

          {/* Active User Persona & Register Trigger */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-xs transition-colors cursor-pointer"
            title="Institutional Account & Profile"
          >
            <div className="w-5 h-5 rounded-full bg-[#5C1D2D] text-white flex items-center justify-center font-bold text-[10px]">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <span className="font-bold text-neutral-800 block text-[11px] leading-tight truncate max-w-[100px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono block leading-none">
                {currentUser.reg_or_badge_number}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="Open notifications"
            className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#5C1D2D] rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Reset African Campus Demo Data"
            className="hidden xl:flex p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#5C1D2D] hover:bg-[#481421] rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Report Item</span>
          </button>
        </div>

      </div>
    </header>
  );
};

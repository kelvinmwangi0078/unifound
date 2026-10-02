/**
 * UniFound - Campus Lost & Found Management System
 * Conforms to academic requirements by Kumar et al. (2022) & Wanjiru (2021)
 * Tailored for African University Context with 3 Stakeholder Personas & Registration
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { ReportModal } from './components/ReportModal';
import { ClaimModal } from './components/ClaimModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { storage } from './services/storage';
import { Item, Claim, Notification, UserRole, AppUser, SmartMatch, SystemStats, Student, Admin } from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { PRESET_USERS } from './data/initialData';

export default function App() {
  // Current active user (from 3 core roles: Student, Security Officer, Admin)
  const [currentUser, setCurrentUser] = useState<AppUser>(storage.getCurrentUser());
  const [currentRole, setCurrentRole] = useState<UserRole>(storage.getCurrentUser().role);
  const [activeTab, setActiveTab] = useState<string>('catalog');
  
  // Data state
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<SystemStats>(storage.getSystemStats());
  const [smartMatches, setSmartMatches] = useState<SmartMatch[]>([]);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' } | null>(null);

  // Sync data from storage
  const refreshData = () => {
    const loadedItems = storage.getItems();
    const loadedClaims = storage.getClaims();
    const loadedNotifs = storage.getNotifications();
    const currentStats = storage.getSystemStats();
    const matches = storage.findMatches();

    setItems(loadedItems);
    setClaims(loadedClaims);
    setNotifications(loadedNotifs);
    setStats(currentStats);
    setSmartMatches(matches);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Role switching
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // Find matching preset user for this role if current user has different role
    if (currentUser.role !== newRole) {
      const matchPreset = PRESET_USERS.find(u => u.role === newRole);
      if (matchPreset) {
        setCurrentUser(matchPreset);
        storage.setCurrentUser(matchPreset);
      }
    }

    if (newRole === 'student') {
      setActiveTab('catalog');
    } else if (newRole === 'security') {
      setActiveTab('claims');
    } else {
      setActiveTab('overview');
    }
  };

  // Select user from Auth Modal
  const handleSelectUser = (selectedUser: AppUser) => {
    setCurrentUser(selectedUser);
    setCurrentRole(selectedUser.role);
    storage.setCurrentUser(selectedUser);

    if (selectedUser.role === 'student') {
      setActiveTab('catalog');
    } else if (selectedUser.role === 'security') {
      setActiveTab('claims');
    } else {
      setActiveTab('overview');
    }

    showToast('User Account Active', `Authenticated as ${selectedUser.name} (${selectedUser.role.toUpperCase()})`);
  };

  // Registration handler
  const handleRegisterUser = (userData: Omit<AppUser, 'id' | 'date_registered'>) => {
    const newUser = storage.registerUser(userData);
    refreshData();
    showToast('Registration Successful', `Account created for ${newUser.name}. Welcome to UniFound!`);
    return newUser;
  };

  const handleCreateReport = (itemData: any) => {
    const created = storage.addItem(itemData);
    refreshData();
    showToast(
      created.type === 'found' ? 'Property Turned In Successfully' : 'Missing Report Registered',
      `Item #${created.item_id} logged into campus registry at ${created.location}.`
    );
  };

  const handleInitiateClaim = (item: Item) => {
    setSelectedItem(item);
    setIsClaimModalOpen(true);
  };

  const handleSubmitClaim = (claimData: any) => {
    const newClaim = storage.submitClaim(claimData);
    refreshData();
    showToast(
      'Ownership Claim Transmitted',
      `Claim #${newClaim.claim_id} received. Central Security Gatehouse will verify and notify you.`
    );
  };

  const handleVerifyClaim = (claimId: number, decision: 'Approved' | 'Rejected', notes: string) => {
    storage.verifyClaim(claimId, decision, currentUser.id, currentUser.name, notes);
    refreshData();
    showToast(
      decision === 'Approved' ? 'Claim Approved' : 'Claim Rejected',
      `Adjudication recorded for Claim #${claimId} by ${currentUser.name}. Notification dispatched to student.`
    );
  };

  const handleMarkReunited = (itemId: number, notes?: string) => {
    storage.markItemReunited(itemId, currentUser.name, notes);
    refreshData();
    showToast(
      'Handover Complete',
      `Item #${itemId} marked as reunited. Signed off in Gatehouse physical register.`
    );
  };

  const handleViewDetails = (item: Item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleSelectNotificationItem = (itemId: number) => {
    const item = items.find(i => i.item_id === itemId);
    if (item) {
      handleViewDetails(item);
    }
  };

  const handleResetData = () => {
    storage.resetToDemo();
    const defaultUser = PRESET_USERS[0];
    setCurrentUser(defaultUser);
    setCurrentRole(defaultUser.role);
    setActiveTab('catalog');
    refreshData();
    showToast('African Campus Data Restored', 'Reset to initial campus records, African personas, and JKML custody safe.', 'info');
  };

  // Convert current user to student format for StudentPortal & modals
  const studentProfile: Student = useMemo(() => ({
    student_id: currentUser.id,
    student_name: currentUser.name,
    reg_number: currentUser.reg_or_badge_number,
    email: currentUser.email,
    phone: currentUser.phone,
    faculty: currentUser.department_or_faculty,
    date_registered: currentUser.date_registered
  }), [currentUser]);

  // Convert current user to admin/security format for AdminPortal
  const adminOrOfficerProfile: Admin = useMemo(() => ({
    admin_id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    badge_number: currentUser.reg_or_badge_number,
    department: currentUser.department_or_faculty,
    office_location: currentUser.campus_zone || 'Central Security Gatehouse (Gate A Post)'
  }), [currentUser]);

  const selectedItemClaim = useMemo(() => {
    if (!selectedItem) return undefined;
    return claims.find(c => c.item_id === selectedItem.item_id);
  }, [selectedItem, claims]);

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-900 flex flex-col antialiased">
      
      {/* Top Bar with 3 Roles & Auth Trigger */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onResetData={handleResetData}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-start gap-3 border border-neutral-700 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold">{toastMessage.title}</div>
              <div className="text-xs text-neutral-300 mt-0.5">{toastMessage.desc}</div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-auto text-neutral-400 hover:text-white text-xs font-semibold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Role Routing: 1) Student Portal, 2) Security Custody Desk, 3) Dean / Admin */}
        {currentRole === 'student' ? (
          <StudentPortal
            items={items}
            claims={claims}
            currentStudent={studentProfile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onViewDetails={handleViewDetails}
            onInitiateClaim={handleInitiateClaim}
            smartMatches={smartMatches}
          />
        ) : (
          <AdminPortal
            items={items}
            claims={claims}
            currentAdmin={adminOrOfficerProfile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onVerifyClaim={handleVerifyClaim}
            onMarkReunited={handleMarkReunited}
            onViewItemDetails={handleViewDetails}
            auditLogs={storage.getAuditLogs()}
            stats={stats}
            smartMatches={smartMatches}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#5C1D2D]">UniFound</span>
            <span>·</span>
            <span>Campus Digital Lost & Found System</span>
          </div>

          <div className="flex items-center gap-3 text-neutral-400">
            <span>Central Campus Custody & Recovery</span>
            <span>·</span>
            <span>© 2026 UniFound. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Authentication & User Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onRegisterUser={handleRegisterUser}
      />

      {/* Property Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateReport}
        userRole={currentRole}
        currentStudent={studentProfile}
      />

      {/* Ownership Claim Modal */}
      <ClaimModal
        item={selectedItem}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSubmitClaim={handleSubmitClaim}
        currentStudent={studentProfile}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        userRole={currentRole}
        currentUserId={currentUser.id}
        onInitiateClaim={handleInitiateClaim}
        onMarkReunited={(itemId) => handleMarkReunited(itemId)}
        existingClaim={selectedItemClaim}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        userRole={currentRole}
        currentUserId={currentUser.id}
        onMarkAsRead={(id) => {
          storage.markNotificationAsRead(id);
          refreshData();
        }}
        onMarkAllAsRead={() => {
          storage.markAllNotificationsAsRead(currentRole, currentUser.id);
          refreshData();
        }}
        onSelectItem={handleSelectNotificationItem}
      />

    </div>
  );
}

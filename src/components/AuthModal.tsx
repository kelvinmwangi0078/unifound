import React, { useState } from 'react';
import { X, UserPlus, LogIn, Shield, User, GraduationCap, CheckCircle2, Building, Phone, Mail, Lock, AlertCircle } from 'lucide-react';
import { AppUser, UserRole } from '../types';
import { PRESET_USERS } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  onSelectUser: (user: AppUser) => void;
  onRegisterUser: (userData: Omit<AppUser, 'id' | 'date_registered'>) => AppUser;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onRegisterUser
}) => {
  const [activeMode, setActiveMode] = useState<'signin' | 'register'>('signin');

  // Registration Form State
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Reg No or Staff ID
  const [facultyOrDept, setFacultyOrDept] = useState('School of Computing & Informatics');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !identifier.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete all required institutional registration fields.');
      return;
    }

    try {
      const newUser = onRegisterUser({
        name: fullName.trim(),
        role: regRole,
        reg_or_badge_number: identifier.trim().toUpperCase(),
        department_or_faculty: facultyOrDept.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password || '123456'
      });

      onSelectUser(newUser);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating account.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Campus User Portal & Authentication
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              African Institutional Lost & Found Management System
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-200 px-6 pt-3 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveMode('signin')}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeMode === 'signin'
                ? 'text-[#5C1D2D] border-b-2 border-[#5C1D2D]'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Directory Accounts
          </button>
          <button
            onClick={() => setActiveMode('register')}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeMode === 'register'
                ? 'text-[#5C1D2D] border-b-2 border-[#5C1D2D]'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            + Register New Student / Staff
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {activeMode === 'signin' && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                Sign in to your authorized institutional account to access your property reports, claims, and administrative desks.
              </div>

              <div className="space-y-3">
                {PRESET_USERS.map((usr) => {
                  const isCurrent = currentUser.id === usr.id;
                  const getRoleBadge = () => {
                    switch (usr.role) {
                      case 'student':
                        return { label: 'Student / Scholar', icon: GraduationCap, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
                      case 'security':
                        return { label: 'Security Officer', icon: Shield, color: 'text-blue-800 bg-blue-50 border-blue-200' };
                      case 'admin':
                      default:
                        return { label: 'Dean / Administrator', icon: Building, color: 'text-purple-800 bg-purple-50 border-purple-200' };
                    }
                  };

                  const badge = getRoleBadge();
                  const Icon = badge.icon;

                  return (
                    <div
                      key={usr.id}
                      onClick={() => {
                        onSelectUser(usr);
                        onClose();
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isCurrent
                          ? 'border-[#5C1D2D] bg-[#5C1D2D]/5 ring-1 ring-[#5C1D2D]'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl border ${badge.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-bold text-neutral-900">{usr.name}</span>
                            <span className="text-[11px] font-mono text-neutral-500 font-semibold">{usr.reg_or_badge_number}</span>
                          </div>
                          <p className="text-xs text-neutral-600">{usr.department_or_faculty}</p>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                            <span>{usr.email}</span>
                            <span>·</span>
                            <span>{usr.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#5C1D2D]">
                            <CheckCircle2 className="w-4 h-4" /> Signed In
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
                            Sign In
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Role selector */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Registration Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('student');
                      setFacultyOrDept('School of Computing & Informatics');
                    }}
                    className={`py-2 px-3 rounded-lg border font-semibold transition-all cursor-pointer ${
                      regRole === 'student'
                        ? 'border-[#5C1D2D] bg-[#5C1D2D] text-white shadow-xs'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Student / Scholar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('security');
                      setFacultyOrDept('Campus Security & Safety Directorate');
                    }}
                    className={`py-2 px-3 rounded-lg border font-semibold transition-all cursor-pointer ${
                      regRole === 'security'
                        ? 'border-[#5C1D2D] bg-[#5C1D2D] text-white shadow-xs'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Security / Gatehouse Staff
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Full Official Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zawadi Kamau or Sgt. Samuel Njoroge"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1D2D]"
                />
              </div>

              {/* Registration Number or Badge Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    {regRole === 'student' ? 'Student Admission No.' : 'Officer Badge / Staff ID'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={regRole === 'student' ? 'e.g. P15/2840/2023' : 'e.g. SEC-K4092'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono uppercase border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1D2D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Mobile Phone (M-Pesa / SMS) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1D2D]"
                  />
                </div>
              </div>

              {/* Faculty or Department */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  {regRole === 'student' ? 'Faculty / Academic School' : 'Security Desk / Directorate'}
                </label>
                <select
                  value={facultyOrDept}
                  onChange={(e) => setFacultyOrDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5C1D2D] cursor-pointer"
                >
                  <option value="School of Computing & Informatics">School of Computing & Informatics</option>
                  <option value="School of Engineering & Architecture">School of Engineering & Architecture</option>
                  <option value="Faculty of Law & Governance">Faculty of Law & Governance</option>
                  <option value="School of Business & Economics">School of Business & Economics</option>
                  <option value="Faculty of Science & Technology">Faculty of Science & Technology</option>
                  <option value="Campus Security & Property Custody">Campus Security & Property Custody</option>
                </select>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Institutional Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@student.campus.ac.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1D2D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Account Security PIN / Pass
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C1D2D]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setActiveMode('signin')}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#5C1D2D] hover:bg-[#481421] rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Complete Registration
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

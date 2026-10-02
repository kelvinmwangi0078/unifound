import React, { useState, useMemo } from 'react';
import { 
  Item, 
  Claim, 
  Admin, 
  AuditLog, 
  SystemStats, 
  SmartMatch, 
  ItemStatus 
} from '../types';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Printer, 
  FileText, 
  MapPin, 
  ArrowUpRight, 
  AlertTriangle, 
  UserCheck, 
  Box, 
  Sparkles,
  Filter,
  Check
} from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/initialData';

interface AdminPortalProps {
  items: Item[];
  claims: Claim[];
  currentAdmin: Admin;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onVerifyClaim: (claimId: number, decision: 'Approved' | 'Rejected', notes: string) => void;
  onMarkReunited: (itemId: number, notes?: string) => void;
  onViewItemDetails: (item: Item) => void;
  auditLogs: AuditLog[];
  stats: SystemStats;
  smartMatches: SmartMatch[];
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  items,
  claims,
  currentAdmin,
  activeTab,
  onTabChange,
  onVerifyClaim,
  onMarkReunited,
  onViewItemDetails,
  auditLogs,
  stats,
  smartMatches
}) => {
  // Verification action modal state
  const [selectedClaimForAction, setSelectedClaimForAction] = useState<Claim | null>(null);
  const [verificationDecision, setVerificationDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [adminNotes, setAdminNotes] = useState('');

  // Inventory filtering state
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<string>('all');
  const [inventoryZoneFilter, setInventoryZoneFilter] = useState<string>('all');

  // Report generation date filters
  const [reportDateRange, setReportDateRange] = useState('all');

  // Filtered claims queue
  const pendingClaims = useMemo(() => {
    return claims.filter(c => c.status === 'Pending');
  }, [claims]);

  const processedClaims = useMemo(() => {
    return claims.filter(c => c.status !== 'Pending');
  }, [claims]);

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return items.filter(item => {
      if (inventoryStatusFilter !== 'all' && item.status !== inventoryStatusFilter) return false;
      if (inventoryZoneFilter !== 'all' && !item.location.toLowerCase().includes(inventoryZoneFilter.toLowerCase())) return false;
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        return item.item_name.toLowerCase().includes(q) ||
               item.description.toLowerCase().includes(q) ||
               item.item_id.toString().includes(q) ||
               (item.storage_location && item.storage_location.toLowerCase().includes(q));
      }
      return true;
    });
  }, [items, inventoryStatusFilter, inventoryZoneFilter, inventorySearch]);

  // Breakdown statistics by campus location
  const locationBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      const zone = item.location.split('(')[0].trim();
      counts[zone] = (counts[zone] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [items]);

  // Breakdown by category
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const handleOpenVerification = (claim: Claim, defaultDecision: 'Approved' | 'Rejected') => {
    setSelectedClaimForAction(claim);
    setVerificationDecision(defaultDecision);
    setAdminNotes(
      defaultDecision === 'Approved'
        ? 'Claimant proof matches physical property records. Approved for physical handover upon inspection of Student ID card.'
        : 'Proof description provided is insufficient or does not match unique item indicators. Claimant invited to present further evidence at gatehouse.'
    );
  };

  const handleConfirmVerification = () => {
    if (!selectedClaimForAction) return;
    onVerifyClaim(selectedClaimForAction.claim_id, verificationDecision, adminNotes);
    setSelectedClaimForAction(null);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Context Ribbon */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
            <Shield className="w-5 h-5 text-neutral-100" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-0.5">
              <span>{currentAdmin.department}</span>
              <span>·</span>
              <span className="font-mono">{currentAdmin.badge_number}</span>
            </div>
            <h2 className="text-base font-bold text-neutral-900">{currentAdmin.name}</h2>
            <p className="text-xs text-neutral-500">{currentAdmin.office_location}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingClaims.length > 0 && (
            <button
              onClick={() => onTabChange('claims')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingClaims.length} Pending Claim{pendingClaims.length > 1 ? 's' : ''}</span>
            </button>
          )}
          <button
            onClick={() => onTabChange('reports')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* VIEW: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Platform Governance Banner matching institutional specification */}
          <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-5 border border-neutral-800 flex items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Directorate Operations & Compliance
              </span>
              <p className="text-sm font-medium text-neutral-200">
                Manage user credential verification, monitor M-Pesa escrow flow, resolve disputes, and audit platform transactions.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 font-mono text-xs text-neutral-400 bg-neutral-800/80 px-3 py-1.5 rounded-lg border border-neutral-700 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Ledger Verified</span>
            </div>
          </div>

          {/* High-Intent Metric Cards (No Hallucinated Scores, Pure Institutional Metrics) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-1">
              <span className="text-xs font-medium text-neutral-500">Total Logged Items</span>
              <div className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
                {stats.totalItems}
              </div>
              <span className="text-[11px] text-neutral-400 block">
                {stats.foundInCustodyCount} in physical custody
              </span>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-1">
              <span className="text-xs font-medium text-neutral-500">Active Missing Reports</span>
              <div className="text-2xl font-bold text-[#5C1D2D] font-mono tabular-nums">
                {stats.activeLostCount}
              </div>
              <span className="text-[11px] text-neutral-400 block">
                Reported by students & faculty
              </span>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-1">
              <span className="text-xs font-medium text-neutral-500">Pending Verification</span>
              <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
                {stats.pendingClaimsCount}
              </div>
              <span className="text-[11px] text-neutral-400 block">
                Requires security review
              </span>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-1">
              <span className="text-xs font-medium text-neutral-500">Recovery & Return Rate</span>
              <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                {stats.recoveryRatePercent}%
              </div>
              <span className="text-[11px] text-neutral-400 block">
                {stats.reunitedCount} successfully reunited
              </span>
            </div>

          </div>

          {/* Quick Actions & Recent Verification Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Action Queue */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Immediate Claim Verification Queue */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Immediate Verification Requests
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Student ownership claims requiring administrative authentication
                    </p>
                  </div>
                  <button
                    onClick={() => onTabChange('claims')}
                    className="text-xs font-semibold text-neutral-900 hover:underline cursor-pointer"
                  >
                    View All ({claims.length})
                  </button>
                </div>

                {pendingClaims.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                    All ownership claims are up to date! No pending verification requests in the queue.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingClaims.slice(0, 3).map(claim => {
                      const itemObj = items.find(i => i.item_id === claim.item_id);
                      return (
                        <div
                          key={claim.claim_id}
                          className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors space-y-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-0.5">
                                <span className="font-mono">Claim #{claim.claim_id}</span>
                                <span>·</span>
                                <span>Item #{claim.item_id}</span>
                              </div>
                              <h4 className="text-sm font-bold text-neutral-900">
                                {claim.item_name}
                              </h4>
                              <p className="text-xs text-neutral-600 mt-0.5">
                                Claimant: <strong>{claim.student_name}</strong> ({claim.student_email})
                              </p>
                            </div>
                            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded">
                              Pending Review
                            </span>
                          </div>

                          <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs space-y-1">
                            <span className="font-semibold text-neutral-800 block">Claimant's Proof:</span>
                            <p className="text-neutral-600">{claim.proof_description}</p>
                            {claim.secret_details_answer && (
                              <p className="text-neutral-500 italic">
                                Verification Answer: {claim.secret_details_answer}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            {itemObj && (
                              <button
                                onClick={() => onViewItemDetails(itemObj)}
                                className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                              >
                                View Item
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenVerification(claim, 'Rejected')}
                              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Reject Claim
                            </button>
                            <button
                              onClick={() => handleOpenVerification(claim, 'Approved')}
                              className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                            >
                              Verify & Approve
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Custody Inventory Snapshot */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      High-Value Property in Vault
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Electronics, identification documents and wallets logged in secure gatehouse custody
                    </p>
                  </div>
                  <button
                    onClick={() => onTabChange('inventory')}
                    className="text-xs font-semibold text-neutral-900 hover:underline cursor-pointer"
                  >
                    Open Custody Registry
                  </button>
                </div>

                <div className="divide-y divide-neutral-100 text-xs">
                  {items.filter(i => i.type === 'found' && (i.status === 'Found' || i.status === 'Claim_Pending')).slice(0, 4).map(item => (
                    <div
                      key={item.item_id}
                      onClick={() => onViewItemDetails(item)}
                      className="py-3 flex items-center justify-between hover:bg-neutral-50 px-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-neutral-400 text-[11px]">#{item.item_id}</span>
                        <div>
                          <span className="font-semibold text-neutral-900 block">{item.item_name}</span>
                          <span className="text-neutral-500 text-[11px]">{item.storage_location || item.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.status === 'Claim_Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.status === 'Claim_Pending' ? 'Claim Pending' : 'In Custody'}
                        </span>
                        <span className="text-neutral-400 block text-[11px] mt-0.5 font-mono">{item.date_reported}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Campus Zones & Audit Trail */}
            <div className="space-y-6">
              
              {/* Top Incident Zones */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-neutral-900">
                  Campus Loss Distribution
                </h3>
                <p className="text-xs text-neutral-500">
                  Locations with highest volume of reported misplaced property
                </p>

                <div className="space-y-2 pt-2">
                  {locationBreakdown.slice(0, 5).map(([loc, count]) => (
                    <div key={loc} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-700 truncate max-w-[180px]">{loc}</span>
                      <span className="font-mono font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                        {count} item{count > 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chain of Custody & Audit Logs */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900">
                    Chain of Custody Audit
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-mono">Live</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Immutable record of submissions, verifications, and property handovers
                </p>

                <div className="space-y-2 pt-1 max-h-[300px] overflow-y-auto">
                  {auditLogs.slice(0, 6).map(log => (
                    <div key={log.log_id} className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                        <span>{log.timestamp}</span>
                        <span>{log.log_id}</span>
                      </div>
                      <div className="font-semibold text-neutral-800">
                        {log.action.replace('_', ' ')} · {log.target}
                      </div>
                      <p className="text-neutral-500 text-[11px]">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEW: CLAIMS VERIFICATION QUEUE */}
      {activeTab === 'claims' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Ownership Claim Verification Desk
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Review claimant statements, cross-reference security records, and authorize collection passes
              </p>
            </div>
            
            <span className="text-xs text-neutral-500">
              Total Claims: <strong className="text-neutral-900 font-mono">{claims.length}</strong> (
              <strong className="text-amber-700 font-mono">{pendingClaims.length}</strong> pending)
            </span>
          </div>

          {/* Pending List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Pending Adjudication ({pendingClaims.length})
            </h3>

            {pendingClaims.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500">
                No claims awaiting adjudication.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingClaims.map(claim => {
                  const targetItem = items.find(i => i.item_id === claim.item_id);
                  return (
                    <div
                      key={claim.claim_id}
                      className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                            <span className="font-mono font-semibold text-neutral-900">Claim #{claim.claim_id}</span>
                            <span>·</span>
                            <span>Item #{claim.item_id}</span>
                            <span>·</span>
                            <span className="font-mono">{claim.claim_date}</span>
                          </div>
                          <h4 className="text-base font-bold text-neutral-900">{claim.item_name}</h4>
                          <div className="mt-1 text-xs text-neutral-600 flex items-center gap-2 flex-wrap">
                            <span>Claimant: <strong>{claim.student_name}</strong></span>
                            <span>·</span>
                            <span>Email: <strong className="font-mono">{claim.student_email}</strong></span>
                            <span>·</span>
                            <span>Phone: <strong className="font-mono">{claim.student_phone}</strong></span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-800 self-start">
                          Pending Decision
                        </span>
                      </div>

                      {/* Evidence & Custody Comparison Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        
                        {/* Student Claim */}
                        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                          <span className="font-bold text-neutral-900 block">Student Ownership Narrative:</span>
                          <p className="text-neutral-700 leading-relaxed">{claim.proof_description}</p>
                          {claim.secret_details_answer && (
                            <div className="p-2 bg-white rounded border border-neutral-200 text-neutral-800">
                              <span className="font-medium text-neutral-500 block text-[11px]">Answer to Verification Clue:</span>
                              "{claim.secret_details_answer}"
                            </div>
                          )}
                          {claim.supporting_document_ref && (
                            <p className="text-neutral-500 text-[11px]">
                              Doc reference: <strong className="text-neutral-700">{claim.supporting_document_ref}</strong>
                            </p>
                          )}
                        </div>

                        {/* Stored Property Details */}
                        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                          <span className="font-bold text-neutral-900 block">Stored Property Profile:</span>
                          {targetItem ? (
                            <>
                              <p className="text-neutral-700">{targetItem.description}</p>
                              <div className="text-[11px] text-neutral-500 space-y-0.5">
                                <div>Location Found: <strong>{targetItem.location}</strong></div>
                                <div>Vault Safe: <strong>{targetItem.storage_location || 'Central Desk'}</strong></div>
                                {targetItem.unique_identifier_hint && (
                                  <div>Expected Clue: <strong className="text-neutral-700">{targetItem.unique_identifier_hint}</strong></div>
                                )}
                              </div>
                            </>
                          ) : (
                            <p className="text-neutral-400">Item details not found in active cache.</p>
                          )}
                        </div>

                      </div>

                      {/* Decision CTA Buttons */}
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2">
                        {targetItem && (
                          <button
                            onClick={() => onViewItemDetails(targetItem)}
                            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Inspect Full Record
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenVerification(claim, 'Rejected')}
                          className="px-3.5 py-1.5 text-xs font-semibold text-[#5C1D2D] bg-[#5C1D2D]/5 hover:bg-[#5C1D2D]/10 rounded-lg transition-colors cursor-pointer"
                        >
                          Reject Claim
                        </button>
                        <button
                          onClick={() => handleOpenVerification(claim, 'Approved')}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                        >
                          Approve Ownership
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Historical Processed Claims */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Adjudicated Claims History ({processedClaims.length})
            </h3>

            <div className="divide-y divide-neutral-100 text-xs">
              {processedClaims.map(claim => (
                <div key={claim.claim_id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-neutral-500 mb-0.5">
                      <span className="font-mono">Claim #{claim.claim_id}</span>
                      <span>·</span>
                      <span className="font-semibold text-neutral-900">{claim.item_name}</span>
                      <span>·</span>
                      <span>Claimant: {claim.student_name}</span>
                    </div>
                    {claim.admin_notes && (
                      <p className="text-neutral-500 text-[11px]">Note: {claim.admin_notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {claim.collection_pass_code && (
                      <span className="font-mono text-[11px] bg-neutral-100 px-2 py-0.5 rounded font-semibold text-neutral-800">
                        {claim.collection_pass_code}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW: CUSTODY INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Institutional Custody Registry
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Physical property logged at the university security gatehouse & property holding vault
              </p>
            </div>

            <span className="text-xs text-neutral-500">
              Showing <strong className="text-neutral-900 font-mono">{filteredInventory.length}</strong> items in registry
            </span>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search inventory by item name, ID, storage locker..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <select
              value={inventoryStatusFilter}
              onChange={(e) => setInventoryStatusFilter(e.target.value)}
              className="text-xs border border-neutral-200 rounded-lg px-3 py-2 bg-white font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Found">In Custody (Unclaimed)</option>
              <option value="Claim_Pending">Claim Pending</option>
              <option value="Approved">Approved for Pickup</option>
              <option value="Reunited">Reunited / Handed Over</option>
              <option value="Lost">Lost Reports</option>
            </select>

            <select
              value={inventoryZoneFilter}
              onChange={(e) => setInventoryZoneFilter(e.target.value)}
              className="text-xs border border-neutral-200 rounded-lg px-3 py-2 bg-white font-medium cursor-pointer max-w-[160px] truncate"
            >
              <option value="all">All Campus Zones</option>
              <option value="library">Library</option>
              <option value="science">Science Complex</option>
              <option value="lecture">Lecture Theaters</option>
              <option value="hostel">Hostels</option>
              <option value="cafeteria">Cafeteria</option>
            </select>
          </div>

          {/* High-Density Data Table (conforming to tabular figures & SaaS guidelines) */}
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70 text-neutral-500 font-semibold">
                  <th className="py-3 px-4">Item ID</th>
                  <th className="py-3 px-4">Property Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Campus Location</th>
                  <th className="py-3 px-4">Custody Safe / Bin</th>
                  <th className="py-3 px-4">Reported</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredInventory.map(item => (
                  <tr key={item.item_id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-neutral-900">
                      #{item.item_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900">{item.item_name}</div>
                      <div className="text-[11px] text-neutral-400 truncate max-w-xs">{item.description}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 truncate max-w-[160px]">
                      {item.location}
                    </td>
                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                      {item.storage_location || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500 tabular-nums">
                      {item.date_reported}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.status === 'Reunited' ? 'bg-neutral-100 text-neutral-700' :
                        item.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'Claim_Pending' ? 'bg-amber-100 text-amber-800' :
                        item.status === 'Found' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#5C1D2D]/10 text-[#5C1D2D]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewItemDetails(item)}
                          className="px-2 py-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded font-medium cursor-pointer"
                        >
                          Details
                        </button>
                        {item.status === 'Approved' && (
                          <button
                            onClick={() => onMarkReunited(item.item_id, 'Handed over at Security Gatehouse')}
                            className="px-2.5 py-1 text-white bg-emerald-700 hover:bg-emerald-800 rounded font-semibold text-[11px] cursor-pointer"
                          >
                            Mark Reunited
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* VIEW: OFFICIAL AUDIT & ACTIVITY REPORT (Objective 1.4.2 Specific Report Generation) */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
          
          {/* Printable Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                  Institutional Security & Safety Directorate
                </span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900">
                Campus Property Custody & Recovery Audit Report
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Prepared by {currentAdmin.name} ({currentAdmin.badge_number}) · Generated {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                onClick={handlePrintReport}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#5C1D2D] hover:bg-[#481421] rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Report</span>
              </button>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs font-medium block">Total Property Logged</span>
              <span className="text-xl font-bold text-neutral-900 font-mono tabular-nums">{stats.totalItems}</span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs font-medium block">In Gatehouse Custody</span>
              <span className="text-xl font-bold text-emerald-800 font-mono tabular-nums">{stats.foundInCustodyCount}</span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs font-medium block">Reunited with Owners</span>
              <span className="text-xl font-bold text-neutral-900 font-mono tabular-nums">{stats.reunitedCount}</span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 text-xs font-medium block">Recovery Efficiency</span>
              <span className="text-xl font-bold text-blue-900 font-mono tabular-nums">{stats.recoveryRatePercent}%</span>
            </div>
          </div>

          {/* Detailed Categorical & Spatial Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            <div className="space-y-3">
              <h3 className="font-bold text-neutral-900 text-sm">
                Distribution by Campus Location Zone
              </h3>
              <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
                {locationBreakdown.map(([zone, count]) => (
                  <div key={zone} className="py-2.5 px-3.5 flex items-center justify-between">
                    <span className="text-neutral-700">{zone}</span>
                    <span className="font-mono font-bold text-neutral-900">{count} items</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-neutral-900 text-sm">
                Distribution by Item Category
              </h3>
              <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
                {categoryBreakdown.map(([cat, count]) => (
                  <div key={cat} className="py-2.5 px-3.5 flex items-center justify-between">
                    <span className="text-neutral-700">{cat}</span>
                    <span className="font-mono font-bold text-neutral-900">{count} items</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Custody Inventory Log Table for Report */}
          <div className="space-y-3 pt-4">
            <h3 className="font-bold text-neutral-900 text-sm">
              Current Unclaimed & Recovered Property Ledger
            </h3>
            
            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                    <th className="py-2.5 px-3">Item #</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Found Location</th>
                    <th className="py-2.5 px-3">Storage Safe</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {items.filter(i => i.type === 'found').map(item => (
                    <tr key={item.item_id}>
                      <td className="py-2 px-3 font-mono font-semibold">#{item.item_id}</td>
                      <td className="py-2 px-3 font-medium text-neutral-900">{item.item_name}</td>
                      <td className="py-2 px-3 text-neutral-600">{item.location}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-neutral-500">{item.storage_location || 'Gatehouse'}</td>
                      <td className="py-2 px-3">
                        <span className="font-semibold text-neutral-800">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custody Certification and Sign-Off */}
          <div className="pt-6 border-t border-neutral-200 text-xs text-neutral-500 space-y-4">
            <p className="leading-relaxed">
              <strong>Custody Statement:</strong> Student identifiers and contact details are restricted to designated campus custody officers. Unclaimed items are held for a designated period of 90 days before final property disposition.
            </p>

            <div className="pt-8 grid grid-cols-2 gap-8 text-neutral-700">
              <div className="border-t border-neutral-400 pt-2">
                <span className="block font-semibold">Campus Security Supervisor</span>
                <span className="text-[11px] text-neutral-500">Signature & Date</span>
              </div>
              <div className="border-t border-neutral-400 pt-2">
                <span className="block font-semibold">Dean of Students Welfare Office</span>
                <span className="text-[11px] text-neutral-500">Official Seal</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* VERIFICATION MODAL */}
      {selectedClaimForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-neutral-800" />
                <h3 className="text-base font-bold text-neutral-900">
                  Adjudicate Ownership Claim #{selectedClaimForAction.claim_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClaimForAction(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p>
                Item: <strong>{selectedClaimForAction.item_name}</strong>
              </p>
              <p>
                Claimant: <strong>{selectedClaimForAction.student_name}</strong> ({selectedClaimForAction.student_email})
              </p>
            </div>

            {/* Decision selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Official Determination
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVerificationDecision('Approved')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    verificationDecision === 'Approved'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  ✓ Approve Claim
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationDecision('Rejected')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    verificationDecision === 'Rejected'
                      ? 'bg-[#5C1D2D]/10 border-[#5C1D2D] text-[#5C1D2D] font-bold'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  ✕ Reject Claim
                </button>
              </div>
            </div>

            {/* Notes / Reason */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Official Adjudication Notes & Instructions for Student
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-2.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              />
            </div>

            {verificationDecision === 'Approved' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 leading-normal">
                Approving this claim will automatically generate a secure collection pass code and notify the student to collect their property from Room 102.
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setSelectedClaimForAction(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerification}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#5C1D2D] hover:bg-[#481421] rounded-lg transition-colors cursor-pointer"
              >
                Record Determination
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

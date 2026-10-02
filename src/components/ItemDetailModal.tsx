import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, Shield, Tag, User, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Item, UserRole, Claim } from '../types';

interface ItemDetailModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  currentUserId: number;
  onInitiateClaim?: (item: Item) => void;
  onMarkReunited?: (item_id: number) => void;
  existingClaim?: Claim;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  userRole,
  currentUserId,
  onInitiateClaim,
  onMarkReunited,
  existingClaim
}) => {
  const [imgError, setImgError] = useState(false);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Title and Close */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
              item.type === 'found' ? 'bg-neutral-900 text-white' : 'bg-[#5C1D2D] text-white'
            }`}>
              {item.type === 'found' ? 'Found Property' : 'Lost Report'}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              UF-ITEM-{item.item_id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Visual Media */}
          {item.image_url && !imgError && (
            <div className="relative aspect-16/9 w-full bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
              <img
                src={item.image_url}
                alt={item.item_name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Category */}
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span className="font-semibold text-neutral-700">{item.category}</span>
              <span>·</span>
              <span>Reported on {item.date_reported}</span>
            </div>
            <h1 className="text-xl font-bold text-neutral-900">
              {item.item_name}
            </h1>
          </div>

          {/* Description Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Description & Circumstances
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              {item.description}
            </p>
          </div>

          {/* Key Spatial & Custody Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block mb-1 font-medium">Campus Location</span>
              <div className="flex items-start gap-1.5 font-semibold text-neutral-900">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>{item.location}</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block mb-1 font-medium">Physical Custody Storage</span>
              <div className="flex items-start gap-1.5 font-semibold text-neutral-900">
                <Shield className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>{item.storage_location || 'With Reporter / Pending Gatehouse Handover'}</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block mb-1 font-medium">Date Occurred</span>
              <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>{item.date_occurred}</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block mb-1 font-medium">Current Status</span>
              <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{item.status}</span>
              </div>
            </div>
          </div>

          {/* Secret / Verification Question (If logged) */}
          {item.unique_identifier_hint && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
              <span className="font-semibold text-amber-900 block">
                Custody Verification Challenge:
              </span>
              <p className="text-amber-800">
                "{item.unique_identifier_hint}"
              </p>
            </div>
          )}

          {/* Existing Claim Notice if applicable */}
          {existingClaim && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-950">Active Claim Status</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  existingClaim.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                  existingClaim.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {existingClaim.status}
                </span>
              </div>
              <p className="text-blue-900">
                Claim submitted on <span className="font-mono">{existingClaim.claim_date}</span> by {existingClaim.student_name}.
              </p>
              {existingClaim.collection_pass_code && (
                <div className="p-2 bg-white rounded border border-blue-300 font-mono text-center font-bold text-neutral-900">
                  Collection Pass Code: {existingClaim.collection_pass_code}
                </div>
              )}
              {existingClaim.admin_notes && (
                <p className="text-neutral-600 text-[11px]">
                  <strong>Admin Note:</strong> {existingClaim.admin_notes}
                </p>
              )}
            </div>
          )}

          {/* Reporter Information */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-400" />
              <span>Logged by: {item.reporter_name} ({item.reporter_role})</span>
            </div>
            <span className="font-mono text-[11px]">{item.reporter_email}</span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <div className="text-xs text-neutral-500">
            Official University Record
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>

            {/* If Student & Item is Found & not claimed yet */}
            {userRole === 'student' && item.type === 'found' && (item.status === 'Found' || item.status === 'Claim_Pending') && onInitiateClaim && (
              <button
                onClick={() => {
                  onClose();
                  onInitiateClaim(item);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#5C1D2D] hover:bg-[#481421] rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Claim This Item
              </button>
            )}

            {/* If Admin & Item is Approved -> Handover button */}
            {userRole === 'admin' && item.status === 'Approved' && onMarkReunited && (
              <button
                onClick={() => {
                  onMarkReunited(item.item_id);
                  onClose();
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Execute Physical Handover
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Item, Student } from '../types';

interface ClaimModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (claimData: {
    item_id: number;
    student_id: number;
    student_name: string;
    student_email: string;
    student_phone: string;
    proof_description: string;
    secret_details_answer: string;
    supporting_document_ref?: string;
  }) => void;
  currentStudent: Student;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmitClaim,
  currentStudent
}) => {
  const [proofDescription, setProofDescription] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [supportingDocRef, setSupportingDocRef] = useState('');
  const [contactPhone, setContactPhone] = useState(currentStudent.phone);
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofDescription.trim() || !acknowledged) return;

    onSubmitClaim({
      item_id: item.item_id,
      student_id: currentStudent.student_id,
      student_name: currentStudent.student_name,
      student_email: currentStudent.email,
      student_phone: contactPhone,
      proof_description: proofDescription.trim(),
      secret_details_answer: secretAnswer.trim(),
      supporting_document_ref: supportingDocRef.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-neutral-800" />
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Submit Ownership Claim
              </h2>
              <p className="text-xs text-neutral-500">
                Item #{item.item_id} · {item.item_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Target Item Summary */}
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-start gap-3">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.item_name}
                className="w-16 h-16 rounded-lg object-cover border border-neutral-200 shrink-0"
              />
            )}
            <div className="text-xs space-y-1">
              <span className="font-semibold text-neutral-900 block">{item.item_name}</span>
              <span className="text-neutral-500 block">Found at: {item.location}</span>
              <span className="text-neutral-500 block">Reported: {item.date_reported}</span>
            </div>
          </div>

          {/* Verification Challenge (if available) */}
          {item.unique_identifier_hint && (
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-950">
                <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Verification Challenge from Security / Custody:</span>
              </div>
              <p className="text-xs text-blue-900 italic font-medium">
                "{item.unique_identifier_hint}"
              </p>
              <div>
                <label className="block text-[11px] font-semibold text-blue-950 mb-1">
                  Your Answer to the Challenge:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Provide precise matching details..."
                  value={secretAnswer}
                  onChange={(e) => setSecretAnswer(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* Proof of Ownership Narrative */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Detailed Proof of Ownership <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-neutral-500 mb-1.5">
              Specify hidden markings, serial numbers, wallpaper, contents, case color, or circumstances when misplaced.
            </p>
            <textarea
              required
              rows={3}
              placeholder="e.g. My initials 'KW' are engraved on the back clip; the desktop wallpaper is a blue mountain scenery; purchased in August 2024."
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all resize-none"
            />
          </div>

          {/* Supporting Reference / Student Card No */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Supporting Reference / Purchase Invoice / Serial No. (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Receipt #8891, IMEI ending in 410, or National ID number"
              value={supportingDocRef}
              onChange={(e) => setSupportingDocRef(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
            />
          </div>

          {/* Claimant Contact Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Student Reg. Number
              </label>
              <input
                type="text"
                disabled
                value={currentStudent.reg_number}
                className="w-full px-3 py-1.5 text-xs bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Contact Phone for Pickup SMS
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* University Regulation Affirmation */}
          <label className="flex items-start gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 rounded text-neutral-900 focus:ring-neutral-900"
            />
            <span className="text-[11px] text-neutral-600 leading-tight">
              I certify under university student conduct rules that this property belongs to me. I understand fraudulent claims are subject to institutional disciplinary action and gatehouse surveillance review.
            </span>
          </label>

          {/* Action buttons */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!acknowledged || !proofDescription.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#5C1D2D] hover:bg-[#481421] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Transmit Claim to Security
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

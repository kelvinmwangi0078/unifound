import React, { useState } from 'react';
import { X, Upload, Camera, AlertCircle, Check, Info } from 'lucide-react';
import { ItemType, ItemCategory, UserRole } from '../types';
import { CAMPUS_LOCATIONS, ITEM_CATEGORIES } from '../data/initialData';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: any) => void;
  userRole: UserRole;
  currentStudent: {
    student_id: number;
    student_name: string;
    email: string;
    phone: string;
  };
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userRole,
  currentStudent
}) => {
  const [type, setType] = useState<ItemType>('lost');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ItemCategory>(ITEM_CATEGORIES[0]);
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [dateOccurred, setDateOccurred] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [uniqueHint, setUniqueHint] = useState('');
  const [storageLocation, setStorageLocation] = useState('Central Security Gatehouse, Room 102');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleImageSelect = (url: string) => {
    setPreviewImage(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !description.trim()) return;

    const finalLocation = customLocation.trim() ? customLocation : location;

    onSubmit({
      type,
      item_name: itemName.trim(),
      category,
      description: description.trim(),
      location: finalLocation,
      date_occurred: dateOccurred,
      status: type === 'found' ? 'Found' : 'Lost',
      image_url: previewImage || undefined,
      storage_location: type === 'found' ? storageLocation : undefined,
      unique_identifier_hint: uniqueHint.trim() || undefined,
      reporter_id: currentStudent.student_id,
      reporter_name: currentStudent.student_name,
      reporter_email: currentStudent.email,
      reporter_phone: currentStudent.phone,
      reporter_role: userRole
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Report Campus Property
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Submit details to the official university lost and found database
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Report Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Report Classification
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-xl">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  type === 'lost'
                    ? 'bg-[#5C1D2D] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  type === 'found'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                I Found / Deposited Property
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Item Name & Brief Identifier <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Blue Dell Inspiron Laptop 15-inch, Black Leather Wallet, Student ID"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Category & Date Occurred */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all cursor-pointer"
              >
                {ITEM_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Date Misplaced / Found
              </label>
              <input
                type="date"
                required
                value={dateOccurred}
                onChange={(e) => setDateOccurred(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              />
            </div>
          </div>

          {/* Campus Location */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Campus Location Zone
            </label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setCustomLocation('');
              }}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all cursor-pointer"
            >
              {CAMPUS_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
              <option value="custom">+ Other / Specific Campus Room</option>
            </select>
            
            {location === 'custom' && (
              <input
                type="text"
                placeholder="Specify exact building, room number, or outdoor bench"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="mt-2 w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe color, brand, distinct scratches, contents, stickers, or condition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all resize-none"
            />
          </div>

          {/* Unique Identifier Question / Verification Clue (Kumar et al. 2022 anti-fraud) */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Ownership Verification Clue (Anti-Fraud)</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-normal">
              {type === 'found'
                ? 'Specify a question only the genuine owner can answer (e.g., "What is the lock screen wallpaper?" or "What name is written on page 1?"). Do not reveal this answer publicly.'
                : 'Provide a hidden identifier or serial code known only to you that Security can use to verify your claim.'}
            </p>
            <input
              type="text"
              placeholder={type === 'found' ? "Verification question for claimants..." : "Hidden serial or internal markings..."}
              value={uniqueHint}
              onChange={(e) => setUniqueHint(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Custody location if found item */}
          {type === 'found' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Physical Storage / Custody Location
              </label>
              <input
                type="text"
                placeholder="e.g. Central Security Gatehouse, Locker B-4"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              />
            </div>
          )}

          {/* Photo Attachment */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Photograph / Visual Reference
            </label>
            
            {previewImage ? (
              <div className="relative rounded-lg overflow-hidden border border-neutral-200 aspect-16/9 bg-neutral-100 flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 p-1 bg-neutral-900/80 hover:bg-neutral-900 text-white rounded-md text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-neutral-400 rounded-xl p-4 cursor-pointer bg-neutral-50 transition-colors">
                  <Camera className="w-5 h-5 text-neutral-400 mb-1" />
                  <span className="text-xs font-medium text-neutral-700">Click to upload an image from device</span>
                  <span className="text-[11px] text-neutral-500">PNG, JPG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Quick preset campus photos */}
                <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 flex-wrap">
                  <span>Attach sample photo:</span>
                  <button
                    type="button"
                    onClick={() => handleSampleImageSelect('/src/assets/images/lost_found_student_id_1790951792059.jpg')}
                    className="hover:underline text-neutral-700 font-medium cursor-pointer"
                  >
                    Smartcard
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSampleImageSelect('/src/assets/images/spectre_laptop_1790953733989.jpg')}
                    className="hover:underline text-neutral-700 font-medium cursor-pointer"
                  >
                    Laptop
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSampleImageSelect('/src/assets/images/brass_room_keys_1790953704133.jpg')}
                    className="hover:underline text-neutral-700 font-medium cursor-pointer"
                  >
                    Keys
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSampleImageSelect('/src/assets/images/casio_calculator_1790953718876.jpg')}
                    className="hover:underline text-neutral-700 font-medium cursor-pointer"
                  >
                    Calculator
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSampleImageSelect('/src/assets/images/lost_found_phone_1790951831307.jpg')}
                    className="hover:underline text-neutral-700 font-medium cursor-pointer"
                  >
                    Phone
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submitter info notice */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Logged by: <strong className="text-neutral-800">{currentStudent.student_name}</strong></span>
            <span className="font-mono text-[11px]">{currentStudent.email}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#5C1D2D] hover:bg-[#481421] rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Submit Property Report
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

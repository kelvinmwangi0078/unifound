import React, { useState } from 'react';
import { Item, UserRole } from '../types';
import { MapPin, Calendar, CheckCircle2, AlertCircle, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  userRole: UserRole;
  currentUserId: number;
  onViewDetails: (item: Item) => void;
  onInitiateClaim?: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  userRole,
  currentUserId,
  onViewDetails,
  onInitiateClaim
}) => {
  const [imgError, setImgError] = useState(false);

  // Status text styling helper
  const getStatusDisplay = () => {
    switch (item.status) {
      case 'Found':
        return {
          text: 'In Campus Custody',
          textColor: 'text-emerald-700',
          dotColor: 'bg-emerald-500'
        };
      case 'Claim_Pending':
        return {
          text: 'Verification In Progress',
          textColor: 'text-amber-700',
          dotColor: 'bg-amber-500'
        };
      case 'Approved':
        return {
          text: 'Approved for Collection',
          textColor: 'text-blue-700',
          dotColor: 'bg-blue-500'
        };
      case 'Reunited':
        return {
          text: 'Reunited with Owner',
          textColor: 'text-neutral-600',
          dotColor: 'bg-neutral-400'
        };
      case 'Lost':
      default:
        return {
          text: 'Reported Missing',
          textColor: 'text-[#5C1D2D]',
          dotColor: 'bg-[#5C1D2D]'
        };
    }
  };

  const status = getStatusDisplay();
  const isMine = item.reporter_id === currentUserId;

  return (
    <div 
      onClick={() => onViewDetails(item)}
      className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Visual Media Header */}
      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
        {item.image_url && !imgError ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400">
            <span className="text-2xl font-bold tracking-tight text-neutral-400">UF</span>
            <span className="mt-1 text-xs text-neutral-500 font-medium">{item.category}</span>
          </div>
        )}

        {/* Type Tag (Found vs Lost) with user's exact maroon color for Lost Report */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm ${
            item.type === 'found' 
              ? 'bg-neutral-900/95 text-white' 
              : 'bg-[#5C1D2D] text-white tracking-wide'
          }`}>
            {item.type === 'found' ? 'Found Property' : 'Lost Report'}
          </span>
        </div>

        {/* Reporter Indicator */}
        {isMine && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 text-[11px] font-medium bg-white/95 text-neutral-800 rounded shadow-xs">
              My Report
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1.5 flex-wrap">
            <span className="font-medium text-neutral-700">{item.category}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums">
              <Calendar className="w-3 h-3 text-neutral-400" />
              {item.date_reported}
            </span>
          </div>

          {/* Primary Item Name */}
          <h3 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1">
            {item.item_name}
          </h3>

          {/* Description */}
          <p className="mt-1 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Location line */}
          <div className="mt-2.5 flex items-center gap-1 text-xs text-neutral-500 truncate">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        {/* Card Footer: Status & Action */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
          {/* Unboxed status dot and label */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status.dotColor}`} />
            <span className={`font-medium ${status.textColor}`}>
              {status.text}
            </span>
          </div>

          {/* Action Trigger */}
          {item.type === 'found' && item.status === 'Found' && userRole === 'student' && onInitiateClaim ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInitiateClaim(item);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-[#5C1D2D] hover:bg-[#481421] rounded-md transition-colors cursor-pointer"
            >
              Claim This
            </button>
          ) : (
            <span className="text-neutral-400 group-hover:text-neutral-900 font-medium inline-flex items-center gap-0.5 transition-colors">
              Details <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

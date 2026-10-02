import React, { useState, useMemo } from 'react';
import { 
  Item, 
  Claim, 
  Student, 
  SmartMatch, 
  ItemCategory 
} from '../types';
import { ItemCard } from './ItemCard';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../data/initialData';

interface StudentPortalProps {
  items: Item[];
  claims: Claim[];
  currentStudent: Student;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onViewDetails: (item: Item) => void;
  onInitiateClaim: (item: Item) => void;
  smartMatches: SmartMatch[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  items,
  claims,
  currentStudent,
  activeTab,
  onTabChange,
  onViewDetails,
  onInitiateClaim,
  smartMatches
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'found' | 'lost'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Location filter
      if (selectedLocation !== 'all' && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.item_name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchCat) return false;
      }

      return true;
    });
  }, [items, selectedType, selectedCategory, selectedLocation, searchQuery]);

  // My items & claims
  const myReportedItems = useMemo(() => {
    return items.filter(i => i.reporter_id === currentStudent.student_id);
  }, [items, currentStudent.student_id]);

  const myClaims = useMemo(() => {
    return claims.filter(c => c.student_id === currentStudent.student_id);
  }, [claims, currentStudent.student_id]);

  // Matches relevant to this student's lost items
  const myLostMatches = useMemo(() => {
    const myLostIds = new Set(myReportedItems.filter(i => i.type === 'lost').map(i => i.item_id));
    return smartMatches.filter(m => myLostIds.has(m.lost_item.item_id));
  }, [smartMatches, myReportedItems]);

  return (
    <div className="space-y-6">
      
      {/* Smart Match Banner (if high-confidence matches found for student) */}
      {myLostMatches.length > 0 && activeTab !== 'matching' && (
        <div className="bg-neutral-900 text-white rounded-2xl p-5 shadow-sm border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-neutral-800 text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Automated Campus Match Alert: {myLostMatches.length} Potential Match Detected!
              </h2>
              <p className="text-xs text-neutral-300 mt-0.5">
                Our matching engine found found item(s) in custody closely matching your reported lost item(s).
              </p>
            </div>
          </div>
          <button
            onClick={() => onTabChange('matching')}
            className="px-4 py-2 text-xs font-semibold bg-white text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Review Smart Matches
          </button>
        </div>
      )}

      {/* View: CATALOG (Default) */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          
          {/* Hero / Filter Bar Header */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campus catalog by item name, keyword, brand, location (e.g. 'library', 'laptop', 'student id')..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 text-xs">
              
              {/* Type Segmented Buttons (Functional interactive button tabs) */}
              <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                    selectedType === 'all'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All Items ({items.length})
                </button>
                <button
                  onClick={() => setSelectedType('found')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                    selectedType === 'found'
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Found in Custody ({items.filter(i => i.type === 'found').length})
                </button>
                <button
                  onClick={() => setSelectedType('lost')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                    selectedType === 'lost'
                      ? 'bg-[#5C1D2D] text-white shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Reported Missing ({items.filter(i => i.type === 'lost').length})
                </button>
              </div>

              {/* Category & Location Selectors */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 border border-neutral-200 rounded-lg">
                  <span className="text-neutral-500 font-medium">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent font-semibold text-neutral-800 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {ITEM_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 border border-neutral-200 rounded-lg">
                  <span className="text-neutral-500 font-medium">Zone:</span>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-transparent font-semibold text-neutral-800 focus:outline-none cursor-pointer max-w-[140px] truncate"
                  >
                    <option value="all">All Locations</option>
                    <option value="library">Library</option>
                    <option value="lecture">Lecture Theaters</option>
                    <option value="science">Science Complex</option>
                    <option value="hostel">Hostels</option>
                    <option value="cafeteria">Cafeteria</option>
                  </select>
                </div>

                {(selectedCategory !== 'all' || selectedLocation !== 'all' || selectedType !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedLocation('all');
                      setSelectedType('all');
                      setSearchQuery('');
                    }}
                    className="px-2.5 py-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors font-medium cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Results Summary & Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-neutral-500">
                Displaying <strong className="text-neutral-900 font-semibold">{filteredItems.length}</strong> items in university registry
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Real-time Campus Sync
              </span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">No items match your criteria</h3>
                <p className="text-xs text-neutral-500">
                  Try adjusting your search terms, clearing filters, or submit a new missing item report so security can notify you if found.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLocation('all');
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredItems.map(item => (
                  <ItemCard
                    key={item.item_id}
                    item={item}
                    userRole="student"
                    currentUserId={currentStudent.student_id}
                    onViewDetails={onViewDetails}
                    onInitiateClaim={onInitiateClaim}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* View: MY REPORTS & CLAIMS */}
      {activeTab === 'my-reports' && (
        <div className="space-y-6">
          
          {/* Student Profile Ribbon */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                <span>Student Portal</span>
                <span>·</span>
                <span className="font-mono">{currentStudent.reg_number}</span>
              </div>
              <h2 className="text-lg font-bold text-neutral-900">{currentStudent.student_name}</h2>
              <p className="text-xs text-neutral-500 mt-0.5">{currentStudent.faculty} · {currentStudent.email}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Reported Belongings</span>
                <span className="text-base font-bold text-neutral-900 font-mono">{myReportedItems.length}</span>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Active Claims</span>
                <span className="text-base font-bold text-neutral-900 font-mono">{myClaims.length}</span>
              </div>
            </div>
          </div>

          {/* Section 1: My Submitted Claims */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  My Ownership Claims & Pickup Status
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Track security verification progress and view authorized collection passes
                </p>
              </div>
            </div>

            {myClaims.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500">
                You have not initiated any ownership claims. When you spot your misplaced item in the catalog, click "Claim This Item".
              </div>
            ) : (
              <div className="space-y-3">
                {myClaims.map(claim => (
                  <div
                    key={claim.claim_id}
                    className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                          <span className="font-mono">Claim #{claim.claim_id}</span>
                          <span>·</span>
                          <span>Item #{claim.item_id}</span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">{claim.claim_date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900">
                          {claim.item_name}
                        </h4>
                      </div>

                      {/* Claim Status Label */}
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                        claim.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {claim.status === 'Approved' ? 'Approved for Collection' : 
                         claim.status === 'Rejected' ? 'Claim Rejected' : 'Under Verification'}
                      </span>
                    </div>

                    {/* Proof Details Preview */}
                    <div className="text-xs text-neutral-600 bg-white p-3 rounded-lg border border-neutral-200/80">
                      <span className="font-semibold text-neutral-800 block mb-0.5">Submitted Proof Details:</span>
                      <p>{claim.proof_description}</p>
                      {claim.secret_details_answer && (
                        <p className="mt-1 text-neutral-500 italic">
                          Challenge response: {claim.secret_details_answer}
                        </p>
                      )}
                    </div>

                    {/* Pickup Passcode (if approved) */}
                    {claim.status === 'Approved' && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-emerald-950 block">Ready for Physical Handover!</span>
                          <span className="text-emerald-800">
                            Present this pickup code along with your Student ID Card at Central Security Gatehouse, Room 102.
                          </span>
                        </div>
                        <div className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg font-mono font-bold text-sm text-emerald-900 tracking-wider text-center shrink-0">
                          {claim.collection_pass_code}
                        </div>
                      </div>
                    )}

                    {/* Admin Notes if rejected */}
                    {claim.status === 'Rejected' && claim.admin_notes && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900">
                        <strong>Security Officer Feedback:</strong> {claim.admin_notes}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Items I Reported */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">
              Items Logged by Me
            </h3>

            {myReportedItems.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500">
                You have not submitted any lost or found reports yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myReportedItems.map(item => (
                  <ItemCard
                    key={item.item_id}
                    item={item}
                    userRole="student"
                    currentUserId={currentStudent.student_id}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* View: SMART MATCH RADAR (Kumar et al. 2022) */}
      {activeTab === 'matching' && (
        <div className="space-y-6">
          
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-bold text-neutral-900">
                Automated Smart Match Radar
              </h2>
            </div>
            <p className="text-xs text-neutral-600 max-w-2xl">
              Based on the algorithmic matching model by Kumar et al. (2022), this engine evaluates category taxonomies, semantic token overlap, spatial campus proximity, and time windows to automatically connect misplaced belongings with items turned into security.
            </p>
          </div>

          {smartMatches.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">No Potential Matches Currently</h3>
              <p className="text-xs text-neutral-500">
                When new items are reported as found that match your lost items' description or location, they will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {smartMatches.map(match => (
                <div
                  key={match.match_id}
                  className="bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 transition-all space-y-4"
                >
                  {/* Top Match Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                        {match.confidence_score}% Match Confidence
                      </span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-neutral-500">
                        {match.matching_factors.join(' · ')}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-neutral-400">
                      Algo ID: {match.match_id}
                    </span>
                  </div>

                  {/* Comparison Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                    
                    {/* Lost Side */}
                    <div className="p-3.5 bg-[#5C1D2D]/5 rounded-xl border border-[#5C1D2D]/20 text-xs space-y-2">
                      <span className="font-semibold text-[#5C1D2D] block">Reported Lost (Missing)</span>
                      <h4 className="font-bold text-neutral-900">{match.lost_item.item_name}</h4>
                      <p className="text-neutral-600 line-clamp-2">{match.lost_item.description}</p>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                        <span>Loc: {match.lost_item.location}</span>
                        <span>·</span>
                        <span>Date: {match.lost_item.date_reported}</span>
                      </div>
                    </div>

                    {/* Found Side */}
                    <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-900">Found in Custody</span>
                        <span className="text-[11px] text-emerald-800 font-medium">Item #{match.found_item.item_id}</span>
                      </div>
                      <h4 className="font-bold text-neutral-900">{match.found_item.item_name}</h4>
                      <p className="text-neutral-600 line-clamp-2">{match.found_item.description}</p>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                        <span>Loc: {match.found_item.location}</span>
                        <span>·</span>
                        <span>Custody: {match.found_item.storage_location || 'Security Gatehouse'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(match.found_item)}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Inspect Found Item
                    </button>
                    {match.found_item.status === 'Found' && (
                      <button
                        onClick={() => onInitiateClaim(match.found_item)}
                        className="px-4 py-1.5 text-xs font-semibold bg-[#5C1D2D] text-white hover:bg-[#481421] rounded-lg transition-colors shadow-xs cursor-pointer"
                      >
                        Claim Matching Item
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

/**
 * Academic & Institutional Data Model for Lost and Found Management System
 * Conforms to Chapter 3 Entity-Relationship & Database Schema Specifications
 * Enhanced for African Institutional Context (Universities & Colleges)
 */

export type UserRole = 'student' | 'security' | 'admin';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  reg_or_badge_number: string;
  phone: string;
  department_or_faculty: string;
  date_registered: string;
  password?: string;
  campus_zone?: string;
}

export interface Student {
  student_id: number;
  student_name: string;
  reg_number: string;
  email: string;
  phone: string;
  faculty: string;
  date_registered: string;
}

export interface SecurityOfficer {
  officer_id: number;
  name: string;
  email: string;
  badge_number: string;
  post_location: string;
  phone: string;
  rank: string;
}

export interface Admin {
  admin_id: number;
  name: string;
  email: string;
  badge_number: string;
  department: string;
  office_location: string;
}

export type ItemType = 'lost' | 'found';

export type ItemStatus = 
  | 'Lost'          // Still missing, owner reported
  | 'Found'         // In custody at security desk / waiting for owner claim
  | 'Claim_Pending' // Claim submitted, undergoing security verification
  | 'Approved'      // Claim verified, ready for physical pickup at Gatehouse
  | 'Reunited'      // Successfully returned to owner
  | 'Archived';     // Closed/Unclaimed beyond 90-day holding period

export type ItemCategory = 
  | 'Student Smartcards & National IDs'
  | 'Laptops & Computing Devices'
  | 'Mobile Phones & Chargers'
  | 'Campus Backpacks & Handbags'
  | 'Hostel & Room Keys'
  | 'Course Texts & Examination Cards'
  | 'Wallets, Purses & National ID Folders'
  | 'Jackets, Lab Coats & Clothing'
  | 'Watches & Wrist Accessories'
  | 'Other Campus Belongings';

export interface Item {
  item_id: number;
  type: ItemType; // 'lost' (missing) or 'found' (deposited/turned in)
  item_name: string;
  category: ItemCategory;
  description: string;
  location: string; // Campus zone / lecture hall / hostel
  date_reported: string; // ISO date
  date_occurred: string; // When lost or found
  status: ItemStatus;
  image_url?: string;
  storage_location?: string; // e.g. "Gate A Security Post - Locker B-04"
  unique_identifier_hint?: string; // Challenge clue (e.g. "National ID serial", "Lock wallpaper")
  reporter_id: number;
  reporter_name: string;
  reporter_email: string;
  reporter_phone: string;
  reporter_role: UserRole;
  matched_item_id?: number;
}

export type ClaimStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Claim {
  claim_id: number;
  item_id: number;
  item_name: string;
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  claim_date: string;
  proof_description: string;
  secret_details_answer: string;
  supporting_document_ref?: string; // e.g. "National ID 34912091 or Examination Card"
  status: ClaimStatus;
  verified_by?: number;
  verified_by_name?: string;
  verification_date?: string;
  admin_notes?: string;
  collection_pass_code?: string;
}

export interface Notification {
  notification_id: string;
  user_id: number;
  user_role: UserRole;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link_item_id?: number;
  type: 'match_alert' | 'claim_update' | 'item_logged' | 'security_announcement';
}

export interface SmartMatch {
  match_id: string;
  lost_item: Item;
  found_item: Item;
  confidence_score: number; // 0 to 100
  matching_factors: string[];
  status: 'suggested' | 'notified' | 'dismissed' | 'confirmed';
}

export interface AuditLog {
  log_id: string;
  timestamp: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  target: string;
  details: string;
}

export interface SystemStats {
  totalItems: number;
  activeLostCount: number;
  foundInCustodyCount: number;
  pendingClaimsCount: number;
  reunitedCount: number;
  recoveryRatePercent: number;
  registeredUsersCount: number;
}

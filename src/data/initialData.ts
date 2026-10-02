import { Student, SecurityOfficer, Admin, AppUser, Item, Claim, Notification, AuditLog } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    student_id: 101,
    student_name: 'Zawadi Kamau',
    reg_number: 'P15/2840/2023',
    email: 'zawadi.kamau@student.campus.ac.ke',
    phone: '+254 712 345 678',
    faculty: 'School of Computing & Informatics',
    date_registered: '2026-01-15'
  },
  {
    student_id: 102,
    student_name: 'Kwame Mensah',
    reg_number: 'E22/1940/2024',
    email: 'kwame.mensah@student.campus.ac.ke',
    phone: '+254 722 890 123',
    faculty: 'School of Engineering',
    date_registered: '2026-02-01'
  },
  {
    student_id: 103,
    student_name: 'Amina Bello',
    reg_number: 'C01/0819/2022',
    email: 'amina.bello@student.campus.ac.ke',
    phone: '+254 733 456 789',
    faculty: 'Faculty of Law & Governance',
    date_registered: '2026-01-20'
  }
];

export const INITIAL_SECURITY_OFFICERS: SecurityOfficer[] = [
  {
    officer_id: 201,
    name: 'Sergeant Samuel Njoroge',
    email: 'samuel.njoroge@security.campus.ac.ke',
    badge_number: 'SEC-K4092',
    post_location: 'Central Security Gatehouse (Gate A Entry Post)',
    phone: '+254 701 928 374',
    rank: 'Custody Sergeant & Desk Officer'
  },
  {
    officer_id: 202,
    name: 'Corporal Halima Hassan',
    email: 'halima.hassan@security.campus.ac.ke',
    badge_number: 'SEC-K5188',
    post_location: 'Jomo Kenyatta Memorial Library Security Post',
    phone: '+254 702 334 112',
    rank: 'Patrol Corporal'
  }
];

export const INITIAL_ADMINS: Admin[] = [
  {
    admin_id: 301,
    name: 'Dr. Josephat Mutua',
    email: 'josephat.mutua@admin.campus.ac.ke',
    badge_number: 'ADM-8801',
    department: 'Directorate of Student Affairs & Welfare',
    office_location: 'Administration Block, 2nd Floor, Room 204'
  }
];

export const PRESET_USERS: AppUser[] = [
  {
    id: 101,
    name: 'Zawadi Kamau',
    email: 'zawadi.kamau@student.campus.ac.ke',
    role: 'student',
    reg_or_badge_number: 'P15/2840/2023',
    phone: '+254 712 345 678',
    department_or_faculty: 'School of Computing & Informatics',
    date_registered: '2026-01-15'
  },
  {
    id: 201,
    name: 'Sergeant Samuel Njoroge',
    email: 'samuel.njoroge@security.campus.ac.ke',
    role: 'security',
    reg_or_badge_number: 'SEC-K4092',
    phone: '+254 701 928 374',
    department_or_faculty: 'Campus Security & Property Custody',
    date_registered: '2024-03-10',
    campus_zone: 'Central Security Gatehouse (Gate A)'
  },
  {
    id: 301,
    name: 'Dr. Josephat Mutua',
    email: 'josephat.mutua@admin.campus.ac.ke',
    role: 'admin',
    reg_or_badge_number: 'ADM-8801',
    phone: '+254 720 000 880',
    department_or_faculty: 'Directorate of Student Affairs & Welfare',
    date_registered: '2023-08-01',
    campus_zone: 'Administration Block Room 204'
  }
];

export const CAMPUS_LOCATIONS = [
  'Jomo Kenyatta Memorial Library (Level 1 Info Desk)',
  'Jomo Kenyatta Memorial Library (Quiet Study Commons)',
  '8-4-4 Multi-Purpose Lecture Complex (Hall B)',
  '8-4-4 Multi-Purpose Lecture Complex (Auditorium 1)',
  'Science & Computing Block (Chiromo Lab 4)',
  'Main Campus Student Mess & Central Cafeteria',
  'Hostel Hall 9 (Men’s Residence Common Room)',
  'Hostel Hall 3 (Women’s Residence Reception Desk)',
  'Central Security Gatehouse (Gate A Post)',
  'Taifa Hall & Chancellor’s Court',
  'School of Engineering Workshops',
  'Sports Pavilion & University Grounds'
];

export const ITEM_CATEGORIES = [
  'Student Smartcards & National IDs',
  'Laptops & Computing Devices',
  'Mobile Phones & Chargers',
  'Campus Backpacks & Handbags',
  'Hostel & Room Keys',
  'Course Texts & Examination Cards',
  'Wallets, Purses & National ID Folders',
  'Jackets, Lab Coats & Clothing',
  'Watches & Wrist Accessories',
  'Other Campus Belongings'
] as const;

export const INITIAL_ITEMS: Item[] = [
  {
    item_id: 1001,
    type: 'found',
    item_name: 'University Student Smartcard & National ID',
    category: 'Student Smartcards & National IDs',
    description: 'Deposited at library checkout counter. Official university magnetic smartcard attached to blue university lanyard with Huduma/National ID card in plastic sleeve.',
    location: 'Jomo Kenyatta Memorial Library (Level 1 Info Desk)',
    date_reported: '2026-09-29',
    date_occurred: '2026-09-29',
    status: 'Found',
    image_url: '/src/assets/images/lost_found_student_id_1790951792059.jpg',
    storage_location: 'Central Security Gatehouse, Locker A-04',
    unique_identifier_hint: 'What is the last 4 digits of the National ID and student admission year?',
    reporter_id: 201,
    reporter_name: 'Sergeant Samuel Njoroge',
    reporter_email: 'samuel.njoroge@security.campus.ac.ke',
    reporter_phone: '+254 701 928 374',
    reporter_role: 'security'
  },
  {
    item_id: 1002,
    type: 'found',
    item_name: 'Silver HP EliteBook Laptop (14-inch)',
    category: 'Laptops & Computing Devices',
    description: 'Found left behind near the carrels in silent study area. Brushed aluminium body with spiral engineering notebook and 65W fast charger.',
    location: 'Jomo Kenyatta Memorial Library (Quiet Study Commons)',
    date_reported: '2026-09-30',
    date_occurred: '2026-09-30',
    status: 'Claim_Pending',
    image_url: '/src/assets/images/lost_found_laptop_1790951805557.jpg',
    storage_location: 'Gate A High-Value Safe #2',
    unique_identifier_hint: 'What specific tech sticker is on the palm rest beside the fingerprint scanner?',
    reporter_id: 102,
    reporter_name: 'Kwame Mensah',
    reporter_email: 'kwame.mensah@student.campus.ac.ke',
    reporter_phone: '+254 722 890 123',
    reporter_role: 'student'
  },
  {
    item_id: 1003,
    type: 'found',
    item_name: 'Navy Blue Canvas Campus Backpack',
    category: 'Campus Backpacks & Handbags',
    description: 'Navy blue canvas bag found on the 4th row bench after Engineering Mathematics lecture. Contains lecture handouts and a metallic thermos flask.',
    location: '8-4-4 Multi-Purpose Lecture Complex (Hall B)',
    date_reported: '2026-10-01',
    date_occurred: '2026-10-01',
    status: 'Found',
    image_url: '/src/assets/images/lost_found_backpack_1790951818952.jpg',
    storage_location: 'Central Security Gatehouse, Bin C-12',
    unique_identifier_hint: 'Describe the keyholder charm and keychain attached to the front zipper.',
    reporter_id: 201,
    reporter_name: 'Sergeant Samuel Njoroge',
    reporter_email: 'samuel.njoroge@security.campus.ac.ke',
    reporter_phone: '+254 701 928 374',
    reporter_role: 'security'
  },
  {
    item_id: 1004,
    type: 'found',
    item_name: 'Samsung Galaxy Smartphone in Clear Cover',
    category: 'Mobile Phones & Chargers',
    description: 'Black smartphone with clear shockproof cover found on dining table beside lunch receipts. Battery charged to 60%.',
    location: 'Main Campus Student Mess & Central Cafeteria',
    date_reported: '2026-10-02',
    date_occurred: '2026-10-02',
    status: 'Found',
    image_url: '/src/assets/images/lost_found_phone_1790951831307.jpg',
    storage_location: 'Gate A High-Value Safe #1',
    unique_identifier_hint: 'What lock screen wallpaper photo or owner contact message appears when waking the screen?',
    reporter_id: 103,
    reporter_name: 'Amina Bello',
    reporter_email: 'amina.bello@student.campus.ac.ke',
    reporter_phone: '+254 733 456 789',
    reporter_role: 'student'
  },
  {
    item_id: 1005,
    type: 'lost',
    item_name: 'HP Spectre x360 Laptop & Charger',
    category: 'Laptops & Computing Devices',
    description: 'Misplaced during evening study discussion at the library. Dark ash silver with brass trim. Student project files stored in user folder.',
    location: 'Jomo Kenyatta Memorial Library (Quiet Study Commons)',
    date_reported: '2026-09-30',
    date_occurred: '2026-09-30',
    status: 'Lost',
    image_url: '/src/assets/images/spectre_laptop_1790953733989.jpg',
    reporter_id: 101,
    reporter_name: 'Zawadi Kamau',
    reporter_email: 'zawadi.kamau@student.campus.ac.ke',
    reporter_phone: '+254 712 345 678',
    reporter_role: 'student',
    unique_identifier_hint: 'Serial number on bottom baseplate: 5CD2398892'
  },
  {
    item_id: 1006,
    type: 'lost',
    item_name: 'Room 304 Yale Keys with Maasai Bead Lanyard',
    category: 'Hostel & Room Keys',
    description: 'Set of 3 Yale keys with hostel electronic swipe token and handmade red/blue Maasai bead lanyard. Misplaced between mess and Hall 9.',
    location: 'Main Campus Student Mess & Central Cafeteria',
    date_reported: '2026-10-01',
    date_occurred: '2026-10-01',
    status: 'Lost',
    image_url: '/src/assets/images/brass_room_keys_1790953704133.jpg',
    reporter_id: 101,
    reporter_name: 'Zawadi Kamau',
    reporter_email: 'zawadi.kamau@student.campus.ac.ke',
    reporter_phone: '+254 712 345 678',
    reporter_role: 'student',
    unique_identifier_hint: 'Brass circular tag stamped 304 with room warden initial'
  },
  {
    item_id: 1007,
    type: 'found',
    item_name: 'Casio FX-991EX Scientific Calculator',
    category: 'Laptops & Computing Devices',
    description: 'ClassWiz series scientific calculator left on desk after Physics II CAT examination.',
    location: 'Science & Computing Block (Chiromo Lab 4)',
    date_reported: '2026-09-28',
    date_occurred: '2026-09-28',
    status: 'Reunited',
    image_url: '/src/assets/images/casio_calculator_1790953718876.jpg',
    storage_location: 'Handed over to verified student',
    unique_identifier_hint: 'Student name engraved with silver marker inside the hard cover',
    reporter_id: 201,
    reporter_name: 'Sergeant Samuel Njoroge',
    reporter_email: 'samuel.njoroge@security.campus.ac.ke',
    reporter_phone: '+254 701 928 374',
    reporter_role: 'security'
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    claim_id: 501,
    item_id: 1002,
    item_name: 'Silver HP EliteBook Laptop (14-inch)',
    student_id: 101,
    student_name: 'Zawadi Kamau',
    student_email: 'zawadi.kamau@student.campus.ac.ke',
    student_phone: '+254 712 345 678',
    claim_date: '2026-09-30',
    proof_description: 'I was revising at study table 12 on Level 2 until 6:45 PM. I packed up hurriedly for the evening lecture and left the sleeve. My computing coursework drafts are saved in home folder named Zawadi.',
    secret_details_answer: 'There is a Nairobi DevFest circular badge sticker and a small hairline scratch on the HDMI port.',
    supporting_document_ref: 'Student Smartcard Reg P15/2840/2023 & Laptop Purchase Receipt',
    status: 'Pending'
  },
  {
    claim_id: 500,
    item_id: 1007,
    item_name: 'Casio FX-991EX Scientific Calculator',
    student_id: 103,
    student_name: 'Amina Bello',
    student_email: 'amina.bello@student.campus.ac.ke',
    student_phone: '+254 733 456 789',
    claim_date: '2026-09-29',
    proof_description: 'Left on bench 4 after examination. Name Bello written inside slide case.',
    secret_details_answer: 'Bello - Law/2022',
    supporting_document_ref: 'University Exam Registration Card presented at Gate A',
    status: 'Approved',
    verified_by: 201,
    verified_by_name: 'Sergeant Samuel Njoroge',
    verification_date: '2026-09-29',
    admin_notes: 'Physical examination card verified; student signed property discharge register in Gatehouse ledger.',
    collection_pass_code: 'SEC-UG-9910'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    notification_id: 'notif-1',
    user_id: 101,
    user_role: 'student',
    title: 'Automated Match Alert',
    message: 'A "Silver HP EliteBook Laptop" deposited at JKML matches your lost report from Sep 30.',
    timestamp: '2026-09-30 19:15',
    read: false,
    link_item_id: 1002,
    type: 'match_alert'
  },
  {
    notification_id: 'notif-2',
    user_id: 101,
    user_role: 'student',
    title: 'Claim Awaiting Security Inspection',
    message: 'Your ownership claim for item #1002 is under review at Central Security Gatehouse.',
    timestamp: '2026-09-30 20:00',
    read: false,
    link_item_id: 1002,
    type: 'claim_update'
  },
  {
    notification_id: 'notif-3',
    user_id: 201,
    user_role: 'security',
    title: 'New Student Ownership Claim',
    message: 'Zawadi Kamau (Reg P15/2840/2023) submitted ownership claim for Silver HP Laptop.',
    timestamp: '2026-09-30 20:00',
    read: false,
    link_item_id: 1002,
    type: 'claim_update'
  },
  {
    notification_id: 'notif-4',
    user_id: 301,
    user_role: 'admin',
    title: 'Quarterly Custody Audit Ready',
    message: 'Monthly lost and found recovery rate is 67%. Senate report summary is ready for download.',
    timestamp: '2026-10-01 09:00',
    read: false,
    type: 'security_announcement'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    log_id: 'LOG-001',
    timestamp: '2026-09-28 14:10',
    actor_name: 'Sergeant Samuel Njoroge',
    actor_role: 'security',
    action: 'PROPERTY_DEPOSITED',
    target: 'Item #1007 (Casio Calculator)',
    details: 'Logged into Gate A custody following turn-in by Chiromo lab technician.'
  },
  {
    log_id: 'LOG-002',
    timestamp: '2026-09-29 11:30',
    actor_name: 'Amina Bello',
    actor_role: 'student',
    action: 'CLAIM_FILED',
    target: 'Claim #500',
    details: 'Claimant provided registration details and examination card verification.'
  },
  {
    log_id: 'LOG-003',
    timestamp: '2026-09-29 15:45',
    actor_name: 'Sergeant Samuel Njoroge',
    actor_role: 'security',
    action: 'CLAIM_VERIFIED',
    target: 'Claim #500 (Item #1007)',
    details: 'Verified against Student Record Database. Pass code SEC-UG-9910 issued and item returned.'
  },
  {
    log_id: 'LOG-004',
    timestamp: '2026-09-30 18:40',
    actor_name: 'Kwame Mensah',
    actor_role: 'student',
    action: 'FOUND_PROPERTY_TURNED_IN',
    target: 'Item #1002 (Silver Laptop)',
    details: 'Deposited at Library Information Desk; transferred to Gate A safe.'
  }
];

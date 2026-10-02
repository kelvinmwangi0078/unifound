import { 
  Item, 
  Claim, 
  Notification, 
  AuditLog, 
  SmartMatch, 
  SystemStats, 
  Student, 
  Admin, 
  SecurityOfficer,
  AppUser,
  UserRole 
} from '../types';
import { 
  INITIAL_ITEMS, 
  INITIAL_CLAIMS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_STUDENTS, 
  INITIAL_ADMINS,
  INITIAL_SECURITY_OFFICERS,
  PRESET_USERS
} from '../data/initialData';

const STORAGE_KEYS = {
  ITEMS: 'unifound_items_v5',
  CLAIMS: 'unifound_claims_v5',
  NOTIFICATIONS: 'unifound_notifications_v5',
  AUDIT_LOGS: 'unifound_audit_v5',
  USERS: 'unifound_users_v5',
  CURRENT_USER_ID: 'unifound_active_user_id_v5'
};

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing ${key} to localStorage`, e);
    }
  }

  // --- Users & Authentic African Roles ---
  getUsers(): AppUser[] {
    return this.get<AppUser[]>(STORAGE_KEYS.USERS, PRESET_USERS);
  }

  getCurrentUser(): AppUser {
    const users = this.getUsers();
    const currentId = this.get<number>(STORAGE_KEYS.CURRENT_USER_ID, 101);
    return users.find(u => u.id === currentId) || users[0];
  }

  setCurrentUser(user: AppUser): void {
    this.set(STORAGE_KEYS.CURRENT_USER_ID, user.id);
  }

  registerUser(userData: Omit<AppUser, 'id' | 'date_registered'>): AppUser {
    const users = this.getUsers();
    const newId = Math.max(...users.map(u => u.id), 500) + 1;
    const nowStr = new Date().toISOString().split('T')[0];

    const newUser: AppUser = {
      ...userData,
      id: newId,
      date_registered: nowStr
    };

    this.set(STORAGE_KEYS.USERS, [...users, newUser]);
    this.setCurrentUser(newUser);

    this.logAction(
      newUser.name,
      newUser.role,
      'USER_REGISTERED',
      `${newUser.role.toUpperCase()} (${newUser.reg_or_badge_number})`,
      `Registered into university lost and found system under ${newUser.department_or_faculty}`
    );

    return newUser;
  }

  // --- Core Data Getters ---
  getItems(): Item[] {
    return this.get<Item[]>(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
  }

  getClaims(): Claim[] {
    return this.get<Claim[]>(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
  }

  getNotifications(): Notification[] {
    return this.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  getAuditLogs(): AuditLog[] {
    return this.get<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  getStudents(): Student[] {
    return INITIAL_STUDENTS;
  }

  getSecurityOfficers(): SecurityOfficer[] {
    return INITIAL_SECURITY_OFFICERS;
  }

  getAdmins(): Admin[] {
    return INITIAL_ADMINS;
  }

  // --- Reset to Factory Demo State ---
  resetToDemo(): void {
    this.set(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
    this.set(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
    this.set(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.set(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.set(STORAGE_KEYS.USERS, PRESET_USERS);
    this.set(STORAGE_KEYS.CURRENT_USER_ID, 101);
  }

  // --- Add New Item (Lost or Found) ---
  addItem(itemData: Omit<Item, 'item_id' | 'date_reported'>): Item {
    const items = this.getItems();
    const newId = Math.max(...items.map(i => i.item_id), 1000) + 1;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const newItem: Item = {
      ...itemData,
      item_id: newId,
      date_reported: dateStr
    };

    const updatedItems = [newItem, ...items];
    this.set(STORAGE_KEYS.ITEMS, updatedItems);

    // Record audit log
    this.logAction(
      newItem.reporter_name,
      newItem.reporter_role,
      newItem.type === 'found' ? 'PROPERTY_DEPOSITED' : 'LOST_REPORT_LOGGED',
      `Item #${newItem.item_id} (${newItem.item_name})`,
      `Location: ${newItem.location}. Storage: ${newItem.storage_location || 'Pending custody assignment'}`
    );

    // If it's a found item, check for smart matches against reported lost items
    if (newItem.type === 'found') {
      this.evaluateMatchesForNewFoundItem(newItem);
    } else {
      this.evaluateMatchesForNewLostItem(newItem);
    }

    return newItem;
  }

  // --- Submit Ownership Claim ---
  submitClaim(claimData: {
    item_id: number;
    student_id: number;
    student_name: string;
    student_email: string;
    student_phone: string;
    proof_description: string;
    secret_details_answer: string;
    supporting_document_ref?: string;
  }): Claim {
    const claims = this.getClaims();
    const items = this.getItems();
    const targetItem = items.find(i => i.item_id === claimData.item_id);

    const newClaimId = Math.max(...claims.map(c => c.claim_id), 500) + 1;
    const dateStr = new Date().toISOString().split('T')[0];

    const newClaim: Claim = {
      claim_id: newClaimId,
      item_id: claimData.item_id,
      item_name: targetItem ? targetItem.item_name : 'Item',
      student_id: claimData.student_id,
      student_name: claimData.student_name,
      student_email: claimData.student_email,
      student_phone: claimData.student_phone,
      claim_date: dateStr,
      proof_description: claimData.proof_description,
      secret_details_answer: claimData.secret_details_answer,
      supporting_document_ref: claimData.supporting_document_ref,
      status: 'Pending'
    };

    // Update item status to Claim_Pending
    const updatedItems = items.map(i => {
      if (i.item_id === claimData.item_id && i.status === 'Found') {
        return { ...i, status: 'Claim_Pending' as const };
      }
      return i;
    });

    this.set(STORAGE_KEYS.ITEMS, updatedItems);
    this.set(STORAGE_KEYS.CLAIMS, [newClaim, ...claims]);

    // Send notifications to student & security custody officers
    this.addNotification({
      user_id: claimData.student_id,
      user_role: 'student',
      title: 'Ownership Claim Transmitted',
      message: `Your ownership claim for "${newClaim.item_name}" has been logged and forwarded to Central Security Gatehouse.`,
      link_item_id: claimData.item_id,
      type: 'claim_update'
    });

    this.addNotification({
      user_id: 201,
      user_role: 'security',
      title: 'New Ownership Claim for Adjudication',
      message: `${claimData.student_name} filed claim #${newClaim.claim_id} for ${newClaim.item_name}.`,
      link_item_id: claimData.item_id,
      type: 'claim_update'
    });

    this.logAction(
      claimData.student_name,
      'student',
      'CLAIM_SUBMITTED',
      `Claim #${newClaim.claim_id} for Item #${claimData.item_id}`,
      'Submitted detailed ownership proof and identifiers.'
    );

    return newClaim;
  }

  // --- Security or Admin Verify Claim (Approve or Reject) ---
  verifyClaim(
    claim_id: number,
    decision: 'Approved' | 'Rejected',
    officer_id: number,
    officer_name: string,
    notes: string
  ): void {
    const claims = this.getClaims();
    const items = this.getItems();
    const targetClaim = claims.find(c => c.claim_id === claim_id);
    if (!targetClaim) return;

    const dateStr = new Date().toISOString().split('T')[0];
    const passCode = decision === 'Approved' ? `SEC-UG-${Math.floor(1000 + Math.random() * 9000)}` : undefined;

    const updatedClaims = claims.map(c => {
      if (c.claim_id === claim_id) {
        return {
          ...c,
          status: decision,
          verified_by: officer_id,
          verified_by_name: officer_name,
          verification_date: dateStr,
          admin_notes: notes,
          collection_pass_code: passCode
        };
      }
      return c;
    });

    // Update item status
    const updatedItems = items.map(item => {
      if (item.item_id === targetClaim.item_id) {
        if (decision === 'Approved') {
          return { ...item, status: 'Approved' as const };
        } else {
          return { ...item, status: 'Found' as const };
        }
      }
      return item;
    });

    this.set(STORAGE_KEYS.CLAIMS, updatedClaims);
    this.set(STORAGE_KEYS.ITEMS, updatedItems);

    // Notify student
    if (decision === 'Approved') {
      this.addNotification({
        user_id: targetClaim.student_id,
        user_role: 'student',
        title: 'Claim Approved! Collection Pass Issued',
        message: `Your claim for "${targetClaim.item_name}" was approved by ${officer_name}. Present your Student Smartcard & Pass Code: ${passCode} at Gate A Gatehouse.`,
        link_item_id: targetClaim.item_id,
        type: 'claim_update'
      });
    } else {
      this.addNotification({
        user_id: targetClaim.student_id,
        user_role: 'student',
        title: 'Claim Decision: Insufficient Evidence',
        message: `Claim for "${targetClaim.item_name}" could not be confirmed. Officer remarks: "${notes}"`,
        link_item_id: targetClaim.item_id,
        type: 'claim_update'
      });
    }

    this.logAction(
      officer_name,
      'security',
      decision === 'Approved' ? 'CLAIM_APPROVED' : 'CLAIM_REJECTED',
      `Claim #${claim_id} for Item #${targetClaim.item_id}`,
      `Determination: ${decision}. Remarks: ${notes}`
    );
  }

  // --- Physical Handover Complete ---
  markItemReunited(item_id: number, officer_name: string, notes?: string): void {
    const items = this.getItems();
    const targetItem = items.find(i => i.item_id === item_id);
    if (!targetItem) return;

    const updatedItems = items.map(i => {
      if (i.item_id === item_id) {
        return {
          ...i,
          status: 'Reunited' as const,
          storage_location: 'Handed over to verified owner at Gate A Post'
        };
      }
      return i;
    });

    this.set(STORAGE_KEYS.ITEMS, updatedItems);

    this.logAction(
      officer_name,
      'security',
      'PHYSICAL_HANDOVER_EXECUTED',
      `Item #${item_id} (${targetItem.item_name})`,
      notes || 'Discharge confirmed in Gatehouse physical register with ID verification.'
    );
  }

  // --- Notifications ---
  addNotification(notifData: Omit<Notification, 'notification_id' | 'timestamp' | 'read'>): void {
    const notifs = this.getNotifications();
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newNotif: Notification = {
      ...notifData,
      notification_id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr,
      read: false
    };

    this.set(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
  }

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => n.notification_id === id ? { ...n, read: true } : n);
    this.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  markAllNotificationsAsRead(userRole: UserRole, userId: number): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => {
      if (n.user_role === userRole && (userRole === 'admin' || userRole === 'security' || n.user_id === userId)) {
        return { ...n, read: true };
      }
      return n;
    });
    this.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  // --- Audit Log Recorder ---
  private logAction(
    actor_name: string,
    actor_role: UserRole,
    action: string,
    target: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newLog: AuditLog = {
      log_id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      actor_name,
      actor_role,
      action,
      target,
      details
    };

    this.set(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs.slice(0, 49)]);
  }

  // --- Automated Matching Algorithm ---
  findMatches(): SmartMatch[] {
    const items = this.getItems();
    const lostItems = items.filter(i => i.type === 'lost' && i.status === 'Lost');
    const foundItems = items.filter(i => i.type === 'found' && (i.status === 'Found' || i.status === 'Claim_Pending'));

    const matches: SmartMatch[] = [];

    for (const lost of lostItems) {
      for (const found of foundItems) {
        let score = 0;
        const factors: string[] = [];

        // 1. Category Exact Match
        if (lost.category === found.category) {
          score += 40;
          factors.push(`Category match: "${lost.category}"`);
        }

        // 2. Location Building / Zone overlap
        const loc1 = lost.location.toLowerCase();
        const loc2 = found.location.toLowerCase();
        if (loc1 === loc2) {
          score += 30;
          factors.push('Identical campus zone');
        } else if (
          (loc1.includes('library') && loc2.includes('library')) ||
          (loc1.includes('8-4-4') && loc2.includes('8-4-4')) ||
          (loc1.includes('computing') && loc2.includes('computing')) ||
          (loc1.includes('hostel') && loc2.includes('hostel')) ||
          (loc1.includes('mess') && loc2.includes('mess'))
        ) {
          score += 20;
          factors.push('Same campus building');
        }

        // 3. Keyword / Title / Description overlap
        const cleanWords = (txt: string) => 
          txt.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(' ')
            .filter(w => w.length > 3 && !['with', 'from', 'left', 'found', 'lost', 'that', 'this', 'have'].includes(w));

        const lostWords = new Set([...cleanWords(lost.item_name), ...cleanWords(lost.description)]);
        const foundWords = cleanWords(found.item_name).concat(cleanWords(found.description));
        const matchedTokens = foundWords.filter(w => lostWords.has(w));

        if (matchedTokens.length > 0) {
          const uniqueTokens = Array.from(new Set(matchedTokens));
          score += Math.min(30, uniqueTokens.length * 10);
          factors.push(`Keyword correlation: ${uniqueTokens.slice(0, 3).join(', ')}`);
        }

        // 4. Date Proximity
        const d1 = new Date(lost.date_reported).getTime();
        const d2 = new Date(found.date_reported).getTime();
        const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
        if (diffDays <= 4) {
          score += 10;
          factors.push(`Logged within ${Math.ceil(diffDays)} day(s)`);
        }

        if (score >= 45) {
          matches.push({
            match_id: `match-${lost.item_id}-${found.item_id}`,
            lost_item: lost,
            found_item: found,
            confidence_score: Math.min(score, 98),
            matching_factors: factors,
            status: 'suggested'
          });
        }
      }
    }

    return matches.sort((a, b) => b.confidence_score - a.confidence_score);
  }

  private evaluateMatchesForNewFoundItem(foundItem: Item): void {
    const items = this.getItems();
    const lostItems = items.filter(i => i.type === 'lost' && i.status === 'Lost');
    
    for (const lost of lostItems) {
      if (lost.category === foundItem.category) {
        this.addNotification({
          user_id: lost.reporter_id,
          user_role: 'student',
          title: 'Potential Match for Misplaced Item',
          message: `A "${foundItem.item_name}" deposited at ${foundItem.location} matches your lost report category.`,
          link_item_id: foundItem.item_id,
          type: 'match_alert'
        });
      }
    }
  }

  private evaluateMatchesForNewLostItem(lostItem: Item): void {
    const items = this.getItems();
    const foundItems = items.filter(i => i.type === 'found' && i.status === 'Found');
    
    for (const found of foundItems) {
      if (found.category === lostItem.category) {
        this.addNotification({
          user_id: lostItem.reporter_id,
          user_role: 'student',
          title: 'Found Property May Match Your Report',
          message: `Check item #${found.item_id} ("${found.item_name}") deposited in custody at ${found.location}.`,
          link_item_id: found.item_id,
          type: 'match_alert'
        });
      }
    }
  }

  // --- System Statistics Calculation ---
  getSystemStats(): SystemStats {
    const items = this.getItems();
    const claims = this.getClaims();
    const users = this.getUsers();

    const totalItems = items.length;
    const activeLostCount = items.filter(i => i.type === 'lost' && i.status === 'Lost').length;
    const foundInCustodyCount = items.filter(i => i.type === 'found' && (i.status === 'Found' || i.status === 'Claim_Pending')).length;
    const pendingClaimsCount = claims.filter(c => c.status === 'Pending').length;
    const reunitedCount = items.filter(i => i.status === 'Reunited').length;
    const registeredUsersCount = users.length;

    const denominator = (reunitedCount + foundInCustodyCount);
    const recoveryRatePercent = denominator > 0 ? Math.round((reunitedCount / denominator) * 100) : 0;

    return {
      totalItems,
      activeLostCount,
      foundInCustodyCount,
      pendingClaimsCount,
      reunitedCount,
      recoveryRatePercent,
      registeredUsersCount
    };
  }
}

export const storage = new StorageService();

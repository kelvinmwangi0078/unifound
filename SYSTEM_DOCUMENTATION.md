# UniFound — Campus Lost & Found Management System
## System Architecture, Academic Specifications & Operational Documentation
*Conforms to Academic Research Specifications by Kumar et al. (2022) & Wanjiru (2021)*

---

## 1. Executive Summary & Problem Formulation
On modern African university campuses with tens of thousands of students moving between lecture halls, laboratories, libraries, and hostels, property loss represents a recurring disruption to student welfare and academic continuity. Traditional lost and found setups rely on scattered physical noticeboards, WhatsApp groups, and unstructured gatehouse logbooks with zero authentication, leading to:
- High rates of permanent asset loss (laptops, student smartcards, calculators).
- Vulnerability to fraudulent claims and impersonation.
- Lack of centralized custody tracking for items stored in campus security vaults.
- No automated matching between reported lost items and surrendered property.

**UniFound** provides a centralized, authenticated, role-based platform bridging students, security desk custodians, and university administration.

---

## 2. Project Objectives (Chapter 1.4 Mapping)
| Objective ID | Requirement Specification | System Implementation Status |
| :--- | :--- | :--- |
| **Obj 1.4.1** | **User Authentication & Credential Verification** | Implemented: Role-based authentication supporting Students, Security Officers, and Directorate Administration with institutional IDs. |
| **Obj 1.4.2** | **Centralized Reporting & Custody Intake** | Implemented: Standardized reporting forms with categorization, geolocation tagging across campus landmarks, and custody vault assignments. |
| **Obj 1.4.3** | **Automated Multi-Factor Matching Algorithm** | Implemented: Algorithmic matching scoring category (40%), location zone (30%), keyword NLP (20%), and time proximity (10%). |
| **Obj 1.4.4** | **Two-Tier Ownership Verification Mechanism** | Implemented: Secret identifier challenge questions, serial/invoice validation, and one-time Gatehouse collection pass codes (`SEC-UG-XXXX`). |
| **Obj 1.4.5** | **Custody Audit & Recovery Reporting** | Implemented: Live chain-of-custody audit trail, exportable/printable custody audit reports, and recovery KPI analytics. |

---

## 3. Stakeholder Roles & Access Control Matrix (RBAC)

### 3.1 Student / Scholar
- Report misplaced belongings with private identifier hints.
- Surrender found property to digital registry with handover location.
- Browse campus repository and trigger Smart Match search.
- Submit ownership claims with challenge answers and upload supporting documents.
- Receive digital collection pass codes for approved items.

### 3.2 Campus Security Custody Officer (Central Gatehouse Desk)
- Inspect physical property surrendered at campus gatehouses and security posts.
- Assign items to physical vaults, lockers, and high-value safes (e.g., Gate A High-Value Safe #1).
- Adjudicate submitted ownership claims by comparing student claims against hidden physical item markers.
- Approve or reject claims with official officer notes.
- Issue collection pass codes and sign off physical handovers in the gatehouse custody register.

### 3.3 Dean of Students / Directorate Administrator
- Monitor real-time recovery metrics (recovery percentage, active loss volume, vault inventory).
- Review disputes and oversee escalated claims.
- Generate and print the official **Campus Property Custody & Recovery Audit Report**.
- Audit the immutable chain-of-custody platform transaction ledger.

---

## 4. Multi-Factor Automated Matching Engine

The matching engine executes a deterministic similarity evaluation between active `Lost` reports and surrendered `Found` items:

$$\text{Confidence Score} = S_{\text{category}} + S_{\text{location}} + S_{\text{keyword}} + S_{\text{temporal}}$$

1. **Category Concordance ($S_{\text{category}} = 40\%$)**: Exact category taxonomy match.
2. **Campus Zone Proximity ($S_{\text{location}} = 30\%$)**: Same campus complex or zone (e.g. Jomo Kenyatta Memorial Library, 8-4-4 Complex, Chiromo).
3. **Keyword & Token Correlation ($S_{\text{keyword}} = \min(30\%, N \times 10\%)$)**: Stopword-filtered token set intersection across title and descriptions.
4. **Temporal Proximity ($S_{\text{temporal}} = 10\%$)**: Reports filed within $\le 4$ calendar days of each other.

Thresholds:
- $\ge 70\%$: High-confidence match (triggers high-priority notification to owner).
- $45\% - 69\%$: Probable match (displayed on Smart Match Radar).
- $< 45\%$: Filtered out to avoid false alerts.

---

## 5. Security & Fraud Prevention Protocol

1. **Information Asymmetry**: Unique identifying features (e.g., laptop serial number, engraving, phone lock screen wallpaper) are withheld from public catalog views.
2. **Challenge-Response Claiming**: Claimants must provide the private identifier before security can verify the claim.
3. **Collection Pass Token**: Approved claims generate a unique, cryptographically random collection pass (e.g. `SEC-UG-4109`) that must be presented alongside the physical Student Smartcard at Gate A.
4. **Physical Register Sign-Off**: The officer records the national ID / admission card before releasing the item from the high-value safe.

---

## 6. Technical Stack
- **Frontend**: React 18 SPA, TypeScript, Vite.
- **Styling**: Tailwind CSS with Collegiate Burgundy/Maroon (`#5C1D2D`) institutional palette.
- **Typography**: Inter (Body & Headers) + JetBrains Mono (Codes, Badges, Identifiers).
- **Icons**: Lucide React.
- **Persistence**: Structured Browser LocalStorage with schema versioning (`v5`).

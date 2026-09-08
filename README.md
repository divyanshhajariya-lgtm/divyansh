# GeM-Verify: AI-Powered Integrated Bid Compliance Verification Platform
### Smart India Hackathon 2026 | Problem Statement #26100
**Organization:** Ministry of Petroleum & Natural Gas | Chennai Petroleum Corporation Limited (CPCL)  
**Domain:** Public Procurement, Anti-Corruption, Automated Statutory Auditing & AI Vigilance  

---

## 🌟 Executive Summary

**GeM-Verify** is an enterprise-grade, human-in-the-loop bid evaluation platform designed to automate and cryptographically verify technical and statutory eligibility for high-value public procurement tenders on the Government e-Marketplace (GeM).

Created specifically for the **Chennai Petroleum Corporation Limited (CPCL) Manali Refinery** for critical equipment tenders (such as Cryogenic Valves, Heat Exchangers, and Pipeline Fittings), GeM-Verify replaces vulnerable, slow, manual paper scrutiny with instant, tamper-proof cross-verification against eight sovereign Indian government databases, backed by Google Gemini reasoning and an immutable SHA-256 audit ledger.

---

## 🧭 Why Are We Using These Technologies? (Architectural Justifications)

In public procurement, every architectural choice must satisfy strict legal mandates, high security standards, and rapid evaluation requirements. Below is the detailed engineering rationale for every core technology employed in GeM-Verify:

| Component / Technology | Exact Role in GeM-Verify | Why We Use This (Primary Justification) | What Happens If Omitted (Trade-off / Risk) |
| :--- | :--- | :--- | :--- |
| **DigiLocker Integration (OAuth 2.0)** | Direct electronic certificate retrieval with root CCA digital signatures | Mandated under **Section 6A of the Information Technology Act, 2000**. DigiLocker retrieves CBDT PAN, Udyam MSME, and GST documents directly from issuer databases, eliminating Photoshop/PDF forgery. | Bidders can upload counterfeit MSME certificates or doctored tax clearance returns; manual officer verification takes 10–14 days per tender. |
| **Google Gemini 3.1 Pro (`ThinkingLevel.HIGH`)** | Deep vigilance reasoning on shell companies, collusion, and complex GFR clauses | Advanced multi-step deductive reasoning allows the model to correlate minor discrepancies (e.g. slight trade name divergence, delayed PF remittances, shared director DINs) against **GFR 2017 Rule 144 & CVC circulars** without hallucinating. | Shallow LLMs produce superficial summaries without citing statutory clauses or fail to recognize subtle corporate veil circumventions. |
| **Google Gemini 3.5 Flash (`googleSearch` Grounding)** | Real-time central vigilance and debarment cross-referencing | Provides live web-grounded validation against central debarment lists, court orders, CVC press releases, and GeM incident notices with verifiable citations. | Static checks cannot detect suppliers debarred by other PSUs or ministries within the last 48 hours. |
| **SHA-256 Cryptographic Audit Ledger** | Permanent, tamper-evident hash chaining for every evaluation step and decision | **GFR 2017 & CVC Guidelines** require full evidentiary trails. Every OCR extraction, registry ping, officer decision, and timestamp is hashed into an immutable block hash (`hash_chain_prev`). | Corrupt or disputed tender awards can be challenged in High Court; lack of immutable proof leads to tender stay orders and costly litigation. |
| **Three.js & WebGL 3D Visualization** | Interactive 3D holographic architecture and systems topology view | Procurement committees, vigilance officers, and auditors need an intuitive spatial understanding of how data flows across sovereign registries, AI vigilance nodes, and officer checkpoints. | Dense 2D text documents lead to cognitive overload during high-pressure tender evaluation committee meetings. |
| **Express.js Server-Side Proxy** | Dedicated server routing, Gemini API key custody, and registry mock gateway | Strict security mandate: API keys, DigiLocker client secrets, and internal government gateway tokens **must never leak to the client browser DevTools**. All requests are proxied via `/api/v1/*`. | Client-side API key leakage allows malicious bidders to inspect prompts, manipulate evaluation rules, or exhaust API quotas. |
| **React 19 & TypeScript** | Client-side reactive interface with zero hydration mismatch and type safety | Guarantees strict type safety across multi-domain verification parameters, preventing undefined property errors during high-stakes financial adjudication. | JavaScript runtime type mismatches during officer sign-off could crash the session or corrupt audit logs. |
| **Tailwind CSS v4** | Clean, accessible design system tailored for Indian e-Governance | Enables dense, high-contrast, distraction-free dashboard layouts that adhere to WCAG AA contrast standards and Government of India web portal guidelines. | Bloated CSS frameworks or disjointed styling degrades performance on low-spec officer laptops in refinery control rooms. |
| **Recharts Data Visualization** | Score gauge breakdowns, risk spread analytics, and comparative bidder charts | Delivers lightweight SVG rendering of the $S_{comp}$ dynamic compliance formula, Make in India local content tiers, and quote comparisons without heavy runtime overhead. | Raw numeric tables obscure comparative patterns, making it difficult to spot predatory under-quoting or non-compliant clusters. |
| **Motion (Framer Motion)** | Fluid state transitions, drawer expansions, and verification progress animations | Provides visual feedback when registries are queried in real time, confirming that background cryptographic checks are progressing. | Static UI feels unresponsive during multi-second registry round-trips, causing users to double-click and re-trigger tasks. |

---

## 📐 Mathematical Scoring Formulation: Dynamic Compliance Index ($S_{comp}$)

Each bidder's technical compliance is mathematically evaluated via the **Weighted Procurement Index Formula**:

$$S_{comp} = \sum_{i=1}^{n} \left( W_i \times C_i \right) - \Delta_{flags}$$

Where:
- $W_i$: Normalized statutory weight for parameter domain $i$ ($\sum W_i = 1.0$)
- $C_i$: Evaluated domain confidence score ($0 \le C_i \le 100$)
- $\Delta_{flags}$: Hard penalty deduction for critical statutory violations:
  - Active Debarment on GeM / MoPNG: $\Delta = 100$ (Instant Disqualification)
  - Cancelled or Suspended GSTIN: $\Delta = 60$
  - Discredited Local Content Declaration (< 20%): $\Delta = 40$

### Domain Weight Breakdown:
1. **Statutory Tax & Identity (GSTIN & PAN)**: $W_1 = 0.20$ (20%)
2. **Enterprise Classification (Udyam MSME)**: $W_2 = 0.20$ (20%)
3. **DigiLocker Authenticated Credentials**: $W_3 = 0.15$ (15%)
4. **Make in India (Class-I / Class-II MII Order 2017)**: $W_4 = 0.15$ (15%)
5. **Central Debarment & Vigilance (CVC / GeM)**: $W_5 = 0.15$ (15%)
6. **Social Security & Labor Laws (EPFO / ESIC)**: $W_6 = 0.15$ (15%)

---

## 🏗️ System Architecture & Data Pipeline

```
[ Bidder Submission (PDFs / OCR) ]
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 GeM-Verify Ingestion Engine                 │
│  - Document Hashing (SHA-256)                               │
│  - Key-Value Metadata Extraction (GSTIN, PAN, UDIN, Udyam)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────┐         ┌───────────────────────────┐
│ Sovereign Registry Gateway│         │  DigiLocker Direct Gate   │
│ - GSTN Live Search        │         │ - IT Act 2000 Section 6A  │
│ - CBDT PAN Verification   │         │ - CCA Root Verification   │
│ - MCA21 Director DIN      │         │ - Tamper-Proof Electronic │
│ - Udyam MSME Portal       │         │   Credentials             │
│ - Central Debarment / CVC │         └─────────────┬─────────────┘
│ - EPFO ECR Remittance     │                       │
└─────────────┬─────────────┘                       │
              │                                     │
              └──────────────────┬──────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│          Multi-Source Discrepancy & Matrix Engine           │
│  - Field-by-Field Reconciliation (OCR vs Live Source)       │
│  - Dynamic Weight Calculation ($S_{comp}$)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            Google Gemini AI Vigilance Copilot               │
│  - Pro-Thinking (Deep legal reasoning on GFR 2017)          │
│  - Grounded Search (Debarment citations & court orders)     │
│  - Fast Scan (Rapid low-latency pre-qualification check)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Officer Decision Support Dashboard              │
│  - Human-in-the-Loop Adjudication (Qualify / Disqualify)    │
│  - Formal 48-Hour Clarification Notice Generation           │
│  - Cryptographic Block Chaining (SHA-256 Audit Log)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Statutory & Legal Framework Adherence

1. **General Financial Rules (GFR) 2017**:
   - **Rule 144(xi)**: Restrictions on public procurement from countries sharing land borders with India.
   - **Rule 149**: Mandatory procurement through GeM.
   - **Rule 151**: Debarment from bidding for integrity pact violations.
   - **Rule 173(xxiii)**: Statutory procedures for seeking non-material bidder clarifications.
2. **Public Procurement (Preference to Make in India) Order 2017**:
   - Automated classification into **Class-I Local Supplier** ($\ge 50\%$), **Class-II Local Supplier** ($20\% - 49\%$), or **Non-Local Supplier** ($< 20\%$).
   - Mandatory Chartered Accountant UDIN verification for tenders $> \text{₹}10\text{ Crores}$.
3. **Information Technology Act, 2000**:
   - **Section 6A & Section 4**: Legal recognition of electronic records and documents pulled via DigiLocker.
4. **Central Vigilance Commission (CVC) Circulars**:
   - Strict prohibition of post-tender negotiations with bidders other than L-1.
   - Objective, transparent, and auditable reasons recorded in writing for disqualification.

---

## 🚀 Running the Project

### Prerequisites
- Node.js 18+ or 20+
- npm or bun

### Environment Variables (`.env`)
```env
# Server-side Gemini API key (optional - system uses intelligent fallback rules when unset)
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Run in development mode (starts Express backend + Vite on port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```

---

## 🏛️ Project Directory Structure

```
├── backend/
│   ├── data/
│   │   └── mock_db.ts          # Statutory registry records, mock tenders, audit logs
│   ├── gemini.ts               # Gemini 3.1 Pro & 3.5 Flash vigilance reasoning engine
│   ├── routes.ts               # Express REST APIs (/api/v1/*)
│   ├── server.ts               # Express backend + Vite middleware integration
│   └── types.ts                # Server TypeScript contracts & ledger definitions
├── frontend/
│   ├── components/
│   │   ├── AuditTrailLogs.tsx         # Immutable CVC audit ledger with SHA-256 hashes
│   │   ├── BidderSubmissionModal.tsx  # Ingest new bid tender submissions
│   │   ├── ComplianceScoreCard.tsx    # Dynamic $S_{comp}$ score gauge & risk tier badge
│   │   ├── DigiLockerConnectModal.tsx # Section 6A IT Act DigiLocker direct gateway
│   │   ├── DocumentMismatchTable.tsx  # Side-by-side OCR vs registry cross-check matrix
│   │   ├── GeminiCopilotPanel.tsx     # Multi-turn conversational vigilance AI copilot
│   │   ├── OfficerDecisionModal.tsx   # Formal Human-in-the-Loop decision & CVC signing
│   │   ├── RiskAnalyticsCharts.tsx    # Recharts score vs quote & risk distribution
│   │   ├── TasksAndContactsModal.tsx  # Verification committee tasks & nodal directory
│   │   └── ThreeDReadme.tsx           # Interactive 3D WebGL architecture & tech justifications
│   ├── App.tsx                        # Main application layout & state management
│   ├── index.css                      # Tailwind CSS v4 styling rules
│   ├── main.tsx                       # React DOM root entry point
│   └── types.ts                       # Shared frontend data models & types
├── index.html                         # Application HTML entry point
├── package.json                       # Scripts and project dependencies
├── README.md                          # Comprehensive project & technology documentation
├── tsconfig.json                      # TypeScript configuration
└── vite.config.ts                     # Vite + Tailwind plugin configuration
```

---

## ⚖️ License & Intellectual Property
Developed for **Smart India Hackathon 2026** by the **GeM-Verify Team**.  
In collaboration with **Chennai Petroleum Corporation Limited (CPCL)** & **Ministry of Petroleum & Natural Gas (MoPNG)**.

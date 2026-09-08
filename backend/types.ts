export type BidStatus =
  | 'AI_RECOMMENDED'
  | 'CLARIFICATION_REQUESTED'
  | 'DISQUALIFIED'
  | 'PENDING_REVIEW'
  | 'QUALIFIED';

export type RiskLevel = 'HIGH' | 'LOW' | 'MEDIUM';

export interface AuditLogEntry {
  actionType:
    | 'ANOMALY_DETECTED'
    | 'API_CROSS_VERIFY'
    | 'DECISION_FINALIZED'
    | 'DIGILOCKER_AUTH'
    | 'INGESTION'
    | 'OFFICER_OVERRIDE';
  actor: string;
  blockHeight: number;
  currentHash: string;
  cvcRuleRef: string;
  description: string;
  id: string;
  previousHash: string;
  targetBidId: string;
  timestamp: string;
}

export interface BidSubmission {
  cin: string;
  complianceScore: number;
  digiLockerAadhaarRef?: string;
  digiLockerAuthenticated: boolean;
  digiLockerVerifiedAt?: string;
  documents: {
    confidence: number;
    filename: string;
    fileSize: string;
    id: string;
    ocrExtractedText: string;
    sha256: string;
    type: string;
    uploadedAt: string;
    verifiedViaDigiLocker: boolean;
  }[];
  enterpriseCategory: 'Large' | 'Medium' | 'Micro' | 'Small';
  gstin: string;
  id: string;
  legalEntity: string;
  localContentPercent: number;
  miiClass:
    | 'Class-I Local Supplier (>=50%)'
    | 'Class-II Local Supplier (20%-49%)'
    | 'Non-Local Supplier (<20%)';
  officerDecision?: {
    action: 'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY';
    auditHash: string;
    officerDesignation: string;
    officerName: string;
    remarks: string;
    timestamp: string;
  };
  pan: string;
  parameters: ParameterVerification[];
  quotedValueINR: number;
  riskLevel: RiskLevel;
  status: BidStatus;
  submittedAt: string;
  tenderId: string;
  tenderTitle: string;
  bidderName: string;
  udyamNumber: string;
}

export interface ChatMessage {
  content: string;
  id: string;
  modelUsed?: string;
  role: 'assistant' | 'system' | 'user';
  sources?: { title: string; url: string }[];
  thinkingSteps?: string[];
  timestamp: string;
}

export interface OfficerContact {
  department: string;
  email: string;
  id: string;
  name: string;
  organization: string;
  phone: string;
  role: string;
  status: 'IN_MEETING' | 'OFFLINE' | 'ONLINE';
}

export interface OfficerTask {
  assignedOfficer: string;
  bidderId?: string;
  completed: boolean;
  dueDate: string;
  id: string;
  notes: string;
  priority: 'HIGH' | 'LOW' | 'MEDIUM';
  tenderId: string;
  title: string;
}

export interface ParameterVerification {
  bidderDocName: string;
  bidderUploadData: string;
  digiLockerSigned?: boolean;
  discrepancyNote?: string;
  domain:
    | 'Direct Verification'
    | 'Enterprise Category'
    | 'Identity & Tax'
    | 'Integrity Checks'
    | 'Policy Compliance'
    | 'Social Security';
  id: string;
  parameter: string;
  portalData: string;
  portalSource: string;
  score: number;
  sha256Hash?: string;
  status: 'CLEAN' | 'COMPLIANT' | 'FAILED' | 'VALID' | 'VERIFIED' | 'WARNING';
  statusLabel: string;
  weight: number;
}

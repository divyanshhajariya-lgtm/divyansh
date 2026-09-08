import {
  BLACKLISTED_ENTITIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_BIDS,
  INITIAL_CONTACTS,
  INITIAL_TASKS,
  computeSha256,
} from './data/mock_db';
import { runBidComplianceReasoning, runOfficerChat } from './gemini';
import {
  AuditLogEntry,
  BidSubmission,
  OfficerContact,
  OfficerTask,
} from './types';
import crypto from 'crypto';
import { Router } from 'express';

export const apiRouter = Router();

// In-memory state managed on backend
const bids: BidSubmission[] = [...INITIAL_BIDS];
const auditLogs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
const tasks: OfficerTask[] = [...INITIAL_TASKS];
const contacts: OfficerContact[] = [...INITIAL_CONTACTS];

// Cryptographic audit chain helper
function appendAuditLog(
  actionType: AuditLogEntry['actionType'],
  actor: string,
  targetBidId: string,
  description: string,
  cvcRuleRef: string
): AuditLogEntry {
  const lastEntry = auditLogs[auditLogs.length - 1];
  const previousHash = lastEntry
    ? lastEntry.currentHash
    : '0000000000000000000000000000000000000000000000000000000000000000';
  const blockHeight = (lastEntry ? lastEntry.blockHeight : 100) + 1;
  const timestamp = new Date().toISOString();

  const payloadToHash = `${blockHeight}|${timestamp}|${actionType}|${actor}|${targetBidId}|${description}|${previousHash}|${cvcRuleRef}`;
  const currentHash = computeSha256(payloadToHash);

  const newEntry: AuditLogEntry = {
    actionType,
    actor,
    blockHeight,
    currentHash,
    cvcRuleRef,
    description,
    id: `LOG-${1000 + blockHeight}`,
    previousHash,
    targetBidId,
    timestamp,
  };

  auditLogs.push(newEntry);
  return newEntry;
}

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    activeBids: bids.length,
    auditBlocks: auditLogs.length,
    service: 'GeM-Verify Backend API',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 1. Audit logs endpoint
apiRouter.get('/v1/audit-logs', (_req, res) => {
  res.json({ logs: auditLogs });
});

// 2. Bids listing
apiRouter.get('/v1/bids', (_req, res) => {
  res.json({
    bids,
    tenderContext: {
      buyer: 'Chennai Petroleum Corporation Limited (Ministry of Petroleum & Natural Gas)',
      closingDate: '2026-09-15T17:00:00Z',
      estimatedValueINR: 15000000,
      tenderId: 'GEM/2026/B/891273',
      title:
        'Procurement of High Pressure Cryogenic Valves & Fittings for CPCL Manali Refinery',
    },
    total: bids.length,
  });
});

// 3. Bid by ID
apiRouter.get('/v1/bids/:id', (req, res) => {
  const bid = bids.find((b) => b.id === req.params.id);
  if (!bid) return res.status(404).json({ error: 'Bid not found' });
  res.json({ bid });
});

// 4. Submit new bid
apiRouter.post('/v1/bids/submit', (req, res) => {
  const {
    bidderName,
    cin,
    digiLockerAadhaarRef,
    digiLockerAuthenticated,
    enterpriseCategory,
    gstin,
    legalEntity,
    localContentPercent,
    pan,
    quotedValueINR,
    udyamNumber,
  } = req.body;

  const newId = `BID-2026-${String(bids.length + 1).padStart(3, '0')}`;
  const miiClass =
    Number(localContentPercent) >= 50
      ? 'Class-I Local Supplier (>=50%)'
      : Number(localContentPercent) >= 20
      ? 'Class-II Local Supplier (20%-49%)'
      : 'Non-Local Supplier (<20%)';

  const isDebarred = BLACKLISTED_ENTITIES.some(
    (b) => b.pan === pan || b.name.toLowerCase() === String(bidderName).toLowerCase()
  );

  const parameters = [
    {
      bidderDocName: 'GST_Certificate.pdf',
      bidderUploadData: `Self-attested GST document matching ${gstin}`,
      digiLockerSigned: Boolean(digiLockerAuthenticated),
      domain: 'Identity & Tax' as const,
      id: 'P1',
      parameter: 'GST Status & Filing Consistency',
      portalData: `Active Registered GSTIN: ${gstin} | Regular Returns`,
      portalSource: 'GSTN Live Gateway',
      score: String(gstin).includes('Z') ? 1.0 : 0.5,
      sha256Hash: computeSha256(gstin + Date.now()),
      status: (String(gstin).includes('Z') ? 'VERIFIED' : 'WARNING') as any,
      statusLabel: String(gstin).includes('Z') ? 'Active Status' : 'Review Required',
      weight: 0.2,
    },
    {
      bidderDocName: 'Udyam_Registration.pdf',
      bidderUploadData: `Declared Category: ${enterpriseCategory}`,
      digiLockerSigned: Boolean(digiLockerAuthenticated),
      domain: 'Enterprise Category' as const,
      id: 'P2',
      parameter: 'Udyam MSME Registration & Tier',
      portalData: udyamNumber
        ? `${udyamNumber} | Verified ${enterpriseCategory} Enterprise`
        : 'Udyam not found',
      portalSource: 'Ministry of MSME Udyam Portal',
      score: udyamNumber ? 1.0 : 0.4,
      sha256Hash: computeSha256(udyamNumber + Date.now()),
      status: (udyamNumber ? 'VALID' : 'FAILED') as any,
      statusLabel: udyamNumber ? `Valid ${enterpriseCategory}` : 'Missing Registration',
      weight: 0.2,
    },
    {
      bidderDocName: 'DigiLocker_Vault_Token.json',
      bidderUploadData: digiLockerAuthenticated
        ? `Aadhaar ref: ${digiLockerAadhaarRef}`
        : 'Unsigned manual upload',
      digiLockerSigned: Boolean(digiLockerAuthenticated),
      domain: 'Direct Verification' as const,
      id: 'P3',
      parameter: 'DigiLocker Cryptographic Proof',
      portalData: digiLockerAuthenticated
        ? 'National DigiLocker Repository: SHA-256 Validated'
        : 'No DigiLocker connection',
      portalSource: 'National DigiLocker API v2.0',
      score: digiLockerAuthenticated ? 1.0 : 0.0,
      sha256Hash: computeSha256(String(digiLockerAadhaarRef) + Date.now()),
      status: (digiLockerAuthenticated ? 'VERIFIED' : 'WARNING') as any,
      statusLabel: digiLockerAuthenticated ? 'Digitally Signed' : 'Manual Scan Only',
      weight: 0.15,
    },
    {
      bidderDocName: 'MII_Chartered_Accountant_Cert.pdf',
      bidderUploadData: `Declared Local Content: ${localContentPercent}% with CA Certificate`,
      domain: 'Policy Compliance' as const,
      id: 'P4',
      parameter: 'Make in India (MII) Local Content %',
      portalData: `${miiClass} | Minimum Threshold Met`,
      portalSource: 'DPIIT Industrial Registry',
      score: Number(localContentPercent) >= 50 ? 1.0 : 0.7,
      sha256Hash: computeSha256(String(localContentPercent) + Date.now()),
      status: (Number(localContentPercent) >= 50 ? 'COMPLIANT' : 'WARNING') as any,
      statusLabel: `${localContentPercent}% Local Content`,
      weight: 0.15,
    },
    {
      bidderDocName: 'Non_Blacklisting_Affidavit.pdf',
      bidderUploadData: 'Self-declaration of non-blacklisting submitted',
      discrepancyNote: isDebarred
        ? 'Entity or PAN listed under MoPNG/CVC Debarment List'
        : undefined,
      domain: 'Integrity Checks' as const,
      id: 'P5',
      parameter: 'Central Debarment & GeM Watchlist',
      portalData: isDebarred
        ? 'MATCH FOUND IN CENTRAL DEBARMENT DATABASE'
        : 'Clean Record across all ministries',
      portalSource: 'Central Debarment Unified DB',
      score: isDebarred ? 0.0 : 1.0,
      sha256Hash: computeSha256(pan + Date.now()),
      status: (isDebarred ? 'FAILED' : 'CLEAN') as any,
      statusLabel: isDebarred ? 'DEBARRED ENTITY' : 'No Adverse Records',
      weight: 0.15,
    },
    {
      bidderDocName: 'EPFO_Challan.pdf',
      bidderUploadData: 'Uploaded recent ECR challan acknowledgement',
      domain: 'Social Security' as const,
      id: 'P6',
      parameter: 'EPFO & ESIC Remittance Remittance',
      portalData: 'Establishment code active on Shram Suvidha Portal',
      portalSource: 'EPFO Shram Suvidha Portal',
      score: 0.9,
      sha256Hash: computeSha256(cin + Date.now()),
      status: 'VERIFIED' as any,
      statusLabel: 'Remittance Active',
      weight: 0.15,
    },
  ];

  let totalScore = 0;
  for (const p of parameters) {
    totalScore += p.weight * p.score;
  }
  const finalScore = Math.round(totalScore * 100);
  const riskLevel =
    isDebarred || finalScore < 60 ? 'HIGH' : finalScore >= 85 ? 'LOW' : 'MEDIUM';
  const status = isDebarred
    ? 'DISQUALIFIED'
    : finalScore >= 85
    ? 'AI_RECOMMENDED'
    : 'PENDING_REVIEW';

  const newBid: BidSubmission = {
    cin: cin || 'U29100TN2020PTC139011',
    complianceScore: finalScore,
    digiLockerAadhaarRef,
    digiLockerAuthenticated: Boolean(digiLockerAuthenticated),
    digiLockerVerifiedAt: digiLockerAuthenticated ? new Date().toISOString() : undefined,
    documents: [
      {
        confidence: 0.98,
        filename: 'Udyam_Registration.pdf',
        fileSize: '1.1 MB',
        id: `DOC-${Date.now()}-1`,
        ocrExtractedText: `ENTERPRISE NAME: ${String(
          bidderName
        ).toUpperCase()} | UDYAM: ${udyamNumber} | CATEGORY: ${String(
          enterpriseCategory
        ).toUpperCase()}`,
        sha256: computeSha256(bidderName + 'udyam'),
        type: 'UDYAM_CERTIFICATE',
        uploadedAt: new Date().toISOString(),
        verifiedViaDigiLocker: Boolean(digiLockerAuthenticated),
      },
      {
        confidence: 0.97,
        filename: 'GST_Certificate.pdf',
        fileSize: '820 KB',
        id: `DOC-${Date.now()}-2`,
        ocrExtractedText: `GOVT OF INDIA GST REGISTRATION: ${gstin} | NAME: ${String(
          bidderName
        ).toUpperCase()}`,
        sha256: computeSha256(bidderName + 'gst'),
        type: 'GST_CERTIFICATE',
        uploadedAt: new Date().toISOString(),
        verifiedViaDigiLocker: Boolean(digiLockerAuthenticated),
      },
    ],
    enterpriseCategory: enterpriseCategory || 'Small',
    gstin: gstin || '33AABCN9988P1Z0',
    id: newId,
    legalEntity: legalEntity || bidderName || 'New Vendor Enterprises',
    localContentPercent: Number(localContentPercent) || 65,
    miiClass,
    pan: pan || 'AABCN9988P',
    parameters,
    quotedValueINR: Number(quotedValueINR) || 4900000,
    riskLevel,
    status,
    submittedAt: new Date().toISOString(),
    tenderId: 'GEM/2026/B/891273',
    tenderTitle:
      'Procurement of High Pressure Cryogenic Valves & Fittings for CPCL Manali Refinery',
    bidderName: bidderName || 'New Vendor Enterprises',
    udyamNumber: udyamNumber || 'UDYAM-TN-02-0012345',
  };

  bids.unshift(newBid);

  appendAuditLog(
    'INGESTION',
    'GeM Ingestion Gateway',
    newBid.id,
    `Bid ingested for ${newBid.bidderName}. Score: ${finalScore}/100 [${riskLevel} RISK]. DigiLocker: ${
      digiLockerAuthenticated ? 'YES' : 'NO'
    }.`,
    'GFR 2017 Rule 149 & CVC/PROC/2021/04'
  );

  res.status(201).json({ bid: newBid });
});

// 5. Contacts listing
apiRouter.get('/v1/contacts', (_req, res) => {
  res.json({ contacts });
});

// 6. Debarred entities watchlist
apiRouter.get('/v1/debarred', (_req, res) => {
  res.json({ debarredEntities: BLACKLISTED_ENTITIES });
});

// 7. Officer decision recording
apiRouter.post('/v1/decision/:id', (req, res) => {
  const { action, officerDesignation, officerName, remarks } = req.body;
  const bid = bids.find((b) => b.id === req.params.id);
  if (!bid) return res.status(404).json({ error: 'Bid not found' });

  const auditHash = computeSha256(
    `${bid.id}|${action}|${officerName}|${remarks}|${Date.now()}`
  );

  bid.officerDecision = {
    action,
    auditHash,
    officerDesignation: officerDesignation || 'CGM (Procurement), CPCL',
    officerName: officerName || 'R. Kalyanasundaram',
    remarks:
      remarks ||
      `Officer confirmed ${action} decision following automated compliance review.`,
    timestamp: new Date().toISOString(),
  };

  if (action === 'QUALIFY') {
    bid.status = 'QUALIFIED';
  } else if (action === 'DISQUALIFY') {
    bid.status = 'DISQUALIFIED';
  } else if (action === 'CLARIFICATION') {
    bid.status = 'CLARIFICATION_REQUESTED';
  }

  appendAuditLog(
    'DECISION_FINALIZED',
    `${bid.officerDecision.officerName} (${bid.officerDecision.officerDesignation})`,
    bid.id,
    `Final decision recorded: ${action}. Remarks: ${
      bid.officerDecision.remarks
    }. Audit Hash: ${auditHash.slice(0, 16)}...`,
    'GFR 2017 Rule 173 & CVC Transparency Guidelines'
  );

  res.json({ bid, decision: bid.officerDecision });
});

// 8. DigiLocker OAuth Token Mock
apiRouter.post('/v1/digilocker/oauth/token', (req, res) => {
  const { aadhaar_last_four, consent } = req.body;
  if (!consent) {
    return res
      .status(400)
      .json({ detail: 'User consent is required for DigiLocker authentication.' });
  }

  const token = crypto
    .createHash('sha256')
    .update(`${aadhaar_last_four || '8921'}-${Date.now()}`)
    .digest('hex');

  res.json({
    aadhaar_last_four: aadhaar_last_four || '8921',
    access_token: token,
    expires_in: 3600,
    issuer:
      'Unique Identification Authority of India (UIDAI) / DigiLocker National Gateway',
    status: 'AUTHENTICATED',
    token_type: 'Bearer',
  });
});

// 9. DigiLocker Document Fetch Mock
apiRouter.get('/v1/digilocker/fetch-documents/:token', (req, res) => {
  const { token } = req.params;
  res.json({
    documents: [
      {
        category: 'Small',
        doc_id: 'UDYAM-TN-02-0098712',
        doc_type: 'UDYAM_CERTIFICATE',
        is_active: true,
        issuer_cert_authority:
          'CCA India / Ministry of Micro, Small and Medium Enterprises',
        organization_name: 'Apex Engineering Solutions Pvt Ltd',
        sha256: 'b821a8a25c1b6973e2a0f8b4d8e3d09a5b3992b4742e88a3b5c7ef61c7793b82',
        verified_at: new Date().toISOString(),
      },
      {
        doc_id: 'AAACA1234F',
        doc_type: 'PAN_CARD',
        is_active: true,
        issuer_cert_authority: 'Central Board of Direct Taxes (CBDT)',
        name: 'Apex Engineering Solutions Pvt Ltd',
        sha256: 'c0b79e2a9b31d8e4f1a23c5e6b7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
        verified_at: new Date().toISOString(),
      },
      {
        doc_id: '33AAACA1234F1Z5',
        doc_type: 'GST_CERTIFICATE',
        is_active: true,
        issuer_cert_authority: 'Goods and Services Tax Network (GSTN)',
        name: 'Apex Engineering Solutions Pvt Ltd',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        verified_at: new Date().toISOString(),
      },
    ],
    issuer: 'Ministry of MSME / CBDT / DigiLocker National Authority',
    status: 'SUCCESS',
    token_ref: token.slice(0, 12) + '...',
    verification_status: 'DIGITALLY_SIGNED',
  });
});

// 10. Gemini Intelligence Analyze
apiRouter.post('/v1/gemini/analyze', async (req, res) => {
  try {
    const { bidId, mode } = req.body;
    const bid = bids.find((b) => b.id === bidId) || bids[0];
    const result = await runBidComplianceReasoning(bid, mode || 'fast-scan');
    res.json({ analysis: result });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to analyze bid' });
  }
});

// 11. Gemini Copilot Chat
apiRouter.post('/v1/gemini/chat', async (req, res) => {
  try {
    const { bidId, history, message } = req.body;
    const bid = bids.find((b) => b.id === bidId);
    const response = await runOfficerChat(message, history || [], bid);
    res.json({ response });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Chat generation failed' });
  }
});

// 12. Tasks Listing
apiRouter.get('/v1/tasks', (_req, res) => {
  res.json({ tasks });
});

// 13. Create Task
apiRouter.post('/v1/tasks', (req, res) => {
  const {
    assignedOfficer,
    bidderId,
    dueDate,
    notes,
    priority,
    tenderId,
    title,
  } = req.body;
  const newTask: OfficerTask = {
    assignedOfficer: assignedOfficer || 'R. Kalyanasundaram',
    bidderId,
    completed: false,
    dueDate:
      dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    id: `TASK-${tasks.length + 1}`,
    notes: notes || '',
    priority: priority || 'MEDIUM',
    tenderId: tenderId || 'GEM/2026/B/891273',
    title: title || 'New Verification Task',
  };
  tasks.unshift(newTask);
  res.status(201).json({ task: newTask });
});

// 14. Update Task
apiRouter.put('/v1/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (typeof req.body.completed === 'boolean') task.completed = req.body.completed;
  if (req.body.title) task.title = req.body.title;
  if (req.body.notes) task.notes = req.body.notes;
  res.json({ task });
});

// 15. Dynamic Re-verification Trigger
apiRouter.post('/v1/verify/:id', (req, res) => {
  const bid = bids.find((b) => b.id === req.params.id);
  if (!bid) return res.status(404).json({ error: 'Bid not found' });

  let totalScore = 0;
  for (const p of bid.parameters) {
    totalScore += p.weight * p.score;
  }
  bid.complianceScore = Math.round(totalScore * 100);
  bid.riskLevel =
    bid.complianceScore >= 85
      ? 'LOW'
      : bid.complianceScore >= 60
      ? 'MEDIUM'
      : 'HIGH';

  appendAuditLog(
    'API_CROSS_VERIFY',
    'Multi-Source Verification Engine',
    bid.id,
    `Live re-verification executed across 6 registries. Dynamic Compliance Score: ${bid.complianceScore}/100.`,
    'GFR 2017 Rule 149 (Verification Matrix)'
  );

  res.json({ bid, message: 'Re-verification completed successfully' });
});

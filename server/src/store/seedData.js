import { VERIFICATION_TYPES, VERIFICATION_STATUS, RISK_LEVELS } from '../config/constants.js';

export const initialDossiers = [
  {
    id: 'DOS-PAN-849201',
    refId: 'LXM-PAN-2026-849201',
    type: VERIFICATION_TYPES.PAN,
    serviceTitle: 'PAN Master Verification',
    entityName: 'LAXMI NIWAS INFOTECH PVT LTD',
    entityIdentifier: 'AAACL7821M',
    status: VERIFICATION_STATUS.CERTIFIED,
    riskLevel: RISK_LEVELS.LOW,
    trustScore: 99.8,
    timestamp: '2026-09-18T05:45:12.000Z',
    latencyMs: 312,
    actor: 'Shubham (Admin)',
    channel: 'REST API v2.4',
    ipAddress: '103.21.144.92',
    panDetails: {
      panNumber: 'AAACL7821M',
      panStatus: 'OPERATIVE & ACTIVE',
      holderName: 'LAXMI NIWAS INFOTECH PVT LTD',
      panType: 'COMPANY / CORPORATE',
      dateOfIncorporation: '2019-04-12',
      aadhaarSeedingStatus: 'NOT_APPLICABLE (Corporate Entity)',
      jurisdiction: 'WARD 3(2), NEW DELHI CENTRAL',
      aoCode: 'DLC-W-03-2',
      taxComplianceRating: 'AAA',
      nsdlReferenceNumber: 'NSDL-VRF-89210-2026-X9',
      tamperEvidentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qrVerificationSignature: 'CERT-ITD-SIG-2026-09-18-LN-9921',
      validationChecks: [
        { label: 'NSDL Master Registry Sync', passed: true, note: 'Direct match confirmed' },
        { label: 'Corporate Entity CIN Linkage', passed: true, note: 'Matched with MCA ROC database' },
        { label: 'Income Tax Return Compliance', passed: true, note: 'AY 2025-26 filed regularly' },
        { label: 'TDS/TCS Regularity Assessment', passed: true, note: 'Zero active defaults' },
        { label: 'Sanctions & AML Blacklist Check', passed: true, note: 'Clean record across all databases' }
      ]
    }
  },
  {
    id: 'DOS-DL-982144',
    refId: 'LXM-DL-2026-982144',
    type: VERIFICATION_TYPES.DIGILOCKER,
    serviceTitle: 'DigiLocker Aadhaar KYC',
    entityName: 'SHUBHAM AGRAWAL',
    entityIdentifier: 'XXXX-XXXX-8921',
    status: VERIFICATION_STATUS.CERTIFIED,
    riskLevel: RISK_LEVELS.LOW,
    trustScore: 99.9,
    timestamp: '2026-09-18T05:22:30.000Z',
    latencyMs: 465,
    actor: 'Automated Gateway',
    channel: 'DigiLocker Bridge',
    ipAddress: '49.36.120.14',
    digiLockerDetails: {
      maskedAadhaar: 'XXXX-XXXX-8921',
      fullName: 'SHUBHAM AGRAWAL',
      gender: 'MALE',
      dateOfBirth: '1994-08-15',
      careOf: 'C/O SATISH KUMAR AGRAWAL',
      address: {
        line1: 'Flat 402, Laxmi Niwas Tower, Sector 62',
        line2: 'Institutional Area, Phase 2',
        city: 'Noida',
        district: 'Gautam Buddha Nagar',
        state: 'Uttar Pradesh',
        pincode: '201309',
        country: 'India'
      },
      xmlSignatureDigest: 'SHA256withRSA (UIDAI Root Certificate G2)',
      certificateExpiry: '2030-12-31T23:59:59Z',
      photoVerificationMatch: 99.4,
      offlineXmlTimestamp: '2026-09-18T05:22:28.112Z',
      validationChecks: [
        { label: 'UIDAI Cryptographic Signature', passed: true, note: 'Valid RSA-2048 Government Key' },
        { label: 'Face Match & Live Liveness', passed: true, note: '99.4% confidence score' },
        { label: 'Address Standardization (PIN 201309)', passed: true, note: 'Geocoded & verified' },
        { label: 'Time-bound OTP Nonce Validity', passed: true, note: 'Single-use cryptographic token verified' }
      ]
    }
  },
  {
    id: 'DOS-CIB-719302',
    refId: 'LXM-CIB-2026-719302',
    type: VERIFICATION_TYPES.CIBIL,
    serviceTitle: 'TransUnion CIBIL Credit Dossier',
    entityName: 'SHUBHAM AGRAWAL',
    entityIdentifier: 'AAACL7821M',
    status: VERIFICATION_STATUS.CERTIFIED,
    riskLevel: RISK_LEVELS.LOW,
    trustScore: 98.6,
    timestamp: '2026-09-18T04:50:00.000Z',
    latencyMs: 590,
    actor: 'Credit Underwriter (System)',
    channel: 'Bureau Host-to-Host',
    ipAddress: '103.21.144.92',
    cibilDetails: {
      creditScore: 785,
      scoreScale: '300-900',
      scoreCategory: 'EXCELLENT / PRIME',
      summary: {
        totalAccounts: 6,
        activeAccounts: 4,
        closedAccounts: 2,
        overdueAccounts: 0,
        totalSanctionedLimit: 3850000,
        currentBalance: 420000,
        creditUtilizationRatio: '10.9%',
        onTimePaymentTrack: '100% (36/36 Months)'
      },
      accounts: [
        {
          lender: 'HDFC Bank Ltd',
          accountType: 'Home Loan',
          accountNumber: '••••••••4819',
          sanctionAmount: 3200000,
          currentBalance: 395000,
          status: 'STANDARD / ON-TIME',
          openedDate: '2021-06-15',
          dpdMax: 0
        },
        {
          lender: 'ICICI Bank Ltd',
          accountType: 'Credit Card (Sapphiro)',
          accountNumber: '••••••••7721',
          sanctionAmount: 500000,
          currentBalance: 25000,
          status: 'STANDARD / ON-TIME',
          openedDate: '2020-01-10',
          dpdMax: 0
        },
        {
          lender: 'Axis Bank Ltd',
          accountType: 'Auto Loan',
          accountNumber: '••••••••1109',
          sanctionAmount: 850000,
          currentBalance: 0,
          status: 'CLOSED (Full Repayment)',
          openedDate: '2019-03-20',
          dpdMax: 0
        }
      ],
      recentInquiries: [
        { date: '2026-08-10', institution: 'Laxmi Niwas Verification', purpose: 'Credit Assessment (Commercial)' },
        { date: '2026-03-14', institution: 'HDFC Bank Ltd', purpose: 'Credit Card Limit Review' }
      ],
      bureauSealReference: 'TU-CIBIL-CERT-99410-2026-IN'
    }
  },
  {
    id: 'DOS-GST-441029',
    refId: 'LXM-GST-2026-441029',
    type: VERIFICATION_TYPES.GST,
    serviceTitle: 'GSTIN Compliance Verification',
    entityName: 'LAXMI NIWAS INFOTECH PVT LTD',
    entityIdentifier: '07AAACL7821M1Z5',
    status: VERIFICATION_STATUS.CERTIFIED,
    riskLevel: RISK_LEVELS.LOW,
    trustScore: 99.2,
    timestamp: '2026-09-18T03:15:40.000Z',
    latencyMs: 380,
    actor: 'Shubham (Admin)',
    channel: 'REST API v2.4',
    ipAddress: '103.21.144.92',
    gstDetails: {
      gstin: '07AAACL7821M1Z5',
      legalName: 'LAXMI NIWAS INFOTECH PRIVATE LIMITED',
      tradeName: 'LAXMI NIWAS VERIFY',
      registrationDate: '2019-05-18',
      taxpayerType: 'Regular',
      status: 'Active',
      principalPlace: '402, Laxmi Niwas Tower, Connaught Place, New Delhi 110001',
      filingTrackRecord: '100% On-Time (12/12 Months GSTR-3B & GSTR-1)',
      annualTurnoverTier: '₹ 25 Cr - 50 Cr'
    }
  },
  {
    id: 'DOS-BNK-330192',
    refId: 'LXM-BNK-2026-330192',
    type: VERIFICATION_TYPES.BANK,
    serviceTitle: 'Bank Account & Penny Drop (IMPS)',
    entityName: 'LAXMI NIWAS INFOTECH PVT LTD',
    entityIdentifier: '••••••••1729 (HDFC0000060)',
    status: VERIFICATION_STATUS.CERTIFIED,
    riskLevel: RISK_LEVELS.LOW,
    trustScore: 100,
    timestamp: '2026-09-18T02:40:11.000Z',
    latencyMs: 495,
    actor: 'Automated Gateway',
    channel: 'IMPS Host-to-Host',
    ipAddress: '49.36.120.14',
    bankDetails: {
      accountNumberMasked: '5020••••••1729',
      ifscCode: 'HDFC0000060',
      bankName: 'HDFC Bank Ltd',
      branchName: 'Connaught Place Main Branch, New Delhi',
      beneficiaryNameCBS: 'LAXMI NIWAS INFOTECH PRIVATE LIMITED',
      fuzzyMatchScore: 100,
      pennyDropStatus: 'SUCCESS (₹1.00 Credited)',
      npciRrn: '626109481920',
      accountOperational: true
    }
  },
  {
    id: 'DOS-MCA-118492',
    refId: 'LXM-MCA-2026-118492',
    type: VERIFICATION_TYPES.MCA,
    serviceTitle: 'MCA Corporate Master Dossier',
    entityName: 'LAXMI NIWAS INFOTECH PVT LTD',
    entityIdentifier: 'U72900DL2019PTC348912',
    status: VERIFICATION_STATUS.CERTIFIED,
    riskLevel: RISK_LEVELS.LOW,
    trustScore: 99.6,
    timestamp: '2026-09-18T01:10:00.000Z',
    latencyMs: 520,
    actor: 'Compliance Team',
    channel: 'MCA ROC Portal',
    ipAddress: '103.21.144.92',
    mcaDetails: {
      cin: 'U72900DL2019PTC348912',
      companyName: 'LAXMI NIWAS INFOTECH PRIVATE LIMITED',
      rocCode: 'ROC Delhi',
      registrationNumber: '348912',
      companyCategory: 'Company limited by Shares / Non-govt company',
      classOfCompany: 'Private',
      dateOfIncorporation: '2019-04-12',
      authorizedCapital: '₹ 50,00,000',
      paidUpCapital: '₹ 25,00,000',
      directors: [
        { din: '08419201', name: 'SHUBHAM AGRAWAL', designation: 'Managing Director', appointmentDate: '2019-04-12' },
        { din: '08419202', name: 'PRIYA AGRAWAL', designation: 'Director', appointmentDate: '2019-04-12' }
      ],
      registeredOffice: '402, Laxmi Niwas Tower, Connaught Place, New Delhi 110001',
      listingStatus: 'Unlisted',
      activeCompliance: 'ACTIVE (Compliant with e-Form INC-22A & AOC-4)'
    }
  }
];

export const initialApiKeys = [
  {
    id: 'key-live-01',
    name: 'Production Core Gateway',
    environment: 'LIVE',
    keyPrefix: 'lxm_live_',
    maskedKey: 'lxm_live_••••••••••••39a1',
    rawKeyPreview: 'lxm_live_9f81bc20e82c449191d8481239a1',
    status: 'ACTIVE',
    createdDate: '2026-01-15T10:00:00Z',
    lastUsed: '2 mins ago',
    rateLimitRps: 150,
    permissions: ['ALL_SERVICES', 'READ_DOSSIERS', 'EXECUTE_VERIFICATION'],
    webhookUrl: 'https://api.laxminiwas.com/v1/webhooks/verify-events'
  },
  {
    id: 'key-test-01',
    name: 'Sandbox Development Key',
    environment: 'SANDBOX',
    keyPrefix: 'lxm_test_',
    maskedKey: 'lxm_test_••••••••••••8b94',
    rawKeyPreview: 'lxm_test_7a10dd91c01e4590bb2189408b94',
    status: 'ACTIVE',
    createdDate: '2026-02-01T12:30:00Z',
    lastUsed: 'Just now',
    rateLimitRps: 50,
    permissions: ['ALL_SERVICES_SANDBOX'],
    webhookUrl: 'https://staging-api.laxminiwas.com/webhooks/test'
  }
];

export const initialAuditLogs = [
  {
    id: 'AUD-99120',
    timestamp: '2026-09-18T05:45:12Z',
    action: 'VERIFICATION_EXECUTED',
    service: 'PAN Master Verification',
    entity: 'LAXMI NIWAS INFOTECH (AAACL7821M)',
    actor: 'Shubham Agrawal (Super Admin)',
    status: 'SUCCESS',
    ipAddress: '103.21.144.92',
    details: 'NSDL database query executed with 100% cryptographic certificate match.'
  },
  {
    id: 'AUD-99119',
    timestamp: '2026-09-18T05:22:30Z',
    action: 'DIGILOCKER_KYC_ISSUED',
    service: 'DigiLocker Aadhaar KYC',
    entity: 'SHUBHAM AGRAWAL (XXXX-XXXX-8921)',
    actor: 'Automated Gateway',
    status: 'SUCCESS',
    ipAddress: '49.36.120.14',
    details: 'UIDAI XML paperless eKYC signature validated with high-res portrait.'
  },
  {
    id: 'AUD-99118',
    timestamp: '2026-09-18T04:50:00Z',
    action: 'CREDIT_INQUIRY_PULL',
    service: 'TransUnion CIBIL Bureau',
    entity: 'SHUBHAM AGRAWAL (AAACL7821M)',
    actor: 'Credit Underwriter System',
    status: 'SUCCESS',
    ipAddress: '103.21.144.92',
    details: 'TransUnion CIBIL Prime credit report generated. Score: 785.'
  },
  {
    id: 'AUD-99117',
    timestamp: '2026-09-18T03:15:40Z',
    action: 'GSTIN_VERIFIED',
    service: 'GSTIN Compliance Verification',
    entity: '07AAACL7821M1Z5',
    actor: 'Shubham Agrawal',
    status: 'SUCCESS',
    ipAddress: '103.21.144.92',
    details: 'Central GSTN registry verified for Active status and GSTR-3B filings.'
  },
  {
    id: 'AUD-99116',
    timestamp: '2026-09-18T02:00:15Z',
    action: 'API_KEY_ROTATED',
    service: 'Security Subsystem',
    entity: 'Production Core Gateway',
    actor: 'Security Daemon',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
    details: 'Automated 90-day key health check passed. Signature integrity verified.'
  }
];

export const initialMetrics = {
  successRate: 99.82,
  successRateDelta: '+0.14%',
  totalVerifications: 148920,
  verificationsDelta: '+18.4%',
  avgLatencyMs: 410,
  latencyDelta: '-35ms',
  trustScore: 99.4,
  trustScoreCategory: 'Institutional Grade (AAA)',
  uptime: '99.99%',
  activeNodes: 12,
  throughputTimeSeries: [
    { time: '00:00', pan: 120, aadhaar: 95, cibil: 45, gst: 30, bank: 60 },
    { time: '04:00', pan: 80, aadhaar: 60, cibil: 25, gst: 15, bank: 35 },
    { time: '08:00', pan: 350, aadhaar: 310, cibil: 190, gst: 140, bank: 220 },
    { time: '12:00', pan: 620, aadhaar: 580, cibil: 340, gst: 280, bank: 410 },
    { time: '16:00', pan: 710, aadhaar: 640, cibil: 390, gst: 310, bank: 460 },
    { time: '20:00', pan: 490, aadhaar: 420, cibil: 260, gst: 190, bank: 330 },
    { time: '23:59', pan: 210, aadhaar: 180, cibil: 110, gst: 75, bank: 140 }
  ],
  serviceDistribution: [
    { name: 'PAN Master', count: 52100, percentage: 35, color: '#059669' },
    { name: 'DigiLocker KYC', count: 41700, percentage: 28, color: '#10B981' },
    { name: 'TransUnion CIBIL', count: 23800, percentage: 16, color: '#0284C7' },
    { name: 'Bank Penny Drop', count: 17800, percentage: 12, color: '#6366F1' },
    { name: 'GSTIN / Tax', count: 8900, percentage: 6, color: '#F59E0B' },
    { name: 'MCA Corporate', count: 4620, percentage: 3, color: '#EC4899' }
  ]
};

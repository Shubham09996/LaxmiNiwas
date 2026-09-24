export const ALL_APIS = [
  // --- BHARAT CLOUD STATUTORY & BANKING (11 APIS) ---
  {
    id: 'pan-advance',
    num: 1,
    name: 'PAN Card Verification (Plus)',
    category: 'Statutory',
    gateway: 'Bharat Cloud',
    baseCost: 2.00,
    gst: 0.36,
    cost: 2.36,
    icon: 'CreditCard',
    tag: 'Bharat Cloud • NSDL',
    description: 'Live demographic, Aadhaar linkage & allotment data direct lookup via PAN number.',
    details: '/srv2/validation/pan/plus • POST • Bharat Cloud',
    fixedRules: 'Direct PAN Plus Gateway • Aadhaar Seeding & Allotment',
    sampleInput: {
      pan_number: 'AAACL7821M'
    }
  },
  {
    id: 'aadhaar-digilocker-generate',
    num: 2,
    name: 'Aadhaar DigiLocker – Generate URL',
    category: 'Statutory',
    gateway: 'Bharat Cloud',
    baseCost: 3.00,
    gst: 0.54,
    cost: 3.54,
    icon: 'Fingerprint',
    tag: 'Bharat Cloud • UIDAI',
    description: 'Initializes DigiLocker paperless digital e-KYC flow and generates real-time token consent URL.',
    details: '/srv2/validation/digilocker-digital-kyc • POST',
    fixedRules: 'methodName="generateToken" • auto-redirect callback',
    sampleInput: {
      aadhaar_number: '984512348921',
      redirectUrl: 'https://laxminiwas.com/aadhaar-callback',
      logoUrl: 'https://laxminiwas.com/logo.png'
    }
  },
  {
    id: 'aadhaar-digilocker-fetch',
    num: 3,
    name: 'Aadhaar DigiLocker – Fetch Details',
    category: 'Statutory',
    gateway: 'Bharat Cloud',
    baseCost: 3.00,
    gst: 0.54,
    cost: 3.54,
    icon: 'FileCheck',
    tag: 'Bharat Cloud • UIDAI',
    description: 'Fetches officially verified Aadhaar XML details (Photo, Address, DOB, Gender) using client token.',
    details: '/srv2/validation/digilocker-digital-kyc • POST',
    fixedRules: 'methodName="fetchDetails"',
    sampleInput: {
      client_id: 'DL_REQ_665a91b24e8c10948b8719'
    }
  },
  {
    id: 'aadhaar-fetch-without-otp',
    num: 4,
    name: 'Aadhar Fetch Without OTP',
    category: 'Statutory',
    gateway: 'Bharat Cloud',
    baseCost: 8.00,
    gst: 1.44,
    cost: 9.44,
    icon: 'Fingerprint',
    tag: 'Bharat Cloud • UIDAI',
    description: 'Direct live verification gateway powered by Bharat API Cloud with automatic wallet debit (₹9.44) & refunds.',
    details: '/srv3/verification/aadhar • POST • No OTP Required',
    fixedRules: '12 Digits (No OTP required) • Real-time statutory lookup',
    sampleInput: {
      aadhaar_number: '975589822424',
      full_name: 'SHUBHAM GUPTA'
    }
  },
  {
    id: 'bank-account-verification',
    num: 5,
    name: 'Bank Account Verification',
    category: 'Banking',
    gateway: 'Bharat Cloud',
    baseCost: 3.00,
    gst: 0.54,
    cost: 3.54,
    icon: 'Landmark',
    tag: 'Bharat Cloud • CBS',
    description: 'Real-time bank account validation, beneficiary name lookup and active status check.',
    details: '/api/v1/validate_bank_account • POST',
    sampleInput: {
      account_number: '50100238491029',
      ifsc: 'HDFC0001234'
    }
  },
  {
    id: 'bank-ifsc-lookup',
    num: 6,
    name: 'Bank IFSC Code Lookup',
    category: 'Banking',
    gateway: 'Bharat Cloud',
    baseCost: 1.00,
    gst: 0.18,
    cost: 1.18,
    icon: 'ArrowRightLeft',
    tag: 'Bharat Cloud • RBI',
    description: 'Instant branch address, NEFT/RTGS/IMPS enablement, MICR and bank details from IFSC.',
    details: '/bank/ifsc • POST • RBI Central Directory',
    sampleInput: {
      ifsc: 'HDFC0001234'
    }
  },
  {
    id: 'mobile-to-bank-advance',
    num: 7,
    name: 'Mobile To Bank Advance (Live Account Linkage)',
    category: 'Banking',
    gateway: 'Bharat Cloud',
    baseCost: 5.00,
    gst: 0.90,
    cost: 5.90,
    icon: 'Landmark',
    tag: 'Bharat Cloud • CBS Linkage',
    description: 'Direct live verification gateway powered by Bharat API Cloud with automatic wallet debit (₹5.90) & refunds.',
    details: '/srv3/mobile-to-bank/advance • POST • Live Account Linkage',
    fixedRules: '10 Digits Mobile • Auto User Consent (Y Fixed)',
    sampleInput: {
      mobile: '8287270925'
    }
  },
  {
    id: 'mobile-upi-lookup-enhanced',
    num: 8,
    name: 'Mobile To UPI Lookup Enhanced',
    category: 'Banking',
    gateway: 'Bharat Cloud',
    baseCost: 2.80,
    gst: 0.50,
    cost: 3.30,
    icon: 'Smartphone',
    tag: 'Bharat Cloud • NPCI',
    description: 'Live NPCI directory lookup fetching UPI Virtual Payment Address (VPA) & account holder name.',
    details: '/srv2/mobile-upi-lookup/enhanced • POST • NPCI Directory',
    fixedRules: '10 Digits Mobile • Instant VPA & Name Match',
    sampleInput: {
      mobile: '8527475512'
    }
  },
  {
    id: 'uan-lookup-mobile',
    num: 9,
    name: 'EPFO / UAN Mobile Lookup',
    category: 'Employment',
    gateway: 'Bharat Cloud',
    baseCost: 2.79,
    gst: 0.50,
    cost: 3.29,
    icon: 'Briefcase',
    tag: 'Bharat Cloud • EPFO',
    description: 'Fetches Universal Account Number (UAN) registered under the applicant mobile number.',
    details: '/srv3/uan-mobile • POST • EPFO Sync',
    sampleInput: {
      mobile: '9876543210'
    }
  },
  {
    id: 'uan-direct-history',
    num: 10,
    name: 'UAN Direct Employment History',
    category: 'Employment',
    gateway: 'Bharat Cloud',
    baseCost: 3.80,
    gst: 0.68,
    cost: 4.48,
    icon: 'Briefcase',
    tag: 'Bharat Cloud • EPFO',
    description: 'Detailed EPFO service record with active employer establishment list and passbook history.',
    details: '/srv3/uan-direct • POST • EPFO Passbook',
    sampleInput: {
      uan: '100928491029'
    }
  },
  {
    id: 'mobile-profile-prefill',
    num: 11,
    name: 'Mobile Profile & Reference Prefill',
    category: 'Telecom',
    gateway: 'Bharat Cloud',
    baseCost: 5.00,
    gst: 0.90,
    cost: 5.90,
    icon: 'Smartphone',
    tag: 'Bharat Cloud • Telecom',
    description: 'Telecom-grade demographic prefill, name verification and emergency references lookup.',
    details: '/srv4/credit-report/prefill • POST',
    sampleInput: {
      mobile_number: '9876543210',
      first_name: 'SHUBHAM',
      last_name: 'GUPTA'
    }
  },
  {
    id: 'ip-fraud-geolocation',
    num: 12,
    name: 'IP Fraud & Geolocation Risk',
    category: 'Cyber Risk',
    gateway: 'Bharat Cloud',
    baseCost: 2.00,
    gst: 0.36,
    cost: 2.36,
    icon: 'Globe',
    tag: 'Bharat Cloud • Risk',
    description: 'Evaluates IP address risk level, ISP organization, city coordinates, proxy/VPN detection.',
    details: '/check • POST • Threat Intelligence',
    fixedRules: 'ip=auto-detected via request if omitted',
    sampleInput: {
      ip: '103.21.144.92'
    }
  },
  {
    id: 'reverse-geocoding',
    num: 13,
    name: 'Reverse Geocoding (Coordinates)',
    category: 'Doorstep GPS',
    gateway: 'Bharat Cloud',
    baseCost: 2.00,
    gst: 0.36,
    cost: 2.36,
    icon: 'MapPin',
    tag: 'Bharat Cloud • GPS',
    description: 'Translates device GPS latitude & longitude into doorstep verified residential postal address.',
    details: '/reverse • POST • OpenStreetMap / Postal',
    sampleInput: {
      lat: 28.6139,
      lon: 77.2090
    }
  },
  {
    id: 'domain-age-security',
    num: 14,
    name: 'Domain Age & MX Security',
    category: 'Security',
    gateway: 'Bharat Cloud',
    baseCost: 2.00,
    gst: 0.36,
    cost: 2.36,
    icon: 'Shield',
    tag: 'Bharat Cloud • Security',
    description: 'Validates corporate employer email domain registration date, lifetime age, and MX deliverability.',
    details: '/dosvak/domain-age • POST • ICANN Registry',
    sampleInput: {
      domain: 'laxminiwas.com'
    }
  },

  // --- BHARAT CLOUD / IDSPAY CREDIT BUREAU (3 APIS) ---
  {
    id: 'cibil-transunion-pdf',
    num: 15,
    name: 'CIBIL TransUnion Credit PDF',
    category: 'Credit Bureau',
    gateway: 'IDSPay',
    baseCost: 75.00,
    gst: 13.50,
    cost: 88.50,
    icon: 'TrendingUp',
    tag: 'IDSPay • TransUnion',
    description: 'Official TransUnion comprehensive bureau file, 36-month repayment track, and instant PDF report generation.',
    details: '/srv5/transunion-Score-Hybrid • POST • IDSPay',
    fixedRules: 'gender="Male" • DOB supported',
    sampleInput: {
      forename: 'PRADEEP',
      surname: 'KUMAR',
      phone_number: '8976543210',
      pan_id: 'AAACL7821M',
      gender: 'Male',
      date_of_birth: '1960-05-30'
    }
  },
  {
    id: 'experian-credit-report',
    num: 16,
    name: 'Experian Credit Bureau Report',
    category: 'Credit Bureau',
    gateway: 'Bharat Cloud',
    baseCost: 25.00,
    gst: 4.50,
    cost: 29.50,
    icon: 'TrendingUp',
    tag: 'Bharat Cloud • Experian',
    description: 'Real-time Experian consumer credit score, active tradeline accounts, and credit limits.',
    details: '/srv2/credit-report/experian • POST • Bharat Cloud',
    fixedRules: 'dob="1995-01-01" fallback',
    sampleInput: {
      mobile_no: '9876543210',
      pan: 'AAACL7821M',
      first_name: 'SHUBHAM',
      last_name: 'GUPTA',
      dob: '1995-01-01'
    }
  },
  {
    id: 'crif-credit-score-v4',
    num: 17,
    name: 'CRIF HighMark Credit Score (V4)',
    category: 'Credit Bureau',
    gateway: 'Bharat Cloud',
    baseCost: 25.00,
    gst: 4.50,
    cost: 29.50,
    icon: 'TrendingUp',
    tag: 'Bharat Cloud • CRIF',
    description: 'Instant CRIF HighMark credit score rating, active EMI liabilities, and default history.',
    details: '/crif/Credit-ScoreV4 • POST • Bharat Cloud',
    fixedRules: 'name_lookup=0 (bureau mandatory default)',
    sampleInput: {
      mobile_no: '9876543210',
      first_name: 'SHUBHAM',
      last_name: 'GUPTA'
    }
  }
];

export const TOTAL_BASE_COST = 170.39;
export const TOTAL_GST = 30.66;
export const TOTAL_COST_WITH_GST = 201.05;
export const TOTAL_COST_PER_CUSTOMER = 201.05;
export const SERVICES_CATALOG = ALL_APIS;
export const API_STAGES = {};

export const VERIFICATION_TYPES = {
  PAN: 'PAN_VERIFICATION',
  DIGILOCKER: 'DIGILOCKER_KYC',
  CIBIL: 'CIBIL_CREDIT_REPORT',
  GST: 'GSTIN_COMPLIANCE',
  BANK: 'BANK_PENNY_DROP',
  MCA: 'MCA_CORPORATE_DATA'
};

export const VERIFICATION_STATUS = {
  CERTIFIED: 'CERTIFIED',
  VALIDATED: 'VALIDATED',
  PENDING: 'PENDING',
  MANUAL_REVIEW: 'MANUAL_REVIEW',
  FAILED: 'FAILED'
};

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

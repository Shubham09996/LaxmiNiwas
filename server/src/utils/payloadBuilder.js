/**
 * Master Profile Enrichment & Auto-Derived Rules Utility
 * Laxmi Niwas Production Verification Gateway
 */

export function splitName(fullName = '') {
  const clean = String(fullName || '').trim().replace(/\s+/g, ' ');
  if (!clean) {
    return {
      fullName: 'SHUBHAM GUPTA',
      firstName: 'SHUBHAM',
      lastName: 'GUPTA',
      forename: 'SHUBHAM',
      surname: 'GUPTA'
    };
  }

  const parts = clean.split(' ');
  if (parts.length === 1) {
    const single = parts[0].toUpperCase();
    return {
      fullName: single,
      firstName: single,
      lastName: single, // Duplicate single name for bureau compliance
      forename: single,
      surname: single
    };
  }

  const first = parts[0].toUpperCase();
  const last = parts.slice(1).join(' ').toUpperCase();
  return {
    fullName: clean.toUpperCase(),
    firstName: first,
    lastName: last,
    forename: first,
    surname: last
  };
}

export function normalizeMobile(phone = '') {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '').slice(-10);
}

export function normalizePan(pan = '') {
  if (!pan) return '';
  return String(pan).toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
}

export function normalizeAadhaar(aadhaar = '') {
  if (!aadhaar) return '';
  return String(aadhaar).replace(/\D/g, '').slice(-12);
}

/**
 * Builds and normalizes upstream payload from request parameters and master profile
 */
export function buildEnrichedPayload(apiId, inputParams = {}, req = null) {
  // Extract master profile inputs
  const rawName = inputParams.fullName || inputParams.name || inputParams.first_name || '';
  const { fullName, firstName, lastName, forename, surname } = splitName(rawName);

  const mobile = normalizeMobile(
    inputParams.mobileNumber || inputParams.mobile || inputParams.mobile_no || inputParams.mobile_number || inputParams.phone || inputParams.phone_number || ''
  );

  const pan = normalizePan(
    inputParams.panNumber || inputParams.pan || inputParams.pan_id || inputParams.pan_number || ''
  );

  const aadhaar = normalizeAadhaar(
    inputParams.aadhaarNumber || inputParams.aadhaar || inputParams.aadhaar_number || ''
  );

  // Auto-detected IP address
  const clientIp = (
    inputParams.ip ||
    req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    req?.socket?.remoteAddress ||
    '103.21.144.92'
  ).replace('::ffff:', '');

  const dob = inputParams.dob || inputParams.date_of_birth || '1995-01-01';
  const genderLower = (inputParams.gender || 'male').toLowerCase();
  const genderCapitalized = genderLower === 'female' ? 'Female' : 'Male';

  switch (apiId) {
    // 1. PAN Card Verification (Fuzzy Match)
    case 'pan-advance':
    case 'pan':
      return {
        pan: pan || 'AAACL7821M',
        name: fullName || 'SHUBHAM GUPTA',
        pan_display_name: 'false',
        name_match_method: 'fuzzy'
      };

    // 2. Aadhaar DigiLocker – Generate e-KYC URL
    case 'aadhaar-digilocker-generate':
    case 'digilocker-generate':
      return {
        methodName: 'generateToken',
        aadhaar_number: aadhaar || '984512348921',
        redirectUrl: inputParams.redirectUrl || 'https://laxminiwas.com/aadhaar-callback',
        logoUrl: inputParams.logoUrl || 'https://laxminiwas.com/logo.png'
      };

    // 3. Aadhaar DigiLocker – Fetch Details
    case 'aadhaar-digilocker-fetch':
    case 'digilocker-fetch':
      return {
        methodName: 'fetchDetails',
        client_id: inputParams.client_id || inputParams.clientId || 'DL_REQ_665a91b24e8c10948b8719'
      };

    // 4. Bank Account Verification (Penny-less / Active Check)
    case 'bank-account-verification':
    case 'bank-account':
      return {
        account_number: (inputParams.account_number || inputParams.accountNumber || '50100238491029').trim(),
        ifsc: (inputParams.ifsc || 'HDFC0001234').toUpperCase().trim()
      };

    // 5. Bank IFSC Code Lookup
    case 'bank-ifsc-lookup':
    case 'ifsc':
      return {
        ifsc: (inputParams.ifsc || 'HDFC0001234').toUpperCase().trim()
      };

    // 6. EPFO / UAN Lookup (via Mobile Number)
    case 'uan-lookup-mobile':
    case 'uan-mobile':
      return {
        mobile: mobile || '9876543210'
      };

    // 7. EPFO / UAN Direct Employment History
    case 'uan-direct-history':
    case 'uan-direct':
      return {
        uan: (inputParams.uan || inputParams.uanNumber || '100928491029').trim()
      };

    // 8. Mobile Profile & Reference Prefill
    case 'mobile-profile-prefill':
    case 'mobile-prefill':
      return {
        mobile_number: mobile || '9876543210',
        first_name: firstName || 'Shubham',
        last_name: lastName || 'Gupta'
      };

    // 9. IP Fraud & Geolocation Risk
    case 'ip-fraud-geolocation':
    case 'ip-check':
      return {
        ip: clientIp
      };

    // 10. Reverse Geocoding (Coordinates to Exact Address)
    case 'reverse-geocoding':
    case 'reverse-geo':
      return {
        lat: parseFloat(inputParams.lat ?? inputParams.latitude ?? 28.6139),
        lon: parseFloat(inputParams.lon ?? inputParams.longitude ?? 77.2090)
      };

    // 11. Domain Age & MX Security Check
    case 'domain-age-security':
    case 'domain-age':
      return {
        domain: (inputParams.domain || 'laxminiwas.com').replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()
      };

    // 12. CIBIL / TransUnion Credit Report (PDF Download)
    case 'cibil-transunion-pdf':
    case 'cibil-pdf':
      return {
        name: fullName || 'SHUBHAM GUPTA',
        mobile: mobile || '9876543210',
        pan: pan || 'AAACL7821M',
        gender: genderLower,
        consent: 'Y'
      };

    // 13. CIBIL / TransUnion Hybrid Score (V5 Analysis)
    case 'cibil-transunion-v5':
    case 'cibil-hybrid':
      return {
        forename: forename || 'SHUBHAM',
        surname: surname || 'GUPTA',
        phone_number: mobile || '9876543210',
        gender: genderCapitalized,
        pan_id: pan || 'AAACL7821M',
        dob: dob
      };

    // 14. Experian Credit Bureau Report
    case 'experian-credit-report':
    case 'experian':
      return {
        mobile_no: mobile || '9876543210',
        pan: pan || 'AAACL7821M',
        first_name: firstName || 'SHUBHAM',
        last_name: lastName || 'GUPTA',
        dob: dob
      };

    // 15. CRIF HighMark Credit Score (V4 Deep Dossier)
    case 'crif-credit-score-v4':
    case 'crif-score':
      return {
        mobile_no: mobile || '9876543210',
        name_lookup: inputParams.name_lookup ?? 0,
        first_name: firstName || 'SHUBHAM',
        last_name: lastName || 'GUPTA'
      };

    default:
      return inputParams;
  }
}

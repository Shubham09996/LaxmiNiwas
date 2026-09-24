/**
 * Master Profile Enrichment & Payload Normalization Utility
 * Laxmi Niwas Production Verification Gateway
 */

export function splitName(fullName = '') {
  const clean = String(fullName || '').trim().replace(/\s+/g, ' ');
  if (!clean) {
    return {
      fullName: '',
      firstName: '',
      lastName: '',
      forename: '',
      surname: ''
    };
  }

  const parts = clean.split(' ');
  if (parts.length === 1) {
    const single = parts[0].toUpperCase();
    return {
      fullName: single,
      firstName: single,
      lastName: single,
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
 * Normalizes upstream payload using real user request parameters
 */
export function buildEnrichedPayload(apiId, inputParams = {}, req = null) {
  const rawName = inputParams.fullName || inputParams.name || inputParams.first_name || inputParams.forename || '';
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

  // Auto-detected IP address from real incoming HTTP request or direct input
  const clientIp = (
    inputParams.ip ||
    inputParams.ipAddress ||
    req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    req?.socket?.remoteAddress ||
    ''
  ).replace('::ffff:', '');

  const dob = inputParams.dob || inputParams.date_of_birth || '';
  const gender = inputParams.gender || '';

  switch (apiId) {
    // 1. PAN Card Verification (Plus)
    case 'pan-advance':
    case 'pan-plus':
    case 'pan': {
      const panVal = (pan || inputParams.pan_number || inputParams.pan || inputParams.panNumber || '').toUpperCase().trim();
      return {
        pan: panVal,
        pan_number: panVal
      };
    }

    // 2. Aadhaar DigiLocker – Generate e-KYC URL
    case 'aadhaar-digilocker-generate':
    case 'digilocker-generate':
      return {
        methodName: inputParams.methodName || 'generateToken',
        aadhaar_number: aadhaar || (inputParams.aadhaar_number || '').replace(/\D/g, ''),
        redirectUrl: inputParams.redirectUrl || 'https://laxminiwas.com/aadhaar-callback',
        logoUrl: inputParams.logoUrl || 'https://laxminiwas.com/logo.png'
      };

    // 3. Aadhaar DigiLocker – Fetch Details
    case 'aadhaar-digilocker-fetch':
    case 'digilocker-fetch':
      return {
        methodName: inputParams.methodName || 'fetchDetails',
        client_id: inputParams.client_id || inputParams.clientId || ''
      };

    // 4. Aadhaar Fetch - Without OTP
    case 'aadhaar-fetch-without-otp':
    case 'aadhaar-without-otp':
    case 'aadhar-fetch-without-otp':
    case 'aadhar-without-otp': {
      const aadhaarVal = (aadhaar || inputParams.aadhaar_number || inputParams.aadhar_number || inputParams.aadhaar || inputParams.aadhar || '').replace(/\D/g, '').slice(-12);
      const nameVal = (fullName || inputParams.full_name || inputParams.name || '').trim();
      return {
        aadhaar_number: aadhaarVal,
        aadhar_number: aadhaarVal,
        aadhaar: aadhaarVal,
        full_name: nameVal,
        name: nameVal
      };
    }

    // 5. Bank Account Verification (Penny-less / Active Check)
    case 'bank-account-verification':
    case 'bank-account':
      return {
        account_number: (inputParams.account_number || inputParams.accountNumber || '').trim(),
        ifsc: (inputParams.ifsc || inputParams.ifscCode || '').toUpperCase().trim()
      };

    // 5. Bank IFSC Code Lookup
    case 'bank-ifsc-lookup':
    case 'ifsc':
      return {
        ifsc: (inputParams.ifsc || inputParams.ifscCode || '').toUpperCase().trim()
      };

    // 6. Mobile To Bank Advance (Live Account Linkage)
    case 'mobile-to-bank-advance':
    case 'mobile-to-bank':
    case 'mobile-bank-advance': {
      const mobileVal = (mobile || inputParams.mobile || inputParams.mobile_number || inputParams.phone || '').replace(/\D/g, '').slice(-10);
      return {
        mobile: mobileVal,
        mobile_number: mobileVal,
        user_consent: 'Y',
        consent: 'Y'
      };
    }

    // 7. Mobile To UPI Lookup Enhanced (Live NPCI Directory Lookup)
    case 'mobile-upi-lookup-enhanced':
    case 'mobile-upi-lookup':
    case 'mobile-upi-enhanced':
    case 'upi-lookup': {
      const mobileVal = (mobile || inputParams.mobile || inputParams.mobile_number || inputParams.phone || '').replace(/\D/g, '').slice(-10);
      return {
        mobile: mobileVal,
        mobile_number: mobileVal
      };
    }

    // 8. EPFO / UAN Lookup (via Mobile Number)
    case 'uan-lookup-mobile':
    case 'uan-mobile':
      return {
        mobile: mobile || (inputParams.mobile || '').replace(/\D/g, '').slice(-10)
      };

    // 7. EPFO / UAN Direct Employment History
    case 'uan-direct-history':
    case 'uan-direct':
      return {
        uan: (inputParams.uan || inputParams.uanNumber || '').trim()
      };

    // 8. Mobile Profile & Reference Prefill
    case 'mobile-profile-prefill':
    case 'mobile-prefill':
      return {
        mobile_number: mobile || (inputParams.mobile_number || '').replace(/\D/g, '').slice(-10),
        first_name: firstName || (inputParams.first_name || '').trim(),
        last_name: lastName || (inputParams.last_name || '').trim()
      };

    // 9. IP Fraud & Geolocation Risk
    case 'ip-fraud-geolocation':
    case 'ip-check':
      return {
        ip: String(inputParams.ip || inputParams.ipAddress || inputParams.ip_address || clientIp || '').trim()
      };

    // 10. Reverse Geocoding (Coordinates to Exact Address)
    case 'reverse-geocoding':
    case 'reverse-geo':
      return {
        lat: parseFloat(inputParams.lat ?? inputParams.latitude ?? 0),
        lon: parseFloat(inputParams.lon ?? inputParams.longitude ?? 0)
      };

    // 11. Domain Age & MX Security Check
    case 'domain-age-security':
    case 'domain-age':
      return {
        domain: (inputParams.domain || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()
      };

    // 12. CIBIL / TransUnion Credit Report (PDF Generation from Hybrid Bureau Data)
    case 'cibil-transunion-pdf':
    case 'cibil-pdf':
    case 'cibil-transunion-v5':
    case 'cibil-hybrid': {
      const fName = forename || firstName || (inputParams.forename || inputParams.first_name || (fullName ? fullName.split(' ')[0] : '')) || '';
      const sName = surname || lastName || (inputParams.surname || inputParams.last_name || (fullName && fullName.split(' ').length > 1 ? fullName.split(' ').slice(1).join(' ') : fName)) || '';
      const pNum = mobile || (inputParams.phone_number || inputParams.mobile || inputParams.mobile_no || '').replace(/\D/g, '').slice(-10);
      const pId = pan || (inputParams.pan_id || inputParams.pan || '').toUpperCase().trim();
      const dobVal = inputParams.date_of_birth || inputParams.dob || dob || '';

      return {
        forename: fName.toUpperCase().trim(),
        surname: sName.toUpperCase().trim(),
        phone_number: pNum,
        gender: (gender && gender.toLowerCase() === 'female') ? 'Female' : 'Male',
        pan_id: pId,
        date_of_birth: dobVal,
        dob: dobVal
      };
    }

    // 13. Experian Credit Bureau Report
    case 'experian-credit-report':
    case 'experian':
      return {
        mobile_no: mobile || (inputParams.mobile_no || '').replace(/\D/g, '').slice(-10),
        pan: pan || (inputParams.pan || '').toUpperCase().trim(),
        first_name: firstName || (inputParams.first_name || '').toUpperCase().trim(),
        last_name: lastName || (inputParams.last_name || '').toUpperCase().trim(),
        dob: dob || ''
      };

    // 15. CRIF HighMark Credit Score (V4 Deep Dossier)
    case 'crif-credit-score-v4':
    case 'crif-score':
      return {
        mobile_no: mobile || (inputParams.mobile_no || '').replace(/\D/g, '').slice(-10),
        name_lookup: inputParams.name_lookup ?? 0,
        first_name: firstName || (inputParams.first_name || '').toUpperCase().trim(),
        last_name: lastName || (inputParams.last_name || '').toUpperCase().trim()
      };

    default:
      return inputParams;
  }
}

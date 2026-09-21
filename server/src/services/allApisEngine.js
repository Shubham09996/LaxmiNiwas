import { ALL_APIS } from '../config/constants.js';
import { gatewayService } from './gatewayService.js';
import { buildEnrichedPayload } from '../utils/payloadBuilder.js';
import { generateTransUnionPdfFromApiResponse } from '../utils/transunionPdfGenerator.js';
import { generateCrifPdfFromApiResponse } from '../utils/crifPdfGenerator.js';

export async function executeApiTest(apiId, rawInputParams = {}, req = null) {
  const foundApi = ALL_APIS.find(a => a.id === apiId);
  
  if (!foundApi) {
    throw new Error(`API Endpoint '${apiId}' not found in registered live catalog.`);
  }

  // Enrich parameters with master profile & compliance rules
  const inputParams = buildEnrichedPayload(foundApi.id, rawInputParams, req);

  const timestamp = new Date().toISOString();
  const refId = `LXM-${foundApi.id.toUpperCase().replace(/-/g, '')}-${Date.now().toString().slice(-6)}`;

  let liveResult = null;

  switch (foundApi.id) {
    // 1. PAN Card Verification (Fuzzy Match)
    case 'pan-advance':
    case 'pan':
      liveResult = await gatewayService.verifyPan(inputParams);
      break;

    // 2. Aadhaar DigiLocker – Generate URL
    case 'aadhaar-digilocker-generate':
    case 'digilocker-generate':
      liveResult = await gatewayService.generateDigiLockerUrl(inputParams);
      break;

    // 3. Aadhaar DigiLocker – Fetch Details
    case 'aadhaar-digilocker-fetch':
    case 'digilocker-fetch':
      liveResult = await gatewayService.fetchDigiLockerDetails(inputParams);
      break;

    // 4. Bank Account Verification
    case 'bank-account-verification':
    case 'bank-account':
      liveResult = await gatewayService.verifyBankAccount(inputParams);
      break;

    // 5. Bank IFSC Code Lookup
    case 'bank-ifsc-lookup':
    case 'ifsc-lookup':
    case 'ifsc':
      liveResult = await gatewayService.lookupIfsc(inputParams);
      break;

    // 6. EPFO / UAN Mobile Lookup
    case 'uan-lookup-mobile':
    case 'uan-mobile':
      liveResult = await gatewayService.lookupUanByMobile(inputParams);
      break;

    // 7. UAN Direct Employment History
    case 'uan-direct-history':
    case 'uan-employment-history':
    case 'uan-direct':
      liveResult = await gatewayService.getUanHistory(inputParams);
      break;

    // 8. Mobile Profile & Reference Prefill
    case 'mobile-profile-prefill':
    case 'telecom-mobile-identity':
    case 'mobile-prefill':
      liveResult = await gatewayService.prefillMobileProfile(inputParams);
      break;

    // 9. IP Fraud & Geolocation
    case 'ip-fraud-geolocation':
    case 'ip-check':
      liveResult = await gatewayService.lookupIpRisk(inputParams);
      break;

    // 10. Reverse Geocoding (Lat/Long)
    case 'reverse-geocoding':
    case 'reverse-geo':
      liveResult = await gatewayService.reverseGeocode(inputParams);
      break;

    // 11. Domain Age & MX Security
    case 'domain-age-security':
    case 'domain-age':
      liveResult = await gatewayService.checkDomainAge(inputParams);
      break;

    // 12. CIBIL TransUnion Credit PDF
    case 'cibil-transunion-pdf':
    case 'cibil-transunion-v5':
    case 'cibil-pdf':
    case 'cibil-hybrid':
      liveResult = await gatewayService.getCibilTransunionPdf(inputParams);
      break;

    // 13. Experian Credit Bureau Report
    case 'experian-credit-report':
    case 'experian':
      liveResult = await gatewayService.getExperianReport(inputParams);
      break;

    // 14. CRIF HighMark Credit Score (V4)
    case 'crif-credit-score-v4':
    case 'crif-score':
      liveResult = await gatewayService.getCrifCreditScore(inputParams);
      break;

    default:
      throw new Error(`Unsupported API route '${foundApi.id}'`);
  }

  const isSuccess = Boolean(liveResult && (liveResult.ok || liveResult.status === 200));
  const rawData = liveResult?.data || {};

  // Build high-fidelity visual card data mapping for realistic UI renderers
  const visualData = await buildVisualData(foundApi.id, inputParams, rawData, isSuccess);

  return {
    success: isSuccess,
    refId,
    apiId: foundApi.id,
    apiName: foundApi.name,
    apiNumber: foundApi.num,
    tag: foundApi.tag,
    gateway: foundApi.gateway,
    cost: foundApi.cost,
    costFormatted: `₹ ${foundApi.cost.toFixed(2)}`,
    latencyMs: liveResult?.latencyMs || 0,
    statusCode: liveResult?.status || 500,
    timestamp,
    isLiveGateway: true,
    visualData,
    // Real untouched upstream gateway response data
    data: rawData,
    error: !isSuccess ? (
      (typeof rawData.status === 'object' && rawData.status?.message) ? rawData.status.message :
      rawData.message || rawData.error || rawData.status_message || rawData.rawText || `Upstream gateway HTTP ${liveResult?.status}`
    ) : null
  };
}

function getVal(src, ...keys) {
  if (!src || typeof src !== 'object') return null;
  const targets = [src, src.data, src.result, src.response].filter(t => t && typeof t === 'object');
  for (const target of targets) {
    for (const key of keys) {
      if (target[key] !== undefined && target[key] !== null) {
        if (typeof target[key] === 'object' && !Array.isArray(target[key])) {
          if (target[key].message && typeof target[key].message === 'string') return target[key].message;
          return target[key];
        }
        if (String(target[key]).trim() !== '') {
          return target[key];
        }
      }
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchedKey = Object.keys(target).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedKey);
      if (matchedKey && target[matchedKey] !== undefined && target[matchedKey] !== null) {
        if (typeof target[matchedKey] === 'object' && !Array.isArray(target[matchedKey])) {
          if (target[matchedKey].message && typeof target[matchedKey].message === 'string') return target[matchedKey].message;
          return target[matchedKey];
        }
        if (String(target[matchedKey]).trim() !== '') {
          return target[matchedKey];
        }
      }
    }
  }
  return null;
}

async function buildVisualData(apiId, inputParams, rawData, isSuccess) {
  switch (apiId) {
    // 1. PAN Card Verification
    case 'pan-advance': {
      const panNum = (getVal(rawData, 'pan', 'pan_number', 'panNumber') || inputParams.pan || '').toUpperCase();
      const entityCode = panNum.length >= 4 ? panNum[3] : '';
      const entityMap = {
        'P': 'Individual (Person)',
        'C': 'Company / Corporate',
        'H': 'Hindu Undivided Family (HUF)',
        'F': 'Partnership Firm / LLP',
        'A': 'Association of Persons (AOP)',
        'T': 'Trust',
        'B': 'Body of Individuals (BOI)',
        'G': 'Government Agency'
      };
      const entityType = getVal(rawData, 'pan_type', 'entity_type') || (entityCode ? entityMap[entityCode] : null);
      const firstName = getVal(rawData, 'first_name');
      const middleName = getVal(rawData, 'middle_name');
      const lastName = getVal(rawData, 'last_name');
      const fullName = getVal(rawData, 'fullname', 'full_name', 'name', 'registered_name') || (firstName ? `${firstName} ${middleName ? `${middleName} ` : ''}${lastName || ''}`.trim() : (inputParams.name || null));
      const fatherName = getVal(rawData, 'father_name', 'fathername');
      const dob = getVal(rawData, 'dob', 'date_of_birth');
      const gender = getVal(rawData, 'gender');
      
      const aadhaarLinkedBool = getVal(rawData, 'aadhaar_linked');
      const aadhaarSeeding = getVal(rawData, 'aadhaar_seeding_status');
      const aadhaarNumber = getVal(rawData, 'aadhaar_number');
      const isAadhaarLinked = (aadhaarLinkedBool !== null && aadhaarLinkedBool !== undefined)
        ? (aadhaarLinkedBool === true || aadhaarLinkedBool === 'true')
        : (aadhaarSeeding ? (aadhaarSeeding === 'Y' || aadhaarSeeding === 'y') : (aadhaarNumber ? true : null));

      const matchScoreRaw = getVal(rawData, 'name_match_score', 'match_score');
      const nameMatch = getVal(rawData, 'name_match');
      const matchScore = (matchScoreRaw !== null && matchScoreRaw !== undefined && String(matchScoreRaw).trim() !== '')
        ? `${matchScoreRaw}% Matched`
        : (nameMatch === true ? '100% Match' : null);

      let formattedAddress = null;
      const addrObj = getVal(rawData, 'address');
      if (addrObj && typeof addrObj === 'object') {
        const parts = [
          addrObj.building_name || addrObj.first_line_of_address || addrObj.line1,
          addrObj.street_name || addrObj.second_line_of_address || addrObj.line2,
          addrObj.locality || addrObj.third_line_of_address || addrObj.line3,
          addrObj.city,
          addrObj.state ? `${addrObj.state}${addrObj.pincode || addrObj.postal_code ? ` - ${addrObj.pincode || addrObj.postal_code}` : ''}` : (addrObj.pincode || addrObj.postal_code),
          addrObj.country || (addrObj.country_code === 'IB' || addrObj.country_code === 'IN' ? 'India' : addrObj.country_code)
        ].filter(p => p && String(p).trim() !== '');
        if (parts.length > 0) formattedAddress = parts.join(', ');
      } else if (typeof addrObj === 'string' && addrObj.trim() !== '') {
        formattedAddress = addrObj;
      }

      const mobile = getVal(rawData, 'mobile', 'mobile_number', 'phone');
      const email = getVal(rawData, 'email');
      const clientRefNum = getVal(rawData, 'client_ref_num', 'clientRefNum');
      const requestId = getVal(rawData, 'request_id', 'requestId');
      const rawStatus = getVal(rawData, 'status', 'pan_status');

      return {
        cardType: 'PAN_CARD',
        pan: panNum || null,
        name: fullName ? String(fullName).toUpperCase() : null,
        firstName: firstName ? String(firstName).toUpperCase() : null,
        middleName: middleName ? String(middleName).toUpperCase() : null,
        lastName: lastName ? String(lastName).toUpperCase() : null,
        fatherName: fatherName ? String(fatherName).toUpperCase() : null,
        dob: dob || null,
        gender: gender ? String(gender).toUpperCase() : null,
        entityType: entityType || null,
        aadhaarLinked: isAadhaarLinked,
        aadhaarNumber: aadhaarNumber || null,
        aadhaarSeedingStatus: aadhaarSeeding || (isAadhaarLinked === true ? 'Y' : null),
        matchScore,
        address: formattedAddress,
        mobile: mobile || null,
        email: email || null,
        clientRefNum: clientRefNum || null,
        requestId: requestId || null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'ACTIVE' : 'FAILED'),
        issuer: 'INCOME TAX DEPARTMENT • GOVT OF INDIA'
      };
    }

    // 2. Aadhaar DigiLocker – Generate URL
    case 'aadhaar-digilocker-generate': {
      const rawAadhaar = (getVal(rawData, 'aadhaar_number', 'aadhaarNumber') || inputParams.aadhaar_number || '').replace(/\D/g, '');
      const masked = rawAadhaar.length === 12
        ? `${rawAadhaar.slice(0, 4)} ${rawAadhaar.slice(4, 8)} ${rawAadhaar.slice(8, 12)}`
        : (rawAadhaar.length > 4 ? `XXXX XXXX ${rawAadhaar.slice(-4)}` : (rawAadhaar || null));
      const redirectUrl = rawData?.data?.url || getVal(rawData, 'url', 'redirect_url', 'redirectUrl', 'token_url', 'auth_url');
      const clientId = rawData?.data?.client_id || getVal(rawData, 'client_id', 'clientId', 'session_id', 'token_id') || inputParams.client_id;
      const expirySeconds = rawData?.data?.expiry_seconds || getVal(rawData, 'expiry_seconds', 'expirySeconds');
      const token = rawData?.data?.token || getVal(rawData, 'token');
      const requestId = getVal(rawData, 'request_id', 'requestId');
      const rawStatus = getVal(rawData, 'status');

      return {
        cardType: 'DIGILOCKER_GENERATE_CARD',
        aadhaarMasked: masked,
        redirectUrl: redirectUrl || null,
        clientId: clientId || null,
        token: token || null,
        expirySeconds: expirySeconds || null,
        requestId: requestId || null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'TOKEN ACTIVE' : 'FAILED'),
        issuer: 'UIDAI • DIGILOCKER GATEWAY'
      };
    }

    // 3. Aadhaar DigiLocker – Fetch Details
    case 'aadhaar-digilocker-fetch': {
      const xmlData = rawData?.data?.aadhaar_xml_data || rawData?.aadhaar_xml_data || {};
      const metadata = rawData?.data?.digilocker_metadata || rawData?.digilocker_metadata || {};

      const rawAadhaar = xmlData.masked_aadhaar || getVal(rawData, 'masked_aadhaar', 'aadhaar_number', 'aadhaar') || '';
      const masked = rawAadhaar && rawAadhaar.length === 12
        ? `${rawAadhaar.slice(0, 4)} ${rawAadhaar.slice(4, 8)} ${rawAadhaar.slice(8, 12)}`
        : (rawAadhaar || null);

      const name = xmlData.full_name || metadata.name || getVal(rawData, 'full_name', 'name', 'fullname');
      const careOf = xmlData.care_of || xmlData.father_name || getVal(rawData, 'care_of', 'father_name');
      const dob = xmlData.dob || metadata.dob || getVal(rawData, 'dob', 'date_of_birth');
      const gender = xmlData.gender || metadata.gender || getVal(rawData, 'gender');
      const zip = xmlData.zip || getVal(rawData, 'zip', 'pincode');
      const fullAddress = xmlData.full_address || getVal(rawData, 'full_address', 'address', 'display_name');
      const xmlUrl = rawData?.data?.xml_url || getVal(rawData, 'xml_url');
      const clientId = rawData?.data?.client_id || getVal(rawData, 'client_id', 'clientId') || inputParams.client_id;
      const photo = xmlData.photo || xmlData.image || rawData?.data?.photo || getVal(rawData, 'photo', 'image', 'profile_image');
      const house = xmlData.house || getVal(rawData, 'house');
      const street = xmlData.street || getVal(rawData, 'street');
      const landmark = xmlData.landmark || getVal(rawData, 'landmark');
      const locality = xmlData.locality || xmlData.loc || getVal(rawData, 'locality');
      const vtc = xmlData.vtc || getVal(rawData, 'vtc', 'subdistrict');
      const district = xmlData.district || xmlData.dist || getVal(rawData, 'district');
      const state = xmlData.state || getVal(rawData, 'state');
      const rawStatus = getVal(rawData, 'status');

      return {
        cardType: 'AADHAAR_CARD',
        aadhaarMasked: masked,
        nameEnglish: name ? String(name).toUpperCase() : null,
        careOf: careOf ? String(careOf).toUpperCase() : null,
        dob: dob || null,
        gender: gender === 'M' ? 'MALE' : gender === 'F' ? 'FEMALE' : (gender ? String(gender).toUpperCase() : null),
        zip: zip || null,
        address: fullAddress || null,
        house: house || null,
        street: street || null,
        landmark: landmark || null,
        locality: locality || null,
        vtc: vtc || null,
        district: district || null,
        state: state || null,
        photo: photo || null,
        xmlUrl: xmlUrl || null,
        clientId: clientId || null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'VERIFIED' : 'PENDING'),
        issuer: 'UNIQUE IDENTIFICATION AUTHORITY OF INDIA (UIDAI)'
      };
    }

    // 4. Bank Account Verification
    case 'bank-account-verification': {
      const accNum = getVal(rawData, 'account_number', 'accountNumber', 'acc_no') || inputParams.account_number || '';
      const maskedAcc = accNum.length > 4 ? `${accNum.slice(0, 4)} •••• •••• ${accNum.slice(-4)}` : accNum;
      const beneficiary = getVal(rawData, 'full_name', 'beneficiary_name', 'account_holder_name', 'name');
      const bankName = getVal(rawData, 'bank', 'bank_name', 'bankName');
      const ifsc = getVal(rawData, 'ifsc', 'ifsc_code') || inputParams.ifsc;
      const branch = getVal(rawData, 'branch', 'branch_name');
      const city = getVal(rawData, 'city', 'district');
      const state = getVal(rawData, 'state');
      const accountStatus = getVal(rawData, 'account_status', 'status');
      const referenceId = getVal(rawData, 'reference_id', 'ref_id', 'client_ref_num', 'utr', 'rrn');
      const matchScore = getVal(rawData, 'name_match_score', 'match_score');
      const rawStatus = getVal(rawData, 'status');

      return {
        cardType: 'BANK_ACCOUNT_CARD',
        accountNumber: accNum || null,
        accountMasked: maskedAcc || null,
        beneficiaryName: beneficiary ? String(beneficiary).toUpperCase() : null,
        bankName: bankName ? String(bankName).toUpperCase() : null,
        ifsc: ifsc ? String(ifsc).toUpperCase() : null,
        branch: branch ? String(branch).toUpperCase() : null,
        city: city ? String(city).toUpperCase() : null,
        state: state ? String(state).toUpperCase() : null,
        accountStatus: accountStatus || (isSuccess ? 'ACTIVE' : null),
        referenceId: referenceId || null,
        matchScore: matchScore || null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'CBS VALIDATED' : 'UNVERIFIED'),
        issuer: 'RESERVE BANK OF INDIA • CBS NETWORK'
      };
    }

    // 5. Bank IFSC Code Lookup
    case 'bank-ifsc-lookup': {
      const bankName = getVal(rawData, 'bank', 'bank_name', 'bankName', 'BANK');
      const ifsc = getVal(rawData, 'ifsc', 'ifsc_code', 'IFSC') || inputParams.ifsc;
      const branch = getVal(rawData, 'branch', 'branch_name', 'BRANCH');
      const address = getVal(rawData, 'address', 'ADDRESS');
      const contact = getVal(rawData, 'contact', 'phone', 'CONTACT');
      const city = getVal(rawData, 'city', 'CITY');
      const district = getVal(rawData, 'district', 'DISTRICT');
      const state = getVal(rawData, 'state', 'STATE');
      const micr = getVal(rawData, 'micr', 'micr_code', 'MICR');
      const swift = getVal(rawData, 'swift', 'SWIFT');
      const centre = getVal(rawData, 'centre', 'CENTRE');
      const bankCode = getVal(rawData, 'bank_code', 'BANKCODE');
      const neft = getVal(rawData, 'neft', 'NEFT');
      const rtgs = getVal(rawData, 'rtgs', 'RTGS');
      const imps = getVal(rawData, 'imps', 'IMPS');
      const upi = getVal(rawData, 'upi', 'UPI');
      const rawStatus = getVal(rawData, 'status');

      return {
        cardType: 'IFSC_DIRECTORY_CARD',
        bankName: bankName ? String(bankName).toUpperCase() : null,
        ifsc: ifsc ? String(ifsc).toUpperCase() : null,
        branch: branch ? String(branch).toUpperCase() : null,
        address: address || null,
        contact: contact || null,
        city: city || null,
        district: district || null,
        state: state || null,
        micr: micr || null,
        swift: swift || null,
        centre: centre || null,
        bankCode: bankCode || null,
        neft: neft !== null && neft !== undefined ? Boolean(neft === true || neft === 'true' || neft === 1 || neft === '1' || neft === 'YES') : null,
        rtgs: rtgs !== null && rtgs !== undefined ? Boolean(rtgs === true || rtgs === 'true' || rtgs === 1 || rtgs === '1' || rtgs === 'YES') : null,
        imps: imps !== null && imps !== undefined ? Boolean(imps === true || imps === 'true' || imps === 1 || imps === '1' || imps === 'YES') : null,
        upi: upi !== null && upi !== undefined ? Boolean(upi === true || upi === 'true' || upi === 1 || upi === '1' || upi === 'YES') : null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'RBI VERIFIED' : 'FAILED'),
        issuer: 'RESERVE BANK OF INDIA • IFSC DIRECTORY'
      };
    }

    // 6. EPFO / UAN Mobile Lookup
    case 'uan-lookup-mobile': {
      const mobile = getVal(rawData, 'mobile', 'mobile_number') || inputParams.mobile;
      const uan = getVal(rawData, 'uan', 'uan_number');
      const memberName = getVal(rawData, 'member_name', 'name', 'fullname');
      const employer = getVal(rawData, 'employer', 'establishment_name');
      const fatherName = getVal(rawData, 'father_name', 'fathername');
      const dob = getVal(rawData, 'dob');
      const gender = getVal(rawData, 'gender');
      const clientRefNum = getVal(rawData, 'client_ref_num', 'request_id');
      const rawStatus = getVal(rawData, 'status');

      return {
        cardType: 'UAN_LOOKUP_CARD',
        mobile: mobile || null,
        uan: uan || null,
        uanFormatted: uan && String(uan).length === 12 ? String(uan).replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : (uan || null),
        memberName: memberName ? String(memberName).toUpperCase() : null,
        fatherName: fatherName ? String(fatherName).toUpperCase() : null,
        dob: dob || null,
        gender: gender || null,
        employer: employer ? String(employer).toUpperCase() : null,
        clientRefNum: clientRefNum || null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'RECORD FOUND' : 'NOT FOUND'),
        issuer: 'EMPLOYEES PROVIDENT FUND ORGANISATION (EPFO)'
      };
    }

    // 7. UAN Direct Employment History
    case 'uan-direct-history': {
      const uan = getVal(rawData, 'uan') || inputParams.uan;
      const summary = rawData?.data?.summary || rawData?.summary || {};
      const recentEmployerData = summary?.recent_employer_data || {};
      
      const memberName = getVal(rawData, 'member_name', 'fullname', 'name');
      const employer = recentEmployerData.establishment_name || getVal(rawData, 'establishment_name', 'employer', 'company');
      const memberId = recentEmployerData.member_id || getVal(rawData, 'member_id');
      const totalServiceMonths = summary.total_service_months || getVal(rawData, 'total_service_months');
      const doj = recentEmployerData.doj || getVal(rawData, 'doj', 'date_of_joining');
      const doe = recentEmployerData.doe || getVal(rawData, 'doe', 'date_of_exit');
      const fatherName = getVal(rawData, 'father_name');
      const monthlyPfAmount = getVal(rawData, 'monthly_pf_amount');
      const rawEstablishments = summary?.establishment_data || rawData?.data?.establishments || rawData?.establishments || [];
      const establishments = Array.isArray(rawEstablishments) ? rawEstablishments : [];
      const clientRefNum = getVal(rawData, 'client_ref_num', 'request_id');
      const rawStatus = getVal(rawData, 'status');

      return {
        cardType: 'UAN_HISTORY_CARD',
        uan: uan || null,
        uanFormatted: uan && String(uan).length === 12 ? String(uan).replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : (uan || null),
        memberName: memberName ? String(memberName).toUpperCase() : null,
        fatherName: fatherName ? String(fatherName).toUpperCase() : null,
        employer: employer ? String(employer).toUpperCase() : null,
        memberId: memberId || null,
        totalServiceMonths: totalServiceMonths || null,
        monthlyPfAmount: monthlyPfAmount || null,
        doj: doj || null,
        doe: doe || null,
        establishments,
        clientRefNum: clientRefNum || null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'ACTIVE' : 'NOT FOUND'),
        issuer: 'EMPLOYEES PROVIDENT FUND ORGANISATION (EPFO)'
      };
    }

    // 8. Mobile Profile & Reference Prefill
    case 'mobile-profile-prefill': {
      const mob = getVal(rawData, 'mobile_number', 'mobile') || inputParams.mobile_number;
      const name = getVal(rawData, 'fullname', 'name');
      const panNum = getVal(rawData, 'pan_number', 'pan');
      const dob = getVal(rawData, 'dob');
      const age = getVal(rawData, 'age');
      const gender = getVal(rawData, 'gender');
      const email = getVal(rawData, 'email');
      const addresses = getVal(rawData, 'address', 'addresses', 'addressList') || [];
      const references = getVal(rawData, 'references', 'reference_list') || [];
      const clientRefNum = getVal(rawData, 'client_ref_num', 'clientRefNum');
      const requestId = getVal(rawData, 'request_id', 'requestId');
      const resultCode = getVal(rawData, 'result_code', 'resultCode');
      const message = getVal(rawData, 'idspay_message', 'message');
      const rawStatus = getVal(rawData, 'status');

      return {
        cardType: 'TELECOM_CARD',
        mobile: mob || null,
        mobileFormatted: mob ? '+91 ' + String(mob).slice(-10) : null,
        name: name ? String(name).toUpperCase() : null,
        pan: panNum ? String(panNum).toUpperCase() : null,
        dob: dob || null,
        age: age || null,
        gender: gender ? String(gender).toUpperCase() : null,
        email: email || null,
        addressList: Array.isArray(addresses) ? addresses : (addresses ? [addresses] : []),
        references: Array.isArray(references) ? references : [],
        clientRefNum: clientRefNum || null,
        requestId: requestId || null,
        resultCode: resultCode || null,
        message: message || null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'SUBSCRIBER ACTIVE' : 'UNAVAILABLE'),
        issuer: 'TRAI • CARRIER DEMOGRAPHICS'
      };
    }

    // 9. IP Fraud & Geolocation Risk
    case 'ip-fraud-geolocation': {
      const ip = rawData.ip || getVal(rawData, 'ip', 'ip_address') || inputParams.ip;
      const ipType = rawData.type || getVal(rawData, 'type') || null;
      const continent = rawData.continent_name ? `${rawData.continent_name}${rawData.continent_code ? ` (${rawData.continent_code})` : ''}` : getVal(rawData, 'continent_name');
      const country = rawData.country_name ? `${rawData.country_name}${rawData.country_code ? ` (${rawData.country_code})` : ''}` : getVal(rawData, 'country_name', 'country');
      const region = rawData.region_name ? `${rawData.region_name}${rawData.region_code ? ` (${rawData.region_code})` : ''}` : getVal(rawData, 'region_name', 'region');
      const city = rawData.city || getVal(rawData, 'city');
      const loc = (rawData.location && typeof rawData.location === 'object') ? rawData.location : {};
      const lat = rawData.latitude ?? getVal(rawData, 'latitude', 'lat');
      const lon = rawData.longitude ?? getVal(rawData, 'longitude', 'lon');
      const routingType = rawData.ip_routing_type || getVal(rawData, 'ip_routing_type');
      const connectionType = rawData.connection_type || getVal(rawData, 'connection_type');
      const zip = rawData.zip ||
        rawData.postal ||
        rawData.pincode ||
        rawData.postcode ||
        rawData.postal_code ||
        loc.zip ||
        loc.postal ||
        loc.postcode ||
        loc.pincode ||
        (rawData.data && (rawData.data.zip || rawData.data.postal || rawData.data.pincode || rawData.data.postcode)) ||
        getVal(rawData, 'zip', 'postal', 'pincode', 'postcode', 'postal_code');
      const capital = loc.capital || getVal(rawData, 'capital');
      const flagEmoji = loc.country_flag_emoji || rawData.country_flag_emoji || null;
      const flagUrl = loc.country_flag || rawData.country_flag || null;
      const callingCode = loc.calling_code ? `+${loc.calling_code}` : (getVal(rawData, 'calling_code') ? `+${getVal(rawData, 'calling_code')}` : null);
      const languages = Array.isArray(loc.languages)
        ? loc.languages.map(l => (l.native && l.name && l.native !== l.name ? `${l.name} (${l.native})` : (l.name || l.code || l))).filter(Boolean)
        : [];

      const isp = rawData.isp || getVal(rawData, 'isp', 'org', 'organization');
      const asn = rawData.asn || getVal(rawData, 'asn');
      const riskScore = getVal(rawData, 'risk_score', 'fraud_score');
      const vpn = getVal(rawData, 'vpn', 'proxy');
      const rawStatus = getVal(rawData, 'status');

      return {
        cardType: 'IP_FRAUD_CARD',
        ip: ip || null,
        ipType,
        continent: continent || null,
        country: country || null,
        region: region || null,
        city: city || null,
        zip: zip || null,
        latitude: lat,
        longitude: lon,
        routingType: routingType || null,
        connectionType: connectionType || null,
        capital: capital || null,
        flagEmoji,
        flagUrl,
        callingCode,
        languages,
        isp: isp || null,
        asn: asn || null,
        riskScore: riskScore !== null && riskScore !== undefined ? `${riskScore} / 100` : null,
        vpn: vpn !== null && vpn !== undefined ? (vpn === true ? 'Proxy / VPN Detected' : 'Clean Residential IP') : null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'VERIFIED' : 'FAILED'),
        issuer: 'CYBER GEOLOCATION & THREAT INTELLIGENCE'
      };
    }

    // 10. Reverse Geocoding (Coordinates)
    case 'reverse-geocoding': {
      const rawLat = getVal(rawData, 'lat', 'latitude') ?? inputParams.lat;
      const rawLon = getVal(rawData, 'lon', 'longitude') ?? inputParams.lon;
      const lat = rawLat !== undefined && rawLat !== null && rawLat !== '' ? parseFloat(rawLat) : null;
      const lon = rawLon !== undefined && rawLon !== null && rawLon !== '' ? parseFloat(rawLon) : null;
      
      const displayName = getVal(rawData, 'display_name', 'formatted_address', 'address');
      const placeName = getVal(rawData, 'name') || null;
      const nestedAddr = (rawData.address && typeof rawData.address === 'object') ? rawData.address : {};
      
      const road = nestedAddr.road || getVal(rawData, 'road') || null;
      const suburb = nestedAddr.suburb || nestedAddr.neighbourhood || nestedAddr.locality || nestedAddr.hamlet || null;
      const city = nestedAddr.city || nestedAddr.town || nestedAddr.village || nestedAddr.county || getVal(rawData, 'city') || null;
      const stateDistrict = nestedAddr.state_district || nestedAddr.district || null;
      const state = nestedAddr.state || getVal(rawData, 'state') || null;
      const postcode = nestedAddr.postcode || getVal(rawData, 'postcode', 'pincode', 'pin') || null;
      const country = nestedAddr.country || getVal(rawData, 'country') || null;
      const countryCode = (nestedAddr.country_code || getVal(rawData, 'country_code') || '').toUpperCase() || null;
      const placeId = rawData.place_id || null;
      const osmType = rawData.osm_type || null;
      const osmId = rawData.osm_id || null;
      const addressType = rawData.addresstype || rawData.type || null;
      const boundingBox = rawData.boundingbox || null;
      const rawStatus = getVal(rawData, 'status');

      const satelliteEmbedUrl = (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon))
        ? `https://maps.google.com/maps?q=${lat},${lon}&t=h&z=17&ie=UTF8&iwloc=&output=embed`
        : null;

      const googleMapsUrl = (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon))
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
        : null;

      return {
        cardType: 'GEO_REVERSE_CARD',
        lat,
        lon,
        placeName,
        address: displayName || null,
        road,
        suburb,
        city,
        stateDistrict,
        state,
        postcode,
        country,
        countryCode,
        placeId,
        osmType,
        osmId,
        addressType,
        boundingBox,
        satelliteEmbedUrl,
        googleMapsUrl,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'GPS VERIFIED' : 'FAILED'),
        issuer: 'OPENSTREETMAP • SATELLITE GEODYNAMICS'
      };
    }

    // 11. Domain Age & MX Security
    case 'domain-age-security': {
      const domain = getVal(rawData, 'domain') || inputParams.domain;
      const ageYears = getVal(rawData, 'age_years');
      const ageDays = getVal(rawData, 'age_days');
      const age = (ageYears !== null && ageYears !== undefined)
        ? `${ageYears} Years (${ageDays || 0} Days)`
        : (getVal(rawData, 'age', 'domain_age') || null);
      const createdDate = getVal(rawData, 'creation_date', 'created');
      const expiryDate = getVal(rawData, 'expiration_date', 'expiry');
      const registrar = getVal(rawData, 'registrar');
      const mxValid = getVal(rawData, 'mx_valid');
      const mxRecords = getVal(rawData, 'mx_records') || [];
      const nameservers = getVal(rawData, 'nameservers', 'name_servers') || [];
      const whoisServer = getVal(rawData, 'whois_server', 'whoisServer');
      const rawStatus = getVal(rawData, 'status');

      return {
        cardType: 'DOMAIN_CARD',
        domain: domain ? String(domain).toLowerCase() : null,
        age: age || null,
        createdDate: createdDate || null,
        expiryDate: expiryDate || null,
        registrar: registrar || null,
        mxValid: mxValid !== null && mxValid !== undefined ? (mxValid !== false && mxValid !== 0) : null,
        mxRecords: Array.isArray(mxRecords) ? mxRecords : [],
        nameservers: Array.isArray(nameservers) ? nameservers : [],
        whoisServer: whoisServer || null,
        status: rawStatus ? String(rawStatus).toUpperCase() : (isSuccess ? 'VERIFIED' : 'UNVERIFIED'),
        issuer: 'ICANN REGISTRY'
      };
    }

    // 12. CIBIL TransUnion Credit PDF
    case 'cibil-transunion-pdf': {
      let generatedPdf = null;
      try {
        generatedPdf = await generateTransUnionPdfFromApiResponse(rawData, inputParams);
      } catch (pdfErr) {
        console.warn('[CIBIL PDF Engine] PDF Generation Notice:', pdfErr?.message);
      }

      const name = getVal(rawData, 'name') || inputParams.name || generatedPdf?.extracted?.borrower?.name;
      const pan = getVal(rawData, 'pan') || inputParams.pan || generatedPdf?.extracted?.identifications?.find(i => i.type === 'TaxId' || i.type === '01')?.number;
      const mobile = getVal(rawData, 'mobile') || inputParams.mobile || generatedPdf?.extracted?.telephones?.[0]?.number;
      const pdfUrl = generatedPdf?.base64DataUrl || getVal(rawData, 'pdf_url', 'report_url', 'url');
      const refNo = getVal(rawData, 'ref_no', 'reference_no', 'client_ref_num') || `TU-${Date.now().toString().slice(-8)}`;
      const generatedAt = getVal(rawData, 'generated_at') || new Date().toISOString();

      return {
        cardType: 'CIBIL_PDF_CARD',
        name: name ? String(name).toUpperCase() : null,
        pan: pan ? String(pan).toUpperCase() : null,
        mobile: mobile || null,
        pdfUrl: pdfUrl || null,
        pdfBase64: generatedPdf?.base64DataUrl || null,
        score: generatedPdf?.extracted?.cibilScore ?? getVal(rawData, 'score', 'cibil_score'),
        scoreName: generatedPdf?.extracted?.scoreName || 'CIBILTransUnionScore3',
        scoringFactors: generatedPdf?.extracted?.scoringFactors || [],
        totalAccounts: generatedPdf?.extracted?.totalAccounts || 0,
        activeAccounts: generatedPdf?.extracted?.activeAccounts || 0,
        closedAccounts: generatedPdf?.extracted?.closedAccounts || 0,
        totalSanctioned: generatedPdf?.extracted?.totalSanctioned || 0,
        totalCurrentBalance: generatedPdf?.extracted?.totalCurrentBalance || 0,
        totalOverdue: generatedPdf?.extracted?.totalOverdue || 0,
        dpdOverall: generatedPdf?.extracted?.dpd_overall || '0 DPD (Clean Track)',
        dpdAnalysis: generatedPdf?.extracted?.dpdAnalysis || '',
        dpd30Days: generatedPdf?.extracted?.dpd_30_days || '0',
        dpd60Days: generatedPdf?.extracted?.dpd_60_days || '0',
        dpd90Days: generatedPdf?.extracted?.dpd_90_days || '0',
        dpd120Days: generatedPdf?.extracted?.dpd_120_days || '0',
        tradelines: generatedPdf?.extracted?.tradelinesFull || generatedPdf?.extracted?.allTradelines || [],
        inquiries: generatedPdf?.extracted?.inquiries || [],
        referenceNo: refNo || null,
        generatedAt,
        status: isSuccess ? 'OFFICIAL CIBIL PDF READY' : 'BUREAU UNAVAILABLE',
        issuer: 'TRANSUNION CIBIL'
      };
    }

    // 13. Experian, 14. CRIF
    case 'experian-credit-report':
    case 'crif-credit-score-v4': {
      let generatedPdf = null;
      if (apiId.includes('crif') || rawData?.data?.result_json?.parsed_data?.['B2C-REPORT'] || rawData?.result_json?.parsed_data?.['B2C-REPORT']) {
        try {
          generatedPdf = await generateCrifPdfFromApiResponse(rawData, inputParams);
        } catch (crifPdfErr) {
          console.error('[allApisEngine] CRIF PDF generation error:', crifPdfErr.message);
        }
      } else if (apiId.includes('transunion') || rawData?.data?.steps || rawData?.steps || rawData?.data?.report_summary || rawData?.report_summary || rawData?.result_json) {
        try {
          generatedPdf = await generateTransUnionPdfFromApiResponse(rawData, inputParams);
        } catch (pdfErr) {
          console.error('[allApisEngine] TU PDF generation error:', pdfErr.message);
        }
      }

      const b2cReport = rawData?.result_json?.parsed_data?.['B2C-REPORT'] || rawData?.data?.result_json?.parsed_data?.['B2C-REPORT'];
      const crifScoreObj = b2cReport?.['REPORT-DATA']?.['STANDARD-DATA']?.SCORE?.[0];
      const crifScoreVal = crifScoreObj ? (crifScoreObj['SCORE-VALUE'] || crifScoreObj.value) : null;
      const crifTradelines = b2cReport?.['REPORT-DATA']?.['STANDARD-DATA']?.TRADELINES;
      const crifInquiries = b2cReport?.['REPORT-DATA']?.['STANDARD-DATA']?.['INQUIRY-HISTORY']?.length;

      const rawScore = generatedPdf?.extracted?.scoreSection?.score || generatedPdf?.extracted?.cibilScore || crifScoreVal || getVal(rawData, 'score', 'cibil_score', 'crif_score');
      const score = rawScore !== null && rawScore !== undefined && String(rawScore).trim() !== '' ? Number(rawScore) : null;
      const bureauName = apiId.includes('transunion') ? 'TransUnion CIBIL' : apiId.includes('experian') ? 'Experian' : 'CRIF HighMark';

      let tier = null;
      if (score !== null && !isNaN(score)) {
        tier = score >= 780 ? 'EXCELLENT (PRIME)' : score >= 720 ? 'VERY GOOD' : score >= 650 ? 'GOOD' : 'FAIR';
      } else if (isSuccess) {
        tier = 'THIN FILE / ACTIVE INQUIRY RECORD';
      }

      const name = getVal(rawData, 'name', 'fullname') || (b2cReport ? `${b2cReport['REQUEST-DATA']?.['APPLICANT-SEGMENT']?.['FIRST-NAME'] || ''} ${b2cReport['REQUEST-DATA']?.['APPLICANT-SEGMENT']?.['LAST-NAME'] || ''}`.trim() : '') || inputParams.name || (inputParams.forename ? `${inputParams.forename} ${inputParams.surname || ''}` : '') || (inputParams.first_name ? `${inputParams.first_name} ${inputParams.last_name || ''}` : '') || generatedPdf?.extracted?.borrower?.name;
      const pan = getVal(rawData, 'pan', 'pan_id') || inputParams.pan || inputParams.pan_id || generatedPdf?.extracted?.identifications?.find(i => i.type === 'TaxId')?.number;
      const mobile = getVal(rawData, 'mobile', 'mobile_no', 'phone_number') || inputParams.mobile || inputParams.mobile_no || inputParams.phone_number || generatedPdf?.extracted?.telephones?.[0]?.number;
      const summary = rawData?.data?.summary || rawData?.summary || generatedPdf?.extracted?.summaryObj || {};
      
      const rawTradelines = crifTradelines || rawData.tradelines || rawData?.data?.tradelines || generatedPdf?.extracted?.allTradelines || [];
      const tradelinesList = Array.isArray(rawTradelines) ? rawTradelines : [];
      const activeTradelinesCount = tradelinesList.length || summary.total_accounts || getVal(rawData, 'active_accounts', 'tradelines');
      const inquiries = crifInquiries !== undefined ? crifInquiries : getVal(rawData, 'inquiries_last_30_days', 'inquiries');

      return {
        cardType: 'BUREAU_SCORE_CARD',
        bureau: bureauName,
        score,
        tier,
        name: name ? String(name).toUpperCase() : null,
        pan: pan ? String(pan).toUpperCase() : null,
        mobile: mobile || null,
        pdfUrl: generatedPdf?.base64DataUrl || null,
        summary: Object.keys(summary).length > 0 ? summary : null,
        tradelinesList,
        activeTradelines: activeTradelinesCount !== null && activeTradelinesCount !== undefined ? activeTradelinesCount : null,
        inquiries: inquiries !== null && inquiries !== undefined ? inquiries : null,
        status: isSuccess ? 'CREDIT REPORT CERTIFIED' : 'BUREAU UNREACHABLE',
        issuer: bureauName
      };
    }

    default:
      return {
        cardType: 'GENERIC_CARD',
        title: 'Verification Output'
      };
  }
}

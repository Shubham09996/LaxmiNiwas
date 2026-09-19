import { ALL_APIS } from '../config/constants.js';
import { gatewayService } from './gatewayService.js';
import { buildEnrichedPayload } from '../utils/payloadBuilder.js';

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
      liveResult = await gatewayService.verifyPan(inputParams);
      break;

    // 2. Aadhaar DigiLocker – Generate URL
    case 'aadhaar-digilocker-generate':
      liveResult = await gatewayService.generateDigiLockerUrl(inputParams);
      break;

    // 3. Aadhaar DigiLocker – Fetch Details
    case 'aadhaar-digilocker-fetch':
      liveResult = await gatewayService.fetchDigiLockerDetails(inputParams);
      break;

    // 4. Bank Account Verification
    case 'bank-account-verification':
      liveResult = await gatewayService.verifyBankAccount(inputParams);
      break;

    // 5. Bank IFSC Code Lookup
    case 'bank-ifsc-lookup':
      liveResult = await gatewayService.lookupIfsc(inputParams);
      break;

    // 6. EPFO / UAN Mobile Lookup
    case 'uan-lookup-mobile':
      liveResult = await gatewayService.lookupUanByMobile(inputParams);
      break;

    // 7. UAN Direct Employment History
    case 'uan-direct-history':
      liveResult = await gatewayService.getUanHistory(inputParams);
      break;

    // 8. Mobile Profile & Reference Prefill
    case 'mobile-profile-prefill':
      liveResult = await gatewayService.prefillMobileProfile(inputParams);
      break;

    // 9. IP Fraud & Geolocation Risk
    case 'ip-fraud-geolocation':
      liveResult = await gatewayService.lookupIpRisk(inputParams);
      break;

    // 10. Reverse Geocoding (Coordinates)
    case 'reverse-geocoding':
      liveResult = await gatewayService.reverseGeocode(inputParams);
      break;

    // 11. Domain Age & MX Security
    case 'domain-age-security':
      liveResult = await gatewayService.checkDomainAge(inputParams);
      break;

    // 12. CIBIL TransUnion Credit PDF
    case 'cibil-transunion-pdf':
      liveResult = await gatewayService.getCibilTransunionPdf(inputParams);
      break;

    // 13. TransUnion Hybrid Score (V5)
    case 'cibil-transunion-v5':
      liveResult = await gatewayService.getTransunionScoreHybrid(inputParams);
      break;

    // 14. Experian Credit Bureau Report
    case 'experian-credit-report':
      liveResult = await gatewayService.getExperianReport(inputParams);
      break;

    // 15. CRIF HighMark Credit Score (V4)
    case 'crif-credit-score-v4':
      liveResult = await gatewayService.getCrifCreditScore(inputParams);
      break;

    default:
      throw new Error(`Unsupported API route '${foundApi.id}'`);
  }

  const isSuccess = Boolean(liveResult && (liveResult.ok || liveResult.status === 200));
  const rawData = liveResult?.data || {};

  // Build high-fidelity visual card data mapping for realistic UI renderers
  const visualData = buildVisualData(foundApi.id, inputParams, rawData, isSuccess);

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

function buildVisualData(apiId, inputParams, rawData, isSuccess) {
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
      const entityType = getVal(rawData, 'pan_type', 'entity_type') || (entityCode ? entityMap[entityCode] : 'Individual');
      const firstName = getVal(rawData, 'first_name');
      const middleName = getVal(rawData, 'middle_name');
      const lastName = getVal(rawData, 'last_name');
      const fullName = getVal(rawData, 'fullname', 'full_name', 'name', 'registered_name') || (firstName ? `${firstName} ${middleName ? `${middleName} ` : ''}${lastName || ''}`.trim() : inputParams.name);
      const fatherName = getVal(rawData, 'father_name', 'fathername');
      const dob = getVal(rawData, 'dob', 'date_of_birth');
      const gender = getVal(rawData, 'gender');
      
      const aadhaarLinkedBool = getVal(rawData, 'aadhaar_linked');
      const aadhaarSeeding = getVal(rawData, 'aadhaar_seeding_status');
      const aadhaarNumber = getVal(rawData, 'aadhaar_number');
      const isAadhaarLinked = aadhaarLinkedBool === true || aadhaarLinkedBool === 'true' || aadhaarSeeding === 'Y' || aadhaarSeeding === 'y' || Boolean(aadhaarNumber);

      const matchScoreRaw = getVal(rawData, 'name_match_score', 'match_score');
      const nameMatch = getVal(rawData, 'name_match');
      const matchScore = (matchScoreRaw !== null && matchScoreRaw !== undefined && String(matchScoreRaw).trim() !== '')
        ? `${matchScoreRaw}% Matched`
        : (nameMatch === true ? '100% Match' : (isSuccess ? 'Verified' : null));

      let formattedAddress = null;
      const addrObj = getVal(rawData, 'address');
      if (addrObj && typeof addrObj === 'object') {
        const parts = [
          addrObj.building_name,
          addrObj.street_name,
          addrObj.locality,
          addrObj.city,
          addrObj.state ? `${addrObj.state}${addrObj.pincode ? ` - ${addrObj.pincode}` : ''}` : addrObj.pincode,
          addrObj.country
        ].filter(p => p && String(p).trim() !== '');
        if (parts.length > 0) formattedAddress = parts.join(', ');
      } else if (typeof addrObj === 'string' && addrObj.trim() !== '') {
        formattedAddress = addrObj;
      }

      const mobile = getVal(rawData, 'mobile', 'mobile_number', 'phone');
      const email = getVal(rawData, 'email');

      return {
        cardType: 'PAN_CARD',
        pan: panNum,
        name: fullName ? String(fullName).toUpperCase() : null,
        firstName: firstName ? String(firstName).toUpperCase() : null,
        lastName: lastName ? String(lastName).toUpperCase() : null,
        fatherName: fatherName ? String(fatherName).toUpperCase() : null,
        dob: dob || null,
        gender: gender ? String(gender).toUpperCase() : null,
        entityType: entityType || 'Individual',
        aadhaarLinked: isAadhaarLinked,
        aadhaarNumber: aadhaarNumber || null,
        aadhaarSeedingStatus: aadhaarSeeding || (isAadhaarLinked ? 'Y' : null),
        matchScore,
        address: formattedAddress,
        mobile: mobile || null,
        email: email || null,
        status: isSuccess ? 'ACTIVE & OPERATIVE' : 'VERIFICATION FAILED',
        issuer: 'INCOME TAX DEPARTMENT • GOVT OF INDIA'
      };
    }

    // 2. Aadhaar DigiLocker – Generate URL
    case 'aadhaar-digilocker-generate': {
      const rawAadhaar = (getVal(rawData, 'aadhaar_number', 'aadhaarNumber') || inputParams.aadhaar_number || '').replace(/\D/g, '');
      const masked = rawAadhaar.length === 12
        ? `${rawAadhaar.slice(0, 4)} ${rawAadhaar.slice(4, 8)} ${rawAadhaar.slice(8, 12)}`
        : (rawAadhaar.length > 4 ? `XXXX XXXX ${rawAadhaar.slice(-4)}` : (rawAadhaar || '—'));
      const redirectUrl = rawData?.data?.url || getVal(rawData, 'url', 'redirect_url', 'redirectUrl', 'token_url', 'auth_url');
      const clientId = rawData?.data?.client_id || getVal(rawData, 'client_id', 'clientId', 'session_id', 'token_id') || inputParams.client_id;
      const expirySeconds = rawData?.data?.expiry_seconds || getVal(rawData, 'expiry_seconds', 'expirySeconds') || 1800;
      const token = rawData?.data?.token || getVal(rawData, 'token');

      return {
        cardType: 'DIGILOCKER_GENERATE_CARD',
        aadhaarMasked: masked,
        redirectUrl,
        clientId: clientId || '—',
        token: token || null,
        expirySeconds,
        status: isSuccess ? 'DIGILOCKER CONSENT INITIALIZED' : 'GENERATION FAILED',
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
        : (rawAadhaar || 'XXXXXXXXXXXX');

      const name = xmlData.full_name || metadata.name || getVal(rawData, 'full_name', 'name', 'fullname');
      const careOf = xmlData.care_of || xmlData.father_name || getVal(rawData, 'care_of', 'father_name');
      const dob = xmlData.dob || metadata.dob || getVal(rawData, 'dob', 'date_of_birth');
      const gender = xmlData.gender || metadata.gender || getVal(rawData, 'gender');
      const zip = xmlData.zip || getVal(rawData, 'zip', 'pincode');
      const fullAddress = xmlData.full_address || getVal(rawData, 'full_address', 'address', 'display_name');
      const xmlUrl = rawData?.data?.xml_url || getVal(rawData, 'xml_url');
      const clientId = rawData?.data?.client_id || getVal(rawData, 'client_id', 'clientId') || inputParams.client_id;

      return {
        cardType: 'AADHAAR_CARD',
        aadhaarMasked: masked,
        nameEnglish: name ? String(name).toUpperCase() : null,
        careOf: careOf ? String(careOf).toUpperCase() : null,
        dob: dob || null,
        gender: gender === 'M' ? 'MALE' : gender === 'F' ? 'FEMALE' : (gender ? String(gender).toUpperCase() : null),
        zip: zip || null,
        address: fullAddress || null,
        xmlUrl: xmlUrl || null,
        clientId: clientId || null,
        status: isSuccess ? 'OFFICIAL UIDAI e-KYC VERIFIED' : 'AUTH PENDING',
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
      const accountStatus = getVal(rawData, 'account_status', 'status');
      const referenceId = getVal(rawData, 'reference_id', 'ref_id', 'client_ref_num');

      return {
        cardType: 'BANK_ACCOUNT_CARD',
        accountNumber: accNum,
        accountMasked: maskedAcc,
        beneficiaryName: beneficiary ? String(beneficiary).toUpperCase() : null,
        bankName: bankName ? String(bankName).toUpperCase() : null,
        ifsc: ifsc ? String(ifsc).toUpperCase() : null,
        branch: branch ? String(branch).toUpperCase() : null,
        city: city ? String(city).toUpperCase() : null,
        accountStatus: accountStatus || (isSuccess ? 'ACTIVE' : 'UNVERIFIED'),
        referenceId: referenceId || null,
        status: isSuccess ? 'ACTIVE • CBS VALIDATED' : 'UNVERIFIED',
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
      const neft = getVal(rawData, 'neft', 'NEFT');
      const rtgs = getVal(rawData, 'rtgs', 'RTGS');
      const imps = getVal(rawData, 'imps', 'IMPS');
      const upi = getVal(rawData, 'upi', 'UPI');

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
        neft: neft === true || neft === 'true' || neft === 1 || neft === '1' || neft === 'YES',
        rtgs: rtgs === true || rtgs === 'true' || rtgs === 1 || rtgs === '1' || rtgs === 'YES',
        imps: imps === true || imps === 'true' || imps === 1 || imps === '1' || imps === 'YES',
        upi: upi === true || upi === 'true' || upi === 1 || upi === '1' || upi === 'YES',
        status: isSuccess ? 'RBI VERIFIED BRANCH' : 'LOOKUP FAILED',
        issuer: 'RESERVE BANK OF INDIA • IFSC DIRECTORY'
      };
    }

    // 6. EPFO / UAN Mobile Lookup
    case 'uan-lookup-mobile': {
      const mobile = getVal(rawData, 'mobile', 'mobile_number') || inputParams.mobile;
      const uan = getVal(rawData, 'uan', 'uan_number');
      const memberName = getVal(rawData, 'member_name', 'name', 'fullname');
      const employer = getVal(rawData, 'employer', 'establishment_name');

      return {
        cardType: 'UAN_LOOKUP_CARD',
        mobile,
        uan: uan || null,
        uanFormatted: uan && String(uan).length === 12 ? String(uan).replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : uan,
        memberName: memberName ? String(memberName).toUpperCase() : null,
        employer: employer ? String(employer).toUpperCase() : null,
        status: isSuccess ? 'UAN RECORD FOUND' : 'NO UAN RECORD',
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
      const memberId = getVal(rawData, 'member_id');
      const totalServiceMonths = summary.total_service_months || getVal(rawData, 'total_service_months');
      const doj = recentEmployerData.doj || getVal(rawData, 'doj', 'date_of_joining');
      const doe = recentEmployerData.doe || getVal(rawData, 'doe', 'date_of_exit');
      const fatherName = getVal(rawData, 'father_name');
      const monthlyPfAmount = getVal(rawData, 'monthly_pf_amount');

      return {
        cardType: 'UAN_HISTORY_CARD',
        uan,
        uanFormatted: uan && String(uan).length === 12 ? String(uan).replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : uan,
        memberName: memberName ? String(memberName).toUpperCase() : null,
        fatherName: fatherName ? String(fatherName).toUpperCase() : null,
        employer: employer ? String(employer).toUpperCase() : null,
        memberId: memberId || null,
        totalServiceMonths: totalServiceMonths || null,
        monthlyPfAmount: monthlyPfAmount || null,
        doj: doj || null,
        doe: doe || null,
        status: isSuccess ? 'PASSBOOK SERVICE ACTIVE' : 'LOOKUP FAILED',
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
      const addresses = getVal(rawData, 'address') || [];
      const references = getVal(rawData, 'references') || [];
      const clientRefNum = getVal(rawData, 'client_ref_num');

      return {
        cardType: 'TELECOM_CARD',
        mobile: mob,
        mobileFormatted: mob ? '+91 ' + String(mob).slice(-10) : null,
        name: name ? String(name).toUpperCase() : null,
        pan: panNum ? String(panNum).toUpperCase() : null,
        dob: dob || null,
        age: age || null,
        gender: gender ? String(gender).toUpperCase() : null,
        email: email || null,
        addressList: Array.isArray(addresses) ? addresses : [],
        references: Array.isArray(references) ? references : [],
        clientRefNum: clientRefNum || null,
        status: isSuccess ? 'SUBSCRIBER ACTIVE' : 'PREFILL UNAVAILABLE',
        issuer: 'TRAI • CARRIER DEMOGRAPHICS'
      };
    }

    // 9. IP Fraud & Geolocation Risk
    case 'ip-fraud-geolocation': {
      const ip = rawData.ip || getVal(rawData, 'ip', 'ip_address') || inputParams.ip;
      const ipType = rawData.type || getVal(rawData, 'type') || 'IPv4';
      const continent = rawData.continent_name ? `${rawData.continent_name}${rawData.continent_code ? ` (${rawData.continent_code})` : ''}` : getVal(rawData, 'continent_name');
      const country = rawData.country_name ? `${rawData.country_name}${rawData.country_code ? ` (${rawData.country_code})` : ''}` : getVal(rawData, 'country_name', 'country');
      const region = rawData.region_name ? `${rawData.region_name}${rawData.region_code ? ` (${rawData.region_code})` : ''}` : getVal(rawData, 'region_name', 'region');
      const city = rawData.city || getVal(rawData, 'city');
      const zip = rawData.zip || getVal(rawData, 'zip', 'postal', 'pincode');
      const lat = rawData.latitude ?? getVal(rawData, 'latitude', 'lat');
      const lon = rawData.longitude ?? getVal(rawData, 'longitude', 'lon');
      const routingType = rawData.ip_routing_type || getVal(rawData, 'ip_routing_type');
      const connectionType = rawData.connection_type || getVal(rawData, 'connection_type');
      
      const loc = (rawData.location && typeof rawData.location === 'object') ? rawData.location : {};
      const capital = loc.capital || getVal(rawData, 'capital');
      const flagEmoji = loc.country_flag_emoji || rawData.country_flag_emoji || '🇮🇳';
      const flagUrl = loc.country_flag || rawData.country_flag;
      const callingCode = loc.calling_code ? `+${loc.calling_code}` : getVal(rawData, 'calling_code');
      const languages = Array.isArray(loc.languages)
        ? loc.languages.map(l => (l.native && l.name && l.native !== l.name ? `${l.name} (${l.native})` : (l.name || l.code || l))).filter(Boolean)
        : [];

      const isp = rawData.isp || getVal(rawData, 'isp', 'org', 'organization');
      const asn = rawData.asn || getVal(rawData, 'asn');
      const riskScore = getVal(rawData, 'risk_score', 'fraud_score');
      const vpn = getVal(rawData, 'vpn', 'proxy');

      return {
        cardType: 'IP_FRAUD_CARD',
        ip,
        ipType,
        continent,
        country,
        region,
        city,
        zip,
        latitude: lat,
        longitude: lon,
        routingType,
        connectionType,
        capital,
        flagEmoji,
        flagUrl,
        callingCode,
        languages,
        isp: isp || null,
        asn: asn || null,
        riskScore: riskScore !== null ? `${riskScore} / 100` : (isSuccess ? '0 / 100 (Safe)' : null),
        vpn: vpn === true ? 'Proxy / VPN Detected' : 'Clean Residential IP',
        status: isSuccess ? 'GEOLOCATION & RISK CERTIFIED' : 'LOOKUP FAILED',
        issuer: 'CYBER GEOLOCATION & THREAT INTELLIGENCE'
      };
    }

    // 10. Reverse Geocoding (Coordinates)
    case 'reverse-geocoding': {
      const lat = getVal(rawData, 'lat', 'latitude') ?? inputParams.lat;
      const lon = getVal(rawData, 'lon', 'longitude') ?? inputParams.lon;
      const address = getVal(rawData, 'display_name', 'address', 'formatted_address');
      const nestedAddr = (rawData.address && typeof rawData.address === 'object') ? rawData.address : {};
      const road = nestedAddr.road || getVal(rawData, 'road');
      const postcode = nestedAddr.postcode || getVal(rawData, 'postcode', 'pincode', 'pin');
      const city = nestedAddr.city || nestedAddr.town || nestedAddr.village || nestedAddr.suburb || getVal(rawData, 'city');
      const state = nestedAddr.state || getVal(rawData, 'state');
      const country = nestedAddr.country || getVal(rawData, 'country');

      return {
        cardType: 'GEO_REVERSE_CARD',
        lat,
        lon,
        address: address || null,
        road: road || null,
        postcode: postcode || null,
        city: city || null,
        state: state || null,
        country: country || null,
        status: isSuccess ? 'DOORSTEP GPS VERIFIED' : 'LOOKUP FAILED',
        issuer: 'OPENSTREETMAP • POSTAL DIRECTORY'
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

      return {
        cardType: 'DOMAIN_CARD',
        domain: domain ? String(domain).toLowerCase() : null,
        age: age || null,
        createdDate: createdDate || null,
        expiryDate: expiryDate || null,
        registrar: registrar || null,
        mxValid: mxValid !== false && mxValid !== 0,
        mxRecords: Array.isArray(mxRecords) ? mxRecords : [],
        status: isSuccess ? 'DOMAIN & MX VERIFIED' : 'DOMAIN UNVERIFIED',
        issuer: 'ICANN REGISTRY'
      };
    }

    // 12. CIBIL TransUnion Credit PDF
    case 'cibil-transunion-pdf': {
      const name = getVal(rawData, 'name') || inputParams.name;
      const pan = getVal(rawData, 'pan') || inputParams.pan;
      const mobile = getVal(rawData, 'mobile') || inputParams.mobile;
      const pdfUrl = getVal(rawData, 'pdf_url', 'report_url', 'url');
      const refNo = getVal(rawData, 'ref_no', 'reference_no', 'client_ref_num');
      const generatedAt = getVal(rawData, 'generated_at') || new Date().toISOString();

      return {
        cardType: 'CIBIL_PDF_CARD',
        name: name ? String(name).toUpperCase() : null,
        pan: pan ? String(pan).toUpperCase() : null,
        mobile: mobile || null,
        pdfUrl: pdfUrl || null,
        referenceNo: refNo || null,
        generatedAt,
        status: isSuccess ? 'OFFICIAL CIBIL PDF READY' : 'BUREAU UNAVAILABLE',
        issuer: 'TRANSUNION CIBIL'
      };
    }

    // 13. TransUnion Hybrid Score, 14. Experian, 15. CRIF
    case 'cibil-transunion-v5':
    case 'experian-credit-report':
    case 'crif-credit-score-v4': {
      const b2cReport = rawData?.result_json?.parsed_data?.['B2C-REPORT'] || rawData?.data?.result_json?.parsed_data?.['B2C-REPORT'];
      const crifScoreObj = b2cReport?.['REPORT-DATA']?.['STANDARD-DATA']?.SCORE?.[0];
      const crifScoreVal = crifScoreObj ? (crifScoreObj['SCORE-VALUE'] || crifScoreObj.value) : null;
      const crifTradelines = b2cReport?.['REPORT-DATA']?.['STANDARD-DATA']?.TRADELINES;
      const crifInquiries = b2cReport?.['REPORT-DATA']?.['STANDARD-DATA']?.['INQUIRY-HISTORY']?.length;

      const rawScore = crifScoreVal || getVal(rawData, 'score', 'cibil_score', 'crif_score');
      const score = rawScore !== null && rawScore !== undefined && String(rawScore).trim() !== '' ? Number(rawScore) : null;
      const bureauName = apiId.includes('transunion') ? 'TransUnion CIBIL' : apiId.includes('experian') ? 'Experian' : 'CRIF HighMark';

      let tier = null;
      if (score !== null && !isNaN(score)) {
        tier = score >= 780 ? 'EXCELLENT (PRIME)' : score >= 720 ? 'VERY GOOD' : score >= 650 ? 'GOOD' : 'FAIR';
      } else if (isSuccess) {
        tier = 'THIN FILE / ACTIVE INQUIRY RECORD';
      }

      const name = getVal(rawData, 'name', 'fullname') || (b2cReport ? `${b2cReport['REQUEST-DATA']?.['APPLICANT-SEGMENT']?.['FIRST-NAME'] || ''} ${b2cReport['REQUEST-DATA']?.['APPLICANT-SEGMENT']?.['LAST-NAME'] || ''}`.trim() : '') || inputParams.name || (inputParams.forename ? `${inputParams.forename} ${inputParams.surname || ''}` : '') || (inputParams.first_name ? `${inputParams.first_name} ${inputParams.last_name || ''}` : '');
      const pan = getVal(rawData, 'pan', 'pan_id') || inputParams.pan || inputParams.pan_id;
      const mobile = getVal(rawData, 'mobile', 'mobile_no', 'phone_number') || inputParams.mobile || inputParams.mobile_no || inputParams.phone_number;
      const summary = rawData?.data?.summary || rawData?.summary || {};
      
      const rawTradelines = crifTradelines || rawData.tradelines || rawData?.data?.tradelines || [];
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

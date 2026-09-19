/**
 * Live Gateway Service
 * Dispatches 100% real-time verification requests to Bharat Cloud & IDSPay Gateways
 * Uses exact 1-to-1 upstream parameter names
 */

const getBharatCloudCreds = () => ({
  baseUrl: process.env.GATEWAY_BASE_URL || 'https://brown-goldfish-546701.hostingersite.com',
  api_id: process.env.GATEWAY_API_ID || 'APIDF8FCBC',
  api_key: process.env.GATEWAY_API_KEY || '1beb7649-c12b-4154-a3a5-afc9acee8e1f',
  token_id: process.env.GATEWAY_TOKEN_ID || 'NbN2p9IWr-u5iBO0fwbfdXaOkBB_LXHs'
});

const getIdspayCreds = () => ({
  baseUrl: process.env.IDSPAY_BASE_URL || 'https://javabackend.idspay.in/api/v1/prod',
  api_id: process.env.IDSPAY_API_ID || 'APID2994',
  api_key: process.env.IDSPAY_API_KEY || '49034a5a-cee5-4562-947b-03cf06608d94',
  token_id: process.env.IDSPAY_TOKEN_ID || '70Iy81LSYYp0VY1JnAyPNlioXKle2k5J'
});

async function callGatewayPost(url, payload, timeoutMs = 25000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const latencyMs = Date.now() - startTime;
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text };
    }

    return {
      status: response.status,
      ok: response.ok,
      latencyMs,
      data
    };
  } catch (err) {
    return {
      status: 500,
      ok: false,
      latencyMs: 0,
      data: {
        error: err.name === 'AbortError' ? 'Gateway request timed out' : err.message
      }
    };
  } finally {
    clearTimeout(timer);
  }
}

export const gatewayService = {
  // 1. PAN Card Verification (Fuzzy Name Match)
  // Route: /srv2/validation/pan
  async verifyPan(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/srv2/validation/pan`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      pan: (params.pan || params.panNumber || '').toUpperCase().trim(),
      name: (params.name || '').trim(),
      pan_display_name: String(params.pan_display_name ?? 'true'),
      name_match_method: params.name_match_method || 'fuzzy'
    };
    return await callGatewayPost(url, payload);
  },

  // 2. Aadhaar DigiLocker – Generate e-KYC URL
  // Route: /srv2/validation/digilocker-digital-kyc
  async generateDigiLockerUrl(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/srv2/validation/digilocker-digital-kyc`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      methodName: params.methodName || 'generateToken',
      aadhaar_number: (params.aadhaar_number || params.aadhaarNumber || '').replace(/\s|-/g, ''),
      redirectUrl: params.redirectUrl || 'https://laxminiwas.com/aadhaar-callback',
      logoUrl: params.logoUrl || 'https://laxminiwas.com/logo.png'
    };
    return await callGatewayPost(url, payload);
  },

  // 3. Aadhaar DigiLocker – Fetch Verified Details
  // Route: /srv2/validation/digilocker-digital-kyc
  async fetchDigiLockerDetails(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/srv2/validation/digilocker-digital-kyc`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      methodName: params.methodName || 'fetchDetails',
      client_id: params.client_id || params.clientId || ''
    };
    return await callGatewayPost(url, payload);
  },

  // 4. Bank Account Verification (Penny-less / Active Check)
  // Route: /api/v1/validate_bank_account
  async verifyBankAccount(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/api/v1/validate_bank_account`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      account_number: (params.account_number || params.accountNumber || '').trim(),
      ifsc: (params.ifsc || '').toUpperCase().trim()
    };
    return await callGatewayPost(url, payload);
  },

  // 5. Bank IFSC Code Lookup
  // Route: /bank/ifsc
  async lookupIfsc(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/bank/ifsc`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      ifsc: (params.ifsc || '').toUpperCase().trim()
    };
    return await callGatewayPost(url, payload);
  },

  // 6. EPFO / UAN Lookup (via Mobile Number)
  // Route: /srv3/uan-mobile
  async lookupUanByMobile(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/srv3/uan-mobile`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      mobile: (params.mobile || params.mobileNumber || '').replace(/\D/g, '').slice(-10)
    };
    return await callGatewayPost(url, payload);
  },

  // 7. EPFO / UAN Direct Employment History
  // Route: /srv3/uan-direct
  async getUanHistory(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/srv3/uan-direct`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      uan: (params.uan || params.uanNumber || '').trim()
    };
    return await callGatewayPost(url, payload);
  },

  // 8. Mobile to Profile & Reference Prefill
  // Route: /srv4/credit-report/prefill
  async prefillMobileProfile(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/srv4/credit-report/prefill`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      mobile_number: (params.mobile_number || params.mobileNumber || params.mobile || '').replace(/\D/g, '').slice(-10),
      first_name: (params.first_name || params.firstName || '').trim(),
      last_name: (params.last_name || params.lastName || '').trim()
    };
    return await callGatewayPost(url, payload);
  },

  // 9. IP Fraud & Geolocation Risk
  // Route: /check
  async lookupIpRisk(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/check`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      ip: (params.ip || params.ipAddress || '').trim()
    };
    return await callGatewayPost(url, payload);
  },

  // 10. Reverse Geocoding (Coordinates to Exact Address)
  // Route: /reverse
  async reverseGeocode(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/reverse`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      lat: parseFloat(params.lat ?? params.latitude ?? 28.6139),
      lon: parseFloat(params.lon ?? params.longitude ?? 77.2090)
    };
    return await callGatewayPost(url, payload);
  },

  // 11. Domain Age & MX Security Check
  // Route: /dosvak/domain-age
  async checkDomainAge(params = {}) {
    const creds = getBharatCloudCreds();
    const url = `${creds.baseUrl}/dosvak/domain-age`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      domain: (params.domain || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()
    };
    return await callGatewayPost(url, payload);
  },

  // 12. IDSPay CIBIL / TransUnion Credit Report (PDF Download)
  // Route: /srv2/credit-report/transunion-pdf
  async getCibilTransunionPdf(params = {}) {
    const creds = getIdspayCreds();
    const url = `${creds.baseUrl}/srv2/credit-report/transunion-pdf`;
    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      name: (params.name || (params.first_name ? `${params.first_name} ${params.last_name || ''}` : '') || (params.forename ? `${params.forename} ${params.surname || ''}` : '') || '').toUpperCase().trim(),
      mobile: (params.mobile || params.mobile_no || params.mobile_number || params.mobileNumber || params.phone || params.phone_number || '').replace(/\D/g, '').slice(-10),
      pan: (params.pan || params.panNumber || params.pan_id || '').toUpperCase().trim(),
      gender: params.gender || 'male',
      consent: params.consent || 'Y'
    };
    return await callGatewayPost(url, payload, 25000);
  },

  // 13. IDSPay TransUnion Hybrid Score (V5)
  // Route: /srv5/transunion-Score-Hybrid
  async getTransunionScoreHybrid(params = {}) {
    const creds = getIdspayCreds();
    const url = `${creds.baseUrl}/srv5/transunion-Score-Hybrid`;
    const nameParts = (params.name || '').trim().split(/\s+/);
    const forename = (params.forename || params.first_name || params.firstName || nameParts[0] || '').toUpperCase().trim();
    const surname = (params.surname || params.last_name || params.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : forename)).toUpperCase().trim();
    const phone = (params.phone_number || params.mobile_number || params.mobile || params.mobile_no || params.mobileNumber || params.phone || '').replace(/\D/g, '').slice(-10);
    const panId = (params.pan_id || params.pan || params.panNumber || '').toUpperCase().trim();

    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      forename,
      surname,
      phone_number: phone,
      gender: params.gender || 'Male',
      pan_id: panId,
      dob: params.dob || '1995-05-15'
    };
    return await callGatewayPost(url, payload, 25000);
  },

  // 14. IDSPay Experian Credit Bureau
  // Route: /srv2/credit-report/experian
  async getExperianReport(params = {}) {
    const creds = getIdspayCreds();
    const url = `${creds.baseUrl}/srv2/credit-report/experian`;
    const nameParts = (params.name || '').trim().split(/\s+/);
    const firstName = (params.first_name || params.forename || params.firstName || nameParts[0] || '').toUpperCase().trim();
    const lastName = (params.last_name || params.surname || params.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName)).toUpperCase().trim();
    const mobileNo = (params.mobile_no || params.mobile_number || params.mobile || params.mobileNumber || params.phone_number || params.phone || '').replace(/\D/g, '').slice(-10);
    const pan = (params.pan || params.panNumber || params.pan_id || '').toUpperCase().trim();

    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      mobile_no: mobileNo,
      pan,
      first_name: firstName,
      last_name: lastName,
      dob: params.dob || '1995-05-15'
    };
    return await callGatewayPost(url, payload, 25000);
  },

  // 15. IDSPay CRIF HighMark Credit Score (V4)
  // Route: /crif/Credit-ScoreV4
  async getCrifCreditScore(params = {}) {
    const creds = getIdspayCreds();
    const url = `${creds.baseUrl}/crif/Credit-ScoreV4`;
    const nameParts = (params.name || '').trim().split(/\s+/);
    const firstName = (params.first_name || params.forename || params.firstName || nameParts[0] || '').toUpperCase().trim();
    const lastName = (params.last_name || params.surname || params.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName)).toUpperCase().trim();
    const mobileNo = (params.mobile_no || params.mobile_number || params.mobile || params.mobileNumber || params.phone_number || params.phone || '').replace(/\D/g, '').slice(-10);

    const payload = {
      api_id: creds.api_id,
      api_key: creds.api_key,
      token_id: creds.token_id,
      mobile_no: mobileNo,
      name_lookup: params.name_lookup ?? 0,
      first_name: firstName,
      last_name: lastName
    };
    return await callGatewayPost(url, payload, 25000);
  }
};

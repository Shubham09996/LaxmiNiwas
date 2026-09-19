import { db } from '../store/db.js';
import { ALL_APIS, TOTAL_COST_PER_CUSTOMER } from '../config/constants.js';
import { executeApiTest } from '../services/allApisEngine.js';
import { buildEnrichedPayload } from '../utils/payloadBuilder.js';

export const getApiStages = (req, res) => {
  return res.json({
    success: true,
    totalCostPerCustomer: TOTAL_COST_PER_CUSTOMER,
    apis: ALL_APIS
  });
};

export const runApiTest = async (req, res) => {
  try {
    const { apiId, inputParams = {}, masterProfile = {} } = req.body;
    
    // Combine input parameters with master profile
    const mergedParams = {
      ...masterProfile,
      ...inputParams
    };

    const result = await executeApiTest(apiId, mergedParams, req);

    // Save to in-memory history log
    db.addAuditLog({
      action: 'API_TEST_EXECUTED',
      service: result.apiName,
      entity: `${result.tag || 'Verification'} • ${result.costFormatted}`,
      actor: 'Interactive Sandbox User',
      status: result.success ? 'SUCCESS' : 'GATEWAY_ERROR',
      ipAddress: req.ip || '127.0.0.1',
      details: `Executed ${result.apiName} (${result.isLiveGateway ? 'Live Gateway ⚡' : 'Verified Engine'}) with ${result.latencyMs}ms response time.`
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const runServiceByName = async (req, res) => {
  try {
    const serviceName = req.params.service;
    
    // Map service aliases to API id
    const serviceMap = {
      'pan': 'pan-advance',
      'pan-advance': 'pan-advance',
      'digilocker-generate': 'aadhaar-digilocker-generate',
      'aadhaar-digilocker-generate': 'aadhaar-digilocker-generate',
      'digilocker-fetch': 'aadhaar-digilocker-fetch',
      'aadhaar-digilocker-fetch': 'aadhaar-digilocker-fetch',
      'bank-account': 'bank-account-verification',
      'bank-account-verification': 'bank-account-verification',
      'ifsc': 'bank-ifsc-lookup',
      'bank-ifsc-lookup': 'bank-ifsc-lookup',
      'uan-mobile': 'uan-lookup-mobile',
      'uan-lookup-mobile': 'uan-lookup-mobile',
      'uan-direct': 'uan-direct-history',
      'uan-direct-history': 'uan-direct-history',
      'mobile-prefill': 'mobile-profile-prefill',
      'mobile-profile-prefill': 'mobile-profile-prefill',
      'ip-check': 'ip-fraud-geolocation',
      'ip-fraud-geolocation': 'ip-fraud-geolocation',
      'reverse-geo': 'reverse-geocoding',
      'reverse-geocoding': 'reverse-geocoding',
      'domain-age': 'domain-age-security',
      'domain-age-security': 'domain-age-security',
      'cibil-pdf': 'cibil-transunion-pdf',
      'cibil-transunion-pdf': 'cibil-transunion-pdf',
      'cibil-hybrid': 'cibil-transunion-v5',
      'cibil-transunion-v5': 'cibil-transunion-v5',
      'experian': 'experian-credit-report',
      'experian-credit-report': 'experian-credit-report',
      'crif': 'crif-credit-score-v4',
      'crif-score': 'crif-credit-score-v4',
      'crif-credit-score-v4': 'crif-credit-score-v4'
    };

    const targetApiId = serviceMap[serviceName] || serviceName;
    const result = await executeApiTest(targetApiId, req.body, req);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const previewMasterPayload = (req, res) => {
  const { apiId = 'pan-advance', masterProfile = {} } = req.body;
  const enriched = buildEnrichedPayload(apiId, masterProfile, req);
  return res.json({
    success: true,
    apiId,
    enrichedPayload: enriched
  });
};

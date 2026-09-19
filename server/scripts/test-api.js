import dotenv from 'dotenv';
dotenv.config();
import { ALL_APIS } from '../src/config/constants.js';
import { executeApiTest } from '../src/services/allApisEngine.js';

const MASTER_PROFILE = {
  fullName: 'SHUBHAM GUPTA',
  mobileNumber: '9876543210',
  panNumber: 'AAACL7821M',
  aadhaarNumber: '984512348921'
};

async function runTests() {
  console.log('================================================================');
  console.log(`Starting Test Run for all ${ALL_APIS.length} Verification & Credit Bureau APIs`);
  console.log('Master Profile:', JSON.stringify(MASTER_PROFILE));
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  for (const apiItem of ALL_APIS) {
    try {
      console.log(`Testing #${apiItem.num}: ${apiItem.name} (${apiItem.gateway})...`);
      const res = await executeApiTest(apiItem.id, { ...apiItem.sampleInput, ...MASTER_PROFILE });
      
      console.log(`  ✓ Ref: ${res.refId}`);
      console.log(`  ✓ Latency: ${res.latencyMs}ms | Status Code: ${res.statusCode}`);
      console.log(`  ✓ Card Type: ${res.visualData?.cardType || 'GENERIC'}`);
      console.log(`  ✓ Visual Status: ${res.visualData?.status || 'N/A'}`);
      console.log(`  ✓ Success: ${res.success}`);
      if (!res.success && res.error) {
        console.log(`  ⚠ Notice: ${res.error}`);
      }
      console.log('----------------------------------------------------------------');
      passed++;
    } catch (err) {
      console.error(`  ✕ Error testing ${apiItem.id}:`, err.message);
      failed++;
    }
  }

  console.log(`\n================================================================`);
  console.log(`TEST SUMMARY: ${passed} APIs Processed, ${failed} Failed`);
  console.log(`================================================================\n`);
}

runTests();

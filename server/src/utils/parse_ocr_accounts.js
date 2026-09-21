import fs from 'fs';

const rawOcr = fs.readFileSync('d:\\LaxmiNiwas\\server\\src\\utils\\divyesh_ocr_all_29_pages.txt', 'utf8');

// Let's parse each page
const pages = rawOcr.split(/page \d+==Screenshot for page \d+==/).filter(Boolean);
console.log('Total page blocks found in OCR:', pages.length);

const accounts = [];
const nameVariations = [];
const emailVariations = [];
const dobVariations = [];
const phoneVariations = [];
const idVariations = [];
const addressVariations = [];
const employmentVariations = [];
let inquiries = [];

// Helper to extract table rows
for (let pIdx = 0; pIdx < pages.length; pIdx++) {
  const pText = pages[pIdx];
  const lines = pText.split('\n').map(l => l.trim()).filter(Boolean);

  // Parse Account Information
  // An account block typically looks like:
  // Account Information
  // Account Type: Personal Loan Credit Grantor: ... Account #: ... Lender Type #: NBF As on #: ... Active/Closed
  // Ownership: ... Disbursed Date: ... Disbd Amt/High Credit: ...
  // ...
  // Payment History/Asset Classification:
  // Amount Paid History:
  // Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
  // 2026 000 000 ...

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Check for Account Information
    if (line === 'Account Information') {
      const headerLine = lines[i + 1] || '';
      const mHeader = headerLine.match(/Account Type:\s*(.*?)\s+Credit Grantor:\s*(.*?)\s+Account #:\s*(.*?)\s+Lender Type #:\s*(.*?)\s+As on #:\s*(.*?)\s+(Active|Closed)/i);
      
      let accountType = 'Personal Loan';
      let creditGrantor = '';
      let accountNumber = '';
      let lenderType = '';
      let asOnDate = '';
      let status = 'Active';

      if (mHeader) {
        accountType = mHeader[1].trim();
        creditGrantor = mHeader[2].trim();
        accountNumber = mHeader[3].trim();
        lenderType = mHeader[4].trim();
        asOnDate = mHeader[5].trim();
        status = mHeader[6].trim();
      }

      // Read attribute lines
      let ownership = 'Individual';
      let disbursedDate = '';
      let disbursedHighCredit = '0';
      let creditLimit = '';
      let lastPaymentDate = '';
      let currentBalance = '0';
      let cashLimit = '';
      let closedDate = '';
      let lastPaidAmt = '';
      let instlAmtFreq = '';
      let tenureMonths = '0';
      let overdueAmt = '0';
      let writeOffDate = '';
      let accountInDispute = '';
      let accountRemarks = '';
      let principalWriteoffAmt = '';
      let settlementAmt = '';
      let totalWriteoffAmt = '0';
      const paymentHistory = [];

      let j = i + 2;
      while (j < lines.length && lines[j] !== 'Account Information' && !lines[j].startsWith('Inquiries ( past 24 months)') && !lines[j].startsWith('-END OF REPORT-') && !lines[j].startsWith('Appendix')) {
        const l = lines[j];

        if (l.includes('Ownership:')) {
          const m = l.match(/Ownership:\s*(.*?)\s+Disbursed Date:\s*(.*?)\s+Disbd Amt\/High Credit:\s*([\d,]+)/);
          if (m) {
            ownership = m[1].trim();
            disbursedDate = m[2].trim();
            disbursedHighCredit = m[3].trim();
          }
        } else if (l.includes('Credit Limit:')) {
          const m = l.match(/Credit Limit:\s*(.*?)\s+Last Payment Date:\s*(.*?)\s+Current Balance:\s*([\d,]+)/);
          if (m) {
            creditLimit = m[1].trim();
            lastPaymentDate = m[2].trim();
            currentBalance = m[3].trim();
          }
        } else if (l.includes('Cash Limit:')) {
          const m = l.match(/Cash Limit:\s*(.*?)\s+Closed Date:\s*(.*?)\s+Last Paid Amt:\s*([\d,]*)/);
          if (m) {
            cashLimit = m[1].trim();
            closedDate = m[2].trim();
            lastPaidAmt = m[3].trim();
          }
        } else if (l.includes('InstlAmt/Freq:')) {
          const m = l.match(/InstlAmt\/Freq:\s*(.*?)\s+Tenure\(month\):\s*(.*?)\s+Overdue Amt:\s*([\d,]+)/);
          if (m) {
            instlAmtFreq = m[1].trim();
            tenureMonths = m[2].trim();
            overdueAmt = m[3].trim();
          }
        } else if (l.includes('Write off Date:')) {
          const m = l.match(/Write off Date:\s*(.*?)\s+Account in Dispute:\s*(.*)/);
          if (m) {
            writeOffDate = m[1].trim();
            accountInDispute = m[2].trim();
          }
        } else if (l.includes('Account Remarks:')) {
          const m = l.match(/Account Remarks:\s*(.*?)\s+Principal Writeoff Amt:\s*(.*)/);
          if (m) {
            accountRemarks = m[1].trim();
            principalWriteoffAmt = m[2].trim();
          }
        } else if (l.includes('Settlement Amt:')) {
          const m = l.match(/Settlement Amt:\s*(.*?)\s+Total Writeoff Amt:\s*([\d,]*)/);
          if (m) {
            settlementAmt = m[1].trim();
            totalWriteoffAmt = m[2].trim() || '0';
          }
        } else if (/^(202[0-9]|201[0-9])\s+/.test(l)) {
          // e.g. "2026 000 000" or "2021 000 000 000 000 000 000 000 000 000 000"
          const tokens = l.split(/\s+/);
          const yr = tokens[0];
          const vals = tokens.slice(1);
          
          // Let's find month headers from previous line if available
          const monthHeaders = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthsMap = {};
          
          // If there are N values, in CRIF High Mark OCR they align with specific reported months
          // Let's assign reported values
          for (let vIdx = 0; vIdx < vals.length; vIdx++) {
            // For simple reconstruction, place into months
            if (vIdx < monthHeaders.length) {
              monthsMap[monthHeaders[vIdx]] = vals[vIdx];
            }
          }
          paymentHistory.push({ year: yr, months: monthsMap });
        }
        j++;
      }

      if (creditGrantor || accountNumber) {
        accounts.push({
          accountType,
          creditGrantor,
          accountNumber,
          lenderType,
          asOnDate,
          status,
          ownership,
          disbursedDate,
          disbursedHighCredit,
          creditLimit,
          lastPaymentDate,
          currentBalance,
          cashLimit,
          closedDate,
          lastPaidAmt,
          instlAmtFreq,
          tenureMonths,
          overdueAmt,
          writeOffDate,
          accountInDispute,
          accountRemarks,
          principalWriteoffAmt,
          settlementAmt,
          totalWriteoffAmt,
          paymentHistory
        });
      }
      i = j;
    } else {
      i++;
    }
  }
}

console.log('Total reconstructed accounts from OCR:', accounts.length);
fs.writeFileSync('d:\\LaxmiNiwas\\server\\src\\utils\\divyesh_parsed_accounts.json', JSON.stringify(accounts, null, 2), 'utf8');

import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanText(val) {
  if (val === null || val === undefined || val === '') return '';
  return String(val).trim();
}

function formatDob(rawDob) {
  if (!rawDob) return '';
  const str = String(rawDob).trim();
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) return str;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str.replace(/\//g, '-');
  
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  const m = str.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (m) {
    return `${m[3].padStart(2, '0')}-${m[2].padStart(2, '0')}-${m[1]}`;
  }
  return str.slice(0, 10);
}

function formatAmount(val) {
  if (val === null || val === undefined || val === '') return '';
  const num = Number(String(val).replace(/,/g, ''));
  if (isNaN(num)) return String(val);
  return num.toLocaleString('en-IN');
}

function parseKeyValueMap(arr) {
  const map = {};
  if (Array.isArray(arr)) {
    for (const item of arr) {
      const k = String(item?.['ATTR-NAME'] || item?.name || item?.key || '').trim().toUpperCase();
      const v = String(item?.['ATTR-VALUE'] ?? item?.value ?? '').trim();
      if (k) map[k] = v;
    }
  } else if (arr && typeof arr === 'object') {
    for (const [k, v] of Object.entries(arr)) {
      map[k.trim().toUpperCase()] = String(v ?? '').trim();
    }
  }
  return map;
}

function generateRetroQuarters(dateOfIssueStr) {
  let refDate = new Date();
  if (dateOfIssueStr) {
    const parts = dateOfIssueStr.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        refDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      } else {
        refDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
  }
  if (isNaN(refDate.getTime())) refDate = new Date();

  const quarterEnds = [
    { month: 2, day: 31, str: '31-03' },
    { month: 5, day: 30, str: '30-06' },
    { month: 8, day: 30, str: '30-09' },
    { month: 11, day: 31, str: '31-12' }
  ];

  let currentYear = refDate.getFullYear();
  let currentMonth = refDate.getMonth();
  let currentDay = refDate.getDate();

  let qIdx = -1;
  for (let i = quarterEnds.length - 1; i >= 0; i--) {
    if (currentMonth > quarterEnds[i].month || (currentMonth === quarterEnds[i].month && currentDay >= quarterEnds[i].day)) {
      qIdx = i;
      break;
    }
  }
  if (qIdx === -1) {
    qIdx = 3;
    currentYear -= 1;
  }

  const results = [];
  for (let step = 0; step < 12; step++) {
    const q = quarterEnds[qIdx];
    results.push(`${q.str}-\n${currentYear}`);
    qIdx--;
    if (qIdx < 0) {
      qIdx = 3;
      currentYear -= 1;
    }
  }
  return results;
}

function isSecuredAccount(accountType) {
  const t = String(accountType || '').toLowerCase();
  return (
    t.includes('housing') ||
    t.includes('home') ||
    t.includes('property') ||
    t.includes('auto') ||
    t.includes('car') ||
    t.includes('vehicle') ||
    t.includes('gold') ||
    t.includes('tractor') ||
    t.includes('equipment') ||
    t.includes('construction') ||
    t.includes('secured')
  );
}

/**
 * Generate 100% Exact Official CRIF High Mark Clone PDF
 */
export async function generateCrifReportPdf(data) {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Embed CRIF High Mark Logo
  let logoImage = null;
  try {
    const logoPaths = [
      path.resolve(__dirname, '../assets/crif_highmark_logo.png'),
      path.resolve(__dirname, '../../src/assets/crif_highmark_logo.png'),
      path.resolve(process.cwd(), 'server/src/assets/crif_highmark_logo.png'),
      path.resolve(process.cwd(), 'src/assets/crif_highmark_logo.png'),
    ];
    for (const p of logoPaths) {
      if (fs.existsSync(p)) {
        const logoBytes = fs.readFileSync(p);
        logoImage = await pdfDoc.embedPng(logoBytes);
        break;
      }
    }
  } catch (e) {
    console.warn('[CrifPdfGenerator] Logo embed notice:', e);
  }

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN_LEFT = 30;
  const MARGIN_RIGHT = 30;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 535.28
  const BOTTOM_MARGIN = 24;

  // Exact Official CRIF Colors
  const COLOR_NAVY_HEADER = rgb(0.043, 0.212, 0.388); // #0B3663 (Dark Navy section headers)
  const COLOR_TH_BLUE = rgb(0.910, 0.933, 0.973);     // #E8EEF8 (Light Blue / Lavender Table Header)
  const COLOR_BORDER = rgb(0.776, 0.831, 0.918);      // #C6D4EA (Table Grid Borders)
  const COLOR_WHITE = rgb(1, 1, 1);
  const COLOR_TEXT_DARK = rgb(0.12, 0.15, 0.18);
  const COLOR_TIP_BLUE = rgb(0.102, 0.325, 0.608);    // #1A539B (Tip text blue)
  const COLOR_ACTIVE_BG = rgb(0.902, 0.976, 0.933);   // #E6F9EE (Active Badge Green BG)
  const COLOR_ACTIVE_BORDER = rgb(0.34, 0.827, 0.549); // #57D38C (Active Badge Green Border)
  const COLOR_ACTIVE_TEXT = rgb(0.055, 0.478, 0.212);  // #0E7A36 (Active Badge Text)
  const COLOR_CLOSED_BG = rgb(0.992, 0.91, 0.91);     // #FDE8E8 (Closed Badge Pink BG)
  const COLOR_CLOSED_BORDER = rgb(0.969, 0.639, 0.639);// #F7A3A3 (Closed Badge Pink Border)
  const COLOR_CLOSED_TEXT = rgb(0.773, 0.133, 0.122);  // #C5221F (Closed Badge Text)

  let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - 30;

  function ensureSpace(neededHeight) {
    if (y - neededHeight < BOTTOM_MARGIN) {
      currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - 30;
    }
  }

  function startNewPage() {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - 30;
  }

  // Draw Dark Navy Section Header Banner
  function drawSectionHeader(title, customY) {
    const targetY = customY ?? y;
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: targetY - 14,
      width: CONTENT_WIDTH,
      height: 14,
      color: COLOR_NAVY_HEADER
    });
    currentPage.drawText(title, {
      x: MARGIN_LEFT + 6,
      y: targetY - 10,
      size: 8,
      font: fontBold,
      color: COLOR_WHITE
    });
    if (!customY) {
      y -= 17;
    }
  }

  // Helper for variations sub-tables with multi-page line wrapping
  function drawVariationSubTable(title, headers, rows, colWidths, allowMultiPage = true) {
    if (title) {
      ensureSpace(24 + Math.min(rows.length, 2) * 12);
      currentPage.drawText(title, { x: MARGIN_LEFT, y: y - 1, size: 6.5, font: fontBold, color: COLOR_NAVY_HEADER });
      y -= 9;
    } else {
      ensureSpace(16 + Math.min(rows.length, 2) * 12);
    }

    // Header
    currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 11, width: CONTENT_WIDTH, height: 11, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
    let currX = MARGIN_LEFT;
    for (let h = 0; h < headers.length; h++) {
      if (h > 0) {
        currentPage.drawLine({ start: { x: currX, y: y }, end: { x: currX, y: y - 11 }, color: COLOR_BORDER, thickness: 0.5 });
      }
      currentPage.drawText(headers[h], { x: currX + 4, y: y - 8, size: 5.5, font: fontBold, color: COLOR_NAVY_HEADER });
      currX += colWidths[h];
    }
    y -= 11;

    // Data rows
    for (const r of rows) {
      const col0Text = String(r[0] || '');
      const rawLines = col0Text.split('\n');
      const lines = [];
      for (const rl of rawLines) {
        if (rl.length > 55) {
          const words = rl.split(' ');
          let cur = '';
          for (const w of words) {
            if ((cur + ' ' + w).length > 55) {
              if (cur) lines.push(cur.trim());
              cur = w;
            } else {
              cur = cur ? cur + ' ' + w : w;
            }
          }
          if (cur) lines.push(cur.trim());
        } else {
          lines.push(rl);
        }
      }

      const numLines = Math.max(lines.length, 1);
      const rowH = numLines > 1 ? (numLines * 8.5 + 3) : 11;
      
      if (allowMultiPage && (y - rowH < BOTTOM_MARGIN)) {
        startNewPage();
        // Redraw table header on top of the new page
        currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 11, width: CONTENT_WIDTH, height: 11, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
        let hX = MARGIN_LEFT;
        for (let h = 0; h < headers.length; h++) {
          if (h > 0) {
            currentPage.drawLine({ start: { x: hX, y: y }, end: { x: hX, y: y - 11 }, color: COLOR_BORDER, thickness: 0.5 });
          }
          currentPage.drawText(headers[h], { x: hX + 4, y: y - 8, size: 5.5, font: fontBold, color: COLOR_NAVY_HEADER });
          hX += colWidths[h];
        }
        y -= 11;
      }

      currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - rowH, width: CONTENT_WIDTH, height: rowH, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });

      currX = MARGIN_LEFT;
      for (let c = 0; c < r.length; c++) {
        if (c > 0) {
          currentPage.drawLine({ start: { x: currX, y: y }, end: { x: currX, y: y - rowH }, color: COLOR_BORDER, thickness: 0.5 });
        }
        if (c === 0 && numLines > 1) {
          let lineY = y - 7.5;
          for (const line of lines) {
            currentPage.drawText(line, { x: currX + 4, y: lineY, size: 5, font: fontRegular });
            lineY -= 8.5;
          }
        } else {
          const text = String(r[c] || '');
          currentPage.drawText(text, { x: currX + 4, y: y - (numLines > 1 ? 9 : 8), size: 5.5, font: fontRegular });
        }
        currX += colWidths[c];
      }
      y -= rowH;
    }
    y -= 4;
  }

  // =========================================================================
  // PAGE 1: HEADER SECTION
  // =========================================================================
  // 1. Logo (Top Left)
  if (logoImage) {
    currentPage.drawImage(logoImage, {
      x: MARGIN_LEFT,
      y: y - 34,
      width: 72,
      height: 34.4
    });
  } else {
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: y - 28,
      width: 68,
      height: 26,
      color: rgb(0.04, 0.22, 0.38)
    });
    currentPage.drawText('CRIF', {
      x: MARGIN_LEFT + 6,
      y: y - 19,
      size: 16,
      font: fontBold,
      color: COLOR_WHITE
    });
    currentPage.drawText('High Mark', {
      x: MARGIN_LEFT + 6,
      y: y - 26,
      size: 5.5,
      font: fontBold,
      color: rgb(0.9, 0.9, 0.9)
    });
    currentPage.drawText('Together to the next level', {
      x: MARGIN_LEFT,
      y: y - 36,
      size: 5.5,
      font: fontOblique,
      color: rgb(0.35, 0.35, 0.35)
    });
  }

  // 2. Title (Center)
  const titleText = 'Credit Information™ Report PROV2';
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 13);
  currentPage.drawText(titleText, {
    x: (PAGE_WIDTH - titleWidth) / 2,
    y: y - 10,
    size: 13,
    font: fontBold,
    color: rgb(0.04, 0.22, 0.38)
  });

  const forNameText = `For ${cleanText(data.header.applicantName || 'APPLICANT')}`;
  const forNameWidth = fontBold.widthOfTextAtSize(forNameText, 7.5);
  currentPage.drawText(forNameText, {
    x: (PAGE_WIDTH - forNameWidth) / 2,
    y: y - 24,
    size: 7.5,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  // 3. Metadata (Top Right)
  const metaX = PAGE_WIDTH - MARGIN_RIGHT - 150;
  let metaY = y - 4;
  const metaItems = [
    `CHM Ref #: ${data.header.chmRefNumber || '—'}`,
    `Prepared For: ${data.header.preparedFor || ''}`,
    `Application ID: ${data.header.applicationId || '—'}`,
    `Date of Request: ${data.header.dateOfRequest || '—'}`,
    `Date of Issue: ${data.header.dateOfIssue || '—'}`
  ];
  for (const item of metaItems) {
    currentPage.drawText(item, {
      x: metaX,
      y: metaY,
      size: 6.2,
      font: item.startsWith('CHM') || item.startsWith('Date of Issue') ? fontBold : fontRegular,
      color: rgb(0.15, 0.15, 0.15)
    });
    metaY -= 8.5;
  }

  y -= 44;

  // =========================================================================
  // SECTION 1: INQUIRY INPUT INFORMATION
  // =========================================================================
  drawSectionHeader('Inquiry Input Information');
  const inqHeight = 68;
  currentPage.drawRectangle({
    x: MARGIN_LEFT,
    y: y - inqHeight,
    width: CONTENT_WIDTH,
    height: inqHeight,
    color: COLOR_WHITE,
    borderColor: COLOR_BORDER,
    borderWidth: 0.5
  });

  let rowY = y - 10;
  const col1X = MARGIN_LEFT + 6;
  const col2X = MARGIN_LEFT + 185;
  const col3X = MARGIN_LEFT + 360;

  // Row 1
  currentPage.drawText(`Name:${cleanText(data.inquiryInput.name)}`, { x: col1X, y: rowY, size: 6.5, font: fontBold });
  currentPage.drawText(`DOB/Age: ${cleanText(data.inquiryInput.dobAge)}`, { x: col2X, y: rowY, size: 6.5, font: fontRegular });
  currentPage.drawText(`Gender: ${cleanText(data.inquiryInput.gender)}`, { x: col3X, y: rowY, size: 6.5, font: fontRegular });
  rowY -= 10;

  // Row 2
  currentPage.drawText(`Phone Numbers:${cleanText(data.inquiryInput.phone)}`, { x: col1X, y: rowY, size: 6.5, font: fontRegular });
  currentPage.drawText(`Spouse: ${cleanText(data.inquiryInput.spouse)}`, { x: col2X, y: rowY, size: 6.5, font: fontRegular });
  currentPage.drawText(`Mother: ${cleanText(data.inquiryInput.mother)}`, { x: col3X, y: rowY, size: 6.5, font: fontRegular });
  rowY -= 10;

  // Row 3
  currentPage.drawText(`Father: ${cleanText(data.inquiryInput.father)}`, { x: col1X, y: rowY, size: 6.5, font: fontRegular });
  currentPage.drawText(`ID(s): ${cleanText(data.inquiryInput.idNumbers)}`, { x: col2X, y: rowY, size: 6.5, font: fontRegular });
  currentPage.drawText(`Email ID(s): ${cleanText(data.inquiryInput.email)}`, { x: col3X, y: rowY, size: 6.5, font: fontRegular });
  rowY -= 11;

  // Current Address
  currentPage.drawText('Current Address:', { x: col1X, y: rowY, size: 6.5, font: fontBold });
  rowY -= 9;
  const addrText = cleanText(data.inquiryInput.currentAddress) || '';
  if (addrText) {
    const addrLines = addrText.match(/.{1,115}(\s|$)/g) || [addrText];
    for (let l = 0; l < Math.min(addrLines.length, 2); l++) {
      currentPage.drawText(addrLines[l].trim(), { x: col1X, y: rowY, size: 6, font: fontRegular });
      rowY -= 8;
    }
  }

  // Other Address
  currentPage.drawText('Other Address:', { x: col1X, y: rowY, size: 6.5, font: fontBold });
  y -= (inqHeight + 5);

  // =========================================================================
  // SECTION 2: CRIF HM SCORE(S):
  // =========================================================================
  drawSectionHeader('CRIF HM Score(S):');
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 13, width: CONTENT_WIDTH, height: 13, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  currentPage.drawText('SCORE NAME', { x: MARGIN_LEFT + 6, y: y - 9.5, size: 6.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawLine({ start: { x: MARGIN_LEFT + 180, y: y }, end: { x: MARGIN_LEFT + 180, y: y - 13 }, color: COLOR_BORDER, thickness: 0.5 });
  currentPage.drawText('RANGE', { x: MARGIN_LEFT + 185, y: y - 9.5, size: 6.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawLine({ start: { x: MARGIN_LEFT + 260, y: y }, end: { x: MARGIN_LEFT + 260, y: y - 13 }, color: COLOR_BORDER, thickness: 0.5 });
  currentPage.drawText('SCORE', { x: MARGIN_LEFT + 265, y: y - 9.5, size: 6.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawLine({ start: { x: MARGIN_LEFT + 340, y: y }, end: { x: MARGIN_LEFT + 340, y: y - 13 }, color: COLOR_BORDER, thickness: 0.5 });
  currentPage.drawText('SCORING FACTORS (Up to 4 only)', { x: MARGIN_LEFT + 345, y: y - 9.5, size: 6.5, font: fontBold, color: COLOR_NAVY_HEADER });
  y -= 13;

  // Data row
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 24, width: CONTENT_WIDTH, height: 24, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  currentPage.drawText(cleanText(data.scoreSection.scoreName) || 'PERFORM CONSUMER 2.2', { x: MARGIN_LEFT + 6, y: y - 12, size: 6.5, font: fontRegular });
  currentPage.drawLine({ start: { x: MARGIN_LEFT + 180, y: y }, end: { x: MARGIN_LEFT + 180, y: y - 24 }, color: COLOR_BORDER, thickness: 0.5 });
  currentPage.drawText(cleanText(data.scoreSection.range) || '300-900', { x: MARGIN_LEFT + 185, y: y - 12, size: 6.5, font: fontRegular });
  currentPage.drawLine({ start: { x: MARGIN_LEFT + 260, y: y }, end: { x: MARGIN_LEFT + 260, y: y - 24 }, color: COLOR_BORDER, thickness: 0.5 });
  currentPage.drawText(String(data.scoreSection.score ?? '—'), { x: MARGIN_LEFT + 265, y: y - 12, size: 6.5, font: fontBold });
  currentPage.drawLine({ start: { x: MARGIN_LEFT + 340, y: y }, end: { x: MARGIN_LEFT + 340, y: y - 24 }, color: COLOR_BORDER, thickness: 0.5 });

  const factors = data.scoreSection.scoringFactors || [];
  let factorY = y - 8;
  for (let f = 0; f < Math.min(factors.length, 3); f++) {
    currentPage.drawText(factors[f], { x: MARGIN_LEFT + 345, y: factorY, size: 6, font: fontRegular });
    factorY -= 7;
  }
  y -= 28;

  // =========================================================================
  // SECTION 3: SCORE TREND
  // =========================================================================
  drawSectionHeader('Score Trend');
  const trendCols = 13;
  const trendColWidth = CONTENT_WIDTH / trendCols;

  const dynamicRetroDates = generateRetroQuarters(data.header.dateOfIssue);
  const dates = data.scoreTrend?.retroDates?.length ? data.scoreTrend.retroDates : dynamicRetroDates;
  const scores = data.scoreTrend?.scores?.length ? data.scoreTrend.scores : Array(12).fill('—');

  // Header row (Retro Date)
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 18, width: CONTENT_WIDTH, height: 18, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  currentPage.drawText('Retro Date', { x: MARGIN_LEFT + 2, y: y - 12, size: 6, font: fontBold, color: COLOR_NAVY_HEADER });

  for (let i = 0; i < 12; i++) {
    const cellX = MARGIN_LEFT + (i + 1) * trendColWidth;
    currentPage.drawLine({ start: { x: cellX, y: y }, end: { x: cellX, y: y - 18 }, color: COLOR_BORDER, thickness: 0.5 });
    const dateStr = dates[i] || '';
    const parts = dateStr.split('\n');
    if (parts.length > 1) {
      currentPage.drawText(parts[0], { x: cellX + 1, y: y - 8, size: 5.2, font: fontRegular, color: COLOR_NAVY_HEADER });
      currentPage.drawText(parts[1], { x: cellX + 1, y: y - 15, size: 5.2, font: fontRegular, color: COLOR_NAVY_HEADER });
    } else {
      currentPage.drawText(dateStr, { x: cellX + 1, y: y - 12, size: 5.2, font: fontRegular, color: COLOR_NAVY_HEADER });
    }
  }
  y -= 18;

  // Score Row
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 12, width: CONTENT_WIDTH, height: 12, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  currentPage.drawText('Score', { x: MARGIN_LEFT + 2, y: y - 8.5, size: 6, font: fontBold });
  for (let i = 0; i < 12; i++) {
    const cellX = MARGIN_LEFT + (i + 1) * trendColWidth;
    currentPage.drawLine({ start: { x: cellX, y: y }, end: { x: cellX, y: y - 12 }, color: COLOR_BORDER, thickness: 0.5 });
    const sVal = cleanText(scores[i]) || '—';
    currentPage.drawText(sVal, { x: cellX + 4, y: y - 8.5, size: 5.8, font: fontRegular });
  }
  y -= 15;

  // =========================================================================
  // SECTION 4: PRIMARY ACCOUNT SUMMARY
  // =========================================================================
  drawSectionHeader('Primary Account Summary');
  currentPage.drawText('Tip: Current Balance & Disbursed Amount is considered ONLY for ACTIVE accounts.', { x: MARGIN_LEFT, y: y - 1, size: 5.2, font: fontOblique, color: COLOR_TIP_BLUE });
  currentPage.drawText('Tip: All amounts are in INR.', { x: MARGIN_LEFT, y: y - 7, size: 5.2, font: fontOblique, color: COLOR_TIP_BLUE });
  y -= 10;

  const primCols = [
    'Number\nof\nAccounts',
    'Active\nAccounts',
    'Overdue\nAccounts',
    'Secured\nAccounts',
    'UnSecured\nAccounts',
    'Untagged\nAccounts',
    'Total\nCurrent\nBalance',
    'Current\nBalance\nSecured',
    'Current\nBalance\nUnsecured',
    'Total\nSanctioned\nAmount',
    'Total\nDisbursed\nAmount',
    'Total\nAmount\nOverdue'
  ];
  const primValues = [
    data.primarySummary.numAccounts,
    data.primarySummary.activeAccounts,
    data.primarySummary.overdueAccounts,
    data.primarySummary.securedAccounts,
    data.primarySummary.unsecuredAccounts,
    data.primarySummary.untaggedAccounts,
    data.primarySummary.totalCurrentBalance,
    data.primarySummary.currentBalanceSecured,
    data.primarySummary.currentBalanceUnsecured,
    data.primarySummary.totalSanctionedAmount,
    data.primarySummary.totalDisbursedAmount,
    data.primarySummary.totalAmountOverdue
  ];

  const primColWidth = CONTENT_WIDTH / 12;
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 24, width: CONTENT_WIDTH, height: 24, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  for (let c = 0; c < 12; c++) {
    if (c > 0) {
      currentPage.drawLine({ start: { x: MARGIN_LEFT + c * primColWidth, y: y }, end: { x: MARGIN_LEFT + c * primColWidth, y: y - 24 }, color: COLOR_BORDER, thickness: 0.5 });
    }
    const lines = primCols[c].split('\n');
    let lineY = y - 7;
    for (const l of lines) {
      currentPage.drawText(l, { x: MARGIN_LEFT + c * primColWidth + 2, y: lineY, size: 5, font: fontBold, color: COLOR_NAVY_HEADER });
      lineY -= 6;
    }
  }
  y -= 24;

  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 12, width: CONTENT_WIDTH, height: 12, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  for (let c = 0; c < 12; c++) {
    if (c > 0) {
      currentPage.drawLine({ start: { x: MARGIN_LEFT + c * primColWidth, y: y }, end: { x: MARGIN_LEFT + c * primColWidth, y: y - 12 }, color: COLOR_BORDER, thickness: 0.5 });
    }
    currentPage.drawText(String(primValues[c] ?? 0), { x: MARGIN_LEFT + c * primColWidth + 4, y: y - 8.5, size: 5.8, font: fontRegular });
  }
  y -= 15;

  // =========================================================================
  // SECTION 5: SECONDARY ACCOUNT SUMMARY
  // =========================================================================
  drawSectionHeader('Secondary Account Summary');
  currentPage.drawText('Tip: Current Balance & Disbursed Amount is considered ONLY for ACTIVE accounts.', { x: MARGIN_LEFT, y: y - 1, size: 5.2, font: fontOblique, color: COLOR_TIP_BLUE });
  currentPage.drawText('Tip: All amounts are in INR.', { x: MARGIN_LEFT, y: y - 7, size: 5.2, font: fontOblique, color: COLOR_TIP_BLUE });
  y -= 10;

  const secCols = [
    'Number of\nAccounts',
    'Active\nAccounts',
    'Overdue\nAccounts',
    'Secured\nAccounts',
    'UnSecured\nAccounts',
    'Untagged\nAccounts',
    'Total Current\nBalance',
    'Total Sanctioned\nAmount',
    'Total Disbursed\nAmount',
    'Total Amount\nOverdue'
  ];
  const secValues = [
    data.secondarySummary.numAccounts,
    data.secondarySummary.activeAccounts,
    data.secondarySummary.overdueAccounts,
    data.secondarySummary.securedAccounts,
    data.secondarySummary.unsecuredAccounts,
    data.secondarySummary.untaggedAccounts,
    data.secondarySummary.totalCurrentBalance,
    data.secondarySummary.totalSanctionedAmount,
    data.secondarySummary.totalDisbursedAmount,
    data.secondarySummary.totalAmountOverdue
  ];

  const secColWidth = CONTENT_WIDTH / 10;
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 18, width: CONTENT_WIDTH, height: 18, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  for (let c = 0; c < 10; c++) {
    if (c > 0) {
      currentPage.drawLine({ start: { x: MARGIN_LEFT + c * secColWidth, y: y }, end: { x: MARGIN_LEFT + c * secColWidth, y: y - 18 }, color: COLOR_BORDER, thickness: 0.5 });
    }
    const lines = secCols[c].split('\n');
    let lineY = y - 7;
    for (const l of lines) {
      currentPage.drawText(l, { x: MARGIN_LEFT + c * secColWidth + 2, y: lineY, size: 5.2, font: fontBold, color: COLOR_NAVY_HEADER });
      lineY -= 6;
    }
  }
  y -= 18;

  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 12, width: CONTENT_WIDTH, height: 12, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  for (let c = 0; c < 10; c++) {
    if (c > 0) {
      currentPage.drawLine({ start: { x: MARGIN_LEFT + c * secColWidth, y: y }, end: { x: MARGIN_LEFT + c * secColWidth, y: y - 12 }, color: COLOR_BORDER, thickness: 0.5 });
    }
    currentPage.drawText(String(secValues[c] ?? 0), { x: MARGIN_LEFT + c * secColWidth + 4, y: y - 8.5, size: 5.8, font: fontRegular });
  }
  y -= 15;

  // =========================================================================
  // SECTION 6: GROUP ACCOUNT SUMMARY
  // =========================================================================
  drawSectionHeader('Group Account Summary');
  currentPage.drawText('Tip: Current Balance & Disbursed Amount is considered ONLY for ACTIVE accounts.', { x: MARGIN_LEFT, y: y - 1, size: 5.2, font: fontOblique, color: COLOR_TIP_BLUE });
  currentPage.drawText('Tip: All amounts are in INR.', { x: MARGIN_LEFT, y: y - 7, size: 5.2, font: fontOblique, color: COLOR_TIP_BLUE });
  y -= 10;

  // Group Header row (Height 20)
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 20, width: CONTENT_WIDTH, height: 20, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  const gDivs = [45, 90, 175, 235, 295, 370, 445];
  for (const div of gDivs) {
    currentPage.drawLine({ start: { x: MARGIN_LEFT + div, y: y }, end: { x: MARGIN_LEFT + div, y: y - 20 }, color: COLOR_BORDER, thickness: 0.5 });
  }
  currentPage.drawText('Number\nOf\nAccounts', { x: MARGIN_LEFT + 4, y: y - 7, size: 4.8, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('No Of MFI', { x: MARGIN_LEFT + 50, y: y - 11, size: 4.8, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Account Summary', { x: MARGIN_LEFT + 105, y: y - 11, size: 5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Disbursed\nAmount', { x: MARGIN_LEFT + 183, y: y - 8, size: 4.8, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Instalment\nAmount', { x: MARGIN_LEFT + 243, y: y - 8, size: 4.8, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Total Current\nBalance', { x: MARGIN_LEFT + 308, y: y - 8, size: 4.8, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Total Overdue\nAmount', { x: MARGIN_LEFT + 383, y: y - 8, size: 4.8, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Max Worst\nDelinquency', { x: MARGIN_LEFT + 465, y: y - 8, size: 4.8, font: fontBold, color: COLOR_NAVY_HEADER });
  y -= 20;

  // Sub-header (Own / Other)
  const gSubDivs = [45, 67.5, 90, 118, 146, 175, 205, 235, 265, 295, 332.5, 370, 407.5, 445, 490];
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 10, width: CONTENT_WIDTH, height: 10, color: rgb(0.94, 0.96, 0.99), borderColor: COLOR_BORDER, borderWidth: 0.5 });
  for (const div of gSubDivs) {
    currentPage.drawLine({ start: { x: MARGIN_LEFT + div, y: y }, end: { x: MARGIN_LEFT + div, y: y - 10 }, color: COLOR_BORDER, thickness: 0.5 });
  }
  currentPage.drawText('Own', { x: MARGIN_LEFT + 49, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Other', { x: MARGIN_LEFT + 70, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Active', { x: MARGIN_LEFT + 94, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Closed', { x: MARGIN_LEFT + 121, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Default', { x: MARGIN_LEFT + 149, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Own', { x: MARGIN_LEFT + 182, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Other', { x: MARGIN_LEFT + 210, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Own', { x: MARGIN_LEFT + 242, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Other', { x: MARGIN_LEFT + 270, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Own', { x: MARGIN_LEFT + 305, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Other', { x: MARGIN_LEFT + 342, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Own', { x: MARGIN_LEFT + 380, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Other', { x: MARGIN_LEFT + 417, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Own', { x: MARGIN_LEFT + 460, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawText('Other', { x: MARGIN_LEFT + 502, y: y - 7.5, size: 4.5, font: fontBold, color: COLOR_NAVY_HEADER });
  y -= 10;

  // Data row
  const grp = data.groupSummary || {
    numAccountsOwn: data.primarySummary.numAccounts,
    numAccountsOther: 0,
    noOfMfiOwn: 0,
    noOfMfiOther: 0,
    activeOwn: data.primarySummary.activeAccounts,
    activeOther: 0,
    closedOwn: (Number(data.primarySummary.numAccounts) - Number(data.primarySummary.activeAccounts)),
    closedOther: 0,
    defaultOwn: data.primarySummary.overdueAccounts,
    defaultOther: 0,
    disbursedOwn: data.primarySummary.totalDisbursedAmount,
    disbursedOther: 0,
    installmentOwn: 0,
    installmentOther: 0,
    currentBalanceOwn: data.primarySummary.totalCurrentBalance,
    currentBalanceOther: 0,
    overdueOwn: data.primarySummary.totalAmountOverdue,
    overdueOther: 0,
    maxWorstDelinqOwn: 0,
    maxWorstDelinqOther: 0
  };

  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 12, width: CONTENT_WIDTH, height: 12, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  for (const div of gSubDivs) {
    currentPage.drawLine({ start: { x: MARGIN_LEFT + div, y: y }, end: { x: MARGIN_LEFT + div, y: y - 12 }, color: COLOR_BORDER, thickness: 0.5 });
  }
  currentPage.drawText(`${grp.numAccountsOwn ?? 0}`, { x: MARGIN_LEFT + 15, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.noOfMfiOwn ?? 0}`, { x: MARGIN_LEFT + 51, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.noOfMfiOther ?? 0}`, { x: MARGIN_LEFT + 75, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.activeOwn ?? 0}`, { x: MARGIN_LEFT + 100, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.closedOwn ?? 0}`, { x: MARGIN_LEFT + 128, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.defaultOwn ?? 0}`, { x: MARGIN_LEFT + 157, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.disbursedOwn ?? 0}`, { x: MARGIN_LEFT + 179, y: y - 8.5, size: 5.2, font: fontRegular });
  currentPage.drawText(`${grp.disbursedOther ?? 0}`, { x: MARGIN_LEFT + 215, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.installmentOwn ?? 0}`, { x: MARGIN_LEFT + 240, y: y - 8.5, size: 5.2, font: fontRegular });
  currentPage.drawText(`${grp.installmentOther ?? 0}`, { x: MARGIN_LEFT + 275, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.currentBalanceOwn ?? 0}`, { x: MARGIN_LEFT + 298, y: y - 8.5, size: 5.2, font: fontRegular });
  currentPage.drawText(`${grp.currentBalanceOther ?? 0}`, { x: MARGIN_LEFT + 348, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.overdueOwn ?? 0}`, { x: MARGIN_LEFT + 385, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.overdueOther ?? 0}`, { x: MARGIN_LEFT + 423, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.maxWorstDelinqOwn ?? 0}`, { x: MARGIN_LEFT + 463, y: y - 8.5, size: 5.5, font: fontRegular });
  currentPage.drawText(`${grp.maxWorstDelinqOther ?? 0}`, { x: MARGIN_LEFT + 507, y: y - 8.5, size: 5.5, font: fontRegular });
  y -= 15;

  // =========================================================================
  // SECTION 7: ADDITIONAL SUMMARY
  // =========================================================================
  drawSectionHeader('Additional Summary');
  const addCols = ['NUM-GRANTORS', 'NUM-GRANTORS-ACTIVE', 'NUM-GRANTORS-DELINQ', 'NUM-GRANTORS-ONLY-PRIMARY', 'NUM-GRANTORS-ONLY-SECONDARY'];
  const addColWidth = CONTENT_WIDTH / 5;
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 12, width: CONTENT_WIDTH, height: 12, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  for (let c = 0; c < 5; c++) {
    if (c > 0) {
      currentPage.drawLine({ start: { x: MARGIN_LEFT + c * addColWidth, y: y }, end: { x: MARGIN_LEFT + c * addColWidth, y: y - 12 }, color: COLOR_BORDER, thickness: 0.5 });
    }
    currentPage.drawText(addCols[c], { x: MARGIN_LEFT + c * addColWidth + 4, y: y - 8.5, size: 5.5, font: fontBold, color: COLOR_NAVY_HEADER });
  }
  y -= 12;

  const addValues = [
    data.additionalSummary?.grantors ?? 0,
    data.additionalSummary?.grantorsActive ?? 0,
    data.additionalSummary?.grantorsDelinq ?? 0,
    data.additionalSummary?.grantorsOnlyPrimary ?? 0,
    data.additionalSummary?.grantorsOnlySecondary ?? 0
  ];

  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 10, width: CONTENT_WIDTH, height: 10, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  for (let c = 0; c < 5; c++) {
    if (c > 0) {
      currentPage.drawLine({ start: { x: MARGIN_LEFT + c * addColWidth, y: y }, end: { x: MARGIN_LEFT + c * addColWidth, y: y - 10 }, color: COLOR_BORDER, thickness: 0.5 });
    }
    currentPage.drawText(String(addValues[c] ?? 0), { x: MARGIN_LEFT + c * addColWidth + 30, y: y - 7.5, size: 5.5, font: fontRegular });
  }
  y -= 14;

  // =========================================================================
  // SECTION 8: PERFORM ATTRIBUTES
  // =========================================================================
  drawSectionHeader('Perform Attributes');
  const perfColWidth = CONTENT_WIDTH / 2;

  const perfItemsLeft = [
    `INQUIRIES -IN -LAST -SIX -MONTHS: ${data.performAttributes.inquiriesLast6Months ?? ''}`,
    `LENGTH -OF -CREDIT -HISTORY -MONTH: ${data.performAttributes.lengthCreditHistoryMonth ?? ''}`,
    `AVERAGE -ACCOUNT -AGE -MONTH: ${data.performAttributes.avgAccountAgeMonth ?? ''}`,
    `TOTAL -WRITTEN -OFF -ACCOUNTS: ${data.performAttributes.totalWrittenOffAccounts ?? ''}`
  ];
  const perfItemsRight = [
    `LENGTH -OF -CREDIT -HISTORY -YEAR: ${data.performAttributes.lengthCreditHistoryYear ?? ''}`,
    `AVERAGE -ACCOUNT -AGE -YEAR: ${data.performAttributes.avgAccountAgeYear ?? ''}`,
    `NEW -ACCOUNTS -IN -LAST -SIX -MONTHS: ${data.performAttributes.newAccountsLast6Months ?? ''}`,
    `TOTAL -WRITTEN -OFF -AMOUNT: ${data.performAttributes.totalWrittenOffAmount ?? ''}`
  ];

  let pY = y - 4;
  for (let r = 0; r < 4; r++) {
    currentPage.drawText(perfItemsLeft[r], { x: MARGIN_LEFT, y: pY, size: 6, font: fontBold });
    currentPage.drawText(perfItemsRight[r], { x: MARGIN_LEFT + perfColWidth, y: pY, size: 6, font: fontBold });
    pY -= 9;
  }
  y = pY - 2;

  // =========================================================================
  // SECTION 9: PERSONAL INFO VARIATIONS (PAGE 1: Name Variations ONLY)
  // =========================================================================
  drawSectionHeader('Personal Info Variations');
  currentPage.drawText("Tip: These are applicant's personal information variations as contributed by various financial institutions.", {
    x: MARGIN_LEFT,
    y: y - 1,
    size: 5.2,
    font: fontOblique,
    color: COLOR_TIP_BLUE
  });
  y -= 10;

  const varWidths = [190, 80, 80, 70, CONTENT_WIDTH - 420];

  // Name Variations (Last element on Page 1)
  const nameRows = data.variations.nameVariations.map(v => [v.name, v.firstReported, v.lastReported, v.type, v.source]);
  const finalNameRows = nameRows.length ? nameRows : [[cleanText(data.inquiryInput.name) || 'APPLICANT', data.header.dateOfIssue || '—', data.header.dateOfIssue || '—', '', '']];
  drawVariationSubTable('Name Variations', ['Name', 'First Reported', 'Last Reported', 'Type', 'Source Indicator'], finalNameRows, varWidths, false);

  // =========================================================================
  // PAGE 2: REMAINING VARIATIONS & ADDRESS VARIATIONS HEADER
  // =========================================================================
  startNewPage();

  // Email Variations
  const emailRows = data.variations.emailVariations.map(v => [v.email, v.firstReported, v.lastReported, v.type, v.source]);
  const finalEmailRows = emailRows.length ? emailRows : (cleanText(data.inquiryInput.email) ? [[cleanText(data.inquiryInput.email), data.header.dateOfIssue || '—', data.header.dateOfIssue || '—', '', '']] : []);
  if (finalEmailRows.length) {
    drawVariationSubTable('Email-ID Variations', ['Email', 'First Reported', 'Last Reported', 'Type', 'Source Indicator'], finalEmailRows, varWidths, false);
  }

  // DOB Variations
  const dobRows = data.variations.dobVariations.map(v => [v.dob, v.firstReported, v.lastReported, v.type, v.source]);
  const finalDobRows = dobRows.length ? dobRows : (cleanText(data.inquiryInput.dobAge) ? [[cleanText(data.inquiryInput.dobAge), data.header.dateOfIssue || '—', data.header.dateOfIssue || '—', '', '']] : []);
  if (finalDobRows.length) {
    drawVariationSubTable('DOB Variations', ['DOB', 'First Reported', 'Last Reported', 'Type', 'Source Indicator'], finalDobRows, varWidths, false);
  }

  // Phone Variations
  const phoneRows = data.variations.phoneVariations.map(v => [v.phone, v.firstReported, v.lastReported, v.type, v.source]);
  const finalPhoneRows = phoneRows.length ? phoneRows : (cleanText(data.inquiryInput.phone) ? [[cleanText(data.inquiryInput.phone), data.header.dateOfIssue || '—', data.header.dateOfIssue || '—', '', '']] : []);
  if (finalPhoneRows.length) {
    drawVariationSubTable('Phone Variations', ['Phone', 'First Reported', 'Last Reported', 'Type', 'Source Indicator'], finalPhoneRows, varWidths, false);
  }

  // ID Variations
  const idRows = data.variations.idVariations.map(v => [v.id, v.firstReported, v.lastReported, v.type, v.source]);
  const finalIdRows = idRows.length ? idRows : (cleanText(data.inquiryInput.idNumbers) ? [[cleanText(data.inquiryInput.idNumbers), data.header.dateOfIssue || '—', data.header.dateOfIssue || '—', 'PAN', '']] : []);
  if (finalIdRows.length) {
    drawVariationSubTable('ID Variations', ['ID', 'First Reported', 'Last Reported', 'Type', 'Source Indicator'], finalIdRows, varWidths, false);
  }

  // Address Variations (Section Banner at end of Page 2)
  drawSectionHeader('Address Variations');
  
  // =========================================================================
  // PAGE 3 & 4: ADDRESS VARIATIONS TABLE
  // =========================================================================
  startNewPage();
  const addrRows = data.variations.addressVariations.map(v => [v.address, v.firstReported, v.lastReported, v.type, v.source]);
  const finalAddrRows = addrRows.length ? addrRows : (cleanText(data.inquiryInput.currentAddress) ? [[cleanText(data.inquiryInput.currentAddress), data.header.dateOfIssue || '—', data.header.dateOfIssue || '—', '', '']] : []);
  if (finalAddrRows.length) {
    drawVariationSubTable('', ['Address', 'First Reported', 'Last Reported', 'Type', 'Source Indicator'], finalAddrRows, [230, 60, 60, 45, CONTENT_WIDTH - 395], true);
  }

  // Employment Details (Section Banner on Page 4 bottom)
  ensureSpace(28);
  drawSectionHeader('Employment Details');

  // =========================================================================
  // PAGE 5: EMPLOYMENT DETAILS TABLE & START OF ACCOUNTS
  // =========================================================================
  startNewPage();
  const empRows = data.variations.employmentVariations.map(v => [v.occupation, v.firstReported, v.lastReported, v.type, v.source]);
  const finalEmpRows = empRows.length ? empRows : [['Not Reported', '—', '—', '—', '']];
  drawVariationSubTable('', ['Occupation', 'First Reported', 'Last Reported', 'Type', 'Source Indicator'], finalEmpRows, [170, 75, 75, 90, CONTENT_WIDTH - 410], true);

  // =========================================================================
  // SECTION 10: ACCOUNT INFORMATION (TRADELINES)
  // =========================================================================
  if (data.accounts.length === 0) {
    ensureSpace(45);
    drawSectionHeader('Account Information');
    currentPage.drawRectangle({
      x: MARGIN_LEFT,
      y: y - 24,
      width: CONTENT_WIDTH,
      height: 24,
      color: COLOR_WHITE,
      borderColor: COLOR_BORDER,
      borderWidth: 0.5
    });
    currentPage.drawText('No credit account tradelines reported for this consumer.', {
      x: MARGIN_LEFT + 10,
      y: y - 15,
      size: 6.5,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3)
    });
    y -= 30;
  } else {
    for (let idx = 0; idx < data.accounts.length; idx++) {
      const acc = data.accounts[idx];
      const payRows = acc.paymentHistory && acc.paymentHistory.length ? acc.paymentHistory : [];
      const totalAccHeight = 14 + 14 + 66 + 6 + (payRows.length ? (9 + 9 + 10 + (payRows.length * 10) + 12) : 10);

      // Ensure whole account card fits on the page cleanly
      ensureSpace(totalAccHeight);

      // 0. Dark Navy Section Header for EVERY account card
      drawSectionHeader('Account Information');

      const isActive = acc.status === 'Active' || String(acc.status || '').toLowerCase().includes('active');

      // 1. Account Header Ribbon (Light Blue strip with dynamic item spacing)
      currentPage.drawRectangle({
        x: MARGIN_LEFT,
        y: y - 14,
        width: CONTENT_WIDTH,
        height: 14,
        color: COLOR_TH_BLUE,
        borderColor: COLOR_BORDER,
        borderWidth: 0.5
      });

      const acctTypeStr = `Account Type: ${cleanText(acc.accountType)}`;
      const grantorStr = `Credit Grantor: ${cleanText(acc.creditGrantor)}`;
      const acctNumStr = `Account #: ${cleanText(acc.accountNumber)}`;
      const lenderStr = `Lender Type #: ${cleanText(acc.lenderType || '—')}`;
      const asOnStr = `As on #: ${cleanText(acc.asOnDate || '—')}`;

      const wAcctType = fontBold.widthOfTextAtSize(acctTypeStr, 5.2);
      const wGrantor = fontBold.widthOfTextAtSize(grantorStr, 5.2);
      const wAcctNum = fontBold.widthOfTextAtSize(acctNumStr, 5.2);
      const wLender = fontBold.widthOfTextAtSize(lenderStr, 5.2);
      const wAsOn = fontBold.widthOfTextAtSize(asOnStr, 5.2);

      const xAcctType = MARGIN_LEFT + 4;
      let xGrantor = xAcctType + wAcctType + 8;
      let xAcctNum = xGrantor + wGrantor + 8;
      let xLender = xAcctNum + wAcctNum + 8;
      let xAsOn = xLender + wLender + 8;

      if (xAsOn + wAsOn > MARGIN_LEFT + CONTENT_WIDTH - 2) {
        xAsOn = MARGIN_LEFT + CONTENT_WIDTH - wAsOn - 3;
        xLender = xAsOn - wLender - 6;
        if (xAcctNum + wAcctNum > xLender - 4) {
          xAcctNum = xLender - wAcctNum - 4;
        }
        if (xGrantor + wGrantor > xAcctNum - 4) {
          xGrantor = xAcctType + wAcctType + 4;
        }
      }

      currentPage.drawText(acctTypeStr, { x: xAcctType, y: y - 10, size: 5.2, font: fontBold, color: COLOR_NAVY_HEADER });
      currentPage.drawText(grantorStr, { x: xGrantor, y: y - 10, size: 5.2, font: fontBold, color: COLOR_NAVY_HEADER });
      currentPage.drawText(acctNumStr, { x: xAcctNum, y: y - 10, size: 5.2, font: fontBold, color: COLOR_NAVY_HEADER });
      currentPage.drawText(lenderStr, { x: xLender, y: y - 10, size: 5.2, font: fontBold, color: COLOR_NAVY_HEADER });
      currentPage.drawText(asOnStr, { x: xAsOn, y: y - 10, size: 5.2, font: fontBold, color: COLOR_NAVY_HEADER });
      y -= 14;

      // 2. Account Details Box (with Left Vertical Active/Closed Badge)
      const cardBodyH = 66;
      currentPage.drawRectangle({
        x: MARGIN_LEFT,
        y: y - cardBodyH,
        width: CONTENT_WIDTH,
        height: cardBodyH,
        color: COLOR_WHITE,
        borderColor: COLOR_BORDER,
        borderWidth: 0.5
      });

      // Vertical Status Badge on Left Edge
      const badgeW = 18;
      currentPage.drawRectangle({
        x: MARGIN_LEFT + 0.5,
        y: y - cardBodyH + 0.5,
        width: badgeW,
        height: cardBodyH - 1,
        color: isActive ? COLOR_ACTIVE_BG : COLOR_CLOSED_BG,
        borderColor: isActive ? COLOR_ACTIVE_BORDER : COLOR_CLOSED_BORDER,
        borderWidth: 0.5
      });

      // Vertical text inside badge (top-to-bottom reading orientation with rotate: degrees(-90))
      const statusText = isActive ? 'Active' : 'Closed';
      const textLen = fontBold.widthOfTextAtSize(statusText, 6.5);
      const startY = y - (cardBodyH - textLen) / 2;
      currentPage.drawText(statusText, {
        x: MARGIN_LEFT + 12,
        y: startY,
        size: 6.5,
        font: fontBold,
        color: isActive ? COLOR_ACTIVE_TEXT : COLOR_CLOSED_TEXT,
        rotate: degrees(-90)
      });

      // 3-Column Attributes Grid (7 rows, 9.2 pt line-height)
      const aCol1 = MARGIN_LEFT + badgeW + 8;
      const aCol2 = MARGIN_LEFT + badgeW + 145;
      const aCol3 = MARGIN_LEFT + badgeW + 290;
      let aRowY = y - 9.5;

      // Row 1
      currentPage.drawText(`Ownership: ${cleanText(acc.ownership || 'Individual')}`, { x: aCol1, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(`Disbursed Date: ${cleanText(acc.disbursedDate)}`, { x: aCol2, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText('Disbd Amt/High Credit: ', { x: aCol3, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(formatAmount(acc.disbursedHighCredit), { x: aCol3 + 70, y: aRowY, size: 5.5, font: fontBold });
      aRowY -= 9.2;

      // Row 2
      currentPage.drawText(`Credit Limit: ${cleanText(acc.creditLimit)}`, { x: aCol1, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(`Last Payment Date: ${cleanText(acc.lastPaymentDate)}`, { x: aCol2, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText('Current Balance: ', { x: aCol3, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(formatAmount(acc.currentBalance), { x: aCol3 + 55, y: aRowY, size: 5.5, font: fontBold });
      aRowY -= 9.2;

      // Row 3
      currentPage.drawText(`Cash Limit: ${cleanText(acc.cashLimit)}`, { x: aCol1, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(`Closed Date: ${cleanText(acc.closedDate)}`, { x: aCol2, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(`Last Paid Amt: ${formatAmount(acc.lastPaidAmt)}`, { x: aCol3, y: aRowY, size: 5.5, font: fontRegular });
      aRowY -= 9.2;

      // Row 4
      currentPage.drawText(`InstlAmt/Freq: ${cleanText(acc.instlAmtFreq)}`, { x: aCol1, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(`Tenure(month): ${cleanText(acc.tenureMonths || '0')}`, { x: aCol2, y: aRowY, size: 5.5, font: fontRegular });
      const ovdStr = cleanText(acc.overdueAmt);
      const ovdNum = Number(String(ovdStr).replace(/,/g, ''));
      currentPage.drawText('Overdue Amt: ', { x: aCol3, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(formatAmount(acc.overdueAmt) || '0', {
        x: aCol3 + 45,
        y: aRowY,
        size: 5.5,
        font: fontBold,
        color: ovdNum > 0 ? rgb(0.8, 0, 0) : COLOR_TEXT_DARK
      });
      aRowY -= 9.2;

      // Row 5
      currentPage.drawText(`Write off Date: ${cleanText(acc.writeOffDate)}`, { x: aCol1, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(`Account in Dispute: ${cleanText(acc.accountInDispute)}`, { x: aCol2, y: aRowY, size: 5.5, font: fontRegular });
      aRowY -= 9.2;

      // Row 6
      currentPage.drawText(`Account Remarks: ${cleanText(acc.accountRemarks)}`, { x: aCol1, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(`Principal Writeoff Amt: ${cleanText(acc.principalWriteoffAmt)}`, { x: aCol2, y: aRowY, size: 5.5, font: fontRegular });
      aRowY -= 9.2;

      // Row 7
      currentPage.drawText(`Settlement Amt: ${cleanText(acc.settlementAmt)}`, { x: aCol1, y: aRowY, size: 5.5, font: fontRegular });
      currentPage.drawText(`Total Writeoff Amt: ${cleanText(acc.totalWriteoffAmt || '0')}`, { x: aCol2, y: aRowY, size: 5.5, font: fontRegular });

      y -= (cardBodyH + 6);

      // 3. Payment History / Asset Classification Table (if available)
      if (payRows.length > 0) {
        currentPage.drawText('Payment History/Asset Classification:', { x: MARGIN_LEFT, y: y - 1, size: 6.5, font: fontBold, color: COLOR_NAVY_HEADER });
        y -= 9;
        currentPage.drawText('Amount Paid History:', { x: MARGIN_LEFT, y: y - 1, size: 6, font: fontOblique, color: rgb(0.25, 0.25, 0.25) });
        y -= 9;

        const monthHeaders = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const pColW = (CONTENT_WIDTH - 45) / 12;

        // Table Header
        currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 10, width: CONTENT_WIDTH, height: 10, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
        currentPage.drawLine({ start: { x: MARGIN_LEFT + 45, y: y }, end: { x: MARGIN_LEFT + 45, y: y - 10 }, color: COLOR_BORDER, thickness: 0.5 });

        for (let m = 0; m < 12; m++) {
          currentPage.drawLine({ start: { x: MARGIN_LEFT + 45 + (m + 1) * pColW, y: y }, end: { x: MARGIN_LEFT + 45 + (m + 1) * pColW, y: y - 10 }, color: COLOR_BORDER, thickness: 0.5 });
          currentPage.drawText(monthHeaders[m], { x: MARGIN_LEFT + 45 + m * pColW + 8, y: y - 7.5, size: 5.2, font: fontBold, color: COLOR_NAVY_HEADER });
        }
        y -= 10;

        // History Rows for each reported year
        for (const pRow of payRows) {
          currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 10, width: CONTENT_WIDTH, height: 10, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
          currentPage.drawText(pRow.year || '', { x: MARGIN_LEFT + 4, y: y - 7.5, size: 5.5, font: fontBold });

          currentPage.drawLine({ start: { x: MARGIN_LEFT + 45, y: y }, end: { x: MARGIN_LEFT + 45, y: y - 10 }, color: COLOR_BORDER, thickness: 0.5 });

          for (let m = 0; m < 12; m++) {
            currentPage.drawLine({ start: { x: MARGIN_LEFT + 45 + (m + 1) * pColW, y: y }, end: { x: MARGIN_LEFT + 45 + (m + 1) * pColW, y: y - 10 }, color: COLOR_BORDER, thickness: 0.5 });
            const mKey = monthHeaders[m];
            const val = pRow.months?.[mKey] || '';
            if (val) {
              const isDpdBad = val !== '000' && val !== 'STD' && val !== '0';
              currentPage.drawText(val, {
                x: MARGIN_LEFT + 45 + m * pColW + 6,
                y: y - 7.5,
                size: 5.2,
                font: isDpdBad ? fontBold : fontRegular,
                color: isDpdBad ? rgb(0.8, 0, 0) : rgb(0.1, 0.1, 0.1)
              });
            }
          }
          y -= 10;
        }
      }
      y -= 12;
    }
  }

  // =========================================================================
  // SECTION 11: INQUIRIES (PAST 24 MONTHS)
  // =========================================================================
  ensureSpace(70);
  drawSectionHeader('Inquiries ( past 24 months)');
  const inqWidths = [150, 60, 80, 90, 70, CONTENT_WIDTH - 450];
  const inqHeaders = ['Credit Grantor', 'Type', 'Date of Inquiry', 'Account Type', 'Amount', 'Remark'];

  // Inquiries Header
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 11, width: CONTENT_WIDTH, height: 11, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  let inqCurrX = MARGIN_LEFT;
  for (let h = 0; h < inqHeaders.length; h++) {
    if (h > 0) {
      currentPage.drawLine({ start: { x: inqCurrX, y: y }, end: { x: inqCurrX, y: y - 11 }, color: COLOR_BORDER, thickness: 0.5 });
    }
    currentPage.drawText(inqHeaders[h], { x: inqCurrX + 4, y: y - 8, size: 5.5, font: fontBold, color: COLOR_NAVY_HEADER });
    inqCurrX += inqWidths[h];
  }
  y -= 11;

  if (data.inquiries.length === 0) {
    currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 10, width: CONTENT_WIDTH, height: 10, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
    currentPage.drawText('No inquiries reported in the past 24 months.', { x: MARGIN_LEFT + 6, y: y - 7.5, size: 5.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
    y -= 10;
  } else {
    for (const inq of data.inquiries) {
      ensureSpace(12);
      currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 10, width: CONTENT_WIDTH, height: 10, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });

      let cellX = MARGIN_LEFT;
      const rowVals = [inq.creditGrantor, inq.type, inq.dateOfInquiry, inq.accountType, inq.amount, inq.remark || '—'];
      for (let c = 0; c < rowVals.length; c++) {
        if (c > 0) {
          currentPage.drawLine({ start: { x: cellX, y: y }, end: { x: cellX, y: y - 10 }, color: COLOR_BORDER, thickness: 0.5 });
        }
        let textVal = String(rowVals[c] || '—');
        let textSize = 5.5;
        const maxColW = inqWidths[c] - 6;
        let textW = fontRegular.widthOfTextAtSize(textVal, textSize);
        if (textW > maxColW) {
          textSize = 4.8;
          textW = fontRegular.widthOfTextAtSize(textVal, textSize);
          if (textW > maxColW) {
            textVal = textVal.slice(0, 28) + '...';
          }
        }
        currentPage.drawText(textVal, { x: cellX + 3, y: y - 7.5, size: textSize, font: fontRegular });
        cellX += inqWidths[c];
      }
      y -= 10;
    }
  }
  y -= 14;

  // =========================================================================
  // SECTION 12: -END OF REPORT- & APPENDIX
  // =========================================================================
  ensureSpace(135);
  currentPage.drawText('-END OF REPORT-', { x: PAGE_WIDTH / 2 - 35, y: y - 1, size: 6.5, font: fontBold, color: rgb(0.04, 0.22, 0.38) });
  y -= 12;

  drawSectionHeader('Appendix');
  currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 11, width: CONTENT_WIDTH, height: 11, color: COLOR_TH_BLUE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
  currentPage.drawText('Section', { x: MARGIN_LEFT + 4, y: y - 8, size: 5.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawLine({ start: { x: MARGIN_LEFT + 140, y: y }, end: { x: MARGIN_LEFT + 140, y: y - 11 }, color: COLOR_BORDER, thickness: 0.5 });
  currentPage.drawText('Code', { x: MARGIN_LEFT + 144, y: y - 8, size: 5.5, font: fontBold, color: COLOR_NAVY_HEADER });
  currentPage.drawLine({ start: { x: MARGIN_LEFT + 250, y: y }, end: { x: MARGIN_LEFT + 250, y: y - 11 }, color: COLOR_BORDER, thickness: 0.5 });
  currentPage.drawText('Description', { x: MARGIN_LEFT + 254, y: y - 8, size: 5.5, font: fontBold, color: COLOR_NAVY_HEADER });
  y -= 11;

  const appRows = [
    ['Account Summary', 'Number of Delinquent Accounts', 'Indicates number of accounts that the applicant has defaulted on within the last 6 months'],
    ['Account Information - Credit Grantor', 'XXXX', 'Name of grantor undisclosed as credit grantor is different from inquiring institution'],
    ['Payment History / Asset Classification', 'STD', 'Account Reported as STANDARD Asset'],
    ['Payment History / Asset Classification', 'XXX', 'Data not reported by institution']
  ];

  for (const ar of appRows) {
    ensureSpace(12);
    currentPage.drawRectangle({ x: MARGIN_LEFT, y: y - 10, width: CONTENT_WIDTH, height: 10, color: COLOR_WHITE, borderColor: COLOR_BORDER, borderWidth: 0.5 });
    currentPage.drawText(ar[0], { x: MARGIN_LEFT + 4, y: y - 7.5, size: 5.2, font: fontRegular });
    currentPage.drawLine({ start: { x: MARGIN_LEFT + 140, y: y }, end: { x: MARGIN_LEFT + 140, y: y - 10 }, color: COLOR_BORDER, thickness: 0.5 });
    currentPage.drawText(ar[1], { x: MARGIN_LEFT + 144, y: y - 7.5, size: 5.2, font: fontRegular });
    currentPage.drawLine({ start: { x: MARGIN_LEFT + 250, y: y }, end: { x: MARGIN_LEFT + 250, y: y - 10 }, color: COLOR_BORDER, thickness: 0.5 });
    currentPage.drawText(ar[2], { x: MARGIN_LEFT + 254, y: y - 7.5, size: 5.2, font: fontRegular });
    y -= 10;
  }
  y -= 18;

  // Disclaimer and Copyright Footer
  ensureSpace(45);
  const disclaimerL1 = 'Disclaimer: This document is prepared based on the data submitted by member institutions of CRIF High Mark Credit Information Services Private Limited (CRIF High Mark). No alterations are made to the data submitted';
  const disclaimerL2 = 'by member institutions and the same is up to date as well as accurate to the best of its knowledge. By using data contained in this document, the user acknowledges that CRIF High Mark is not responsible for';
  const disclaimerL3 = 'errors/omissions resulting from submission of erroneous data from Members to CRIF High Mark. This document may not be used or disclosed to others, except with the written permission of CRIF High Mark. Any paper';
  const disclaimerL4 = 'copy of this document will be considered uncontrolled. If you are not the intended recipient, you are not authorized to read, print, retain, copy, disseminate, distribute or use this information or any part thereof.';
  const disclaimerL5 = 'PERFORM score provided in this document is joint work of CRIF SPA (Italy) and CRIF High Mark (India). For any assistance on this report, reach out to us at: customerservice@crifhighmark.com';
  const copyrightL = 'Copyrights reserved (c) 2021 CRIF High Mark Credit Information Services Pvt Ltd';

  currentPage.drawText(disclaimerL1, { x: MARGIN_LEFT, y: y - 2, size: 4.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  currentPage.drawText(disclaimerL2, { x: MARGIN_LEFT, y: y - 8, size: 4.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  currentPage.drawText(disclaimerL3, { x: MARGIN_LEFT, y: y - 14, size: 4.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  currentPage.drawText(disclaimerL4, { x: MARGIN_LEFT, y: y - 20, size: 4.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  currentPage.drawText(disclaimerL5, { x: MARGIN_LEFT, y: y - 26, size: 4.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
  currentPage.drawText(copyrightL, { x: PAGE_WIDTH / 2 - 110, y: y - 36, size: 5.5, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Universal dynamic parser for any CRIF High Mark API response
 */
export function extractCrifFromApiResponse(apiResponse, inputParams = {}) {
  let resp = apiResponse;
  if (typeof resp === 'string') {
    try { resp = JSON.parse(resp); } catch (_) {}
  }

  const resultJson = resp?.data?.result_json || resp?.result_json || resp?.data || resp || {};
  const b2c = resultJson?.parsed_data?.['B2C-REPORT'] || resultJson?.['B2C-REPORT'] || {};
  const reportData = b2c?.['REPORT-DATA'] || {};
  const stdData = reportData?.['STANDARD-DATA'] || {};
  const accSummary = reportData?.['ACCOUNTS-SUMMARY'] || {};
  const priSummary = accSummary?.['PRIMARY-ACCOUNTS-SUMMARY'] || accSummary?.['PRIMARY-ACCOUNT-SUMMARY'] || {};
  const secSummary = accSummary?.['SECONDARY-ACCOUNTS-SUMMARY'] || accSummary?.['SECONDARY-ACCOUNT-SUMMARY'] || {};
  const mfiSummary = accSummary?.['MFI-GROUP-ACCOUNTS-SUMMARY'] || accSummary?.['GROUP-ACCOUNTS-SUMMARY'] || {};
  const addlMap = parseKeyValueMap(accSummary?.['ADDITIONAL-SUMMARY'] || reportData?.['ADDITIONAL-SUMMARY'] || stdData?.['ADDITIONAL-SUMMARY']);
  const perfMap = parseKeyValueMap(accSummary?.['PERFORM-ATTRIBUTES'] || reportData?.['PERFORM-ATTRIBUTES'] || stdData?.['PERFORM-ATTRIBUTES']);
  const demogs = stdData?.['DEMOGS'] || {};
  const header = b2c?.['HEADER-SEGMENT'] || {};
  const reqData = b2c?.['REQUEST-DATA'] || {};
  const appSegment = reqData?.['APPLICANT-SEGMENT'] || {};

  // Score
  let scoreVal = null;
  let scoreName = 'PERFORM CONSUMER 2.2';
  let scoringFactors = [];
  const scoreArr = stdData?.['SCORE'];
  if (Array.isArray(scoreArr) && scoreArr.length > 0) {
    scoreVal = scoreArr[0]?.['VALUE'] ?? scoreArr[0]?.value ?? scoreArr[0]?.['SCORE-VALUE'] ?? null;
    scoreName = scoreArr[0]?.['NAME'] || scoreName;
    if (Array.isArray(scoreArr[0]?.FACTORS)) {
      scoringFactors = scoreArr[0].FACTORS.map(f => f?.TYPE || f?.type || f?.CODE || '').filter(Boolean);
    }
  } else if (scoreArr && typeof scoreArr === 'object') {
    scoreVal = scoreArr?.['VALUE'] ?? scoreArr?.value ?? scoreArr?.['SCORE-VALUE'] ?? null;
    scoreName = scoreArr?.['NAME'] || scoreName;
    if (Array.isArray(scoreArr?.FACTORS)) {
      scoringFactors = scoreArr.FACTORS.map(f => f?.TYPE || f?.type || f?.CODE || '').filter(Boolean);
    }
  }

  // Parse Variations from DEMOGS.VARIATIONS
  const nameVariations = [];
  const emailVariations = [];
  const dobVariations = [];
  const phoneVariations = [];
  const idVariations = [];
  const addressVariations = [];

  const rawVars = demogs?.['VARIATIONS'] || [];
  if (Array.isArray(rawVars)) {
    for (const vGroup of rawVars) {
      const type = String(vGroup?.TYPE || '').toUpperCase();
      const items = Array.isArray(vGroup?.VARIATION) ? vGroup.VARIATION : (vGroup?.VARIATION ? [vGroup.VARIATION] : []);
      for (const item of items) {
        const val = cleanText(item?.VALUE);
        if (!val) continue;
        const firstRep = item?.['FIRST-REPORTED-DT'] || item?.['REPORTED-DT'] || '';
        const lastRep = item?.['REPORTED-DT'] || item?.['LAST-REPORTED-DT'] || firstRep;
        const assocType = item?.['LOAN-TYPE-ASSOC'] || '';
        const src = item?.['SOURCE-INDICATOR'] || '';

        if (type.includes('NAME')) {
          nameVariations.push({ name: val, firstReported: firstRep, lastReported: lastRep, type: assocType, source: src });
        } else if (type.includes('EMAIL')) {
          emailVariations.push({ email: val, firstReported: firstRep, lastReported: lastRep, type: assocType, source: src });
        } else if (type.includes('DOB')) {
          dobVariations.push({ dob: formatDob(val), firstReported: firstRep, lastReported: lastRep, type: assocType, source: src });
        } else if (type.includes('PHONE') || type.includes('MOBILE')) {
          phoneVariations.push({ phone: val, firstReported: firstRep, lastReported: lastRep, type: assocType, source: src });
        } else if (type.includes('PAN') || type.includes('ID') || type.includes('VOTER')) {
          idVariations.push({ id: val, firstReported: firstRep, lastReported: lastRep, type: type.includes('PAN') ? 'PAN' : (type.includes('VOTER') ? 'VOTER ID' : assocType), source: src });
        } else if (type.includes('ADDRESS')) {
          addressVariations.push({ address: val, firstReported: firstRep, lastReported: lastRep, type: assocType, source: src });
        }
      }
    }
  }

  // Parse Employment Details
  const rawEmp = stdData?.['EMPLOYMENT-DETAILS'] || [];
  const employmentVariations = [];
  if (Array.isArray(rawEmp)) {
    for (const empItem of rawEmp) {
      const ed = empItem?.['EMPLOYMENT-DETAIL'] || empItem;
      const occ = cleanText(ed?.['OCCUPATION'] || ed?.occupation);
      if (occ) {
        employmentVariations.push({
          occupation: occ,
          firstReported: ed?.['FIRST-REPORTED-DT'] || '',
          lastReported: ed?.['LAST-REPORTED-DT'] || ed?.['REPORTED-DT'] || '',
          type: ed?.['ACCT-TYPE'] || ed?.['ACCOUNT-TYPE'] || '',
          source: ed?.['SOURCE-INDICATOR'] || ''
        });
      }
    }
  }

  const dateOfIssue = header?.['DATE-OF-ISSUE'] || header?.['REPORT-DATE'] || new Date().toLocaleDateString('en-GB').replace(/\//g, '-');

  // Parse Tradelines
  let rawTrades = stdData?.['TRADELINES'] || reportData?.['TRADELINES'] || [];
  if (rawTrades && !Array.isArray(rawTrades) && typeof rawTrades === 'object') {
    rawTrades = [rawTrades];
  }

  const accounts = (Array.isArray(rawTrades) ? rawTrades : []).map(t => {
    const statusStr = String(t?.['ACCOUNT-STATUS'] || t?.account_status || t?.status || '').toLowerCase();
    const isClosed = Boolean(t?.['CLOSED-DT'] || t?.closed_date || t?.['CLOSED-DATE']) || statusStr.includes('closed') || statusStr.includes('settled') || statusStr.includes('written off');

    // Parse Payment History
    const historyArr = t?.['HISTORY'] || [];
    const combHistory = Array.isArray(historyArr) ? historyArr.find(h => h.NAME === 'COMBINED-PAYMENT-HISTORY' || h.name === 'COMBINED-PAYMENT-HISTORY') : null;
    let paymentHistory = [];

    if (combHistory && combHistory.DATES && combHistory.VALUES) {
      const dates = String(combHistory.DATES).split('|').filter(Boolean);
      const values = String(combHistory.VALUES).split('|').filter(Boolean);
      const yearMap = {};

      for (let i = 0; i < dates.length; i++) {
        const dParts = dates[i].split(':'); // e.g. "Oct:2024"
        if (dParts.length === 2) {
          const month = dParts[0].trim();
          const yr = dParts[1].trim();
          const val = (values[i] || '000').split('/')[0].trim();
          if (!yearMap[yr]) yearMap[yr] = {};
          yearMap[yr][month] = val;
        }
      }

      paymentHistory = Object.keys(yearMap).sort().reverse().map(yr => ({
        year: yr,
        months: yearMap[yr]
      }));
    }

    return {
      accountType: t?.['ACCT-TYPE'] || t?.['ACCOUNT-TYPE'] || 'Other',
      creditGrantor: t?.['CREDIT-GRANTOR'] || t?.['SUBSCRIBER-NAME'] || t?.['MEMBER-NAME'] || '',
      accountNumber: t?.['ACCT-NUMBER'] || t?.['ACCOUNT-NUMBER'] || '—',
      lenderType: t?.['CREDIT-GRANTOR-TYPE'] || t?.['LENDER-TYPE'] || t?.['SUBSCRIBER-TYPE'] || '',
      asOnDate: t?.['REPORTED-DT'] || t?.['DATE-REPORTED'] || dateOfIssue,
      ownership: t?.['OWNERSHIP-TYPE'] || t?.['OWNERSHIP-IND'] || 'Individual',
      creditLimit: t?.['CREDIT-LIMIT'] || '',
      cashLimit: t?.['CASH-LIMIT'] || '',
      instlAmtFreq: t?.['INSTALLMENT-AMT'] || t?.['INSTALLMENT-AMOUNT'] || '',
      writeOffDate: t?.['WRITE-OFF-DT'] || t?.['WRITTEN-OFF-DATE'] || '',
      accountRemarks: t?.['ACCOUNT-REMARKS'] || t?.['REMARKS'] || '',
      settlementAmt: t?.['SETTLEMENT-AMT'] || t?.['SETTLEMENT-AMOUNT'] || '',
      disbursedDate: t?.['DISBURSED-DT'] || t?.['DISBURSED-DATE'] || t?.['OPEN-DATE'] || '',
      lastPaymentDate: t?.['LAST-PAYMENT-DT'] || t?.['LAST-PAYMENT-DATE'] || '',
      closedDate: t?.['CLOSED-DT'] || t?.['CLOSED-DATE'] || '',
      tenureMonths: String(t?.['REPAYMENT-TENURE'] || t?.['TERM-TO-MATURITY'] || t?.['TENURE'] || ''),
      accountInDispute: t?.['ACCT-IN-DISPUTE'] || t?.['DISPUTE-STATUS'] || '',
      principalWriteoffAmt: t?.['PRINCIPAL-WRITE-OFF-AMT'] || '',
      totalWriteoffAmt: t?.['WRITE-OFF-AMT'] || t?.['TOTAL-WRITE-OFF-AMT'] || '',
      disbursedHighCredit: t?.['DISBURSED-AMT'] || t?.['HIGH-CREDIT'] || t?.['HIGH-CREDIT-AMOUNT'] || t?.['SANCTIONED-AMT'] || '0',
      currentBalance: t?.['CURRENT-BAL'] || t?.['CURRENT-BALANCE'] || '0',
      lastPaidAmt: t?.['LAST-PAID-AMOUNT'] || t?.['LAST-PAYMENT-AMOUNT'] || '',
      overdueAmt: t?.['OVERDUE-AMT'] || t?.['AMOUNT-OVERDUE'] || '0',
      status: isClosed ? 'Closed' : 'Active',
      paymentHistory
    };
  });

  // Parse Inquiries
  const rawInqs = stdData?.['INQUIRY-HISTORY'] || reportData?.['INQUIRY-HISTORY'] || [];
  const inquiries = (Array.isArray(rawInqs) ? rawInqs : []).map(inq => ({
    creditGrantor: inq?.['LENDER-NAME'] || inq?.['SUBSCRIBER-NAME'] || inq?.['MEMBER-NAME'] || inq?.['CREDIT-GRANTOR'] || '',
    type: inq?.['LENDER-TYPE'] || inq?.['SUBSCRIBER-TYPE'] || inq?.['MEMBER-TYPE'] || '',
    dateOfInquiry: inq?.['INQUIRY-DT'] || inq?.['DATE-OF-INQUIRY'] || inq?.['INQUIRY-DATE'] || inq?.['DATE'] || '',
    accountType: inq?.['CREDIT-INQ-PURPS-TYPE'] || inq?.['PURPOSE'] || inq?.['ACCOUNT-TYPE'] || inq?.['LOAN-TYPE'] || inq?.['ACCT-TYPE'] || '',
    amount: formatAmount(inq?.['AMOUNT'] || inq?.['INQUIRY-AMOUNT'] || '0'),
    remark: inq?.['REMARK'] || inq?.['REMARKS'] || '—'
  }));

  // Dynamic calculations from accounts array
  const activeAccountsCount = accounts.filter(a => a.status === 'Active').length;
  const overdueAccountsCount = accounts.filter(a => Number(String(a.overdueAmt).replace(/,/g, '')) > 0).length;
  const securedAccountsCount = accounts.filter(a => isSecuredAccount(a.accountType)).length;
  const unsecuredAccountsCount = accounts.length - securedAccountsCount;

  const totalCurrentBalanceCalc = accounts.filter(a => a.status === 'Active').reduce((acc, a) => acc + (Number(String(a.currentBalance).replace(/,/g, '')) || 0), 0);
  const currentBalSecuredCalc = accounts.filter(a => a.status === 'Active' && isSecuredAccount(a.accountType)).reduce((acc, a) => acc + (Number(String(a.currentBalance).replace(/,/g, '')) || 0), 0);
  const currentBalUnsecuredCalc = accounts.filter(a => a.status === 'Active' && !isSecuredAccount(a.accountType)).reduce((acc, a) => acc + (Number(String(a.currentBalance).replace(/,/g, '')) || 0), 0);
  const totalDisbursedCalc = accounts.filter(a => a.status === 'Active').reduce((acc, a) => acc + (Number(String(a.disbursedHighCredit).replace(/,/g, '')) || 0), 0);
  const totalSanctionedCalc = accounts.reduce((acc, a) => acc + (Number(String(a.creditLimit || a.disbursedHighCredit).replace(/,/g, '')) || 0), 0);
  const totalOverdueCalc = accounts.reduce((acc, a) => acc + (Number(String(a.overdueAmt).replace(/,/g, '')) || 0), 0);
  const totalInstallmentCalc = accounts.filter(a => a.status === 'Active').reduce((acc, a) => acc + (Number(String(a.instlAmtFreq).replace(/,/g, '')) || 0), 0);

  // Dynamic Unique Grantors
  const uniqueGrantors = new Set(accounts.map(a => a.creditGrantor).filter(Boolean));
  const uniqueActiveGrantors = new Set(accounts.filter(a => a.status === 'Active').map(a => a.creditGrantor).filter(Boolean));
  const uniqueDelinqGrantors = new Set(accounts.filter(a => Number(String(a.overdueAmt).replace(/,/g, '')) > 0).map(a => a.creditGrantor).filter(Boolean));

  // Dynamic Perform Attributes Calculation
  const writtenOffAccountsCount = accounts.filter(a => Boolean(a.writeOffDate) || Number(String(a.totalWriteoffAmt).replace(/,/g, '')) > 0 || Number(String(a.principalWriteoffAmt).replace(/,/g, '')) > 0).length;
  const writtenOffAmountTotal = accounts.reduce((acc, a) => acc + (Number(String(a.totalWriteoffAmt || a.principalWriteoffAmt).replace(/,/g, '')) || 0), 0);

  // Inquiries in last 6 months
  const inquiriesLast6m = inquiries.length || (perfMap['INQUIRIES-IN-LAST-SIX-MONTHS'] ? Number(perfMap['INQUIRIES-IN-LAST-SIX-MONTHS']) : 0);

  // Credit history age and account age
  let oldestDate = null;
  let totalMonths = 0;
  let countedAccounts = 0;
  const reportDateObj = new Date();

  for (const a of accounts) {
    if (a.disbursedDate) {
      const parts = a.disbursedDate.split(/[-/]/);
      let d = null;
      if (parts.length === 3) {
        if (parts[0].length === 4) d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        else d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
      if (d && !isNaN(d.getTime())) {
        if (!oldestDate || d < oldestDate) oldestDate = d;
        const diffMonths = Math.max(0, (reportDateObj.getFullYear() - d.getFullYear()) * 12 + (reportDateObj.getMonth() - d.getMonth()));
        totalMonths += diffMonths;
        countedAccounts++;
      }
    }
  }

  let creditHistYears = 0;
  let creditHistMonths = 0;
  if (oldestDate) {
    const diff = Math.max(0, (reportDateObj.getFullYear() - oldestDate.getFullYear()) * 12 + (reportDateObj.getMonth() - oldestDate.getMonth()));
    creditHistYears = Math.floor(diff / 12);
    creditHistMonths = diff % 12;
  }

  const avgAgeMonths = countedAccounts > 0 ? Math.round(totalMonths / countedAccounts) : 0;
  const avgAgeYears = Math.floor(avgAgeMonths / 12);
  const avgAgeRemainingMonths = avgAgeMonths % 12;

  // Parse Trends
  const rawTrends = reportData?.['TRENDS'] || reportData?.['SCORE-TREND'] || stdData?.['SCORE-TREND'] || stdData?.['TRENDS'];
  let trendDates = [];
  let trendScores = [];

  if (rawTrends && rawTrends.DATES && rawTrends.VALUES) {
    const dList = String(rawTrends.DATES).split('|').map(s => s.trim()).filter(Boolean);
    const vList = String(rawTrends.VALUES).split('|').map(s => s.trim());
    for (let i = 0; i < Math.min(dList.length, 12); i++) {
      const dStr = dList[i];
      const parts = dStr.split('-');
      if (parts.length === 3) {
        trendDates.push(`${parts[0]}-${parts[1]}-\n${parts[2]}`);
      } else {
        trendDates.push(dStr);
      }
      const val = vList[i];
      trendScores.push(val && val !== 'No Hit' ? val : '—');
    }
  }

  if (trendDates.length === 0) {
    trendDates = generateRetroQuarters(dateOfIssue);
    trendScores = Array(12).fill('—');
  }

  // Inquiry Input Demographics
  const applicantName = inputParams.fullName || inputParams.name || (appSegment['FIRST-NAME'] ? `${appSegment['FIRST-NAME']} ${appSegment['MIDDLE-NAME'] || ''} ${appSegment['LAST-NAME'] || ''}`.replace(/\s+/g, ' ').trim() : '') || (nameVariations[0]?.name) || demogs?.['NAME'] || 'APPLICANT';
  const applicantPhone = inputParams.mobileNumber || inputParams.mobile || (appSegment['PHONES']?.[0]?.VALUE) || (phoneVariations[0]?.phone) || demogs?.['PHONE'] || '';
  const applicantDob = formatDob(inputParams.dob || (dobVariations[0]?.dob) || demogs?.['DOB']);
  const applicantPan = inputParams.panNumber || inputParams.pan || (idVariations.find(v => v.type === 'PAN')?.id) || (idVariations[0]?.id) || demogs?.['PAN'] || '';
  const applicantEmail = inputParams.email || (emailVariations[0]?.email) || demogs?.['EMAIL'] || '';
  const applicantAddress = inputParams.address || (addressVariations[0]?.address) || demogs?.['ADDRESS'] || '';

  // Return Full CrifPdfData Payload
  return {
    header: {
      applicantName,
      chmRefNumber: header?.['REPORT-ID'] || header?.['CHM-REF-NUM'] || '',
      preparedFor: header?.['PREPARED-FOR'] || '',
      applicationId: header?.['APPLICATION-ID'] || header?.['BATCH-ID'] || header?.['REPORT-ID'] || inputParams.leadId || '',
      dateOfRequest: header?.['DATE-OF-REQUEST'] || dateOfIssue,
      dateOfIssue
    },
    inquiryInput: {
      name: applicantName,
      phone: applicantPhone,
      father: demogs?.['FATHER-NAME'] || demogs?.['FATHER'] || '',
      dobAge: applicantDob,
      spouse: demogs?.['SPOUSE-NAME'] || demogs?.['SPOUSE'] || '',
      idNumbers: applicantPan ? `${applicantPan}[PAN]` : '',
      gender: inputParams.gender || appSegment?.['GENDER'] || demogs?.['GENDER'] || '',
      mother: demogs?.['MOTHER-NAME'] || demogs?.['MOTHER'] || '',
      email: applicantEmail,
      currentAddress: applicantAddress,
      otherAddress: addressVariations[1]?.address || ''
    },
    scoreSection: {
      scoreName,
      range: '300-900',
      score: scoreVal ?? '—',
      scoringFactors
    },
    scoreTrend: {
      retroDates: trendDates,
      scores: trendScores
    },
    primarySummary: {
      numAccounts: priSummary?.['NUMBER-OF-ACCOUNTS'] ?? priSummary?.['PRIMARY-NUMBER-OF-ACCOUNTS'] ?? accounts.length,
      activeAccounts: priSummary?.['ACTIVE-ACCOUNTS'] ?? priSummary?.['PRIMARY-ACTIVE-NUMBER-OF-ACCOUNTS'] ?? activeAccountsCount,
      overdueAccounts: priSummary?.['OVERDUE-ACCOUNTS'] ?? priSummary?.['PRIMARY-OVERDUE-NUMBER-OF-ACCOUNTS'] ?? overdueAccountsCount,
      securedAccounts: priSummary?.['SECURED-ACCOUNTS'] ?? priSummary?.['PRIMARY-SECURED-NUMBER-OF-ACCOUNTS'] ?? securedAccountsCount,
      unsecuredAccounts: priSummary?.['UNSECURED-ACCOUNTS'] ?? priSummary?.['PRIMARY-UNSECURED-NUMBER-OF-ACCOUNTS'] ?? unsecuredAccountsCount,
      untaggedAccounts: priSummary?.['UNTAGGED-ACCOUNTS'] ?? 0,
      totalCurrentBalance: formatAmount(priSummary?.['TOTAL-CURRENT-BALANCE'] ?? priSummary?.['CURRENT-BALANCE-TOTAL'] ?? totalCurrentBalanceCalc),
      currentBalanceSecured: formatAmount(priSummary?.['CURRENT-BALANCE-SECURED'] ?? priSummary?.['SECURED-CURRENT-BALANCE'] ?? currentBalSecuredCalc),
      currentBalanceUnsecured: formatAmount(priSummary?.['CURRENT-BALANCE-UNSECURED'] ?? priSummary?.['UNSECURED-CURRENT-BALANCE'] ?? currentBalUnsecuredCalc),
      totalSanctionedAmount: formatAmount(priSummary?.['TOTAL-SANCTIONED-AMT'] ?? priSummary?.['TOTAL-SANCTIONED-AMOUNT'] ?? priSummary?.['SANCTIONED-AMT-TOTAL'] ?? totalSanctionedCalc),
      totalDisbursedAmount: formatAmount(priSummary?.['TOTAL-DISBURSED-AMT'] ?? priSummary?.['TOTAL-DISBURSED-AMOUNT'] ?? priSummary?.['DISBURSED-AMT-TOTAL'] ?? totalDisbursedCalc),
      totalAmountOverdue: formatAmount(priSummary?.['TOTAL-AMT-OVERDUE'] ?? priSummary?.['TOTAL-AMOUNT-OVERDUE'] ?? priSummary?.['OVERDUE-AMT-TOTAL'] ?? totalOverdueCalc)
    },
    secondarySummary: {
      numAccounts: secSummary?.['NUMBER-OF-ACCOUNTS'] ?? 0,
      activeAccounts: secSummary?.['ACTIVE-ACCOUNTS'] ?? 0,
      overdueAccounts: secSummary?.['OVERDUE-ACCOUNTS'] ?? 0,
      securedAccounts: secSummary?.['SECURED-ACCOUNTS'] ?? 0,
      unsecuredAccounts: secSummary?.['UNSECURED-ACCOUNTS'] ?? 0,
      untaggedAccounts: secSummary?.['UNTAGGED-ACCOUNTS'] ?? 0,
      totalCurrentBalance: formatAmount(secSummary?.['TOTAL-CURRENT-BALANCE'] ?? secSummary?.['CURRENT-BALANCE-TOTAL'] ?? 0),
      totalSanctionedAmount: formatAmount(secSummary?.['TOTAL-SANCTIONED-AMT'] ?? secSummary?.['SANCTIONED-AMT-TOTAL'] ?? 0),
      totalDisbursedAmount: formatAmount(secSummary?.['TOTAL-DISBURSED-AMT'] ?? secSummary?.['DISBURSED-AMT-TOTAL'] ?? 0),
      totalAmountOverdue: formatAmount(secSummary?.['TOTAL-AMT-OVERDUE'] ?? secSummary?.['OVERDUE-AMT-TOTAL'] ?? 0)
    },
    groupSummary: {
      numAccountsOwn: mfiSummary?.['NUMBER-OF-ACCOUNTS'] ?? accounts.length,
      numAccountsOther: mfiSummary?.['NO-OF-OTHER-MFIS'] ?? 0,
      noOfMfiOwn: mfiSummary?.['NO-OF-OWN-MFIS'] ?? 0,
      noOfMfiOther: mfiSummary?.['NO-OF-OTHER-MFIS'] ?? 0,
      activeOwn: mfiSummary?.['ACTIVE-ACCOUNTS'] ?? activeAccountsCount,
      activeOther: 0,
      closedOwn: mfiSummary?.['CLOSED-ACCOUNTS'] ?? (accounts.length - activeAccountsCount),
      closedOther: 0,
      defaultOwn: mfiSummary?.['OVERDUE-ACCOUNTS'] ?? overdueAccountsCount,
      defaultOther: 0,
      disbursedOwn: formatAmount(mfiSummary?.['TOTAL-OWN-DISBURSED-AMT'] ?? totalDisbursedCalc),
      disbursedOther: formatAmount(mfiSummary?.['TOTAL-OTHER-DISBURSED-AMT'] ?? 0),
      installmentOwn: formatAmount(mfiSummary?.['TOTAL-OWN-INSTALLMENT-AMT'] ?? totalInstallmentCalc),
      installmentOther: formatAmount(mfiSummary?.['TOTAL-OTHER-INSTALLMENT-AMT'] ?? 0),
      currentBalanceOwn: formatAmount(mfiSummary?.['TOTAL-OWN-CURRENT-BALANCE'] ?? totalCurrentBalanceCalc),
      currentBalanceOther: formatAmount(mfiSummary?.['TOTAL-OTHER-CURRENT-BALANCE'] ?? 0),
      overdueOwn: formatAmount(mfiSummary?.['TOTAL-OWN-OVERDUE-AMT'] ?? totalOverdueCalc),
      overdueOther: formatAmount(mfiSummary?.['TOTAL-OTHER-OVERDUE-AMT'] ?? 0),
      maxWorstDelinqOwn: mfiSummary?.['MAX-WORST-DELINQUENCY'] ?? 0,
      maxWorstDelinqOther: 0
    },
    additionalSummary: {
      grantors: addlMap['NUM-GRANTORS'] ?? uniqueGrantors.size,
      grantorsActive: addlMap['NUM-GRANTORS-ACTIVE'] ?? uniqueActiveGrantors.size,
      grantorsDelinq: addlMap['NUM-GRANTORS-DELINQ'] ?? uniqueDelinqGrantors.size,
      grantorsOnlyPrimary: addlMap['NUM-GRANTORS-ONLY-PRIMARY'] ?? uniqueGrantors.size,
      grantorsOnlySecondary: addlMap['NUM-GRANTORS-ONLY-SECONDARY'] ?? 0
    },
    performAttributes: {
      inquiriesLast6Months: perfMap['INQUIRIES-IN-LAST-SIX-MONTHS'] ?? inquiriesLast6m,
      lengthCreditHistoryYear: perfMap['LENGTH-OF-CREDIT-HISTORY-YEAR'] ?? creditHistYears,
      lengthCreditHistoryMonth: perfMap['LENGTH-OF-CREDIT-HISTORY-MONTH'] ?? creditHistMonths,
      avgAccountAgeYear: perfMap['AVERAGE-ACCOUNT-AGE-YEAR'] ?? avgAgeYears,
      avgAccountAgeMonth: perfMap['AVERAGE-ACCOUNT-AGE-MONTH'] ?? avgAgeRemainingMonths,
      newAccountsLast6Months: perfMap['NEW-ACCOUNTS-IN-LAST-SIX-MONTHS'] ?? accounts.length,
      totalWrittenOffAccounts: perfMap['TOTAL-WRITTEN-OFF-ACCOUNTS'] ?? perfMap['ALL-TYPES-TRADES-WRITTEN-OFF'] ?? writtenOffAccountsCount,
      totalWrittenOffAmount: formatAmount(perfMap['TOTAL-WRITTEN-OFF-AMOUNT'] ?? perfMap['TOTAL-WRITTEN-OFF-AMT'] ?? writtenOffAmountTotal)
    },
    variations: {
      nameVariations,
      emailVariations,
      dobVariations,
      phoneVariations,
      idVariations,
      addressVariations,
      employmentVariations
    },
    accounts,
    inquiries
  };
}

/**
 * Generates PDF and Base64 Data URL for API responses
 */
export async function generateCrifPdfFromApiResponse(apiResponse, inputParams = {}) {
  const extractedData = extractCrifFromApiResponse(apiResponse, inputParams);
  const pdfBuffer = await generateCrifReportPdf(extractedData);
  const base64DataUrl = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;

  return {
    pdfBuffer,
    base64DataUrl,
    extracted: extractedData
  };
}

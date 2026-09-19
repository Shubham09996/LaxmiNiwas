# Laxmi Niwas — Customer Onboarding to Disbursement 🏛️

> **API Cost Breakdown & Verification Engine (Per Customer)**  
> Built with **React + Tailwind CSS** (Vite) and **Node.js + Express**.

---

## 🌟 Executive Summary

This platform is structured around the **Customer Onboarding to Disbursement** pipeline matching the 4 process stages:

| Stage | Process Name | Scope | Total Cost |
|---|---|---|---|
| **01** | **Customer Onboarding APIs** | Essential KYC & Identity (PAN, Aadhaar DigiLocker, UAN, CKYC, Bank Acc, IFSC, Mobile Prefill) | **₹ 18.79** |
| **02** | **Telecaller Onboarding Process** | Risk & Background Verification (IP Lookup, Reverse Geocoding, Domain Age, TransUnion CIBIL PDF, Email Verify, UAN History, 4 Reference Prefill) | **₹ 106.80** |
| **03** | **FCU Onboarding Process** | Banking & Identity Fraud Verification (Mobile to VPA, Mobile to Bank, Bank Penny Drop, Aadhaar without OTP, CKYC Download) | **₹ 21.45** |
| **04** | **Credit Manager Onboarding** | Financial Analysis & AI Scoring (Statement Analyzer AI Advance) | **₹ 25.00** |
| **Total** | **End-to-End Onboarding to Disbursement** | **All 20 Statutory & Bureau APIs** | **₹ 172.04** |

---

## 📱 Simplified 3-View Architecture (No Sidebar Clutter)

1. **Dashboard (`/`)**:
   - 5-Stage Visual Pipeline Flow (`Customer Onboarding` ➔ `Telecaller Verification` ➔ `FCU Verification` ➔ `Credit Analysis` ➔ `Disbursement`).
   - Prominent **₹ 172.04 / customer** Total Cost Card.
   - 4 Stage summary cards with direct 1-click test triggers.
   - 4 Benefit pillars: *Accurate Verification, Reduce Fraud Risk, Faster Turnaround Time, Cost Efficient*.

2. **All APIs & Pricing (`/apis`)**:
   - Complete 4-stage tables matching the exact cost breakdown sheet.
   - Per-API cost, service description, and 1-click **"⚡ Test"** button for any of the 20 APIs.

3. **Live API Tester (`/test`)**:
   - Interactive testing console: select any of the 20 APIs from the dropdown.
   - Editable test input parameters with smart prefilled samples.
   - **3D Holographic Visual Card Result**: Floating 3D card with holographic glow theme, verified outcome badges, structured data chips, and raw JSON toggle.

---

## 🚀 How to Run

### Start Backend Server:
```bash
npm --prefix server start
# or for live reload: npm --prefix server run dev
```

### Start Frontend Client:
```bash
npm --prefix client run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

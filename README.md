# 🚀 Paytm Saarthi: Autonomous AI Copilot for Lending & Fintech

> **Track:** AI-Powered Financial Journeys  
> **Problem Statement:** *"Make Insurance, Lending and Fintech simpler, faster and more human. Reimagine customer-facing journeys across Insurance, Lending and Fintech using AI."*

---

## 🌟 What is Paytm Saarthi?

Paytm Saarthi is an **In-App Autonomous Financial Copilot** designed for **Bharat's 190M+ thin-file customers** (kirana store owners, gig workers, small merchants) who have **0 CIBIL score** but generate consistent daily cash flow through **Paytm QR transactions**.

Unlike traditional chatbots that merely give *guidance* ("fill this 50-field form"), Saarthi performs **autonomous agentic execution**:
1. **Conversational Intent** in Vernacular Hindi / Regional languages.
2. **Alternative Underwriting Engine** evaluating 6 months of QR data (4,520 transactions, ₹86,400 monthly GMV).
3. **RBI Account Aggregator (AA)** 1-tap consent verification.
4. **Instant Straight-Through Disbursal (< 90 seconds)** to Paytm Wallet with the signature **Paytm Soundbox chime**!

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- (Optional) Google Gemini API Key in `.env`

### 2. Start Both Backend & Frontend with One Command
```bash
cd C:\Users\ASHA\.gemini\antigravity-ide\scratch\paytm-saarthi
npm run dev
```

- **Frontend (Split Pitch View):** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 📱 Presentation Modes (Designed for Judges)

1. **⚡ Split Pitch Mode (Default):**
   - **Left:** Paytm Mobile App for *Ramesh Kirana Store (Jaipur)*.
   - **Right:** Paytm Lending Partner & Underwriter Command Center with real-time agent telemetry, 4-pillar risk scores, and Cognee knowledge graph.
   - *Shows judges both user experience and enterprise AI execution simultaneously!*
2. **📱 Mobile App Mode:**
   - Dedicated iPhone/Android device chassis view.
3. **💻 Web Portal Mode:**
   - Full desktop underwriter view for NBFC partners.

---

## ⏱️ 90-Second Demo Script for Judges

1. **The Hook (0:00 - 0:20):**
   - Point out that Ramesh has **0 CIBIL score** (Thin-file), but his store has **4,520 QR transactions** and **₹86,400 monthly sales**.
2. **Voice & Intent (0:20 - 0:45):**
   - Tap the Mic icon or the quick chip: `[🎙️ "50,000 का लोन चाहिए"]`.
   - Watch the AI Assistant scan the ledger and compute an **Alternative Score of 825/900**.
3. **AA Consent (0:45 - 1:05):**
   - Click `[✅ Authorize 1-Tap Consent]`. RBI Account Aggregator rails securely verify SBI cashflow in 200ms.
4. **The Magic Disbursal (1:05 - 1:25):**
   - Click `[🚀 Disburse ₹50,000 Instantly]`.
   - **Confetti bursts**, wallet balance jumps to **₹53,840**, and the **Paytm Soundbox announces:** *"Paytm par pachaas hazaar rupaye prapt hue!"*
5. **Reset & Repeat (1:25 - 1:30):**
   - Tap `[↺ Reset]` in the top header to run it again anytime during judge Q&A!

---

## 🛡️ Architecture & The Paytm Moat

- **First-Party Transaction Moat:** 5 Cr+ merchants' daily QR cash flow data that Google, banks, and other fintechs cannot access.
- **Cognee Knowledge Graph:** Graph-based persistent memory linking `Merchant ➔ Business ➔ QR Ledger ➔ Risk Score ➔ Disbursed Loan ➔ Upgraded Credit Limit (₹1 Lakh)`.
- **Gemini 3.8 Flash:** Official `@google/genai` integration for multi-turn intent reasoning.
- **RBI-Regulated Rails:** Integrates with Account Aggregator (AA) and partner NBFCs (Aditya Birla Capital / SMFG India).

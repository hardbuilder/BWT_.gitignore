# GIG Flow
**Financial Identity Protocol for the Invisible 400 Million**

*Built for the Build with TRAE Hackathon | Challenge Track: Future Finance Platforms*

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [The Problem Landscape](#the-problem-landscape)
3. [The GIG Flow Solution](#the-gig-flow-solution)
4. [Core Technical Innovations](#core-technical-innovations)
5. [System Architecture & User Flow](#system-architecture--user-flow)
6. [Technology Stack](#technology-stack)
7. [Local Setup & Installation](#local-setup--installation)
8. [Future Roadmap](#future-roadmap)
9. [Team](#team)

---

## Executive Summary
GIG Flow is a financial middleware protocol designed to bridge the gap between India's booming gig economy and formal credit institutions. By transforming raw, unstructured UPI transaction history into a verifiable, privacy-preserving "Stability Score," GIG Flow enables delivery partners, freelancers, and micro-entrepreneurs to prove their creditworthiness without traditional salary slips or tax returns.

## The Problem Landscape
India has millions of gig workers earning consistent daily wages. However, the formal banking system classifies them as "credit invisible" due to:
* **Lack of Documentation:** No formal employment contracts, Form 16s, or standard payslips.
* **Unstructured Data:** Their primary income is disbursed via daily or weekly UPI transfers, which traditional credit models view as noise rather than verifiable income.
* **Predatory Alternatives:** Without access to micro-loans from formal banks, workers are forced into high-interest, predatory lending traps.

## The GIG Flow Solution
We shift the paradigm from "Asset-Based Credit" to "Cashflow-Based Identity." 

GIG Flow acts as a secure intermediary. It ingests banking data via the Account Aggregator framework, isolates verified business-to-person (B2P) gig payouts, and computes a dynamic financial health score. Lenders consume this score via a secure QR handshake, guaranteeing zero-knowledge proof of income without compromising the worker's privacy regarding personal spending habits.

## Core Technical Innovations

### 1. Contextual Intent Engine
Standard bank statements do not categorize gig income. Our Intent Engine utilizes regex-based pattern matching on transaction narrations (e.g., `UPI/ZOMATO`, `SWIGGY-PAYOUT`, `ZEPTO-FLEET`) to isolate verified earnings from personal peer-to-peer transfers.

### 2. The GIG Stability Algorithm
We compute a proprietary score (ranging from 300 to 850) that heavily weights earning consistency over absolute volume, which is a better indicator of gig-worker reliability.

**The Logic Matrix:**
* Base Score: 300
* Consistency Multiplier: Percentage of active earning days in a 30-day window x 3
* Volume Coefficient: Total verified monthly volume / 150

### 3. Zero-Knowledge Verification
Workers generate a dynamic QR Code representing their identity. When scanned by a Lender, the system only transmits the final computed `Stability Score` and `Average Monthly Earning`. The raw transaction JSON is discarded post-computation and is never stored on our servers.

---

## System Architecture & User Flow

### The Two-Sided Marketplace

**Side A: The Gig Worker**
1. User authenticates and initiates a data fetch via the Setu Account Aggregator sandbox.
2. The GIG Flow client processes the 90-day transaction JSON locally.
3. The Intent Engine computes the Stability Score.
4. A unique, hashed `DocumentID` and Score are written to Firebase.
5. The UI renders a digital "GIG Passport" with a scannable QR code.

**Side B: The Lender Portal**
1. Lender logs into the web-based GIG Flow Dashboard.
2. Lender scans the worker's QR code.
3. A Firebase real-time listener triggers, fetching the specific `DocumentID`.
4. The dashboard displays the worker's verified income bracket and score, offering immediate micro-loan pre-approval.

---

## Technology Stack

### Frontend & UI
* **Framework:** React 19 + Vite
* **Styling:** Tailwind CSS
* **Motion & Interactions:** Framer Motion
* **QR Generation:** qrcode.react

### Backend & Infrastructure
* **Database:** Firebase Firestore (NoSQL, Real-time Sync)
* **Authentication:** Firebase Auth
* **Data Simulation:** Mocked Setu AA API Responses

### Development Environment
* **IDE:** TRAE AI IDE (Used for rapid scaffolding and complex algorithm generation)

---

## Local Setup & Installation

Follow these steps to run the GIG Flow environment locally for testing and development.

### Prerequisites
* Node.js (v18.0 or higher)
* NPM or Yarn
* A Firebase Project with Firestore enabled


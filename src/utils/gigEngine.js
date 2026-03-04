/**
 * GIG Flow — Core Credit Scoring Engine
 * Analyzes bank transaction data to compute a gig-worker creditworthiness score.
 */

const GIG_KEYWORDS = /ZOMATO|SWIGGY|ZEPTO|BLINKIT/i;

/**
 * calculateGigScore(transactions)
 *
 * @param {Array} transactions - Array of transaction objects from mockTransactions.json
 * @returns {{ score: number, avgMonthlyGigIncome: number, burnRate: number,
 *             totalGigIncome: number, totalDebits: number, consistency: number,
 *             gigDays: number, totalDays: number, tier: string }}
 */
export function calculateGigScore(transactions) {
  if (!transactions || transactions.length === 0) {
    return { score: 300, avgMonthlyGigIncome: 0, burnRate: 0,
             totalGigIncome: 0, totalDebits: 0, consistency: 0,
             gigDays: 0, totalDays: 90, tier: 'HIGH RISK' };
  }

  // --- 1. Filter gig CREDIT transactions ---
  const gigCredits = transactions.filter(
    (t) => t.type === 'CREDIT' && GIG_KEYWORDS.test(t.narration)
  );

  // --- 2. Total gig income ---
  const totalGigIncome = gigCredits.reduce((sum, t) => sum + t.amount, 0);

  // --- 3. Total debits (burn rate) ---
  const debits = transactions.filter((t) => t.type === 'DEBIT');
  const totalDebits = debits.reduce((sum, t) => sum + t.amount, 0);

  // --- 4. Consistency: % of days in 90-day window with at least one gig credit ---
  const TOTAL_DAYS = 90;
  const gigDaysSet = new Set(gigCredits.map((t) => t.date));
  const gigDays    = gigDaysSet.size;
  const consistency = (gigDays / TOTAL_DAYS) * 100; // 0–100

  // --- 5. Stability Score formula ---
  // Base: 300
  // + Consistency component:  consistency% × 3           (max ~300 points)
  // + Income component:       totalGigIncome / 150       (scales with earnings)
  // − Burn rate penalty:      if debits > 90% of income, subtract 50 points
  const burnRatioPenalty =
    totalGigIncome > 0 && totalDebits > totalGigIncome * 0.9 ? 50 : 0;

  const rawScore =
    300 +
    consistency * 3 +
    totalGigIncome / 150 -
    burnRatioPenalty;

  // Clamp between 300 and 850
  const score = Math.round(Math.min(850, Math.max(300, rawScore)));

  // --- 6. Average monthly gig income (90 days ≈ 3 months) ---
  const avgMonthlyGigIncome = Math.round(totalGigIncome / 3);

  // --- 7. Burn rate as % of income ---
  const burnRate =
    totalGigIncome > 0
      ? Math.round((totalDebits / totalGigIncome) * 100)
      : 100;

  // --- 8. Tier ---
  const tier =
    score > 700 ? 'APPROVED' :
    score >= 600 ? 'CONDITIONAL' :
    'HIGH RISK';

  return {
    score,
    avgMonthlyGigIncome,
    burnRate,
    totalGigIncome: Math.round(totalGigIncome),
    totalDebits: Math.round(totalDebits),
    consistency: Math.round(consistency),
    gigDays,
    totalDays: TOTAL_DAYS,
    tier,
  };
}

export default calculateGigScore;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import transactions from '../data/mockTransactions.json';
import { calculateGigScore } from '../utils/gigEngine';

// ─── Animated Score Counter ────────────────────────────────────────────────
function AnimatedScore({ targetScore }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.onChange(setDisplay);
    const controls = animate(count, targetScore, { duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] });
    return () => { controls.stop(); unsub(); };
  }, [targetScore]);

  return <span>{display}</span>;
}

// ─── Circular Progress Ring ────────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 80;
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = (score - 300) / (850 - 300);
  const dashOffset = circumference * (1 - progress);

  const color =
    score > 700 ? '#00FFD1' :
    score >= 600 ? '#F59E0B' :
    '#EF4444';

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg width={radius * 2} height={radius * 2} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        {/* Track */}
        <circle
          cx={radius} cy={radius} r={normalizedRadius}
          fill="transparent" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke}
        />
        {/* Progress */}
        <motion.circle
          cx={radius} cy={radius} r={normalizedRadius}
          fill="transparent"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="relative z-10 text-center">
        <div className="font-display font-extrabold text-3xl" style={{ color, letterSpacing: '-0.04em' }}>
          <AnimatedScore targetScore={score} />
        </div>
        <div className="font-mono text-xs text-white/40 tracking-wider mt-1">SCORE</div>
      </div>
    </div>
  );
}

// ─── Stat Pill ─────────────────────────────────────────────────────────────
function StatPill({ label, value, accent }) {
  return (
    <div className="glass rounded-xl p-4 flex-1 min-w-0">
      <div className="font-mono text-xs text-white/40 tracking-wider mb-1">{label}</div>
      <div className="font-display font-bold text-lg truncate" style={{ color: accent || '#fff' }}>{value}</div>
    </div>
  );
}

// ─── Worker Dashboard ──────────────────────────────────────────────────────
export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  const FIREBASE_DOC_ID = 'user_123_gig_profile';
  const WORKER_NAME = 'Ravi Kumar';

  useEffect(() => {
    // Simulate async fetch + calculation
    setTimeout(() => {
      const result = calculateGigScore(transactions);
      setScoreData(result);
      setLoading(false);
    }, 900);
  }, []);

  const tierColor =
    scoreData?.tier === 'APPROVED' ? '#00FFD1' :
    scoreData?.tier === 'CONDITIONAL' ? '#F59E0B' :
    '#EF4444';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-8 px-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,209,0.05) 0%, #030508 60%)',
        minHeight: '100vh',
      }}
    >
      {/* Top bar */}
      <div className="w-full max-w-sm flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="font-mono text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
        >
          ← BACK
        </button>
        <span className="font-display font-bold text-sm tracking-tight" style={{ color: '#00FFD1' }}>
          GIG Flow
        </span>
        <div className="w-2 h-2 rounded-full bg-[#00FFD1] animate-pulse" />
      </div>

      {/* Passport Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm glass rounded-3xl overflow-hidden"
        style={{
          border: '1px solid rgba(0,255,209,0.15)',
          boxShadow: '0 0 40px rgba(0,255,209,0.08)',
        }}
      >
        {/* Card header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs text-white/30 tracking-widest">GIG CREDIT PASSPORT</span>
            {!loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,255,209,0.12)', border: '1px solid rgba(0,255,209,0.3)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FFD1]" />
                <span className="font-mono text-xs text-[#00FFD1]">VERIFIED</span>
              </motion.div>
            )}
          </div>
          <h2 className="font-display font-bold text-2xl text-white mt-3" style={{ letterSpacing: '-0.03em' }}>
            {WORKER_NAME}
          </h2>
          <p className="font-body text-white/40 text-sm mt-0.5">Delivery Partner · Mumbai</p>
        </div>

        {/* Score area */}
        <div className="px-6 py-6 flex items-center gap-6">
          {loading ? (
            <div className="flex items-center gap-4 w-full">
              <div className="w-40 h-40 rounded-full border-2 border-white/10 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-white/10 rounded animate-pulse" />
                <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              <ScoreRing score={scoreData.score} />
              <div className="flex-1 space-y-3">
                <div>
                  <div className="font-mono text-xs text-white/30 tracking-wider mb-1">TIER STATUS</div>
                  <div className="font-display font-bold text-lg" style={{ color: tierColor }}>
                    {scoreData.tier}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs text-white/30 tracking-wider mb-1">CONSISTENCY</div>
                  <div className="font-display font-bold text-base text-white">
                    {scoreData.consistency}% active days
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Stats row */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="px-6 pb-5 flex gap-3"
          >
            <StatPill
              label="AVG MONTHLY"
              value={`₹${scoreData.avgMonthlyGigIncome.toLocaleString('en-IN')}`}
              accent="#00FFD1"
            />
            <StatPill
              label="BURN RATE"
              value={`${scoreData.burnRate}%`}
              accent={scoreData.burnRate > 90 ? '#EF4444' : '#F59E0B'}
            />
            <StatPill
              label="GIG DAYS"
              value={`${scoreData.gigDays}/90`}
              accent="#5B8DEF"
            />
          </motion.div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

        {/* QR Code Section */}
        <div className="px-6 py-6 flex flex-col items-center">
          <div className="font-mono text-xs text-white/30 tracking-widest mb-4">SCAN TO VERIFY PASSPORT</div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.9 : 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="rounded-2xl p-4"
            style={{ background: '#fff' }}
          >
            <QRCodeSVG
              value={FIREBASE_DOC_ID}
              size={140}
              fgColor="#030508"
              bgColor="#ffffff"
              level="H"
            />
          </motion.div>
          <p className="font-mono text-xs text-white/20 mt-3 tracking-wider">{FIREBASE_DOC_ID}</p>
        </div>

        {/* Footer strip */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ background: 'rgba(0,255,209,0.04)', borderTop: '1px solid rgba(0,255,209,0.08)' }}
        >
          <span className="font-mono text-xs text-white/20">Powered by GIG Flow</span>
          <span className="font-mono text-xs" style={{ color: '#00FFD1' }}>v2.0</span>
        </div>
      </motion.div>

      {/* Info note */}
      {!loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="font-body text-white/25 text-xs text-center mt-6 max-w-xs leading-relaxed"
        >
          This passport is verified by 90 days of gig income analysis. Show it to any GIG Flow lender for instant credit decisions.
        </motion.p>
      )}
    </div>
  );
}

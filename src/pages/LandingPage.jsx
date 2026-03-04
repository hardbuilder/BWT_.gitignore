import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// ─── Cinematic Intro Overlay ────────────────────────────────────────────────
function CinematicIntro({ onComplete }) {
  const [phase, setPhase] = useState('line1'); // line1 | line2 | expand | done
  const [dotScale, setDotScale] = useState(0);
  const overlayRef = useRef(null);

  useEffect(() => {
    // Phase 1: show "Connecting Gig workers" for 1.8s
    const t1 = setTimeout(() => setPhase('line2'), 1800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === 'line2') {
      const t2 = setTimeout(() => setPhase('expand'), 1800);
      return () => clearTimeout(t2);
    }
    if (phase === 'expand') {
      // Animate dot expansion
      requestAnimationFrame(() => setDotScale(120));
      const t3 = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 1200);
      return () => clearTimeout(t3);
    }
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: phase === 'expand' ? '#030508' : '#ffffff' }}
      initial={{ opacity: 1 }}
    >
      {phase !== 'expand' && (
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="text-2xl md:text-4xl font-display font-bold text-center px-8"
            style={{ color: phase === 'line1' ? '#030508' : '#030508', letterSpacing: '-0.02em' }}
          >
            {phase === 'line1'
              ? 'Connecting Gig workers'
              : 'To a system that\'s for everyone.'}
          </motion.p>
        </AnimatePresence>
      )}

      {phase === 'expand' && (
        <motion.div
          className="absolute rounded-full bg-[#030508]"
          style={{ width: '8px', height: '8px' }}
          animate={{ scale: dotScale }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </motion.div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 glass"
      style={{ borderBottom: '1px solid rgba(0,255,209,0.1)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #00FFD1 0%, #0066ff 100%)' }}>
            <span className="font-display font-bold text-[#030508] text-sm">GF</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">GIG Flow</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/lender')}
            className="px-5 py-2 rounded-full text-sm font-body font-medium border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all duration-200"
          >
            Lender Portal
          </button>
          <button
            onClick={() => navigate('/worker')}
            className="px-5 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 pulse-neon"
            style={{ background: '#00FFD1', color: '#030508' }}
          >
            Worker Access
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end pb-24 px-8 md:px-16 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute"
          style={{
            width: '70vw', height: '70vw',
            top: '-20%', right: '-10%',
            background: 'radial-gradient(ellipse, rgba(0,255,209,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute"
          style={{
            width: '50vw', height: '50vw',
            bottom: '0', left: '-5%',
            background: 'radial-gradient(ellipse, rgba(0,102,255,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(0,255,209,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,255,209,0.03) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="font-mono text-xs tracking-widest mb-6"
            style={{ color: '#00FFD1' }}
          >
            ◆ INDIA'S GIG ECONOMY CREDIT LAYER
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display font-extrabold leading-none text-white mb-8"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 7rem)',
              letterSpacing: '-0.04em',
              maxWidth: '16ch',
            }}
          >
            Financial Identity<br />
            <span style={{ color: '#00FFD1' }}>for the Invisible</span><br />
            400 Million.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="font-body text-white/50 text-lg max-w-md leading-relaxed mb-10"
          >
            Real-time gig income analysis. Verifiable credit passports.
            Loans designed for how India actually works.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.6 }}
            className="flex gap-4 flex-wrap items-center"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-mono"
                 style={{ color: '#00FFD1', border: '1px solid rgba(0,255,209,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-[#00FFD1] animate-pulse" />
              Live Score Engine
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-mono"
                 style={{ color: '#00FFD1', border: '1px solid rgba(0,255,209,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-[#00FFD1] animate-pulse" />
              Zero Paper Required
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-12 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="font-mono text-xs text-white/30 tracking-widest -rotate-90 mb-4">SCROLL</span>
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-[#00FFD1] to-transparent"
          animate={{ scaleY: [1, 0.4, 1], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}

// ─── About / Feature Cards Horizontal Scroll Section ─────────────────────────
const FEATURES = [
  {
    id: 'zero-knowledge',
    tag: '01 — PRIVACY',
    title: 'Zero-Knowledge Proofs',
    desc: 'Your raw bank data never leaves your device. We generate cryptographic proofs that verify income without exposing transactions to any third party.',
    icon: '⬡',
    accent: '#00FFD1',
  },
  {
    id: 'intent-engine',
    tag: '02 — AI',
    title: 'Intent Engine',
    desc: 'Our ML model reads spending patterns to distinguish between a bad month and a bad borrower. Context-aware underwriting for gig realities.',
    icon: '◈',
    accent: '#5B8DEF',
  },
  {
    id: 'dynamic-scoring',
    tag: '03 — SCORING',
    title: 'Dynamic Scoring',
    desc: 'Stability scores update weekly. Consistent gig income improves your score over time. The system rewards hustle, not just history.',
    icon: '◎',
    accent: '#FF6B35',
  },
  {
    id: 'instant-verification',
    tag: '04 — SPEED',
    title: 'Instant Verification',
    desc: 'Lenders scan a QR passport and get a verified credit decision in under 3 seconds. No branch visit. No paperwork. No waiting.',
    icon: '◉',
    accent: '#A855F7',
  },
];

function AboutSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['8%', '-68%']);

  return (
    <section ref={containerRef} style={{ height: '300vh' }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="px-8 md:px-16 mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-widest mb-3"
            style={{ color: '#00FFD1' }}
          >
            ◆ HOW IT WORKS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-3xl md:text-5xl text-white"
            style={{ letterSpacing: '-0.03em' }}
          >
            Built different.<br />
            <span className="text-white/40">For different.</span>
          </motion.h2>
        </div>

        <motion.div style={{ x }} className="flex gap-6 px-8 md:px-16 w-max">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.id}
              className="glass rounded-2xl p-8 flex-shrink-0"
              style={{
                width: 'clamp(280px, 30vw, 380px)',
                borderColor: `${f.accent}22`,
                borderWidth: '1px',
              }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="mb-6">
                <span
                  className="font-mono text-xs tracking-widest"
                  style={{ color: f.accent }}
                >
                  {f.tag}
                </span>
              </div>
              <div
                className="text-5xl mb-6 font-mono"
                style={{ color: f.accent }}
              >
                {f.icon}
              </div>
              <h3
                className="font-display font-bold text-xl mb-4 text-white"
                style={{ letterSpacing: '-0.02em' }}
              >
                {f.title}
              </h3>
              <p className="font-body text-white/50 text-sm leading-relaxed">
                {f.desc}
              </p>
              <div
                className="mt-8 h-px w-12"
                style={{ background: f.accent }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { value: '400M+', label: 'Gig Workers in India' },
    { value: '₹0', label: 'Collateral Required' },
    { value: '3sec', label: 'Verification Time' },
    { value: '90-day', label: 'Score Window' },
  ];
  return (
    <section className="py-20 px-8 md:px-16 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="text-center"
          >
            <div
              className="font-display font-extrabold text-4xl md:text-5xl mb-2"
              style={{ color: '#00FFD1', letterSpacing: '-0.04em' }}
            >
              {s.value}
            </div>
            <div className="font-body text-white/40 text-sm tracking-wide">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="py-16 px-8 md:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00FFD1 0%, #0066ff 100%)' }}
            >
              <span className="font-display font-bold text-[#030508] text-xs">GF</span>
            </div>
            <span className="font-display font-bold text-base">GIG Flow</span>
          </div>
          <p className="font-body text-white/30 text-sm max-w-xs">
            Bridging India's gig workforce with formal financial systems.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/worker')}
              className="font-body text-sm text-white/50 hover:text-[#00FFD1] transition-colors"
            >
              Worker Dashboard
            </button>
            <button
              onClick={() => navigate('/lender')}
              className="font-body text-sm text-white/50 hover:text-[#00FFD1] transition-colors"
            >
              Lender Portal
            </button>
          </div>
          <p className="font-mono text-xs text-white/20">
            Built by team{' '}
            <span className="text-white/40">.gitignore</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div style={{ background: '#030508', minHeight: '100vh' }}>
      <AnimatePresence>
        {!introComplete && (
          <CinematicIntro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {introComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar />
          <HeroSection />
          <StatsSection />
          <AboutSection />
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getWorkerProfile, getWorkersStats } from "../services/firestore";
import { useAuth } from "../services/AuthContext.jsx";

function getDecision(score, avgMonthlyGigIncome) {
  if (score > 700) {
    return {
      verdict: "APPROVED",
      color: "#00FFD1",
      bg: "rgba(0,255,209,0.08)",
      border: "rgba(0,255,209,0.25)",
      offerLimit: (avgMonthlyGigIncome * 3).toLocaleString("en-IN"),
      description: "Strong gig income consistency. Low repayment risk.",
      icon: "✓",
      suggestion: `Offer instant credit line of ₹${(avgMonthlyGigIncome * 3).toLocaleString("en-IN")}. Standard 30-day cycle.`,
    };
  }
  if (score >= 600) {
    return {
      verdict: "CONDITIONAL",
      color: "#FFD166",
      bg: "rgba(255,209,102,0.08)",
      border: "rgba(255,209,102,0.25)",
      offerLimit: (avgMonthlyGigIncome * 1.5).toLocaleString("en-IN"),
      description: "Moderate consistency. Manageable risk with conditions.",
      icon: "⚡",
      suggestion: `Conditional offer of ₹${(avgMonthlyGigIncome * 1.5).toLocaleString("en-IN")}. Require 3 months additional monitoring.`,
    };
  }
  return {
    verdict: "HIGH RISK",
    color: "#FF6B6B",
    bg: "rgba(255,107,107,0.08)",
    border: "rgba(255,107,107,0.25)",
    offerLimit: null,
    description: "Irregular income. Elevated default probability.",
    icon: "⚠",
    suggestion: "Suggest daily micro-repayments of ₹50–200 tied to gig payouts. No lump-sum credit at this time.",
  };
}

function Sidebar() {
  const navigate = useNavigate();
  const items = [
    { icon: "⬡", label: "Dashboard", active: true },
    { icon: "◎", label: "Applications", active: false },
    { icon: "◈", label: "Analytics", active: false },
    { icon: "⬟", label: "Verified Workers", active: false },
    { icon: "○", label: "Settings", active: false },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col"
      style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)", minHeight: "100vh" }}>
      <div className="p-6 mb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #00FFD1, #7B61FF)", color: "#0A0A0F" }}>
            GF
          </div>
          <div>
            <p className="text-white text-sm font-semibold" style={{ fontFamily: "'Georgia', serif" }}>GIG Flow</p>
            <p className="text-xs text-gray-500" style={{ fontFamily: "monospace" }}>Lender Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        {items.map((item) => (
          <button key={item.label}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-left transition-all duration-150"
            style={{
              background: item.active ? "rgba(0,255,209,0.08)" : "transparent",
              color: item.active ? "#00FFD1" : "#6B7280",
              fontFamily: "monospace",
              fontSize: "13px",
            }}>
            <span style={{ opacity: item.active ? 1 : 0.5 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => navigate("/")}
          className="w-full text-center text-xs text-gray-600 py-2"
          style={{ fontFamily: "monospace" }}>
          ← Back to Home
        </button>
      </div>
    </aside>
  );
}

export default function LenderPortal() {
  const [scanning, setScanning] = useState(false);
  const [worker, setWorker] = useState(null);
  const [scanPhase, setScanPhase] = useState("idle"); // idle | scanning | found | loaded
  const [docId, setDocId] = useState("");
  const [activeDocId, setActiveDocId] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const { user, account, accountLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (account && account.role !== "lender")) {
      return;
    }
    (async () => {
      try {
        const data = await getWorkersStats();
        setStats(data);
      } catch (e) {
        setStats({ count: 0, avgScore: 0, approvalRate: 0, avgMonthlyIncome: 0 });
      }
    })();
  }, [user, account]);

  const handleScan = () => {
    const trimmed = docId.trim();
    if (!trimmed) {
      setError("Enter passport id");
      return;
    }
    setError("");
    setScanPhase("scanning");
    setScanning(true);
    setActiveDocId(trimmed);

    setTimeout(() => setScanPhase("found"), 1200);
    setTimeout(async () => {
      try {
        const profile = await getWorkerProfile(trimmed);
        if (!profile) {
          setWorker(null);
          setError("Profile not found");
        } else {
          setWorker(profile);
        }
      } catch (e) {
        setWorker(null);
        setError("Unable to fetch profile");
      }
      setScanPhase("loaded");
      setScanning(false);
    }, 2200);
  };

  const reset = () => {
    setWorker(null);
    setScanPhase("idle");
    setError("");
  };

  const decision = worker ? getDecision(worker.score, worker.avgMonthlyGigIncome) : null;

  if (!user || accountLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4" style={{ background: "#0A0A0F" }}>
        <div className="glass rounded-2xl p-6 text-center max-w-sm">
          <div className="font-display font-bold text-xl mb-2 text-white">
            {user ? "Loading account" : "Sign in required"}
          </div>
          <div className="font-body text-white/50 text-sm mb-4">
            {user ? "Fetching your access details." : "Sign in to access lender tools."}
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200"
            style={{ background: "#7B61FF", color: "#030508" }}
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  if (account && account.role !== "lender") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4" style={{ background: "#0A0A0F" }}>
        <div className="glass rounded-2xl p-6 text-center max-w-sm">
          <div className="font-display font-bold text-xl mb-2 text-white">Lender access only</div>
          <div className="font-body text-white/50 text-sm mb-4">
            You are signed in as a worker account.
          </div>
          <button
            onClick={() => navigate("/worker")}
            className="px-5 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200"
            style={{ background: "#00FFD1", color: "#030508" }}
          >
            Go to worker dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex" style={{ background: "#0A0A0F", minHeight: "100vh" }}>
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-light text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>
              Lender Dashboard
            </h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: "monospace" }}>
              Scan a worker passport to begin credit assessment
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400" style={{ fontFamily: "monospace" }}>System Online</span>
          </div>
        </div>

        {/* Metrics bar */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: "Profiles", value: stats?.count ?? 0, delta: "All time" },
            { label: "Approval Rate", value: `${stats?.approvalRate ?? 0}%`, delta: "Score > 700" },
            { label: "Avg Score", value: stats?.avgScore ?? 0, delta: "Current" },
            { label: "Avg Income", value: `₹${(stats?.avgMonthlyIncome ?? 0).toLocaleString("en-IN")}`, delta: "Monthly" },
          ].map(({ label, value, delta }) => (
            <div key={label} className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs text-gray-500 mb-2 tracking-wide" style={{ fontFamily: "monospace" }}>{label}</p>
              <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>{value}</p>
              <p className="text-xs" style={{ color: "#00FFD1", fontFamily: "monospace" }}>{delta}</p>
            </div>
          ))}
        </div>

        {/* Scanner + Decision area */}
        <div className="grid grid-cols-5 gap-6">
          {/* Scanner Panel */}
          <div className="col-span-2 rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>
              Passport Scanner
            </p>
            <p className="text-xs text-gray-500 mb-6" style={{ fontFamily: "monospace" }}>
              Scan worker QR to fetch verified gig profile
            </p>

            {/* Scan animation area */}
            <div className="rounded-xl flex items-center justify-center mb-6 relative overflow-hidden"
              style={{ height: "200px", background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(255,255,255,0.1)" }}>

              <AnimatePresence mode="wait">
                {scanPhase === "idle" && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-center">
                    <p className="text-5xl mb-3 opacity-20">⬡</p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: "monospace" }}>Awaiting scan...</p>
                  </motion.div>
                )}
                {scanPhase === "scanning" && (
                  <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-full h-full relative">
                    {/* QR frame corners */}
                    {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
                      <div key={i} className={`absolute w-6 h-6 ${pos}`}
                        style={{
                          borderTop: i < 2 ? "2px solid #00FFD1" : "none",
                          borderBottom: i >= 2 ? "2px solid #00FFD1" : "none",
                          borderLeft: i % 2 === 0 ? "2px solid #00FFD1" : "none",
                          borderRight: i % 2 === 1 ? "2px solid #00FFD1" : "none",
                        }} />
                    ))}
                    {/* Scan line */}
                    <motion.div className="absolute left-4 right-4 h-0.5"
                      style={{ background: "linear-gradient(90deg, transparent, #00FFD1, transparent)", boxShadow: "0 0 10px #00FFD1" }}
                      animate={{ top: ["20%", "80%", "20%"] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs" style={{ color: "#00FFD1", fontFamily: "monospace" }}>Scanning...</p>
                    </div>
                  </motion.div>
                )}
                {scanPhase === "found" && (
                  <motion.div key="found" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}
                    className="text-center">
                    <motion.div className="text-4xl mb-2" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }}>✓</motion.div>
                    <p className="text-xs" style={{ color: "#00FFD1", fontFamily: "monospace" }}>Passport Found</p>
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "monospace" }}>{activeDocId}</p>
                  </motion.div>
                )}
                {scanPhase === "loaded" && (
                  <motion.div key="loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center">
                    <p className="text-2xl mb-2">◎</p>
                    <p className="text-xs text-gray-400" style={{ fontFamily: "monospace" }}>Profile Loaded</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <input
              className="w-full mb-3 px-3 py-2 rounded-xl bg-transparent border border-white/10 text-sm text-white placeholder-gray-600"
              placeholder="Enter passport id"
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
            />
            {error && (
              <div className="text-xs text-red-400 mb-3" style={{ fontFamily: "monospace" }}>
                {error}
              </div>
            )}

            {scanPhase === "idle" ? (
              <button
                onClick={handleScan}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{ background: "#00FFD1", color: "#0A0A0F", fontFamily: "monospace", boxShadow: "0 0 20px rgba(0,255,209,0.2)" }}>
                ⬡ Scan Passport
              </button>
            ) : (
              <button
                onClick={reset}
                className="w-full py-3 rounded-xl text-sm transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", color: "#6B7280", fontFamily: "monospace", border: "1px solid rgba(255,255,255,0.08)" }}>
                Reset Scanner
              </button>
            )}
          </div>

          {/* Decision Card */}
          <div className="col-span-3">
            <AnimatePresence mode="wait">
              {!worker ? (
                <motion.div key="empty"
                  className="h-full rounded-2xl flex items-center justify-center"
                  style={{ border: "1px dashed rgba(255,255,255,0.06)", minHeight: "380px" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="text-center">
                    <p className="text-4xl opacity-10 mb-4">⬟</p>
                    <p className="text-sm text-gray-600" style={{ fontFamily: "monospace" }}>
                      Decision card will appear after scanning
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="decision"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: `1px solid ${decision.border}`, background: decision.bg }}>

                  {/* Decision verdict header */}
                  <div className="px-7 py-5 flex items-center justify-between"
                    style={{ borderBottom: `1px solid ${decision.border}` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ background: decision.bg, border: `2px solid ${decision.color}`, color: decision.color }}>
                        {decision.icon}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 tracking-widest uppercase mb-0.5" style={{ fontFamily: "monospace" }}>Credit Decision</p>
                        <p className="text-2xl font-bold" style={{ color: decision.color, fontFamily: "'Georgia', serif" }}>
                          {decision.verdict}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "monospace" }}>Stability Score</p>
                      <p className="text-4xl font-bold" style={{ color: decision.color, fontFamily: "'Georgia', serif" }}>
                        {worker.score}
                      </p>
                    </div>
                  </div>

                  <div className="p-7">
                    {/* Worker info */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: "Worker", value: worker.name },
                        { label: "Platform", value: worker.platform },
                        { label: "Location", value: worker.city },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "monospace" }}>{label}</p>
                          <p className="text-sm text-white font-medium" style={{ fontFamily: "monospace" }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Financial metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: "Avg Monthly Income", value: `₹${worker.avgMonthlyGigIncome.toLocaleString("en-IN")}`, color: "#00FFD1" },
                        { label: "Burn Rate (90d)", value: `₹${worker.burnRate.toLocaleString("en-IN")}`, color: "#FF6B6B" },
                        { label: "Active Days", value: `${worker.gigDaysActive} / 90`, color: "#7B61FF" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-xl p-4"
                          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: "monospace" }}>{label}</p>
                          <p className="text-lg font-bold" style={{ color, fontFamily: "'Georgia', serif" }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Offer / Suggestion */}
                    <div className="rounded-xl p-5"
                      style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${decision.border}` }}>
                      <div className="flex items-start gap-3">
                        <span style={{ color: decision.color, fontSize: "18px" }}>◈</span>
                        <div>
                          <p className="text-xs text-gray-400 mb-1 tracking-wide" style={{ fontFamily: "monospace" }}>
                            {decision.verdict === "APPROVED" ? "RECOMMENDED OFFER" :
                              decision.verdict === "CONDITIONAL" ? "CONDITIONAL OFFER" : "RISK MITIGATION"}
                          </p>
                          <p className="text-sm text-white leading-relaxed" style={{ fontFamily: "monospace" }}>
                            {decision.suggestion}
                          </p>
                          {decision.offerLimit && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-gray-500" style={{ fontFamily: "monospace" }}>Credit Limit:</span>
                              <span className="text-lg font-bold" style={{ color: decision.color, fontFamily: "'Georgia', serif" }}>
                                ₹{decision.offerLimit}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import {
  HardHat,
  Users,
  Building2,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Activity,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Clock,
  X,
  MapPin,
  Sparkles,
  ChevronDown,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const [selectedSiteId, setSelectedSiteId] = useState("ALL");
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [activeShiftIndex, setActiveShiftIndex] = useState(1);

  // Daily Work Shifts
  const shifts = [
    { label: "06:00 - 09:00", title: "Morning Start & Safety Briefing", multiplier: 0.7 },
    { label: "09:00 - 16:00", title: "Peak Work Hours", multiplier: 1.0 },
    { label: "16:00 - 20:00", title: "Evening Wrap-Up & Checks", multiplier: 0.5 },
  ];

  // Active Construction Sites
  const [sites, setSites] = useState([
    {
      id: "SITE-101",
      name: "Metropolis Tower B",
      subTitle: "Commercial High-Rise",
      location: "Financial District",
      manager: "Robert Vance",
      budget: 1450000,
      spent: 980000,
      targetWorkers: 150,
      activeWorkers: 142,
      progress: 78,
      safetyDays: 164,
      phase: "Floor 34 Pillar Framing",
      alertStatus: "Normal",
    },
    {
      id: "SITE-102",
      name: "Riverfront Luxury Condos",
      subTitle: "Residential Towers",
      location: "Waterfront Boulevard",
      manager: "Elena Rostova",
      budget: 890000,
      spent: 410000,
      targetWorkers: 110,
      activeWorkers: 98,
      progress: 46,
      safetyDays: 142,
      phase: "Foundation Concrete Pouring",
      alertStatus: "Rain Alert",
    },
    {
      id: "SITE-103",
      name: "Grand Central Logistics Park",
      subTitle: "Cold Storage Warehouse",
      location: "Zone 9 Industrial Area",
      manager: "Marcus Brody",
      budget: 2200000,
      spent: 1950000,
      targetWorkers: 120,
      activeWorkers: 108,
      progress: 91,
      safetyDays: 280,
      phase: "Roof Panels & Wiring Setup",
      alertStatus: "Normal",
    },
  ]);

  // Live Activity Logs
  const [feedLogs, setFeedLogs] = useState([
    {
      id: "LOG-901",
      worker: "David Miller",
      trade: "Master Mason",
      siteId: "SITE-101",
      action: "Scanned card at Gate B entry turnstile",
      time: "2 mins ago",
    },
    {
      id: "LOG-902",
      worker: "Elena Rostova",
      trade: "Site Manager",
      siteId: "SITE-102",
      action: "Completed concrete quality test (Passed)",
      time: "7 mins ago",
    },
    {
      id: "LOG-903",
      worker: "Carlos Mendez",
      trade: "Steel Fixer",
      siteId: "SITE-103",
      action: "Checked crane weight cables for safety",
      time: "14 mins ago",
    },
    {
      id: "LOG-904",
      worker: "Aarav Sharma",
      trade: "Lead Electrician",
      siteId: "SITE-101",
      action: "Started primary backup generator unit",
      time: "25 mins ago",
    },
  ]);

  // New Worker Form State
  const [newDispatch, setNewDispatch] = useState({
    name: "",
    trade: "Master Mason",
    siteId: "SITE-101",
  });

  // Filtered Sites
  const filteredSites = useMemo(() => {
    return selectedSiteId === "ALL"
      ? sites
      : sites.filter((s) => s.id === selectedSiteId);
  }, [sites, selectedSiteId]);

  // Calculations
  const shiftMultiplier = shifts[activeShiftIndex].multiplier;

  const totalActiveWorkers = useMemo(() => {
    const raw = filteredSites.reduce((acc, s) => acc + s.activeWorkers, 0);
    return Math.round(raw * shiftMultiplier);
  }, [filteredSites, shiftMultiplier]);

  const totalTargetWorkers = useMemo(() => {
    return filteredSites.reduce((acc, s) => acc + s.targetWorkers, 0);
  }, [filteredSites]);

  const totalBudget = useMemo(() => {
    return filteredSites.reduce((acc, s) => acc + s.budget, 0);
  }, [filteredSites]);

  const totalSpent = useMemo(() => {
    return filteredSites.reduce((acc, s) => acc + s.spent, 0);
  }, [filteredSites]);

  const avgProgress = useMemo(() => {
    if (filteredSites.length === 0) return 0;
    return Math.round(
      filteredSites.reduce((acc, s) => acc + s.progress, 0) / filteredSites.length
    );
  }, [filteredSites]);

  const dailyCostEst = useMemo(() => {
    return totalActiveWorkers * 140 + filteredSites.length * 300;
  }, [totalActiveWorkers, filteredSites]);

  // Refresh Simulation
  const triggerTelemetryPulse = () => {
    setIsLiveSyncing(true);
    setTimeout(() => {
      setSites((prev) =>
        prev.map((s) => ({
          ...s,
          activeWorkers: Math.min(
            s.targetWorkers,
            Math.max(20, s.activeWorkers + (Math.random() > 0.4 ? 1 : -1))
          ),
          progress: Math.min(100, s.progress + (Math.random() > 0.8 ? 1 : 0)),
        }))
      );
      setIsLiveSyncing(false);
    }, 600);
  };

  // Add Worker
  const handleDeployWorker = (e) => {
    e.preventDefault();
    if (!newDispatch.name.trim()) return;

    setSites((prev) =>
      prev.map((s) =>
        s.id === newDispatch.siteId
          ? { ...s, activeWorkers: s.activeWorkers + 1 }
          : s
      )
    );

    const targetSite = sites.find((s) => s.id === newDispatch.siteId);

    setFeedLogs((prev) => [
      {
        id: `LOG-${Date.now().toString().slice(-3)}`,
        worker: newDispatch.name,
        trade: newDispatch.trade,
        siteId: newDispatch.siteId,
        action: `Assigned and sent to ${targetSite ? targetSite.name : "Job Site"}`,
        time: "Just now",
      },
      ...prev,
    ]);

    setNewDispatch({
      name: "",
      trade: "Master Mason",
      siteId: sites[0]?.id || "SITE-101",
    });
    setIsDispatchOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-amber-400 selection:text-black antialiased relative">
      
      {/* Background Soft Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium tracking-wide uppercase text-emerald-400">
                Live System Connected
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Real-Time Site Monitor</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
              Construction <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Command Center</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Track workers on duty, project progress, daily budgets, and safety records across all your construction sites.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            
            {/* Site Filter Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="appearance-none w-full sm:w-56 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-amber-400 transition cursor-pointer pr-10"
              >
                <option value="ALL" className="bg-[#101522]">All Projects ({sites.length})</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#101522]">
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={triggerTelemetryPulse}
              disabled={isLiveSyncing}
              title="Refresh Site Data"
              className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLiveSyncing ? "animate-spin text-amber-400" : ""}`} />
            </button>

            {/* Add Worker Button */}
            <button
              onClick={() => setIsDispatchOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Worker</span>
            </button>
          </div>
        </header>

        {/* Shift Timing Bar */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 pl-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Select Current Shift:</span>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {shifts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveShiftIndex(idx)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
                  activeShiftIndex === idx
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                    : "text-slate-400 hover:text-white bg-white/[0.02] border border-white/5"
                }`}
              >
                <span className="font-mono text-[11px] opacity-75">{s.label}</span>
                <span>•</span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Top 4 Highlights (Key Numbers) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Workers On Duty</span>
              <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {totalActiveWorkers}
              </span>
              <span className="text-xs text-slate-400">
                of {totalTargetWorkers} planned
              </span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    totalTargetWorkers > 0 ? (totalActiveWorkers / totalTargetWorkers) * 100 : 0
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Estimated Daily Cost</span>
              <div className="p-2 bg-emerald-400/10 rounded-lg text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                ${(dailyCostEst / 1000).toFixed(1)}k
              </span>
              <span className="text-xs text-slate-400">per day</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Total Spent: <span className="text-emerald-400 font-semibold">${(totalSpent / 1000000).toFixed(2)}M</span> /${(totalBudget / 1000000).toFixed(2)}M
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Average Progress</span>
              <div className="p-2 bg-cyan-400/10 rounded-lg text-cyan-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {avgProgress}%
              </span>
              <span className="text-xs text-slate-400">completed</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${avgProgress}%` }}
              />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Safe Working Days</span>
              <div className="p-2 bg-purple-400/10 rounded-lg text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {Math.max(...filteredSites.map((s) => s.safetyDays), 0)}
              </span>
              <span className="text-xs text-purple-400 font-medium">days incident-free</span>
            </div>
            <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
              <span>●</span> All safety requirements met
            </p>
          </div>

        </section>

        {/* Main Content Area */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Active Sites List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">Active Construction Projects</h2>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Showing {filteredSites.length} of {sites.length} sites
              </span>
            </div>

            <div className="space-y-4">
              {filteredSites.map((site) => {
                const budgetPercent = Math.round((site.spent / site.budget) * 100);
                const currentSiteCrew = Math.round(site.activeWorkers * shiftMultiplier);

                return (
                  <div
                    key={site.id}
                    className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-amber-400 font-semibold border border-white/5">
                            {site.id}
                          </span>
                          <h3 className="text-base font-semibold text-white">{site.name}</h3>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{site.location}</span>
                          <span>•</span>
                          <span className="text-amber-300">{site.phase}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-left sm:text-right">
                          <div className="text-sm font-semibold text-white">
                            {currentSiteCrew} <span className="text-slate-500 font-normal">/ {site.targetWorkers}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">Workers Today</div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            site.alertStatus === "Normal"
                              ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20"
                              : "bg-amber-400/10 text-amber-300 border-amber-400/20"
                          }`}
                        >
                          {site.alertStatus}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400">Construction Work Done</span>
                          <span className="text-white font-medium">{site.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${site.progress}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400">Budget Used (${(site.spent / 1000).toLocaleString()}k)</span>
                          <span className="text-emerald-400 font-medium">{budgetPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, budgetPercent)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Site Manager: <strong className="text-slate-200 font-medium">{site.manager}</strong></span>
                      <span className="text-purple-300 font-medium">{site.safetyDays} Safe Work Days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Live Activity Log (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Live Site Updates</h2>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-3">
              {feedLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 transition space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-white">{log.worker}</span>
                    <span className="text-[11px] text-slate-400">{log.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{log.action}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-amber-300 font-medium border border-white/5">
                      {log.trade}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {sites.find((s) => s.id === log.siteId)?.name || log.siteId}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Informational Tip Card */}
            <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/15 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Instant Turnstile Updates</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                Gate scanners and equipment monitors update automatically without needing manual page refreshes.
              </p>
            </div>
          </div>

        </section>

      </div>

      {/* Slide-out Panel to Add Worker */}
      {isDispatchOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">New Assignment</span>
                  <h3 className="text-xl font-semibold text-white mt-1">Add Worker to Site</h3>
                </div>
                <button
                  onClick={() => setIsDispatchOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDeployWorker} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Worker Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Jonathan Mercer"
                    value={newDispatch.name}
                    onChange={(e) => setNewDispatch({ ...newDispatch, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Work Role / Trade
                  </label>
                  <select
                    value={newDispatch.trade}
                    onChange={(e) => setNewDispatch({ ...newDispatch, trade: e.target.value })}
                    className="w-full bg-[#141a29] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                  >
                    <option value="Master Mason">Master Mason</option>
                    <option value="Steel Fixer">Steel Fixer</option>
                    <option value="Lead Electrician">Lead Electrician</option>
                    <option value="Heavy Rigger">Heavy Rigger</option>
                    <option value="Safety Inspector">Safety Inspector</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Select Target Construction Site
                  </label>
                  <select
                    value={newDispatch.siteId}
                    onChange={(e) => setNewDispatch({ ...newDispatch, siteId: e.target.value })}
                    className="w-full bg-[#141a29] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.activeWorkers} current workers)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    Confirm & Send to Site
                  </button>
                </div>
              </form>

            </div>

            <div className="pt-6 border-t border-white/5 text-center text-xs text-slate-500">
              New worker entries automatically record in the master site database.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
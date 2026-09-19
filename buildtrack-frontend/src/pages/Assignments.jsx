import React, { useState, useMemo } from "react";
import {
  ClipboardList,
  ArrowRight,
  Search,
  Plus,
  Download,
  Building2,
  Calendar,
  Users,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  X,
  History
} from "lucide-react";

export default function Assignments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSiteFilter, setSelectedSiteFilter] = useState("ALL");
  const [isMoveDrawerOpen, setIsMoveDrawerOpen] = useState(false);

  // Available Job Sites
  const sitesList = [
    "Metropolis Tower B",
    "Riverfront Luxury Condos",
    "Grand Central Logistics Park",
    "Apex Cyber Gateway",
    "Central Metro Station Pier"
  ];

  // Available Trades / Roles
  const tradesList = [
    "Master Mason",
    "Steel Fixer",
    "Lead Electrician",
    "Heavy Rigger",
    "Safety Officer",
    "Carpenter",
    "Welder"
  ];

  // Assignments State
  const [assignments, setAssignments] = useState([
    {
      id: "ASN-101",
      worker: "Johnathan Doe",
      workerId: "WRK-4011",
      trade: "Master Mason",
      fromSite: "Central Metro Station Pier",
      toSite: "Metropolis Tower B",
      date: "2026-09-19",
      reason: "Urgent Floor Pouring",
      approvedBy: "Robert Vance"
    },
    {
      id: "ASN-102",
      worker: "Carlos Mendez",
      workerId: "WRK-4012",
      trade: "Steel Fixer",
      fromSite: "Metropolis Tower B",
      toSite: "Riverfront Luxury Condos",
      date: "2026-09-18",
      reason: "Foundation Rebar Reinforcement",
      approvedBy: "Elena Rostova"
    },
    {
      id: "ASN-103",
      worker: "Aarav Sharma",
      workerId: "WRK-4013",
      trade: "Lead Electrician",
      fromSite: "Apex Cyber Gateway",
      toSite: "Grand Central Logistics Park",
      date: "2026-09-18",
      reason: "Generator Wiring Setup",
      approvedBy: "Marcus Brody"
    },
    {
      id: "ASN-104",
      worker: "Liam O'Connor",
      workerId: "WRK-4014",
      trade: "Heavy Rigger",
      fromSite: "Riverfront Luxury Condos",
      toSite: "Metropolis Tower B",
      date: "2026-09-17",
      reason: "Tower Crane Assembly",
      approvedBy: "Robert Vance"
    }
  ]);

  // Form Initial State for New Assignment
  const initialMoveForm = {
    worker: "",
    trade: tradesList[0],
    fromSite: sitesList[0],
    toSite: sitesList[1],
    date: new Date().toISOString().split("T")[0],
    reason: "",
    approvedBy: ""
  };
  const [moveFormData, setMoveFormData] = useState(initialMoveForm);

  // Filter Logic
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        item.worker.toLowerCase().includes(query) ||
        item.workerId.toLowerCase().includes(query) ||
        item.trade.toLowerCase().includes(query) ||
        item.toSite.toLowerCase().includes(query) ||
        item.fromSite.toLowerCase().includes(query);

      const matchesSite =
        selectedSiteFilter === "ALL" ||
        item.toSite === selectedSiteFilter ||
        item.fromSite === selectedSiteFilter;

      return matchesSearch && matchesSite;
    });
  }, [assignments, searchTerm, selectedSiteFilter]);

  // Summary Counts
  const metrics = useMemo(() => {
    const totalMoves = assignments.length;
    const todayDate = "2026-09-19";
    const movesToday = assignments.filter((a) => a.date === todayDate).length;
    const uniqueSitesInvolved = new Set(
      assignments.flatMap((a) => [a.fromSite, a.toSite])
    ).size;
    const uniqueWorkersMoved = new Set(assignments.map((a) => a.worker)).size;

    return { totalMoves, movesToday, uniqueSitesInvolved, uniqueWorkersMoved };
  }, [assignments]);

  // Submit New Worker Move
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!moveFormData.worker.trim()) return;

    const newEntry = {
      id: `ASN-${Math.floor(100 + Math.random() * 900)}`,
      workerId: `WRK-${Math.floor(4000 + Math.random() * 900)}`,
      worker: moveFormData.worker,
      trade: moveFormData.trade,
      fromSite: moveFormData.fromSite,
      toSite: moveFormData.toSite,
      date: moveFormData.date,
      reason: moveFormData.reason || "Routine Reallocation",
      approvedBy: moveFormData.approvedBy || "Site Manager"
    };

    setAssignments((prev) => [newEntry, ...prev]);
    setMoveFormData(initialMoveForm);
    setIsMoveDrawerOpen(false);
  };

  // Download CSV
  const exportCSV = () => {
    const header = "Transfer ID,Worker ID,Worker Name,Role,From Site,To Site,Transfer Date,Reason,Approved By\n";
    const rows = filteredAssignments
      .map(
        (a) =>
          `"${a.id}","${a.workerId}","${a.worker}","${a.trade}","${a.fromSite}","${a.toSite}","${a.date}","${a.reason}","${a.approvedBy}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `worker-assignments-${new Date().toISOString().split("T")[0]}.csv`);
    link.click();
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
                Site Transfers Active
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{filteredAssignments.length} Records Shown</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
              Worker <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Site Assignments</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Track worker transfers between job sites, check movement dates, and approve site changes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download List</span>
            </button>

            <button
              onClick={() => setIsMoveDrawerOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Assign to New Site</span>
            </button>
          </div>
        </header>

        {/* 4 Summary Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Transfers</span>
              <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.totalMoves}
              </span>
              <span className="text-xs text-amber-300 font-medium">recorded</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Across all regional projects
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Transferred Today</span>
              <div className="p-2 bg-emerald-400/10 rounded-lg text-emerald-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.movesToday}
              </span>
              <span className="text-xs text-emerald-400 font-medium">moves today</span>
            </div>
            <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All arrivals confirmed</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Workers Reallocated</span>
              <div className="p-2 bg-cyan-400/10 rounded-lg text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.uniqueWorkersMoved}
              </span>
              <span className="text-xs text-cyan-400 font-medium">people</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Moved to balance job site demand
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Sites Connected</span>
              <div className="p-2 bg-purple-400/10 rounded-lg text-purple-400">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.uniqueSitesInvolved}
              </span>
              <span className="text-xs text-purple-400 font-medium">active locations</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Sharing site workers smoothly
            </p>
          </div>

        </section>

        {/* Search & Filters */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by worker name, role, ID, or site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Site Filter Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <select
                value={selectedSiteFilter}
                onChange={(e) => setSelectedSiteFilter(e.target.value)}
                className="appearance-none bg-[#101522] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Sites Involved</option>
                {sitesList.map((site) => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Button */}
            {(searchTerm || selectedSiteFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSiteFilter("ALL");
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 cursor-pointer transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* Assignments Table */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-4 px-5">Worker &amp; ID</th>
                  <th className="py-4 px-5">Role</th>
                  <th className="py-4 px-5">Previous Site</th>
                  <th className="py-4 px-5">New Assigned Site</th>
                  <th className="py-4 px-5">Transfer Date</th>
                  <th className="py-4 px-5">Transfer Reason</th>
                  <th className="py-4 px-5 text-right">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400">
                      <ClipboardList className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                      <p className="font-medium text-white">No site transfer records found.</p>
                      <p className="text-xs mt-1 text-slate-500">Change your search keyword or assign a worker to a site.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Worker & ID */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 text-amber-300 border border-white/10 flex items-center justify-center font-semibold text-sm shrink-0">
                            {row.worker.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {row.worker}
                            </div>
                            <div className="text-xs font-mono text-amber-400/80 mt-0.5">
                              {row.workerId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Trade */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{row.trade}</span>
                        </div>
                      </td>

                      {/* Previous Site */}
                      <td className="py-4 px-5">
                        <span className="text-xs text-slate-400">{row.fromSite}</span>
                      </td>

                      {/* New Assigned Site */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 text-amber-300 font-medium">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{row.toSite}</span>
                        </div>
                      </td>

                      {/* Transfer Date */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{row.date}</span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-5">
                        <span className="text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                          {row.reason}
                        </span>
                      </td>

                      {/* Approved By */}
                      <td className="py-4 px-5 text-right">
                        <span className="text-xs font-medium text-slate-200">
                          {row.approvedBy}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Drawer: ASSIGN TO NEW SITE */}
      {isMoveDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Site Transfer</span>
                  <h3 className="text-xl font-semibold text-white mt-1">Move Worker to Site</h3>
                </div>
                <button
                  onClick={() => setIsMoveDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Worker Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Samuel Johnson"
                    value={moveFormData.worker}
                    onChange={(e) => setMoveFormData({ ...moveFormData, worker: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Work Role / Trade
                  </label>
                  <select
                    value={moveFormData.trade}
                    onChange={(e) => setMoveFormData({ ...moveFormData, trade: e.target.value })}
                    className="w-full bg-[#141a29] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                  >
                    {tradesList.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Current Site
                    </label>
                    <select
                      value={moveFormData.fromSite}
                      onChange={(e) => setMoveFormData({ ...moveFormData, fromSite: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      {sitesList.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      New Target Site
                    </label>
                    <select
                      value={moveFormData.toSite}
                      onChange={(e) => setMoveFormData({ ...moveFormData, toSite: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      {sitesList.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Transfer Date
                    </label>
                    <input
                      type="date"
                      required
                      value={moveFormData.date}
                      onChange={(e) => setMoveFormData({ ...moveFormData, date: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Approved By
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Robert Vance"
                      value={moveFormData.approvedBy}
                      onChange={(e) => setMoveFormData({ ...moveFormData, approvedBy: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Reason for Move
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Floor 34 concrete pour support"
                    value={moveFormData.reason}
                    onChange={(e) => setMoveFormData({ ...moveFormData, reason: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    Confirm &amp; Move Worker
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-white/5 text-xs text-slate-500 text-center">
              Transfers instantly update site muster lists and active gate credentials.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
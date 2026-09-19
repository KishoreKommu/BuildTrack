import React, { useState, useMemo } from "react";
import {
  Building2,
  MapPin,
  ShieldCheck,
  Users,
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  Activity,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  ChevronDown
} from "lucide-react";

export default function Sites() {
  // Master Sites State
  const [sites, setSites] = useState([
    {
      id: "SITE-101",
      name: "Metropolis Tower B",
      subTitle: "Commercial High-Rise",
      location: "Sector 4, Financial District",
      superintendent: "Robert Vance",
      budget: 1450000,
      spent: 980000,
      workersAssigned: 142,
      targetWorkers: 160,
      progress: 78,
      safetyDays: 164,
      status: "Pillar Framing",
      startDate: "2024-01-15",
      targetCompletion: "2025-08-30",
      musterPoint: "East Gate Plaza",
      priority: "High"
    },
    {
      id: "SITE-102",
      name: "Riverfront Luxury Condos",
      subTitle: "Waterfront Residential Towers",
      location: "Pier 17, Waterfront Blvd",
      superintendent: "Elena Rostova",
      budget: 890000,
      spent: 410000,
      workersAssigned: 98,
      targetWorkers: 110,
      progress: 46,
      safetyDays: 142,
      status: "Foundation Work",
      startDate: "2024-04-10",
      targetCompletion: "2026-02-15",
      musterPoint: "North Pier Gate",
      priority: "Normal"
    },
    {
      id: "SITE-103",
      name: "Grand Central Logistics Park",
      subTitle: "Cold Storage Warehouse",
      location: "Zone 9 Industrial Area",
      superintendent: "Marcus Brody",
      budget: 2200000,
      spent: 1950000,
      workersAssigned: 108,
      targetWorkers: 120,
      progress: 91,
      safetyDays: 280,
      status: "Final Checks",
      startDate: "2023-09-01",
      targetCompletion: "2024-12-20",
      musterPoint: "Loading Dock 4",
      priority: "Urgent"
    },
    {
      id: "SITE-104",
      name: "Apex Cyber Gateway",
      subTitle: "Data Center Facility",
      location: "Tech District High Street",
      superintendent: "Devon Vance",
      budget: 3100000,
      spent: 1240000,
      workersAssigned: 134,
      targetWorkers: 150,
      progress: 38,
      safetyDays: 95,
      status: "Electrical Wiring",
      startDate: "2024-05-01",
      targetCompletion: "2026-06-30",
      musterPoint: "Courtyard B Gate",
      priority: "Normal"
    }
  ]);

  const siteStatuses = [
    "Foundation Work",
    "Pillar Framing",
    "Electrical Wiring",
    "Final Checks",
    "Closed"
  ];

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Side Drawers & Modals
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [telemetrySite, setTelemetrySite] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // New Site Form Initial State
  const initialForm = {
    name: "",
    subTitle: "Commercial Construction Project",
    location: "",
    superintendent: "",
    budget: 1200000,
    targetWorkers: 120,
    status: siteStatuses[0],
    startDate: new Date().toISOString().split("T")[0],
    targetCompletion: "2026-12-31",
    musterPoint: "Main Gate 1",
    priority: "Normal"
  };
  const [formData, setFormData] = useState(initialForm);

  // Filter Logic
  const filteredSites = useMemo(() => {
    return sites.filter((s) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query) ||
        s.superintendent.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query);

      const matchesStatus = selectedStatus === "ALL" || s.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [sites, searchTerm, selectedStatus]);

  // Overall Numbers
  const metrics = useMemo(() => {
    const totalProjects = sites.length;
    const totalBudget = sites.reduce((sum, s) => sum + s.budget, 0);
    const totalSpent = sites.reduce((sum, s) => sum + s.spent, 0);
    const totalCrew = sites.reduce((sum, s) => sum + s.workersAssigned, 0);
    const avgProgress =
      totalProjects > 0
        ? Math.round(sites.reduce((sum, s) => sum + s.progress, 0) / totalProjects)
        : 0;

    return { totalProjects, totalBudget, totalSpent, totalCrew, avgProgress };
  }, [sites]);

  // Add Site
  const handleCreateSite = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newSite = {
      ...formData,
      id: `SITE-${Math.floor(100 + Math.random() * 900)}`,
      budget: Number(formData.budget),
      spent: 0,
      workersAssigned: 0,
      targetWorkers: Number(formData.targetWorkers),
      progress: 0,
      safetyDays: 0
    };

    setSites((prev) => [newSite, ...prev]);
    setFormData(initialForm);
    setIsAddDrawerOpen(false);
  };

  // Edit Site
  const handleUpdateSite = (e) => {
    e.preventDefault();
    if (!editingSite) return;

    setSites((prev) =>
      prev.map((s) =>
        s.id === editingSite.id
          ? {
              ...editingSite,
              budget: Number(editingSite.budget),
              spent: Number(editingSite.spent),
              progress: Number(editingSite.progress),
              workersAssigned: Number(editingSite.workersAssigned),
              targetWorkers: Number(editingSite.targetWorkers)
            }
          : s
      )
    );
    setEditingSite(null);
  };

  // Delete Site
  const confirmDeleteSite = () => {
    if (!deleteConfirmId) return;
    setSites((prev) => prev.filter((s) => s.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  // Download CSV
  const exportCSV = () => {
    const header = "Site ID,Project Name,Location,Manager,Stage,Budget ($),Spent ($),Active Workers,Progress (%)\n";
    const rows = filteredSites
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.location}","${s.superintendent}","${s.status}","${s.budget}","${s.spent}","${s.workersAssigned}","${s.progress}%"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `construction-sites-${new Date().toISOString().split("T")[0]}.csv`);
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
                Live Sites System Online
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{filteredSites.length} Projects Listed</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
              Construction <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Project Sites</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Track active project locations, budgets spent, completion stages, emergency gathering points, and site managers.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download List</span>
            </button>

            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Site</span>
            </button>
          </div>
        </header>

        {/* 4 Summary Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Active Projects</span>
              <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.totalProjects}
              </span>
              <span className="text-xs text-emerald-400 font-medium">all active</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full w-full" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Project Budget</span>
              <div className="p-2 bg-emerald-400/10 rounded-lg text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                ${(metrics.totalBudget / 1000000).toFixed(2)}M
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                ${(metrics.totalSpent / 1000000).toFixed(2)}M spent
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Budget Used: <span className="text-emerald-400 font-medium">{metrics.totalBudget > 0 ? Math.round((metrics.totalSpent / metrics.totalBudget) * 100) : 0}%</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Workers On Sites</span>
              <div className="p-2 bg-cyan-400/10 rounded-lg text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.totalCrew}
              </span>
              <span className="text-xs text-slate-400">total crew</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (metrics.totalCrew / 500) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Overall Work Done</span>
              <div className="p-2 bg-purple-400/10 rounded-lg text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.avgProgress}%
              </span>
              <span className="text-xs text-purple-400 font-medium">average done</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-purple-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.avgProgress}%` }}
              />
            </div>
          </div>

        </section>

        {/* Search and Filters Bar */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by project name, location, ID, or manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Stage Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-[#101522] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Project Stages</option>
                {siteStatuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedStatus !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("ALL");
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 cursor-pointer transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* Sites Table */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-4 px-5">Site &amp; ID</th>
                  <th className="py-4 px-5">Current Stage</th>
                  <th className="py-4 px-5">Site Manager</th>
                  <th className="py-4 px-5">Budget Status</th>
                  <th className="py-4 px-5">Workers Present</th>
                  <th className="py-4 px-5">Work Progress</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredSites.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400">
                      <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                      <p className="font-medium text-white">No sites match your search.</p>
                      <p className="text-xs mt-1 text-slate-500">Create a new site or clear your search terms.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSites.map((site) => {
                    const capitalBurnPct = site.budget > 0 ? Math.round((site.spent / site.budget) * 100) : 0;

                    return (
                      <tr
                        key={site.id}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        {/* Name & ID */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 text-amber-300 border border-white/10 flex items-center justify-center font-semibold text-sm shrink-0">
                              <Building2 className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white flex items-center gap-2">
                                <span>{site.name}</span>
                                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                                  site.priority === "Urgent" || site.priority === "High"
                                    ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                                    : "bg-amber-400/10 text-amber-300 border-amber-400/20"
                                }`}>
                                  {site.priority}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span className="font-mono text-amber-400/80">{site.id}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-500" />
                                  <span>{site.location}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Stage */}
                        <td className="py-4 px-5">
                          <span className="text-xs font-medium text-slate-200 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                            {site.status}
                          </span>
                          <p className="text-xs text-slate-400 mt-1">Due: {site.targetCompletion}</p>
                        </td>

                        {/* Superintendent & Safety */}
                        <td className="py-4 px-5">
                          <div className="text-white font-medium text-xs">
                            {site.superintendent}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{site.safetyDays} Safe Days</span>
                          </div>
                        </td>

                        {/* Budget */}
                        <td className="py-4 px-5">
                          <div className="font-mono text-xs font-semibold text-white">
                            ${(site.budget / 1000).toLocaleString()}k
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            ${(site.spent / 1000).toLocaleString()}k used ({capitalBurnPct}%)
                          </div>
                        </td>

                        {/* Workers */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                            <Users className="w-3.5 h-3.5 text-amber-400" />
                            <span>{site.workersAssigned}</span>
                            <span className="text-slate-500 font-normal">/ {site.targetWorkers}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">Gate: {site.musterPoint}</p>
                        </td>

                        {/* Progress Bar */}
                        <td className="py-4 px-5 w-44">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Done</span>
                            <span className="font-mono font-medium text-white">{site.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${site.progress}%` }}
                            />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setTelemetrySite(site)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
                              title="View Site Information"
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingSite(site)}
                              className="p-2 text-slate-400 hover:text-amber-300 hover:bg-white/5 rounded-lg transition cursor-pointer"
                              title="Edit Site Details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(site.id)}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition cursor-pointer"
                              title="Delete Site"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Drawer 1: ADD NEW SITE */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">New Project</span>
                  <h3 className="text-xl font-semibold text-white mt-1">Add Construction Site</h3>
                </div>
                <button
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSite} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Apex Horizon Tower B"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Location / Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sector 12 Industrial Zone"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Site Manager
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Richard Hayes"
                      value={formData.superintendent}
                      onChange={(e) => setFormData({ ...formData, superintendent: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Starting Stage
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      {siteStatuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Total Budget ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="10000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Workers Needed
                    </label>
                    <input
                      type="number"
                      required
                      min="5"
                      value={formData.targetWorkers}
                      onChange={(e) => setFormData({ ...formData, targetWorkers: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Emergency Gathering Point
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Gate 3 West Ground"
                    value={formData.musterPoint}
                    onChange={(e) => setFormData({ ...formData, musterPoint: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    Save &amp; Add Site
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-white/5 text-xs text-slate-500 text-center">
              New project sites appear immediately across the system.
            </div>
          </div>
        </div>
      )}

      {/* Drawer 2: EDIT SITE */}
      {editingSite && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold">{editingSite.id}</span>
                  <h3 className="text-xl font-semibold text-white mt-1">Edit Project Site</h3>
                </div>
                <button
                  onClick={() => setEditingSite(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSite} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSite.name}
                    onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Work Progress (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={editingSite.progress}
                      onChange={(e) => setEditingSite({ ...editingSite, progress: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Current Stage
                    </label>
                    <select
                      value={editingSite.status}
                      onChange={(e) => setEditingSite({ ...editingSite, status: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      {siteStatuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Amount Spent ($)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingSite.spent}
                      onChange={(e) => setEditingSite({ ...editingSite, spent: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Total Budget ($)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingSite.budget}
                      onChange={(e) => setEditingSite({ ...editingSite, budget: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Workers Present
                    </label>
                    <input
                      type="number"
                      required
                      value={editingSite.workersAssigned}
                      onChange={(e) => setEditingSite({ ...editingSite, workersAssigned: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Site Manager
                    </label>
                    <input
                      type="text"
                      required
                      value={editingSite.superintendent}
                      onChange={(e) => setEditingSite({ ...editingSite, superintendent: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-white/5 text-xs text-slate-500 text-center">
              Updates will automatically refresh in the main summary metrics.
            </div>
          </div>
        </div>
      )}

      {/* Drawer 3: VIEW SITE DETAILS */}
      {telemetrySite && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold">{telemetrySite.id}</span>
                  <h3 className="text-xl font-semibold text-white mt-1">{telemetrySite.name}</h3>
                  <p className="text-xs text-slate-400">{telemetrySite.subTitle}</p>
                </div>
                <button
                  onClick={() => setTelemetrySite(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Site Details Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                  <Activity className="w-4 h-4" />
                  <span>Site Summary Information</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Site Manager:</span>
                    <span className="font-medium text-white">{telemetrySite.superintendent}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Emergency Gathering Gate:</span>
                    <span className="font-medium text-amber-300">{telemetrySite.musterPoint}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Accident-Free Track:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{telemetrySite.safetyDays} Days</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Budget Spent / Total:</span>
                    <span className="font-mono text-white">
                      ${(telemetrySite.spent / 1000).toLocaleString()}k / ${(telemetrySite.budget / 1000).toLocaleString()}k
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setTelemetrySite(null)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#101522] border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-white">Delete Project Site?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove <strong className="text-white font-mono">{deleteConfirmId}</strong>? All workers and progress records for this site will be removed.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-1/2 bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSite}
                className="w-1/2 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-xl text-xs font-medium transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
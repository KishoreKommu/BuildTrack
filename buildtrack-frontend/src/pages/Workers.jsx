import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Phone,
  ShieldCheck,
  Wrench,
  DollarSign,
  Building2,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Plus,
  BadgeCheck,
  Download,
  Eye,
  ChevronDown
} from "lucide-react";

export default function Workers() {
  const [availableSites] = useState([
    "Metropolis Tower B",
    "Riverfront Luxury Condos",
    "Grand Central Logistics Park",
    "Apex Cyber Gateway",
    "Central Metro Station Pier"
  ]);

  const tradesList = [
    "Master Mason",
    "Steel Fixer",
    "Lead Electrician",
    "Heavy Rigger",
    "Safety Officer",
    "Carpenter",
    "Scaffolder",
    "Welder"
  ];

  // Workers Data
  const [workers, setWorkers] = useState([
    {
      id: "WRK-4011",
      name: "Johnathan Doe",
      trade: "Master Mason",
      site: "Metropolis Tower B",
      phone: "+91 98480 12345",
      hourlyWage: 28,
      status: "Active",
      safetyCertified: true,
      experienceYears: 6,
      joinDate: "2024-03-15",
      shift: "Morning Shift (06:30 - 15:00)"
    },
    {
      id: "WRK-4012",
      name: "Carlos Mendez",
      trade: "Steel Fixer",
      site: "Riverfront Luxury Condos",
      phone: "+91 98480 23456",
      hourlyWage: 24,
      status: "Active",
      safetyCertified: true,
      experienceYears: 4,
      joinDate: "2024-06-20",
      shift: "Day Shift (08:00 - 16:30)"
    },
    {
      id: "WRK-4013",
      name: "Aarav Sharma",
      trade: "Lead Electrician",
      site: "Grand Central Logistics Park",
      phone: "+91 98480 34567",
      hourlyWage: 32,
      status: "Active",
      safetyCertified: true,
      experienceYears: 8,
      joinDate: "2023-11-01",
      shift: "Day Shift (08:00 - 16:30)"
    },
    {
      id: "WRK-4014",
      name: "Liam O'Connor",
      trade: "Heavy Rigger",
      site: "Metropolis Tower B",
      phone: "+91 98480 45678",
      hourlyWage: 35,
      status: "On Leave",
      safetyCertified: true,
      experienceYears: 9,
      joinDate: "2023-08-12",
      shift: "Night Shift (15:00 - 23:00)"
    },
    {
      id: "WRK-4015",
      name: "Devon Vance",
      trade: "Safety Officer",
      site: "Apex Cyber Gateway",
      phone: "+91 98480 56789",
      hourlyWage: 40,
      status: "Active",
      safetyCertified: true,
      experienceYears: 11,
      joinDate: "2022-04-18",
      shift: "Morning Shift (07:00 - 15:30)"
    }
  ]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSite, setSelectedSite] = useState("ALL");
  const [selectedTrade, setSelectedTrade] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [onlyCertified, setOnlyCertified] = useState(false);

  // Panels & Dialogs
  const [isEnrollDrawerOpen, setIsEnrollDrawerOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [inspectedWorker, setInspectedWorker] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form Initial State
  const initialForm = {
    name: "",
    trade: tradesList[0],
    site: availableSites[0],
    phone: "",
    hourlyWage: 26,
    status: "Active",
    safetyCertified: true,
    experienceYears: 4,
    shift: "Day Shift (08:00 - 16:30)"
  };
  const [formData, setFormData] = useState(initialForm);

  // Filter List Logic
  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        w.name.toLowerCase().includes(query) ||
        w.trade.toLowerCase().includes(query) ||
        w.phone.includes(searchTerm) ||
        w.id.toLowerCase().includes(query);

      const matchesSite = selectedSite === "ALL" || w.site === selectedSite;
      const matchesTrade = selectedTrade === "ALL" || w.trade === selectedTrade;
      const matchesStatus = selectedStatus === "ALL" || w.status === selectedStatus;
      const matchesCertified = !onlyCertified || w.safetyCertified;

      return matchesSearch && matchesSite && matchesTrade && matchesStatus && matchesCertified;
    });
  }, [workers, searchTerm, selectedSite, selectedTrade, selectedStatus, onlyCertified]);

  // Quick Stats
  const metrics = useMemo(() => {
    const total = workers.length;
    const active = workers.filter((w) => w.status === "Active").length;
    const onLeave = workers.filter((w) => w.status === "On Leave").length;
    const hourlyPayTotal = workers
      .filter((w) => w.status === "Active")
      .reduce((sum, w) => sum + Number(w.hourlyWage), 0);
    const certifiedCount = workers.filter((w) => w.safetyCertified).length;
    const certifiedRate = total > 0 ? Math.round((certifiedCount / total) * 100) : 0;

    return { total, active, onLeave, hourlyPayTotal, certifiedCount, certifiedRate };
  }, [workers]);

  // Click badge to change status
  const cycleStatus = (id) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const next = w.status === "Active" ? "On Leave" : w.status === "On Leave" ? "Suspended" : "Active";
          return { ...w, status: next };
        }
        return w;
      })
    );
  };

  // Add Worker
  const handleEnrollWorker = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newEntry = {
      ...formData,
      id: `WRK-${Math.floor(4000 + Math.random() * 900)}`,
      hourlyWage: Number(formData.hourlyWage),
      experienceYears: Number(formData.experienceYears),
      joinDate: new Date().toISOString().split("T")[0]
    };

    setWorkers((prev) => [newEntry, ...prev]);
    setFormData(initialForm);
    setIsEnrollDrawerOpen(false);
  };

  // Save Worker Edits
  const handleUpdateWorker = (e) => {
    e.preventDefault();
    if (!editingWorker) return;

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === editingWorker.id
          ? {
              ...editingWorker,
              hourlyWage: Number(editingWorker.hourlyWage),
              experienceYears: Number(editingWorker.experienceYears)
            }
          : w
      )
    );
    setEditingWorker(null);
  };

  // Remove Worker
  const handleDeleteWorker = () => {
    if (!deleteConfirmId) return;
    setWorkers((prev) => prev.filter((w) => w.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  // Download Excel/CSV File
  const exportCSV = () => {
    const header = "Worker ID,Name,Role,Assigned Site,Shift,Hourly Pay,Status,Safety Passed\n";
    const body = filteredWorkers
      .map(
        (w) =>
          `"${w.id}","${w.name}","${w.trade}","${w.site}","${w.shift}","$${w.hourlyWage}","${w.status}","${
            w.safetyCertified ? "Yes" : "No"
          }"`
      )
      .join("\n");

    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `workers-list-${new Date().toISOString().split("T")[0]}.csv`);
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
                Staff Directory Online
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{filteredWorkers.length} Workers Shown</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
              Worker <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Management</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              View all team members, check working locations, manage daily wages, and track safety approvals.
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
              onClick={() => setIsEnrollDrawerOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Worker</span>
            </button>
          </div>
        </header>

        {/* 4 Summary Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Workers</span>
              <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.total}
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                {metrics.active} active today
              </span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.total > 0 ? (metrics.active / metrics.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Hourly Pay Total</span>
              <div className="p-2 bg-emerald-400/10 rounded-lg text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                ${metrics.hourlyPayTotal}
              </span>
              <span className="text-xs text-slate-400">per hour</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Average: <span className="text-emerald-400 font-medium">${(metrics.hourlyPayTotal / (metrics.active || 1)).toFixed(1)}/hr</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Workers on Leave</span>
              <div className="p-2 bg-cyan-400/10 rounded-lg text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.onLeave}
              </span>
              <span className="text-xs text-slate-400">resting</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.total > 0 ? (metrics.onLeave / metrics.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Safety Trained</span>
              <div className="p-2 bg-purple-400/10 rounded-lg text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.certifiedRate}%
              </span>
              <span className="text-xs text-purple-400 font-medium">trained</span>
            </div>
            <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{metrics.certifiedCount} verified workers</span>
            </p>
          </div>

        </section>

        {/* Search and Filters Bar */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by worker name, role, ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Site Filter */}
            <div className="relative">
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="appearance-none bg-[#101522] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Sites ({availableSites.length})</option>
                {availableSites.map((site) => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Trade / Role Filter */}
            <div className="relative">
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="appearance-none bg-[#101522] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Roles ({tradesList.length})</option>
                {tradesList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-[#101522] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Safety Certified Quick Filter */}
            <button
              onClick={() => setOnlyCertified(!onlyCertified)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                onlyCertified
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white"
              }`}
            >
              <BadgeCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Safety Certified Only</span>
            </button>

            {/* Clear Filters Button */}
            {(searchTerm || selectedSite !== "ALL" || selectedTrade !== "ALL" || selectedStatus !== "ALL" || onlyCertified) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSite("ALL");
                  setSelectedTrade("ALL");
                  setSelectedStatus("ALL");
                  setOnlyCertified(false);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 cursor-pointer transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* Workers Table */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-4 px-5">Worker &amp; ID</th>
                  <th className="py-4 px-5">Role &amp; Shift</th>
                  <th className="py-4 px-5">Assigned Site</th>
                  <th className="py-4 px-5">Hourly Pay</th>
                  <th className="py-4 px-5">Phone</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                      <p className="font-medium text-white">No workers found.</p>
                      <p className="text-xs mt-1 text-slate-500">Try changing your search keywords or clear the filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((w) => (
                    <tr
                      key={w.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Name & ID */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 text-amber-300 border border-white/10 flex items-center justify-center font-semibold text-sm shrink-0">
                            {w.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-white flex items-center gap-1.5">
                              <span>{w.name}</span>
                              {w.safetyCertified && (
                                <BadgeCheck className="w-4 h-4 text-purple-400" title="Safety Approved" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="font-mono text-amber-400/80">{w.id}</span>
                              <span>•</span>
                              <span>{w.experienceYears} yrs experience</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Trade / Role */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{w.trade}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{w.shift}</p>
                      </td>

                      {/* Site */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{w.site}</span>
                        </div>
                      </td>

                      {/* Hourly Pay */}
                      <td className="py-4 px-5">
                        <span className="font-mono font-semibold text-white">${w.hourlyWage}</span>
                        <span className="text-xs text-slate-400">/hr</span>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-5">
                        <a
                          href={`tel:${w.phone}`}
                          className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs transition"
                        >
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{w.phone}</span>
                        </a>
                      </td>

                      {/* Status Button */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => cycleStatus(w.id)}
                          title="Click to switch status"
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                            w.status === "Active"
                              ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20 hover:bg-emerald-400/20"
                              : w.status === "On Leave"
                              ? "bg-amber-400/10 text-amber-300 border-amber-400/20 hover:bg-amber-400/20"
                              : "bg-rose-400/10 text-rose-300 border-rose-400/20 hover:bg-rose-400/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              w.status === "Active"
                                ? "bg-emerald-400"
                                : w.status === "On Leave"
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                          />
                          <span>{w.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setInspectedWorker(w)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
                            title="View Worker Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingWorker(w)}
                            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-white/5 rounded-lg transition cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(w.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition cursor-pointer"
                            title="Delete Worker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Drawer 1: ADD NEW WORKER */}
      {isEnrollDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">New Entry</span>
                  <h3 className="text-xl font-semibold text-white mt-1">Add Team Member</h3>
                </div>
                <button
                  onClick={() => setIsEnrollDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEnrollWorker} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Work Role
                    </label>
                    <select
                      value={formData.trade}
                      onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      {tradesList.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Assigned Site
                    </label>
                    <select
                      value={formData.site}
                      onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      {availableSites.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Hourly Pay ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="15"
                      max="150"
                      value={formData.hourlyWage}
                      onChange={(e) => setFormData({ ...formData, hourlyWage: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="safetyCertifiedEnroll"
                    checked={formData.safetyCertified}
                    onChange={(e) => setFormData({ ...formData, safetyCertified: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-400 focus:ring-0 bg-white/5 border-white/20 cursor-pointer"
                  />
                  <label htmlFor="safetyCertifiedEnroll" className="text-xs text-slate-300 select-none cursor-pointer">
                    Worker has passed full safety tests
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    Save &amp; Add Worker
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-white/5 text-xs text-slate-500 text-center">
              New worker details will be saved to your team list right away.
            </div>
          </div>
        </div>
      )}

      {/* Drawer 2: EDIT WORKER */}
      {editingWorker && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold">{editingWorker.id}</span>
                  <h3 className="text-xl font-semibold text-white mt-1">Edit Worker Details</h3>
                </div>
                <button
                  onClick={() => setEditingWorker(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateWorker} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingWorker.name}
                    onChange={(e) => setEditingWorker({ ...editingWorker, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Site Assignment
                    </label>
                    <select
                      value={editingWorker.site}
                      onChange={(e) => setEditingWorker({ ...editingWorker, site: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      {availableSites.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Current Status
                    </label>
                    <select
                      value={editingWorker.status}
                      onChange={(e) => setEditingWorker({ ...editingWorker, status: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={editingWorker.phone}
                      onChange={(e) => setEditingWorker({ ...editingWorker, phone: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Hourly Pay ($)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingWorker.hourlyWage}
                      onChange={(e) => setEditingWorker({ ...editingWorker, hourlyWage: e.target.value })}
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
              Changes will update site worker totals automatically.
            </div>
          </div>
        </div>
      )}

      {/* Drawer 3: VIEW WORKER CARD */}
      {inspectedWorker && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold">{inspectedWorker.id}</span>
                  <h3 className="text-xl font-semibold text-white mt-1">{inspectedWorker.name}</h3>
                  <p className="text-xs text-slate-400">{inspectedWorker.trade}</p>
                </div>
                <button
                  onClick={() => setInspectedWorker(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Worker Information Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Worker Badge Details</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Assigned Job Site:</span>
                    <span className="font-medium text-white">{inspectedWorker.site}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Working Shift:</span>
                    <span className="font-medium text-white">{inspectedWorker.shift}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Start Date:</span>
                    <span className="font-mono text-white">{inspectedWorker.joinDate}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Safety Status:</span>
                    <span className={`font-semibold ${inspectedWorker.safetyCertified ? "text-emerald-400" : "text-amber-400"}`}>
                      {inspectedWorker.safetyCertified ? "Passed Safety Training" : "Pending Safety Training"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setInspectedWorker(null)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Box */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#101522] border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-white">Remove Worker?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove <strong className="text-white font-mono">{deleteConfirmId}</strong> from your active team?
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
                onClick={handleDeleteWorker}
                className="w-1/2 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-xl text-xs font-medium transition cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
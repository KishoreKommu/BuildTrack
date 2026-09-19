import React, { useState, useMemo } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Download,
  Plus,
  Building2,
  Calendar,
  Eye,
  Check,
  X,
  ChevronDown
} from "lucide-react";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState("2026-09-19");
  const [selectedSiteFilter, setSelectedSiteFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Drawers and Modals
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [inspectedAttendance, setInspectedAttendance] = useState(null);

  // Job Sites
  const sitesList = [
    "Metropolis Tower B",
    "Riverfront Luxury Condos",
    "Grand Central Logistics Park",
    "Apex Cyber Gateway"
  ];

  // Attendance Records
  const [roster, setRoster] = useState([
    {
      id: "ATT-701",
      workerId: "WRK-4011",
      name: "Johnathan Doe",
      trade: "Master Mason",
      site: "Metropolis Tower B",
      status: "Present",
      shift: "Morning Shift (06:30 - 15:00)",
      clockIn: "06:22 AM",
      clockOut: "--:--",
      overtimeHours: 2.0,
      hourlyRate: 28,
      turnstileGate: "East Gate 2"
    },
    {
      id: "ATT-702",
      workerId: "WRK-4012",
      name: "Carlos Mendez",
      trade: "Steel Fixer",
      site: "Riverfront Luxury Condos",
      status: "Present",
      shift: "Day Shift (08:00 - 16:30)",
      clockIn: "07:54 AM",
      clockOut: "--:--",
      overtimeHours: 0.0,
      hourlyRate: 24,
      turnstileGate: "North Pier Gate 1"
    },
    {
      id: "ATT-703",
      workerId: "WRK-4013",
      name: "Aarav Sharma",
      trade: "Lead Electrician",
      site: "Grand Central Logistics Park",
      status: "Late",
      shift: "Day Shift (08:00 - 16:30)",
      clockIn: "08:42 AM",
      clockOut: "--:--",
      overtimeHours: 1.5,
      hourlyRate: 32,
      turnstileGate: "Main Gate A"
    },
    {
      id: "ATT-704",
      workerId: "WRK-4014",
      name: "Liam O'Connor",
      trade: "Heavy Rigger",
      site: "Metropolis Tower B",
      status: "Absent",
      shift: "Night Shift (15:00 - 23:00)",
      clockIn: "--:--",
      clockOut: "--:--",
      overtimeHours: 0.0,
      hourlyRate: 35,
      turnstileGate: "Not Checked In"
    },
    {
      id: "ATT-705",
      workerId: "WRK-4015",
      name: "Devon Vance",
      trade: "Safety Officer",
      site: "Apex Cyber Gateway",
      status: "Present",
      shift: "Day Shift (07:00 - 15:30)",
      clockIn: "06:55 AM",
      clockOut: "--:--",
      overtimeHours: 0.5,
      hourlyRate: 40,
      turnstileGate: "South Gate 1"
    }
  ]);

  // Form Initial State for Manual Entry
  const initialLogForm = {
    name: "",
    site: sitesList[0],
    trade: "General Worker",
    shift: "Day Shift (08:00 - 16:30)",
    status: "Present",
    clockIn: "07:30 AM",
    overtimeHours: 0,
    hourlyRate: 25
  };
  const [logFormData, setLogFormData] = useState(initialLogForm);

  // Filter Logic
  const filteredRoster = useMemo(() => {
    return roster.filter((item) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.trade.toLowerCase().includes(query) ||
        item.workerId.toLowerCase().includes(query);

      const matchesSite = selectedSiteFilter === "ALL" || item.site === selectedSiteFilter;
      const matchesStatus = selectedStatusFilter === "ALL" || item.status === selectedStatusFilter;

      return matchesSearch && matchesSite && matchesStatus;
    });
  }, [roster, searchTerm, selectedSiteFilter, selectedStatusFilter]);

  // Daily Calculations
  const metrics = useMemo(() => {
    const total = roster.length;
    const present = roster.filter((r) => r.status === "Present").length;
    const late = roster.filter((r) => r.status === "Late").length;
    const absent = roster.filter((r) => r.status === "Absent").length;
    const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    const totalOvertime = roster.reduce((sum, r) => sum + Number(r.overtimeHours), 0);

    // Standard 8 hours base pay + 1.5x overtime
    const dailyPayroll = roster
      .filter((r) => r.status === "Present" || r.status === "Late")
      .reduce((sum, r) => {
        const basePay = 8 * Number(r.hourlyRate);
        const otPay = Number(r.overtimeHours) * Number(r.hourlyRate) * 1.5;
        return sum + basePay + otPay;
      }, 0);

    return { total, present, late, absent, attendanceRate, totalOvertime, dailyPayroll };
  }, [roster]);

  // Toggle Attendance Status
  const cycleStatus = (id) => {
    setRoster((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "Present" ? "Late" : item.status === "Late" ? "Absent" : "Present";
          const newClockIn = nextStatus === "Absent" ? "--:--" : item.clockIn === "--:--" ? "08:00 AM" : item.clockIn;
          return { ...item, status: nextStatus, clockIn: newClockIn };
        }
        return item;
      })
    );
  };

  // Adjust Extra Hours (+ / -)
  const adjustOvertime = (id, delta) => {
    setRoster((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = Math.max(0, Math.min(12, Number(item.overtimeHours) + delta));
          return { ...item, overtimeHours: parseFloat(updated.toFixed(1)) };
        }
        return item;
      })
    );
  };

  // Quick Action: Mark All Present
  const markAllPresent = () => {
    setRoster((prev) =>
      prev.map((item) => ({
        ...item,
        status: "Present",
        clockIn: item.clockIn === "--:--" ? "07:30 AM" : item.clockIn
      }))
    );
  };

  // Manual Worker Sign-In
  const handleManualSwipe = (e) => {
    e.preventDefault();
    if (!logFormData.name.trim()) return;

    const newSwipe = {
      id: `ATT-${Math.floor(700 + Math.random() * 200)}`,
      workerId: `WRK-${Math.floor(4000 + Math.random() * 900)}`,
      name: logFormData.name,
      trade: logFormData.trade,
      site: logFormData.site,
      status: logFormData.status,
      shift: logFormData.shift,
      clockIn: logFormData.clockIn,
      clockOut: "--:--",
      overtimeHours: Number(logFormData.overtimeHours),
      hourlyRate: Number(logFormData.hourlyRate),
      turnstileGate: "Manual Supervisor Entry"
    };

    setRoster((prev) => [newSwipe, ...prev]);
    setLogFormData(initialLogForm);
    setIsLogDrawerOpen(false);
  };

  // Download Attendance CSV
  const exportCSV = () => {
    const header = "Record ID,Worker ID,Name,Role,Project Site,Shift,Clock In,Status,Extra Hours,Hourly Pay\n";
    const body = filteredRoster
      .map(
        (r) =>
          `"${r.id}","${r.workerId}","${r.name}","${r.trade}","${r.site}","${r.shift}","${r.clockIn}","${r.status}","${r.overtimeHours}","$${r.hourlyRate}"`
      )
      .join("\n");

    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-report-${selectedDate}.csv`;
    a.click();
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
                Gate Scanner Online
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Live Turnstile Clock-ins</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
              Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Attendance</span> Tracker
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Monitor worker clock-in times, log overtime hours, track late arrivals, and view daily wages earned.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            
            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3.5 py-2.5 rounded-xl text-sm text-slate-200">
              <Calendar className="w-4 h-4 text-amber-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-xs sm:text-sm font-medium text-white"
              />
            </div>

            {/* Mark All Present */}
            <button
              onClick={markAllPresent}
              className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Mark All Present</span>
            </button>

            {/* Download CSV */}
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download List</span>
            </button>

            {/* Manual Clock In */}
            <button
              onClick={() => setIsLogDrawerOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Manual Check-In</span>
            </button>
          </div>
        </header>

        {/* 4 Summary Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Attendance Rate</span>
              <div className="p-2 bg-emerald-400/10 rounded-lg text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.attendanceRate}%
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                {metrics.present + metrics.late} / {metrics.total} present
              </span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.attendanceRate}%` }}
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Extra Hours</span>
              <div className="p-2 bg-amber-400/10 rounded-lg text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.totalOvertime} hrs
              </span>
              <span className="text-xs text-amber-400 font-medium">overtime</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Calculated at <span className="text-amber-300 font-medium">1.5x regular pay</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Today's Total Pay</span>
              <div className="p-2 bg-cyan-400/10 rounded-lg text-cyan-400">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                ${(metrics.dailyPayroll / 1000).toFixed(1)}k
              </span>
              <span className="text-xs text-slate-400">earned today</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Includes normal shift + extra hours
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Absences &amp; Late</span>
              <div className="p-2 bg-rose-400/10 rounded-lg text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-white tracking-tight">
                {metrics.absent + metrics.late}
              </span>
              <span className="text-xs text-rose-400 font-medium">workers flagged</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              <span className="text-amber-300 font-medium">{metrics.late} late</span>,{" "}
              <span className="text-rose-400 font-medium">{metrics.absent} absent</span>
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
              placeholder="Search by worker name, role, or ID..."
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
                value={selectedSiteFilter}
                onChange={(e) => setSelectedSiteFilter(e.target.value)}
                className="appearance-none bg-[#101522] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Sites ({sitesList.length})</option>
                {sitesList.map((site) => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="appearance-none bg-[#101522] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Present">Present Only</option>
                <option value="Late">Late Only</option>
                <option value="Absent">Absent Only</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedSiteFilter !== "ALL" || selectedStatusFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSiteFilter("ALL");
                  setSelectedStatusFilter("ALL");
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 cursor-pointer transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* Attendance Table */}
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-4 px-5">Worker &amp; ID</th>
                  <th className="py-4 px-5">Job Site</th>
                  <th className="py-4 px-5">Shift &amp; Rate</th>
                  <th className="py-4 px-5">Clock In</th>
                  <th className="py-4 px-5">Extra Hours</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredRoster.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400">
                      <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                      <p className="font-medium text-white">No attendance records found.</p>
                      <p className="text-xs mt-1 text-slate-500">Change your search terms or add a check-in manually.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRoster.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Worker Name & Role */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 text-amber-300 border border-white/10 flex items-center justify-center font-semibold text-sm shrink-0">
                            {row.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {row.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="font-mono text-amber-400/80">{row.workerId}</span>
                              <span>•</span>
                              <span>{row.trade}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Site */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{row.site}</span>
                        </div>
                      </td>

                      {/* Shift Details */}
                      <td className="py-4 px-5">
                        <span className="text-xs text-slate-200">{row.shift}</span>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">${row.hourlyRate}/hr</p>
                      </td>

                      {/* Clock In */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{row.clockIn}</span>
                        </div>
                      </td>

                      {/* Overtime Hours Adjuster */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustOvertime(row.id, -0.5)}
                            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center text-xs font-bold transition cursor-pointer"
                            title="Remove 30 mins"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-medium text-white min-w-[2.5rem] text-center">
                            {row.overtimeHours}h
                          </span>
                          <button
                            onClick={() => adjustOvertime(row.id, 0.5)}
                            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center text-xs font-bold transition cursor-pointer"
                            title="Add 30 mins"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Status Button */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => cycleStatus(row.id)}
                          title="Click to switch status"
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                            row.status === "Present"
                              ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/20 hover:bg-emerald-400/20"
                              : row.status === "Late"
                              ? "bg-amber-400/10 text-amber-300 border-amber-400/20 hover:bg-amber-400/20"
                              : "bg-rose-400/10 text-rose-300 border-rose-400/20 hover:bg-rose-400/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              row.status === "Present"
                                ? "bg-emerald-400"
                                : row.status === "Late"
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                          />
                          <span>{row.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setInspectedAttendance(row)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
                          title="View Check-In Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Drawer 1: MANUAL CHECK-IN */}
      {isLogDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Manual Entry</span>
                  <h3 className="text-xl font-semibold text-white mt-1">Manual Worker Sign-In</h3>
                </div>
                <button
                  onClick={() => setIsLogDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManualSwipe} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Worker Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Samuel Johnson"
                    value={logFormData.name}
                    onChange={(e) => setLogFormData({ ...logFormData, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Work Role
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Heavy Rigger"
                    value={logFormData.trade}
                    onChange={(e) => setLogFormData({ ...logFormData, trade: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Target Site
                    </label>
                    <select
                      value={logFormData.site}
                      onChange={(e) => setLogFormData({ ...logFormData, site: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      {sitesList.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Attendance Status
                    </label>
                    <select
                      value={logFormData.status}
                      onChange={(e) => setLogFormData({ ...logFormData, status: e.target.value })}
                      className="w-full bg-[#141a29] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition cursor-pointer"
                    >
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                      Clock-In Time
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="07:15 AM"
                      value={logFormData.clockIn}
                      onChange={(e) => setLogFormData({ ...logFormData, clockIn: e.target.value })}
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
                      value={logFormData.hourlyRate}
                      onChange={(e) => setLogFormData({ ...logFormData, hourlyRate: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Extra Hours (Overtime)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={logFormData.overtimeHours}
                    onChange={(e) => setLogFormData({ ...logFormData, overtimeHours: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                  >
                    Confirm Check-In
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-white/5 text-xs text-slate-500 text-center">
              Manual entries are marked in the site audit log.
            </div>
          </div>
        </div>
      )}

      {/* Drawer 2: VIEW CHECK-IN DETAILS */}
      {inspectedAttendance && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0e131f] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold">{inspectedAttendance.id}</span>
                  <h3 className="text-xl font-semibold text-white mt-1">{inspectedAttendance.name}</h3>
                  <p className="text-xs text-slate-400">{inspectedAttendance.trade}</p>
                </div>
                <button
                  onClick={() => setInspectedAttendance(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Check-In Details Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Gate Scanner Log</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Worker ID:</span>
                    <span className="font-mono text-white">{inspectedAttendance.workerId}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Assigned Job Site:</span>
                    <span className="font-medium text-white">{inspectedAttendance.site}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Assigned Shift:</span>
                    <span className="font-medium text-white">{inspectedAttendance.shift}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Entry Gate:</span>
                    <span className="font-medium text-amber-300">{inspectedAttendance.turnstileGate}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Clock-In Time:</span>
                    <span className="font-mono font-medium text-white">{inspectedAttendance.clockIn}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Estimated Pay for Shift:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ${(8 * inspectedAttendance.hourlyRate + inspectedAttendance.overtimeHours * inspectedAttendance.hourlyRate * 1.5).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setInspectedAttendance(null)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HardHat, Users, Building2, ClipboardList, CalendarCheck, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: HardHat },
    { path: "/workers", label: "Workers", icon: Users },
    { path: "/sites", label: "Sites", icon: Building2 },
    { path: "/assignments", label: "Assignments", icon: ClipboardList },
    { path: "/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 p-2 rounded-xl text-slate-950 shadow-md shadow-amber-500/20">
              <HardHat className="w-6 h-6 font-bold" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">BUILD<span className="text-amber-400">TRACK</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">Enterprise v2.4</span>
            </div>
          </div>

          <div className="hidden md:flex space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      .toString()
                      .includes("true") /* fallback */ || isActive
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-inner"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-300 font-medium">Spring Boot Connected</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sub-navigation bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 bg-slate-900/90 border-t border-slate-800 space-x-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                isActive ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
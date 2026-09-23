import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ currentStructure, structures = [], onSelectStructure, unreadAlertsCount = 3 }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/login');
  };

  // Generate 2-letter initials from user name
  const getInitials = (name) => {
    if (!name) return 'SE';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userName = user?.name || 'Dr. Aris Thorne';
  const userEmail = user?.email || 'aris.thorne@shm-civil.edu';
  const userRole = user?.role || 'ADMIN / ENGINEER';
  const userTitle = user?.title || 'Structural Engineer';
  const initials = getInitials(userName);

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-100 tracking-tight text-base lg:text-lg">
                SHM <span className="text-cyan-400 font-extrabold">AI</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                Civil v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Structural Health Monitoring & AI Risk Assessment
            </p>
          </div>
        </div>

        {/* Live Simulator Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold tracking-wider">LIVE FEED</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">100 Hz Virtual Sensor Stream</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Structure Selector */}
        {structures.length > 0 && (
          <div className="relative">
            <select
              value={currentStructure?.id || currentStructure?._id || ''}
              onChange={(e) => {
                const found = structures.find(s => (s.id || s._id) === e.target.value);
                if (found && onSelectStructure) onSelectStructure(found);
              }}
              className="bg-slate-800 text-slate-200 text-xs lg:text-sm font-medium border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer pr-8"
            >
              {structures.map((s) => (
                <option key={s.id || s._id} value={s.id || s._id}>
                  {s.name} ({s.type})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Alerts Bell Notification Icon */}
        <button 
          onClick={() => navigate('/alerts')}
          className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
          title="Active System Alerts"
        >
          <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-slate-300" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs lg:text-sm transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
              {initials}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{userName}</p>
              <p className="text-[10px] text-cyan-400 font-mono">{userTitle}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-slate-200">{userName}</p>
                <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/30">
                  ROLE: {userRole}
                </span>
              </div>
              <div className="pt-2 text-xs">
                <div 
                  onClick={() => setShowProfileMenu(false)}
                  className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 rounded cursor-pointer"
                >
                  Profile & Credentials
                </div>
                <div 
                  onClick={() => setShowProfileMenu(false)}
                  className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 rounded cursor-pointer"
                >
                  System Settings
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded cursor-pointer font-medium mt-1 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

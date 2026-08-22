import React from 'react';
import { Search, Bell, Sun, Moon, ChevronDown, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Role } from '../../types';
import mvitLogo from '../../assets/mvit-logo.png';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    user,
    notifications,
    setIsNotificationOpen,
    setIsGlobalSearchOpen,
    darkMode,
    setDarkMode,
    addToast
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    setRole(newRole);
    addToast(`Switched view mode to: ${newRole}`, 'info');
  };

  return (
    <header className="app-header">
      {/* Left: MVIT Logo & System Title */}
      <div className="header-left">
        <div className="logo-brand">
          <div className="mvit-logo-container">
            <img
              src={mvitLogo}
              alt="Manakula Vinayagar Institute of Technology (MVIT)"
              className="mvit-logo-img"
            />
          </div>
          <div className="logo-text-group">
            <div className="brand-title-row">
              <span className="brand-name">ExamSecure</span>
            </div>
            <span className="brand-subtitle">MVIT Examination Management System</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="header-center">
        <button
          className="global-search-btn"
          onClick={() => setIsGlobalSearchOpen(true)}
          title="Search subjects, questions, examinations... (Ctrl+K)"
        >
          <Search size={15} className="search-icon" />
          <span className="search-placeholder">Search subjects, questions, papers...</span>
          <kbd className="search-kbd">Ctrl K</kbd>
        </button>
      </div>

      {/* Right: Controls, Theme Toggle, Notifications, User Profile */}
      <div className="header-right">
        {/* Role Switcher Pill */}
        <div className="role-switcher-card">
          <span className="role-switcher-label">ROLE:</span>
          <select
            value={role}
            onChange={handleRoleChange}
            className={`role-select role-${role.toLowerCase()}`}
          >
            <option value="ADMIN">Exam Cell Admin</option>
            <option value="HOD">HOD (Computer Science)</option>
            <option value="FACULTY">Faculty Contributor</option>
            <option value="REVIEWER">Question Paper Reviewer</option>
          </select>
        </div>

        <div className="header-divider" />

        {/* Theme Toggle Button */}
        <button
          className="header-icon-action-btn"
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {darkMode ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-slate-600" />
          )}
        </button>

        {/* Notifications Button */}
        <button
          className="header-icon-action-btn notification-btn"
          onClick={() => setIsNotificationOpen(true)}
          title="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && <span className="notification-pulse-dot">{unreadCount}</span>}
        </button>

        <div className="header-divider" />

        {/* User Profile Chip */}
        <div className="user-profile-chip">
          <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.department}</span>
          </div>
          <ChevronDown size={13} className="text-muted dropdown-arrow" />
        </div>
      </div>

      <style>{`
        .app-header {
          height: 68px;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 40;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(8px);
        }

        .header-left {
          display: flex;
          align-items: center;
          min-width: 320px;
        }

        .logo-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .mvit-logo-container {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.08);
          overflow: hidden;
          flex-shrink: 0;
        }

        .mvit-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-text-group {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .brand-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.3px;
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        /* Center search */
        .header-center {
          flex: 1;
          max-width: 480px;
          margin: 0 24px;
        }

        .global-search-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .global-search-btn:hover {
          border-color: var(--brand-accent);
          background: var(--bg-hover);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          color: var(--text-secondary);
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .search-placeholder {
          flex: 1;
          text-align: left;
          font-size: 12.5px;
        }

        .search-kbd {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 10px;
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--text-muted);
        }

        /* Right controls */
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .role-switcher-card {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .role-switcher-label {
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        .role-select {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          padding: 2px 4px;
        }

        .header-divider {
          width: 1px;
          height: 24px;
          background: var(--border-color);
        }

        .header-icon-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }

        .header-icon-action-btn:hover {
          background: var(--bg-hover);
          border-color: var(--brand-accent);
          transform: translateY(-1px);
        }

        .notification-pulse-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 9px;
          font-weight: 800;
          min-width: 16px;
          height: 16px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid var(--bg-secondary);
        }

        /* User Profile Chip */
        .user-profile-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px 4px 4px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .user-profile-chip:hover {
          border-color: var(--border-focus);
          background: var(--bg-hover);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--brand-accent);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .user-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .user-role {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .dropdown-arrow {
          margin-right: 4px;
        }

        @media (max-width: 1024px) {
          .brand-subtitle { display: none; }
          .header-center { display: none; }
        }
      `}</style>
    </header>
  );
};

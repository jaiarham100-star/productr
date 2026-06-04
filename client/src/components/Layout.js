import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = (user?.email || user?.phone || 'U')[0].toUpperCase();

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="auth-logo-icon" style={{ width: 28, height: 28, fontSize: 14 }}>🔥</div>
          <span className="sidebar-logo-text">Productr</span>
        </div>
        <div className="sidebar-search">
          <div className="sidebar-search-wrap">
            <SearchIcon style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#6b7280' }} />
            <input
              className="sidebar-search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/home"
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          >
            <HomeIcon /><span>Home</span>
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
          >
            <BoxIcon /><span>Products</span>
          </NavLink>
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-search">
            <SearchIcon />
            <input placeholder="Search Services, Products" />
          </div>
          <div className="topbar-right">
            <div className="dropdown-wrap" ref={dropdownRef}>
              <button className="avatar-btn" onClick={() => setDropdownOpen(v => !v)}>
                {initials}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" style={{ fontSize: 12, color: '#6b7280', cursor: 'default' }}>
                    {user?.email || user?.phone}
                  </div>
                  <div style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }} />
                  <div className="dropdown-item danger" onClick={handleLogout}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

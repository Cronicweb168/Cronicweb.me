import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiHome, FiClock, FiYoutube, FiCpu } from 'react-icons/fi';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <FiHome /> },
  { to: '/reminders', label: 'Reminders', icon: <FiClock /> },
  { to: '/playlists', label: 'Playlists', icon: <FiYoutube /> },
  { to: '/ai-tools', label: 'AI Tools', icon: <FiCpu /> },
];

export default function Layout({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-md-background">
      {/* Side Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-md-surface shadow-lg transition-transform duration-300 ease-in-out z-40 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-4 text-xl font-bold text-md-primary">Study App</div>
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `rounded px-3 py-2 text-md-secondary hover:bg-md-outline/10 transition ${
                  isActive ? 'bg-md-outline/20 font-medium' : ''
                }`
              }
              onClick={() => setOpen(false)}
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Backdrop for mobile when drawer is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* App Bar */}
        <header className="flex items-center gap-4 px-4 py-2 shadow bg-md-surface/95 backdrop-blur supports-backdrop-blur:bg-md-surface/80 sticky top-0 z-20">
          <button
            className="md:hidden p-2 rounded hover:bg-md-outline/10 text-md-primary focus:outline-none focus:ring-2 focus:ring-md-primary"
            onClick={() => setOpen((prev) => !prev)}
          >
            <FiMenu size={24} />
          </button>
          <Link to="/" className="text-lg font-semibold text-md-primary">
            Study Reminder App
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
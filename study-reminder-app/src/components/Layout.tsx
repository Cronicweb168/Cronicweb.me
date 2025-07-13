import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/reminders', label: 'Reminders' },
  { to: '/playlists', label: 'Playlists' },
  { to: '/ai-tools', label: 'AI Tools' },
];

export default function Layout({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-md-background dark:bg-gray-900">
      {/* Side Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-md-surface shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
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
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* App Bar */}
        <header className="flex items-center gap-4 px-4 py-2 shadow bg-md-surface">
          <button
            className="md:hidden p-2 rounded hover:bg-md-outline/10 text-md-primary"
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
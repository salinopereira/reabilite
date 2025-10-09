'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Users, Settings } from 'lucide-react';

const navLinks = [
  { href: '/feed/dashboard/feed', icon: Home, label: 'Feed' },
  { href: '/feed/dashboard/chats', icon: MessageCircle, label: 'Chats' },
  { href: '/feed/dashboard/encontrar', icon: Users, label: 'Encontrar' },
  { href: '/feed/dashboard/consultas', icon: Settings, label: 'Consultas' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-dark/30 p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white mb-8">Reabilite Pro</h1>
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-light/80 hover:bg-dark/50'
                }`}>
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto">
        {/* User profile section can be added here */}
      </div>
    </aside>
  );
};

export default Sidebar;

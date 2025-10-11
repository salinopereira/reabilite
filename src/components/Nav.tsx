'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and/or Anon Key are not defined');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Nav() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login'); // Redirect to login after sign out
    };

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Pacientes', href: '/pacientes' },
    ];

    return (
        <header className="bg-slate-900/70 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800">
            <div className="container mx-auto px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        <span className="text-xl font-bold tracking-tighter text-slate-50">ReabilitePro</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}>
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                    Sair
                </button>
            </div>
        </header>
    );
}

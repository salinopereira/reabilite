'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { LogOut, UserCircle, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const [user] = useAuthState(auth);
  
  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const [userData] = useDocumentData(userDocRef);

  const handleLogout = async () => {
    await signOut(auth);
    // Optional: redirect to home after logout
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-white text-xl font-bold">
              <Image src="/logo.PNG" alt="Reabilite Pro Logo" width={180} height={45} priority className="object-contain"/>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href={userData?.type === 'profissional' ? '/dashboard/profissional' : '/dashboard/paciente'} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-light hover:text-primary transition-colors">
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>
                 <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-light hover:text-primary transition-colors">
                  <UserCircle size={20} />
                  <span>{userData?.name || 'Perfil'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-light hover:text-primary transition-colors"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-light hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition-opacity">
                  Cadastre-se
                </Link>
              </>
            )}
          </nav>
          <div className="md:hidden">
            {/* Mobile menu button can be added here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

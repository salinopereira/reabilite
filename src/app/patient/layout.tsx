'use client'

import { AppLayout } from '@/components/app-layout';
import {
  LayoutDashboard,
  User,
  MessageSquare,
} from 'lucide-react';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const navItems = [
  {
    href: '/patient/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={16} />,
    match: (pathname: string) => pathname === '/patient/dashboard',
  },
  {
    href: '/patient/messages',
    label: 'Mensagens',
    icon: <MessageSquare size={16} />,
  },
  {
    href: '/patient/profile',
    label: 'Meu Perfil',
    icon: <User size={16} />,
  },
  {
    href: '/community',
    label: 'Comunidade',
    icon: <MessageSquare size={16} />,
  },
];

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Carregando...</p>
        </div>
    );
  }

  return <AppLayout navItems={navItems}>{children}</AppLayout>;
}

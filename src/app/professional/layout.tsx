'use client';

import { AppLayout } from '@/components/app-layout';
import {
  LayoutDashboard,
  Users,
  Calendar,
  User,
  MessageSquare,
  DollarSign,
} from 'lucide-react';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const navItems = [
  {
    href: '/professional/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={16} />,
    match: (pathname: string) => pathname === '/professional/dashboard',
  },
  {
    href: '/professional/patients',
    label: 'Meus Pacientes',
    icon: <Users size={16} />,
  },
  {
    href: '/professional/schedule',
    label: 'Agenda',
    icon: <Calendar size={16} />,
  },
  {
    href: '/professional/messages',
    label: 'Mensagens',
    icon: <MessageSquare size={16} />,
  },
  {
    href: '/professional/finances',
    label: 'Financeiro',
    icon: <DollarSign size={16} />,
  },
  {
    href: '/professional/profile',
    label: 'Meu Perfil',
    icon: <User size={16} />,
  },
  {
    href: '/community',
    label: 'Comunidade',
    icon: <MessageSquare size={16} />,
  },
];

export default function ProfessionalLayout({
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

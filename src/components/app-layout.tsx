'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Logo } from './logo';
import { placeholderImages } from '@/lib/placeholder-images';
import { useAuth, useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match?: (pathname: string) => boolean;
};

type AppLayoutProps = {
  navItems: NavItem[];
  children: React.ReactNode;
};

export function AppLayout({ navItems, children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user, isUserLoading } = useFirebase();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
    }
    router.push('/login');
  };
  
  const avatarId = user?.photoURL || 'patient-avatar-1'; // fallback
  const avatar = placeholderImages.find((p) => p.id === avatarId);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <div className="grow" />
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.match
                      ? item.match(pathname)
                      : pathname.startsWith(item.href)
                  }
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {isUserLoading ? (
             <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarFallback />
                </Avatar>
                <div className="flex flex-col text-sm">
                    <span className="font-semibold text-foreground">Carregando...</span>
                </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                {avatar && <AvatarImage src={avatar.imageUrl} alt={user.displayName || 'Usuário'} data-ai-hint={avatar.imageHint} />}
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm truncate">
                    <span className="font-semibold text-foreground truncate">{user.displayName || user.email}</span>
                    <span className="text-muted-foreground truncate">{user.email}</span>
                </div>
            </div>
          ) : (
             <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9" />
                <div className="flex flex-col text-sm">
                    <span className="font-semibold text-foreground">Não autenticado</span>
                </div>
            </div>
          )}
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
            <LogOut size={16} />
            <span>Sair</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

'use client'; // Este layout contém um componente cliente, então precisa da diretiva

import FirebaseMessagingProvider from '@/components/FirebaseMessagingProvider';
import Sidebar from '@/components/Sidebar'; // Supondo que você tenha um componente de barra lateral
import { AuthProvider } from '@/contexts/AuthContext'; // Supondo um provedor de autenticação

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
        <FirebaseMessagingProvider>
            <div className="flex h-screen bg-dark">
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </FirebaseMessagingProvider>
    </AuthProvider>
  );
}

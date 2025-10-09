'use client';

import dynamic from 'next/dynamic';

// Carrega dinamicamente o componente do mapa, desativando o SSR.
const ClientMap = dynamic(() => import('@/components/ClientMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Carregando componente do mapa...</span>
    </div>
  )
});

export default function MapPage() {
  return <ClientMap />;
}

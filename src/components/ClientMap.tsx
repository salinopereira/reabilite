'use client';

import { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import Map from '@/components/Map';
import { firestore } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Professional {
  id: string;
  nome: string;
  especialidade: string;
  localizacao: {
    latitude: number;
    longitude: number;
  };
  tipo: string;
}

export default function ClientMap() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    async function getVisibleProfessionals() {
      if (!apiKey) {
        console.error("API Key do Google Maps não configurada.");
        setLoading(false);
        return;
      }

      try {
        const usersCollection = collection(firestore, 'usuarios');
        const q = query(
          usersCollection, 
          where("tipo", "==", "profissional"), 
          where("visivelNoMapa", "==", true)
        );

        const professionalSnapshot = await getDocs(q);
        
        const professionalList = professionalSnapshot.docs
          .map(doc => {
            const data = doc.data();
            if (data.localizacao) {
              return {
                id: doc.id,
                nome: data.nome || 'Nome não informado',
                especialidade: data.especialidade || 'Especialidade não informada',
                localizacao: {
                    latitude: data.localizacao.latitude,
                    longitude: data.localizacao.longitude
                },
                tipo: data.tipo,
              } as Professional;
            }
            return null;
          })
          .filter(Boolean) as Professional[];

        setProfessionals(professionalList);
      } catch (error) {
        console.error("Erro ao buscar profissionais visíveis:", error);
      } finally {
        setLoading(false);
      }
    }

    getVisibleProfessionals();
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Erro de Configuração</h1>
        <p className="text-center">A chave da API do Google Maps não foi encontrada.</p>
        <p className="text-center mt-2">Adicione a variável <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> ao seu ambiente.</p>
      </div>
    );
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Carregando mapa...</span>
        </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-screen">
        <Map professionals={professionals} />
      </div>
    </APIProvider>
  );
}

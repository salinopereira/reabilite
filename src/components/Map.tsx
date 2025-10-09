'use client';

import React, { useState } from 'react';
import { Map as GoogleMap, Marker, InfoWindow } from '@vis.gl/react-google-maps';

// Esta interface se torna a fonte da verdade para o tipo "Profissional"
export interface Professional {
  id: string;
  nome: string;
  especialidade: string;
  localizacao: {
    latitude: number;
    longitude: number;
  };
}

interface MapProps {
  professionals: Professional[];
  userLocation?: { lat: number, lng: number } | null; // Adicionada a localização do usuário
}

export default function Map({ professionals, userLocation }: MapProps) {
  // Centraliza no usuário se a localização for fornecida
  const mapCenter = userLocation || { lat: -23.55052, lng: -46.633308 };
  const [selectedMarker, setSelectedMarker] = useState<Professional | null>(null);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GoogleMap 
        center={mapCenter} 
        zoom={userLocation ? 13 : 11} // Mais zoom se a localização do usuário for conhecida
        mapId="reabilite-pro-map"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        {/* Marcador para a localização do usuário */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            // Um ícone diferente poderia ser usado aqui para diferenciação
          />
        )}
        
        {/* Marcadores para os profissionais */}
        {professionals.map((prof) => (
          <Marker 
            key={prof.id} 
            position={{ lat: prof.localizacao.latitude, lng: prof.localizacao.longitude }}
            onClick={() => setSelectedMarker(prof)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.localizacao.latitude, lng: selectedMarker.localizacao.longitude }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1">
              <h3 className="font-bold text-gray-800">{selectedMarker.nome}</h3>
              <p className="text-gray-600">{selectedMarker.especialidade}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

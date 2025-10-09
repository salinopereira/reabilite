'use client';

import { useState } from 'react';
import { Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import withAuth from '@/components/withAuth';

// Importando o tipo diretamente do componente de mapa
import { Professional } from '@/components/Map';

const MapComponent = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className='h-full w-full bg-dark/50 flex justify-center items-center'><Loader2 className='animate-spin'/></div>
});

// Tipo para os dados brutos recebidos da API
interface ApiProfessionalData {
    id: string;
    name: string;
    specialty: string;
    photoURL: string;
    distance: number;
    location: {
        lat: number;
        lng: number;
    }
}

const EncontrarProfissionaisPage = () => {
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    // Agora usamos o tipo importado, que é a fonte da verdade
    const [profissionais, setProfissionais] = useState<Professional[]>([]);
    const [profissionaisList, setProfissionaisList] = useState<ApiProfessionalData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Aguardando permissão de localização...');

    const findProfessionals = async (lat: number, lng: number) => {
        setLoading(true);
        setError('');
        setStatus('Buscando profissionais próximos...');
        try {
            const response = await fetch(`/api/profissionais_proximos?lat=${lat}&lng=${lng}`)
            if (!response.ok) throw new Error('Falha ao buscar profissionais.');
            const data = await response.json();

            // Mapeia os dados da API para o formato que o componente Map espera
            const formattedProfessionals: Professional[] = data.profissionais.map((prof: ApiProfessionalData) => ({
                id: prof.id,
                nome: prof.name,
                especialidade: prof.specialty,
                localizacao: {
                    latitude: prof.location.lat,
                    longitude: prof.location.lng
                }
            }));
            setProfissionais(formattedProfessionals);
            setProfissionaisList(data.profissionais);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setStatus(profissionais.length > 0 ? 'Profissionais encontrados!' : 'Nenhum profissional encontrado na sua área.');
        }
    };

    const getLocation = () => {
        setLoading(true);
        setStatus('Obtendo sua localização...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                findProfessionals(latitude, longitude);
            },
            (err) => {
                setError('Não foi possível obter a localização. Verifique as permissões do seu navegador.');
                setStatus('Falha ao obter localização.');
                setLoading(false);
            }
        );
    };

    return (
        <div className="p-6 bg-dark rounded-lg shadow-md">
             <h1 className="text-3xl font-bold text-light mb-2">Encontrar Profissionais</h1>
             <p className="text-light/70 mb-6">Encontre especialistas em saúde perto de você.</p>

            {!location && (
                <div className="text-center p-8 border-2 border-dashed border-primary/30 rounded-lg">
                     <MapPin className="mx-auto h-12 w-12 text-primary/80"/>
                    <p className="mt-4 mb-6 text-light/80">Para encontrar profissionais, precisamos da sua localização.</p>
                    <button onClick={getLocation} disabled={loading} className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 mx-auto disabled:opacity-50">
                        {loading ? <Loader2 className='animate-spin'/> : <Search size={20}/>}
                        Buscar Profissionais Próximos
                    </button>
                     {error && <p className="text-red-400 mt-4">{error}</p>}
                </div>
            )}

            {location && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 h-[600px] rounded-lg overflow-hidden border-2 border-primary/40">
                        {/* Passando os dados no formato correto */}
                        <MapComponent professionals={profissionais} userLocation={location} />
                    </div>
                    <div className="md:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {loading && <p className='text-center'><Loader2 className='animate-spin mx-auto'/> Carregando...</p>}
                        {profissionaisList.map(prof => (
                            <Link href={`/profile/${prof.id}`} key={prof.id} className="block bg-dark/60 border border-primary/30 rounded-lg p-4 hover:bg-primary/20 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Image 
                                        src={prof.photoURL || 'https://via.placeholder.com/150'} 
                                        alt={prof.name} 
                                        width={64} 
                                        height={64}
                                        className="w-16 h-16 rounded-full object-cover"/>
                                    <div>
                                        <h3 className="font-bold text-lg text-light">{prof.name}</h3>
                                        <p className="text-primary">{prof.specialty}</p>
                                        <p className="text-sm text-light/70">Aprox. {prof.distance.toFixed(2)} km de distância</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(EncontrarProfissionaisPage, ['paciente']);

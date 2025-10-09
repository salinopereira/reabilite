import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getDistance } from 'geolib';

// Força a rota a ser sempre dinâmica
export const dynamic = 'force-dynamic';

// Definindo a interface para o objeto do profissional
interface Professional {
    id: string;
    userType: string;
    location?: { // A localização é opcional
        latitude: number;
        longitude: number;
    };
    // Adicione outras propriedades que você espera de um profissional
    [key: string]: any;
}

export async function GET(req: NextRequest) {
    if (!adminDb) {
        return NextResponse.json({ error: 'Firebase Admin não inicializado.' }, { status: 500 });
    }
    const { searchParams } = req.nextUrl;
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '10') * 1000; // km para metros

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude e longitude são obrigatórias.' }, { status: 400 });
    }

    try {
        const professionalsSnapshot = await adminDb.collection('users').where('userType', '==', 'profissional').get();
        
        // Tipando o array de profissionais
        const allProfessionals: Professional[] = professionalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Professional));

        const nearbyProfessionals = allProfessionals.filter(prof => {
            // Agora o TypeScript sabe que 'location' pode existir
            if (prof.location) {
                const distance = getDistance(
                    { latitude: lat, longitude: lng },
                    { latitude: prof.location.latitude, longitude: prof.location.longitude }
                );
                return distance <= radius;
            }
            return false;
        });

        return NextResponse.json(nearbyProfessionals, { status: 200 });

    } catch (error) {
        console.error("Erro ao buscar profissionais próximos:", error);
        return NextResponse.json({ error: 'Falha ao buscar profissionais.' }, { status: 500 });
    }
}

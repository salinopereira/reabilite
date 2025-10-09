import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// Força a rota a ser sempre dinâmica
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin não inicializado.' }, { status: 500 });
  }
  try {
    const profissionalId = req.nextUrl.searchParams.get('profissionalId');

    if (!profissionalId) {
      return NextResponse.json({ message: 'ID do profissional é obrigatório' }, { status: 400 });
    }

    const snapshot = await adminDb.collection('avaliacoes').where('profissionalId', '==', profissionalId).get();
    
    if (snapshot.empty) {
      return NextResponse.json({ avaliacoes: [] }, { status: 200 });
    }

    const avaliacoes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ avaliacoes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

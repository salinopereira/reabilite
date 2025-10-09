import { NextResponse, NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { firestore } from 'firebase-admin';

// --- Rota para CRIAR uma nova consulta ---
export async function POST(request: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin não inicializado.' }, { status: 500 });
  }
  try {
    const body = await request.json();
    const { pacienteId, profissionalId, data, motivo } = body;

    if (!pacienteId || !profissionalId || !data || !motivo) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 });
    }

    const newConsulta = {
        pacienteId,
        profissionalId,
        data: firestore.Timestamp.fromDate(new Date(data)),
        motivo,
        status: 'pendente', // Status inicial
        createdAt: firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('consultas').add(newConsulta);

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

// --- Rota para ATUALIZAR o status de uma consulta ---
export async function PUT(request: NextRequest) {
    if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin não inicializado.' }, { status: 500 });
  }
    try {
        const body = await request.json();
        const { consultaId, status } = body;

        if (!consultaId || !status) {
            return NextResponse.json({ error: 'ID da consulta e novo status são obrigatórios.' }, { status: 400 });
        }

        if (!['aceita', 'recusada', 'concluida'].includes(status)) {
            return NextResponse.json({ error: 'Status inválido.' }, { status: 400 });
        }

        const consultaRef = adminDb.collection('consultas').doc(consultaId);
        await consultaRef.update({ status });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar consulta:", error);
        return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
    }
}

// --- Rota para BUSCAR as consultas de um usuário ---
export async function GET(request: NextRequest) {
    if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin não inicializado.' }, { status: 500 });
  }
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const userType = searchParams.get('userType');

        if (!userId || !userType) {
            return NextResponse.json({ error: 'ID e tipo de usuário são obrigatórios.' }, { status: 400 });
        }

        let query;
        if (userType === 'paciente') {
            query = adminDb.collection('consultas').where('pacienteId', '==', userId);
        } else if (userType === 'professional') {
            query = adminDb.collection('consultas').where('profissionalId', '==', userId);
        } else {
             return NextResponse.json({ error: 'Tipo de usuário inválido.' }, { status: 400 });
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();
        const consultas: any[] = [];
        snapshot.forEach(doc => {
            consultas.push({ id: doc.id, ...doc.data() });
        });

        return NextResponse.json({ consultas }, { status: 200 });

    } catch (error) {
        console.error("Erro ao buscar consultas:", error);
        return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
    }
}

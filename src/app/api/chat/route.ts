import { NextResponse, NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { firestore } from 'firebase-admin';

export async function POST(request: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin não inicializado.' }, { status: 500 });
  }
  try {
    const { chatId, senderId, text } = await request.json();

    if (!chatId || !senderId || !text) {
      return NextResponse.json({ error: 'Dados da mensagem incompletos.' }, { status: 400 });
    }

    // Referência para a subcoleção de mensagens dentro do chat
    const messagesRef = adminDb.collection('chats').doc(chatId).collection('messages');

    // Adiciona a nova mensagem
    await messagesRef.add({
        senderId,
        text,
        createdAt: firestore.FieldValue.serverTimestamp(),
    });
    
    // Atualiza o último status da conversa principal para fácil acesso
    await adminDb.collection('chats').doc(chatId).update({
        lastMessage: text,
        lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

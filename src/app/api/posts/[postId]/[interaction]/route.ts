import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin'; // Caminho e nome corrigidos
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest, { params }: { params: { postId: string; interaction: string } }) {
    if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin não inicializado.' }, { status: 500 });
  }
  const { postId, interaction } = params;

  if (interaction !== 'like' && interaction !== 'comment') {
    return NextResponse.json({ message: 'Invalid interaction' }, { status: 400 });
  }

  try {
    const postRef = adminDb.collection('posts').doc(postId);
    const increment = FieldValue.increment(1);

    if (interaction === 'like') {
      await postRef.update({ likes: increment });
    } else {
      // Para comentários, você provavelmente adicionaria um documento a uma subcoleção
      // Aqui, estamos apenas incrementando um contador como exemplo
      await postRef.update({ comments: increment });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

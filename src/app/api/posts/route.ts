import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

const postSchema = z.object({
  content: z.string().min(1),
  authorId: z.string().min(1),
  imageUrl: z.string().url().optional(), // Aceita uma URL de imagem opcional
});

export async function POST(req: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Firebase Admin não inicializado.' }, { status: 500 });
  }
  try {
    const body = await req.json();
    const validation = postSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { content, authorId, imageUrl } = validation.data;

    const postRef = await adminDb.collection('posts').add({
      content,
      authorId,
      imageUrl: imageUrl || null, // Salva a URL da imagem ou null
      createdAt: new Date(),
      likes: 0,
      comments: 0,
    });

    return NextResponse.json({ id: postRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

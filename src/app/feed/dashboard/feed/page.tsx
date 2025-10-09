'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, Heart, MessageCircle, Send, Paperclip, X } from 'lucide-react';
import { uploadImage } from '@/lib/firebase/storage';
import withAuth from '@/components/withAuth';
import Image from 'next/image';

// Tipos
interface Post {
    id: string;
    userId: string;
    content: string;
    imageUrl?: string;
    likes: string[];
    commentsCount: number;
    createdAt: any; 
    authorName?: string;
    authorPhoto?: string;
}

interface UserProfile {
    name: string;
    photoURL: string;
}

// Componente principal do Feed
const FeedPage = () => {
    const [user] = useAuthState(auth);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchPostsWithAuthors = async () => {
        // ... (código existente)
    };

    useEffect(() => {
        fetchPostsWithAuthors();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || (!newPostContent.trim() && !imageFile)) return;

        setIsPosting(true);
        let imageUrl = '';

        try {
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, `posts/${user.uid}`);
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: user.uid, 
                    content: newPostContent, 
                    imageUrl 
                }),
            });

            if (response.ok) {
                setNewPostContent('');
                setImageFile(null);
                setImagePreview(null);
                fetchPostsWithAuthors();
            }
        } catch (error) {
            console.error("Erro ao criar post:", error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="p-6 bg-dark rounded-lg shadow-md text-white">
            <h1 className="text-3xl font-bold text-light mb-6">Feed da Comunidade</h1>
            
            <form onSubmit={handleCreatePost} className="mb-8 bg-dark/50 p-4 rounded-lg">
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Compartilhe algo com a comunidade..."
                    className="w-full p-3 bg-dark/70 border border-primary/50 rounded-lg mb-4"
                    rows={3}
                />
                {imagePreview && (
                    <div className="relative mb-4">
                        <Image src={imagePreview} alt="Pré-visualização" width={100} height={100} className="rounded-lg"/>
                        <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-1 right-1 bg-dark/70 rounded-full p-1">
                            <X size={16}/>
                        </button>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden"/>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary hover:text-primary/90">
                        <Paperclip size={24}/>
                    </button>
                    <button type="submit" disabled={isPosting || (!newPostContent.trim() && !imageFile)} className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        {isPosting ? <Loader2 className='animate-spin'/> : <Send size={18}/>}
                        Publicar
                    </button>
                </div>
            </form>

            {/* ... (resto do código) */}
        </div>
    );
};

// ... (código do PostCard e export)

export default withAuth(FeedPage, ['paciente', 'profissional']);

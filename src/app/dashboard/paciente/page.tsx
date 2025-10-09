'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { MapIcon, PowerIcon, NewspaperIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    body: string;
    imageUrl?: string;
    authorName: string;
    authorSpecialty: string;
    createdAt: Timestamp;
}

// --- Feed Section Component ---
const FeedSection = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(postsQuery);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Post));
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin"/></div>
    }

    return (
        <div className="space-y-8">
            {posts.map(post => (
                <div key={post.id} className="bg-gray-800 rounded-2xl p-6 shadow-lg">
                    {post.imageUrl && (
                        <Image src={post.imageUrl} alt={post.title} width={800} height={400} className="rounded-lg mb-4 w-full object-cover"/>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-2">{post.title}</h3>
                    <p className="text-sm text-indigo-400 mb-2">Por {post.authorName} - {post.authorSpecialty}</p>
                    <p className="text-gray-300 whitespace-pre-wrap">{post.body}</p>
                     <p className="text-xs text-gray-500 mt-4 text-right">
                        {post.createdAt?.toDate().toLocaleDateString('pt-BR')}
                    </p>
                </div>
            ))}
            {posts.length === 0 && (
                <p className="text-center text-gray-500">Nenhum conteúdo publicado ainda.</p>
            )}
        </div>
    )
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeView, setActiveView] = useState('feed'); // feed, find, chat

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().tipo === 'paciente') {
          setUser(currentUser);
          setUserData(userDoc.data());
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login?role=patient');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };
  
  const NavItem = ({ icon: Icon, label, view, activeView, setActiveView }: any) => (
      <button onClick={() => setActiveView(view)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeView === view ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
        <Icon className="h-6 w-6" />
        <span className="font-medium">{label}</span>
    </button>
  )

  if (loading || !userData) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white"><Loader2 className="h-8 w-8 animate-spin"/></div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Image src="/icon.svg" alt="Reabilite Pro Logo" width={40} height={40} />
            <span className="text-xl font-bold">Reabilite Pro</span>
          </div>
          <nav className="flex flex-col gap-2">
            <NavItem icon={NewspaperIcon} label="Feed" view="feed" activeView={activeView} setActiveView={setActiveView} />
            <Link href="/mapa" className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"><MapIcon className="h-6 w-6"/><span className="font-medium">Encontrar</span></Link>
            <NavItem icon={ChatBubbleBottomCenterTextIcon} label="Chat" view="chat" activeView={activeView} setActiveView={setActiveView} />
          </nav>
        </div>
        <div className="border-t border-gray-700 pt-4">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600/20 py-2 text-red-400 hover:bg-red-600/30 transition-colors">
            <PowerIcon className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            {activeView === 'feed' && (
                <>
                    <h1 className="text-4xl font-bold mb-2">Feed de Conteúdo</h1>
                    <p className="text-gray-400 mb-10">Acompanhe as últimas postagens dos profissionais.</p>
                    <FeedSection />
                </>
            )}
             {activeView === 'chat' && (
                <>
                    <h1 className="text-4xl font-bold mb-2">Chat</h1>
                    <p className="text-gray-400 mb-10">Converse com seus profissionais.</p>
                    <div className="bg-gray-800 rounded-2xl p-8 text-center">
                        <p className="text-gray-400">Funcionalidade de chat em desenvolvimento.</p>
                    </div>
                </>
            )}
        </div>
      </main>
    </div>
  );
}

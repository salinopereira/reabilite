'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, GeoPoint, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MapPinIcon, PowerIcon, Squares2X2Icon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

// --- Toggle Switch Component ---
const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean, onChange: (enabled: boolean) => void }) => {
  return (
    <button
      type="button"
      className={`${enabled ? 'bg-green-600' : 'bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

// --- Visibility Section Component ---
const VisibilitySection = ({ user, userData, onUpdate }: { user: User, userData: any, onUpdate: (data: any) => void }) => {
    const [latitude, setLatitude] = useState(userData?.localizacao?.latitude.toString() || '');
    const [longitude, setLongitude] = useState(userData?.localizacao?.longitude.toString() || '');
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const handleLocationSave = async () => {
        if (!user || !latitude || !longitude) {
            setFeedback({ message: 'Latitude e Longitude são obrigatórias.', type: 'error' });
            return;
        }
        setIsSaving(true);
        setFeedback({ message: '', type: '' });

        try {
            const userDocRef = doc(db, 'usuarios', user.uid);
            const newLocation = new GeoPoint(parseFloat(latitude), parseFloat(longitude));
            await setDoc(userDocRef, { localizacao: newLocation }, { merge: true });
            onUpdate({ ...userData, localizacao: newLocation });
            setFeedback({ message: 'Localização salva com sucesso!', type: 'success' });
        } catch (error) {
            console.error("Erro ao salvar localização:", error);
            setFeedback({ message: 'Erro ao salvar a localização.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleVisibilityToggle = async (enabled: boolean) => {
        if (!user) return;
        try {
            const userDocRef = doc(db, 'usuarios', user.uid);
            await setDoc(userDocRef, { visivelNoMapa: enabled }, { merge: true });
            onUpdate({ ...userData, visivelNoMapa: enabled });
        } catch (error) {
            console.error("Erro ao atualizar visibilidade:", error);
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Visibilidade no Mapa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                    <p className="text-gray-400">Insira suas coordenadas para que os pacientes possam te encontrar.</p>
                    <div>
                        <label htmlFor="latitude" className="text-sm font-medium text-gray-300">Latitude</label>
                        <input type="text" id="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="longitude" className="text-sm font-medium text-gray-300">Longitude</label>
                        <input type="text" id="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <button onClick={handleLocationSave} disabled={isSaving} className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                        <MapPinIcon className="h-5 w-5"/>
                        {isSaving ? 'Salvando...' : 'Salvar Localização'}
                    </button>
                    {feedback.message && (
                        <div className={`mt-2 text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {feedback.message}
                        </div>
                    )}
                </div>
                <div className={`bg-gray-700/50 p-6 rounded-lg ${!userData.localizacao ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Aparecer no mapa</h3>
                        <ToggleSwitch enabled={!!userData.visivelNoMapa} onChange={handleVisibilityToggle} />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                        {userData.visivelNoMapa ? 'Você está visível para pacientes próximos.' : 'Você não aparecerá no mapa.'}
                    </p>
                    {!userData.localizacao && (
                        <p className="text-xs text-amber-400 mt-4">Salve uma localização para poder ficar online.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Content Section Component ---
const ContentSection = ({ user, userData }: { user: User, userData: any }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handlePublish = async () => {
        if (!title.trim() || !body.trim()) {
            setFeedback({ message: 'Título e conteúdo são obrigatórios.', type: 'error' });
            return;
        }
        setIsPublishing(true);
        setFeedback({ message: '', type: '' });

        try {
            let imageUrl = '';
            if (image) {
                const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
                await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(storageRef);
            }

            await addDoc(collection(db, 'posts'), {
                title,
                body,
                imageUrl,
                authorId: user.uid,
                authorName: userData.nome,
                authorSpecialty: userData.specialty,
                createdAt: serverTimestamp(),
                likes: 0,
                comments: [],
            });

            setTitle('');
            setBody('');
            setImage(null);
            setFeedback({ message: 'Post publicado com sucesso!', type: 'success' });
        } catch (error) {
            console.error("Error publishing post:", error);
            setFeedback({ message: 'Erro ao publicar. Tente novamente.', type: 'error' });
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Criar Novo Conteúdo</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="post-title" className="block text-sm font-medium text-gray-300">Título</label>
                    <input type="text" id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2" />
                </div>
                <div>
                    <label htmlFor="post-body" className="block text-sm font-medium text-gray-300">Conteúdo</label>
                    <textarea id="post-body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} className="mt-1 w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2"></textarea>
                </div>
                <div>
                    <label htmlFor="post-image" className="block text-sm font-medium text-gray-300">Imagem (Opcional)</label>
                    <input type="file" id="post-image" onChange={handleImageChange} accept="image/*" className="mt-1 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"/>
                </div>
                <div className="text-right">
                    <button onClick={handlePublish} disabled={isPublishing} className="inline-flex justify-center items-center gap-2 px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                        {isPublishing ? <Loader2 className="h-5 w-5 animate-spin"/> : null}
                        {isPublishing ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
                {feedback.message && (
                    <div className={`mt-2 text-sm text-center ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {feedback.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function ProfessionalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, content

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().tipo === 'profissional') {
          setUser(currentUser);
          setUserData(userDoc.data());
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login?role=professional');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading || !userData) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white"><Loader2 className="h-8 w-8 animate-spin"/></div>;
  }
  
  const NavItem = ({ icon: Icon, label, view, activeView, setActiveView }: any) => (
      <button onClick={() => setActiveView(view)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeView === view ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
        <Icon className="h-6 w-6" />
        <span className="font-medium">{label}</span>
    </button>
  )

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Image src="/icon.svg" alt="Reabilite Pro Logo" width={40} height={40} />
            <span className="text-xl font-bold">Reabilite Pro</span>
          </div>
          <nav className="flex flex-col gap-2">
            <NavItem icon={Squares2X2Icon} label="Dashboard" view="dashboard" activeView={activeView} setActiveView={setActiveView} />
            <NavItem icon={DocumentTextIcon} label="Conteúdo" view="content" activeView={activeView} setActiveView={setActiveView} />
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
          <h1 className="text-4xl font-bold mb-2">Olá, {userData.nome}!</h1>
          <p className="text-gray-400 mb-10">Gerencie suas informações e interaja com seus pacientes.</p>
          
          {activeView === 'dashboard' && <VisibilitySection user={user!} userData={userData} onUpdate={setUserData} />}
          {activeView === 'content' && <ContentSection user={user!} userData={userData} />}

        </div>
      </main>
    </div>
  );
}

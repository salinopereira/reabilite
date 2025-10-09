'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Camera, Loader2, MapPin } from 'lucide-react';

export default function ProfessionalRegistrationPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    crm: '',
    specialty: '',
  });
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Aguardando...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData(prev => ({ ...prev, name: currentUser.displayName || '' }));
        if(currentUser.photoURL) setPreviewUrl(currentUser.photoURL);
        setLoading(false);
      } else {
        router.push('/login?role=professional');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setProfileImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('Obtendo localização...');
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus('Localização obtida com sucesso!');
        setError('');
      }, (error) => {
        setError('Não foi possível obter a localização. Verifique as permissões do seu navegador.');
        setLocationStatus('Falha ao obter');
      });
    } else {
      setError('Geolocalização não é suportada por este navegador.');
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.name.trim() || !formData.crm.trim() || !formData.specialty.trim()) {
        setError('Por favor, preencha todos os campos.');
        return;
    }

    if (!location) {
        setError('É obrigatório fornecer a sua localização para continuar.');
        return;
    }
    
    setIsUploading(true);
    setError('');

    try {
      let photoURL = user.photoURL;

      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${user.uid}/${profileImage.name}`);
        await uploadBytes(storageRef, profileImage);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: formData.name,
        type: 'profissional',
        specialty: formData.specialty,
        crm: formData.crm,
        photoURL: photoURL,
        location: location,
        createdAt: serverTimestamp(),
      }, { merge: true });

      router.push('/dashboard/professional');

    } catch (error) {
      console.error("Error creating professional profile:", error);
      setError('Ocorreu um erro ao finalizar seu cadastro. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white"><Loader2 className="w-8 h-8 animate-spin text-primary"/><span className="ml-2">Carregando...</span></div>
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-dark text-white p-6">
        <div className="w-full max-w-lg p-8 space-y-6 bg-dark/80 backdrop-blur-sm rounded-2xl shadow-lg border border-primary/30">
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-light">Cadastro de Profissional</h1>
              <p className="text-light/80 mt-2">Complete seu perfil para se conectar com pacientes.</p>
            </div>

            <form onSubmit={handleRegistration} className="space-y-6">
              <div className="flex justify-center">
                <label htmlFor="profileImageInput" className="cursor-pointer relative">
                  <Image src={previewUrl || 'https://via.placeholder.com/150'} alt="Foto de Perfil" width={128} height={128} className="w-32 h-32 rounded-full border-4 border-primary/50 object-cover" />
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><Camera className="text-white"/></div>
                  <input id="profileImageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                </label>
              </div>

              <div className="space-y-4">
                 <div>
                  <label htmlFor="name" className="block text-sm font-medium text-light/80 mb-2">Nome Completo</label>
                  <input id="name" type="text" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-dark/70 border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="crm" className="block text-sm font-medium text-light/80 mb-2">CRM / Documento</label>
                  <input id="crm" type="text" value={formData.crm} onChange={handleChange} required className="w-full px-4 py-3 bg-dark/70 border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-light/80 mb-2">Especialidade Principal</label>
                  <input id="specialty" type="text" value={formData.specialty} onChange={handleChange} required className="w-full px-4 py-3 bg-dark/70 border border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ex: Fisioterapeuta" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-light/80 mb-2">Localização de Atendimento</label>
                    <div className="flex items-center gap-4 p-3 bg-dark/70 border border-primary/50 rounded-lg">
                        <button type="button" onClick={getLocation} className="bg-primary/80 hover:bg-primary text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors"><MapPin size={16}/> Obter Localização</button>
                        <span className={`text-sm ${location ? 'text-green-400' : 'text-amber-400'}`}>{locationStatus}</span>
                    </div>
                </div>
              </div>

              {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm text-center">{error}</p>}

              <button type="submit" disabled={isUploading} className="w-full mt-6 px-4 py-3 font-bold text-white text-lg bg-gradient-to-r from-primary to-secondary rounded-lg shadow-md hover:shadow-lg focus:outline-none disabled:opacity-50">
                {isUploading ? <><Loader2 className="animate-spin mr-2"/> Finalizando...</> : 'Finalizar Cadastro'}
              </button>
            </form>
        </div>
    </main>
  );
}

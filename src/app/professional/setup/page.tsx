"use client";
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, GeoPoint } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase/config';
import Image from 'next/image';
import { UploadCloud } from 'lucide-react';

export default function ProfessionalSetupPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(new GeoPoint(latitude, longitude));
        },
        (error) => {
          console.warn("Erro ao obter localização: ", error.message);
          setFormError("Não foi possível obter sua localização. Por favor, permita o acesso à localização no seu navegador.");
        }
      );
    } else {
      setFormError("Geolocalização não é suportada neste navegador.");
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError("Você não está autenticado.");
      return;
    }

    if (!specialty || !location || !profilePicture) {
      setFormError("Por favor, preencha todos os campos, permita a localização e adicione uma foto de perfil.");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Upload da foto para o Firebase Storage
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, profilePicture);
      const photoURL = await getDownloadURL(storageRef);

      // 2. Salvar os dados no Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        specialty,
        location,
        photoURL,
        isProfileComplete: true, // Flag para indicar que o setup foi concluído
      }, { merge: true });

      // Redireciona para o dashboard do profissional
      router.push('/dashboard/professional');

    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      setFormError("Falha ao salvar o perfil: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark">
      <div className="w-full max-w-lg p-8 space-y-6 bg-dark/50 rounded-2xl shadow-lg border border-primary/30 m-4">
        <h2 className="text-3xl font-bold text-center text-white">Complete seu Perfil</h2>
        <p className="text-center text-light/80">Adicione suas informações para que os pacientes possam te encontrar.</p>
        
        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-light/90 mb-2">Foto de Perfil</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary/50 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Preview" width={128} height={128} className="mx-auto h-32 w-32 rounded-full object-cover"/>
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-light/50" />
                )}
                <div className="flex text-sm text-light/60">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-dark/70 rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary/50">
                    <span>Carregar uma imagem</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-light/50">PNG, JPG, GIF até 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-light/90">Sua Especialidade</label>
            <input
              id="specialty"
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Ex: Fisioterapeuta, Psicólogo"
              required
              className="mt-1 block w-full px-4 py-3 bg-dark/70 border border-primary/50 rounded-lg text-white"
            />
          </div>
          
          <div>
             <label className="block text-sm font-medium text-light/90">Sua Localização</label>
             <div className="mt-1 p-4 bg-dark/70 rounded-lg text-sm text-light/80 border border-primary/50">
                {location ? 
                    `Localização obtida: Latitude ${location.latitude.toFixed(4)}, Longitude ${location.longitude.toFixed(4)}` : 
                    "Obtendo sua localização... Por favor, aguarde."}
             </div>
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <button
            type="submit"
            disabled={isSaving || !location || !previewUrl}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar e Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}

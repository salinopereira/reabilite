'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db } from '@/lib/firebase/config';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeft, User, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

const ProfilePage = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const [userData, loadingUserData] = useDocumentData(userDocRef);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || loadingUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark text-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="min-h-screen bg-dark text-light">
        <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-light/80 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          Voltar para a Home
        </Link>
      </div>
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-dark/50 rounded-2xl shadow-lg border border-primary/30 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="relative w-32 h-32 mx-auto bg-dark/70 rounded-full flex items-center justify-center border-2 border-primary mb-4">
                <User className="w-16 h-16 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-white">Perfil do Usuário</h1>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-dark/60 rounded-lg">
                <User className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-light/80">Nome</p>
                  <p className="text-lg font-semibold text-white">{userData?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-dark/60 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-light/80">Email</p>
                  <p className="text-lg font-semibold text-white">{userData?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

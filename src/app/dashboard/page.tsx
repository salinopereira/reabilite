'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { auth, db } from '@/lib/firebase/config';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DashboardPage = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const [userData, userLoading] = useDocumentData(userDocRef);

  useEffect(() => {
    if (!loading && !userLoading && userData) {
      if (userData.type === 'paciente') {
        router.push('/dashboard/patient');
      } else if (userData.type === 'profissional') {
        router.push('/dashboard/professional');
      }
    }
  }, [user, loading, userData, userLoading, router]);

  return <div>Carregando dashboard...</div>; // Pode mostrar um loader enquanto redireciona
};

export default DashboardPage;

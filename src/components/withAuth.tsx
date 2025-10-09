'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config'; // Importando o 'db'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';

// O HOC agora aceita um array de perfis (roles) permitidos
const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[]
) => {
  const WithAuthComponent = (props: P) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
      if (loading) {
        return; // Aguarda o estado de autenticação carregar
      }

      if (!user) {
        router.push('/login'); // Se não há usuário, redireciona para o login
        return;
      }

      const checkAuthorization = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userType = userData.userType; // Usando 'userType' como padrão

            if (allowedRoles.includes(userType)) {
              setIsAuthorized(true);
            } else {
              // Perfil não permitido, redireciona para uma página padrão
              router.push('/dashboard'); 
            }
          } else {
            // Documento do usuário não encontrado. Algo está errado.
            router.push('/login');
          }
        } catch (error) {
            console.error("Authorization error:", error);
            router.push('/login');
        } finally {
            setCheckingAuth(false);
        }
      };

      checkAuthorization();

    }, [user, loading, router]);

    if (loading || checkingAuth) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-dark text-white">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="ml-4 text-xl">Verificando acesso...</span>
        </div>
      );
    }

    if (!isAuthorized) {
      return null; // Não renderiza nada enquanto redireciona
    }

    return <WrappedComponent {...props} />;
  };

  // Adiciona um nome de exibição para facilitar a depuração no React DevTools
  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;


  return WithAuthComponent;
};

export default withAuth;

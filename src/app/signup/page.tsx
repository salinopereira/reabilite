'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCreateUserWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('paciente');
    const [specialty, setSpecialty] = useState('');

    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
    const [loggedInUser, loadingAuth] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (!loadingAuth && loggedInUser) {
            router.push('/'); // Redirect home if already logged in
        }
    }, [loggedInUser, loadingAuth, router]);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userType === 'profissional' && !specialty) {
            // Maybe show an error message to the user
            return;
        }
        const email = `${username}@reabilite.pro`;
        try {
            const newUser = await createUserWithEmailAndPassword(email, password);
            if (newUser) {
                await setDoc(doc(db, 'usuarios', newUser.user.uid), {
                    nome: name,
                    email: email,
                    tipo: userType,
                    ...(userType === 'profissional' && { specialty: specialty, visivelNoMapa: false, localizacao: null }),
                });
                // Redirect based on user type
                const destination = userType === 'profissional' ? '/dashboard/profissional' : '/dashboard/paciente';
                router.push(destination);
            }
        } catch (err) {
            console.error("Signup Error:", err);
        }
    };
    
    const loadingRequest = loading || loadingAuth;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
             <div className="absolute top-6 left-6">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    &larr; Voltar para a Home
                </Link>
            </div>
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Crie sua Conta</h1>
                    <p className="text-gray-400 mt-2">Comece sua jornada na Reabilite Pro.</p>
                </div>
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Eu sou</label>
                        <div className="mt-1 grid grid-cols-2 gap-2 rounded-lg bg-gray-800 p-1 border border-gray-700">
                            <button type="button" onClick={() => setUserType('paciente')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${userType === 'paciente' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                                Paciente
                            </button>
                            <button type="button" onClick={() => setUserType('profissional')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${userType === 'profissional' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                                Profissional
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome Completo</label>
                        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg" />
                    </div>

                    {userType === 'profissional' && (
                        <div>
                            <label htmlFor="specialty" className="block text-sm font-medium text-gray-300">Sua Especialidade</label>
                            <select id="specialty" required={userType === 'profissional'} value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg">
                                <option value="" disabled>Selecione sua profissão</option>
                                <option value="Nutricionista">Nutricionista</option>
                                <option value="Profissional de Educação Física">Profissional de Educação Física</option>
                                <option value="Psicólogo">Psicólogo</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">Usuário</label>
                        <div className="mt-1 flex rounded-lg bg-gray-800 border border-gray-700 focus-within:ring-2 focus-within:ring-indigo-500">
                            <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1 block w-full px-4 py-3 bg-transparent rounded-l-lg focus:outline-none" placeholder="seu.usuario" />
                            <span className="inline-flex items-center px-4 text-gray-400 bg-gray-700/50 rounded-r-lg border-l border-gray-700">@reabilite.pro</span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Senha</label>
                        <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg" />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error.message.replace("Firebase: Error (auth/email-already-in-use).", "Este usuário já está cadastrado.")}</p>}
                    <div>
                        <button type="submit" disabled={loadingRequest} className="w-full flex justify-center py-3 px-4 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50">
                            {loadingRequest ? <Loader2 className='animate-spin'/> : 'Cadastrar'}
                        </button>
                    </div>
                </form>
                 <div className="text-center text-sm text-gray-400 mt-6">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                        Faça login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;

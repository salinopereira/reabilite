'use client';

import { useEffect } from 'react';
import { app } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

const FirebaseMessagingProvider = ({ children }: { children: React.ReactNode }) => {
    const [user] = useAuthState(auth);

    useEffect(() => {
        const initializeMessaging = async () => {
            // Garante que o código só será executado no navegador
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator && user) {
                try {
                    // Importação dinâmica do Firebase Messaging
                    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');
                    const messaging = getMessaging(app);

                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
                        if (currentToken) {
                            console.log('FCM Token:', currentToken);
                            const userRef = doc(db, 'users', user.uid);
                            await setDoc(userRef, { fcmToken: currentToken }, { merge: true });
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    }

                    onMessage(messaging, (payload) => {
                        console.log('Message received. ', payload);
                        new Notification(payload.notification?.title || 'Nova Notificação', {
                            body: payload.notification?.body,
                            icon: '/reabilite-pro-logo.png'
                        });
                    });

                } catch (error) {
                    console.error("Erro ao inicializar o Firebase Messaging:", error);
                }
            }
        };

        initializeMessaging();
    }, [user]);

    return <>{children}</>;
};

export default FirebaseMessagingProvider;

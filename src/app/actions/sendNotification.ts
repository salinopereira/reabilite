'use server';

import { getMessaging, Message } from "firebase-admin/messaging";
import { app as adminApp } from "@/lib/firebase/admin";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface NotificationPayload {
    title: string;
    body: string;
    recipientId: string;
}

export async function sendNotification({ title, body, recipientId }: NotificationPayload) {
    if (!adminApp) {
        console.error('Firebase Admin App não inicializado.');
        return { success: false, error: "Servidor de notificação não configurado." };
    }

    try {
        const userDocRef = doc(db, "users", recipientId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            throw new Error("Usuário não encontrado para enviar notificação.");
        }

        const fcmToken = userDocSnap.data()?.fcmToken;

        if (!fcmToken) {
            console.log(`Usuário ${recipientId} não possui um token FCM registrado.`);
            return { success: false, message: "Usuário não tem token de notificação." };
        }

        const message: Message = {
            token: fcmToken,
            notification: {
                title: title,
                body: body,
            },
            webpush: {
                fcmOptions: {
                    link: '/dashboard' 
                }
            }
        };

        const messaging = getMessaging(adminApp);
        const response = await messaging.send(message);
        console.log('Successfully sent message:', response);
        
        return { success: true, messageId: response };

    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, error: "Failed to send notification." };
    }
}

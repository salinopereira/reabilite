import { Timestamp } from 'firebase/firestore';

export type Professional = {
  id: string;
  name: string;
  email: string;
  crnCrefCrp: string;
  areaOfExpertise: string;
  consultationFee: number;
  availability: string;
  serviceMode: string;
  bio?: string;
  role: 'professional';
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  location: string;
  healthHistory?: string;
  preferences?: string;
  role: 'patient';
  dob?: string;
  phone?: string;
};

export type Appointment = {
    id: string;
    patientId: string;
    professionalId: string;
    dateTime: Timestamp;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
}

export type ChatMessage = {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: Timestamp;
};

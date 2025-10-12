'use client';

import Modal from './Modal';
import EditPatientForm from './EditPatientForm';
import { Paciente } from '@/lib/types';

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente;
  onPatientUpdated: () => void;
}

export default function EditPatientModal({ 
  isOpen, 
  onClose, 
  paciente, 
  onPatientUpdated 
}: EditPatientModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Paciente">
        <EditPatientForm 
          paciente={paciente} 
          onClose={onClose} 
          onPatientUpdated={onPatientUpdated} 
        />
    </Modal>
  );
}

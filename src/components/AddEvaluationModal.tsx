'use client';

import Modal from './Modal';
import AddAvaliacaoForm from './AddAvaliacaoForm';

interface AddEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: string;
  onEvaluationAdded: () => void;
}

export default function AddEvaluationModal({ isOpen, onClose, pacienteId, onEvaluationAdded }: AddEvaluationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Avaliação">
      <AddAvaliacaoForm 
        pacienteId={pacienteId} 
        onClose={onClose} 
        onEvaluationAdded={onEvaluationAdded} 
      />
    </Modal>
  );
}

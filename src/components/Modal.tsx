'use client';

import { MouseEventHandler } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md m-4 border border-slate-700">
        <header className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
          <button onClick={onClose} className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

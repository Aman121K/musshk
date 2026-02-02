'use client';

import { useState, useCallback } from 'react';
import Modal from '@/components/Modal';

interface ModalState {
  isOpen: boolean;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'confirm';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const showModal = useCallback((
    message: string,
    options?: {
      title?: string;
      type?: 'success' | 'error' | 'info' | 'warning' | 'confirm';
      onConfirm?: () => void;
      confirmText?: string;
      cancelText?: string;
      showCancel?: boolean;
    }
  ) => {
    setModal({
      isOpen: true,
      message,
      type: options?.type || 'info',
      title: options?.title,
      onConfirm: options?.onConfirm,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      showCancel: options?.showCancel,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const ModalComponent = () => (
    <Modal
      isOpen={modal.isOpen}
      onClose={hideModal}
      title={modal.title}
      message={modal.message}
      type={modal.type}
      onConfirm={modal.onConfirm}
      confirmText={modal.confirmText}
      cancelText={modal.cancelText}
      showCancel={modal.showCancel}
    />
  );

  return {
    showModal,
    hideModal,
    ModalComponent,
  };
}

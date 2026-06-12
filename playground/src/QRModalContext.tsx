import { createContext, useContext, type ReactNode } from 'react';
import type { QRCodeProps } from 'react-qr-master';

export interface ModalContextType {
  openQRModal: (props: Partial<QRCodeProps>, title?: string) => void;
  closeQRModal: () => void;
}

export const QRModalContext = createContext<ModalContextType | null>(null);

export function useQRModal() {
  const context = useContext(QRModalContext);
  if (!context) {
    throw new Error('useQRModal must be used within QRModalProvider');
  }
  return context;
}

export function QRModalProvider({ children }: { children: ReactNode }) {
  // This is just a placeholder - the actual provider is in App.tsx
  return <>{children}</>;
}

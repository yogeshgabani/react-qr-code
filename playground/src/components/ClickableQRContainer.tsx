import { ReactNode } from 'react';
import { useQRModal } from '../QRModalContext';
import type { QRCodeProps } from 'react-qr-master';

export interface ClickableQRContainerProps {
  children: ReactNode;
  qrProps: Partial<QRCodeProps>;
  title?: string;
}

export function ClickableQRContainer({ children, qrProps, title = 'QR Code Designer' }: ClickableQRContainerProps) {
  const { openQRModal } = useQRModal();

  return (
    <div
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onClick={() => openQRModal(qrProps, title)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.filter = 'brightness(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.filter = 'brightness(1)';
      }}
    >
      {children}
    </div>
  );
}

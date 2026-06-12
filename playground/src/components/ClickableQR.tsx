import { useState } from 'react';
import { QRCode, type QRCodeProps } from 'react-qr-master';
import { QRCodeModal } from './QRCodeModal';
import { tokens } from '../styles';

export interface ClickableQRProps extends QRCodeProps {
  modalTitle?: string;
  className?: string;
}

export function ClickableQR({ modalTitle, className, ...qrProps }: ClickableQRProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        style={{
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.filter = 'brightness(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.filter = 'brightness(1)';
        }}
        title="Click to edit and export"
      >
        <QRCode {...qrProps} className={className} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'transparent',
            border: `2px solid ${tokens.primary}`,
            borderRadius: 8,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            background: tokens.primary,
            color: '#000',
            padding: '4px 8px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 600,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
        >
          ✎ Edit
        </div>
      </div>

      <QRCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialProps={qrProps}
        title={modalTitle || 'QR Code Designer'}
      />
    </>
  );
}

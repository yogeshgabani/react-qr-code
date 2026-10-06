import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeCrypto, type CryptoPayload } from '../../core/encoders';

export interface CryptoQRProps extends Omit<QRCodeProps, 'value'>, CryptoPayload {}

export const CryptoQR = /* @__PURE__ */ forwardRef<SVGSVGElement, CryptoQRProps>(function CryptoQR(
  { coin, address, amount, label, message, tokenAddress, ...rest },
  ref,
) {
  const value = encodeCrypto({ coin, address, amount, label, message, tokenAddress });
  return <QRCode ref={ref} value={value} {...rest} />;
});

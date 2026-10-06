import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeWhatsApp, type WhatsAppPayload } from '../../core/encoders';

export interface WhatsAppQRProps extends Omit<QRCodeProps, 'value'>, WhatsAppPayload {}

export const WhatsAppQR = /* @__PURE__ */ forwardRef<SVGSVGElement, WhatsAppQRProps>(function WhatsAppQR(
  { phoneNumber, message, ...rest },
  ref,
) {
  return <QRCode ref={ref} value={encodeWhatsApp({ phoneNumber, message })} {...rest} />;
});

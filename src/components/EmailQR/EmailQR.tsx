import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeEmail, type EmailPayload } from '../../core/encoders';

export interface EmailQRProps extends Omit<QRCodeProps, 'value'>, EmailPayload {}

export const EmailQR = forwardRef<SVGSVGElement, EmailQRProps>(function EmailQR(
  { to, subject, body, cc, bcc, ...rest },
  ref,
) {
  const value = encodeEmail({ to, subject, body, cc, bcc });
  return <QRCode ref={ref} value={value} {...rest} />;
});

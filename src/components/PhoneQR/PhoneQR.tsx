import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodePhone, type PhonePayload } from '../../core/encoders';

export interface PhoneQRProps extends Omit<QRCodeProps, 'value'>, PhonePayload {}

export const PhoneQR = forwardRef<SVGSVGElement, PhoneQRProps>(function PhoneQR(
  { phoneNumber, ...rest },
  ref,
) {
  return <QRCode ref={ref} value={encodePhone({ phoneNumber })} {...rest} />;
});

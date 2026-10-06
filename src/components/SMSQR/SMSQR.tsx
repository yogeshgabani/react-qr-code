import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeSMS, type SMSPayload } from '../../core/encoders';

export interface SMSQRProps extends Omit<QRCodeProps, 'value'>, SMSPayload {}

export const SMSQR = /* @__PURE__ */ forwardRef<SVGSVGElement, SMSQRProps>(function SMSQR(
  { phoneNumber, message, ...rest },
  ref,
) {
  return <QRCode ref={ref} value={encodeSMS({ phoneNumber, message })} {...rest} />;
});

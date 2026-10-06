import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeWiFi, type WiFiPayload } from '../../core/encoders';

export interface WiFiQRProps extends Omit<QRCodeProps, 'value'>, WiFiPayload {}

export const WiFiQR = /* @__PURE__ */ forwardRef<SVGSVGElement, WiFiQRProps>(function WiFiQR(
  { ssid, password, encryption, hidden, ...rest },
  ref,
) {
  const value = encodeWiFi({ ssid, password, encryption, hidden });
  return <QRCode ref={ref} value={value} {...rest} />;
});

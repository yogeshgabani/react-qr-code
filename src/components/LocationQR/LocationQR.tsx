import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeLocation, type LocationPayload } from '../../core/encoders';

export interface LocationQRProps extends Omit<QRCodeProps, 'value'>, LocationPayload {}

export const LocationQR = /* @__PURE__ */ forwardRef<SVGSVGElement, LocationQRProps>(function LocationQR(
  { latitude, longitude, accuracy, query, ...rest },
  ref,
) {
  const value = encodeLocation({ latitude, longitude, accuracy, query });
  return <QRCode ref={ref} value={value} {...rest} />;
});

import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeGoogleMaps, type GoogleMapsPayload } from '../../core/encoders';

export interface GoogleMapsQRProps extends Omit<QRCodeProps, 'value'>, GoogleMapsPayload {}

export const GoogleMapsQR = forwardRef<SVGSVGElement, GoogleMapsQRProps>(function GoogleMapsQR(
  { query, latitude, longitude, ...rest },
  ref,
) {
  const value = encodeGoogleMaps({ query, latitude, longitude });
  return <QRCode ref={ref} value={value} {...rest} />;
});

import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';

export interface WebsiteQRProps extends Omit<QRCodeProps, 'value'> {
  url: string;
}

export const WebsiteQR = /* @__PURE__ */ forwardRef<SVGSVGElement, WebsiteQRProps>(function WebsiteQR(
  { url, ...rest },
  ref,
) {
  const normalised = /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
  return <QRCode ref={ref} value={normalised} {...rest} />;
});

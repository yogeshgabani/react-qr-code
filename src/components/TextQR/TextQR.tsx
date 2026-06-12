import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';

export interface TextQRProps extends Omit<QRCodeProps, 'value'> {
  text: string;
}

export const TextQR = forwardRef<SVGSVGElement, TextQRProps>(function TextQR(
  { text, ...rest },
  ref,
) {
  return <QRCode ref={ref} value={text} {...rest} />;
});

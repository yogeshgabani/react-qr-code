import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeSocial, type SocialPayload } from '../../core/encoders';

export interface SocialQRProps extends Omit<QRCodeProps, 'value'>, SocialPayload {}

export const SocialQR = forwardRef<SVGSVGElement, SocialQRProps>(function SocialQR(
  { platform, username, ...rest },
  ref,
) {
  return <QRCode ref={ref} value={encodeSocial({ platform, username })} {...rest} />;
});

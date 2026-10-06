import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeContact, type ContactPayload } from '../../core/encoders';

export interface ContactQRProps extends Omit<QRCodeProps, 'value' | 'title'>, ContactPayload {}

export const ContactQR = /* @__PURE__ */ forwardRef<SVGSVGElement, ContactQRProps>(function ContactQR(
  {
    firstName,
    lastName,
    fullName,
    organization,
    title,
    phone,
    mobile,
    workPhone,
    email,
    website,
    address,
    note,
    ...rest
  },
  ref,
) {
  const value = encodeContact({
    firstName,
    lastName,
    fullName,
    organization,
    title,
    phone,
    mobile,
    workPhone,
    email,
    website,
    address,
    note,
  });
  return <QRCode ref={ref} value={value} {...rest} />;
});

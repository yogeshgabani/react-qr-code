import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeUPI, type UPIPayload } from '../../core/encoders';

export interface UPIQRProps extends Omit<QRCodeProps, 'value'>, UPIPayload {}

export const UPIQR = forwardRef<SVGSVGElement, UPIQRProps>(function UPIQR(
  {
    payeeVPA,
    payeeName,
    amount,
    note,
    transactionRef,
    merchantCode,
    currency,
    ...rest
  },
  ref,
) {
  const value = encodeUPI({
    payeeVPA,
    payeeName,
    amount,
    note,
    transactionRef,
    merchantCode,
    currency,
  });
  return <QRCode ref={ref} value={value} {...rest} />;
});

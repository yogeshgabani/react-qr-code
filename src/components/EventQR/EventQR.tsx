import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeEvent, type EventPayload } from '../../core/encoders';

export interface EventQRProps extends Omit<QRCodeProps, 'value' | 'title'>, EventPayload {}

export const EventQR = /* @__PURE__ */ forwardRef<SVGSVGElement, EventQRProps>(function EventQR(
  { title, start, end, allDay, location, description, url, organizer, ...rest },
  ref,
) {
  const value = encodeEvent({
    title,
    start,
    end,
    allDay,
    location,
    description,
    url,
    organizer,
  });
  return <QRCode ref={ref} value={value} {...rest} />;
});

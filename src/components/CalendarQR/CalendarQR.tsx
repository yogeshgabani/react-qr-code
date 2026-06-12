import { forwardRef } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { encodeEvent, type EventPayload } from '../../core/encoders';

/**
 * CalendarQR encodes an iCalendar VEVENT — same wire format as EventQR but
 * with optional recurrence. Scanners that recognise VCALENDAR will offer to
 * add the event (and any recurrence) to the user's calendar.
 */
export interface CalendarQRProps extends Omit<QRCodeProps, 'value' | 'title'>, EventPayload {
  /** iCal RRULE (e.g. "FREQ=WEEKLY;BYDAY=MO,WE,FR"). Appended to the VEVENT. */
  recurrence?: string;
}

export const CalendarQR = forwardRef<SVGSVGElement, CalendarQRProps>(function CalendarQR(
  {
    title,
    start,
    end,
    allDay,
    location,
    description,
    url,
    organizer,
    recurrence,
    ...rest
  },
  ref,
) {
  let value = encodeEvent({
    title,
    start,
    end,
    allDay,
    location,
    description,
    url,
    organizer,
  });
  if (recurrence) {
    value = value.replace(
      'END:VEVENT',
      `RRULE:${recurrence}\r\nEND:VEVENT`,
    );
  }
  return <QRCode ref={ref} value={value} {...rest} />;
});

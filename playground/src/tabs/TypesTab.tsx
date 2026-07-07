import type { ReactNode, CSSProperties } from 'react';
import {
  QRCode,
  WebsiteQR,
  TextQR,
  WiFiQR,
  EmailQR,
  PhoneQR,
  SMSQR,
  WhatsAppQR,
  ContactQR,
  GoogleMapsQR,
  LocationQR,
  EventQR,
  CalendarQR,
  UPIQR,
  CryptoQR,
  SocialQR,
} from 'react-qr-master';
import { card, cardLabel, grid, sectionHeading, subtle, tokens } from '../styles';
import { HowToUse, CopyButton } from '../components';
import { useQRModal } from '../QRModalContext';

// Label truncates cleanly instead of colliding with the "Code" button.
const typeLabel: CSSProperties = {
  ...cardLabel,
  flex: 1,
  minWidth: 0,
  textAlign: 'left',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/** QR preview that opens the designer modal on click (with a subtle hover zoom). */
function QRPreview({ onOpen, children }: { onOpen: () => void; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        flex: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onClick={onOpen}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.filter = 'brightness(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.filter = 'brightness(1)';
      }}
    >
      {children}
    </div>
  );
}

export function TypesTab() {
  const { openQRModal } = useQRModal();
  return (
    <div style={{ padding: "32px 0px" }}>
      <h2 style={sectionHeading}>16 QR types</h2>
      <p style={subtle}>
        Each is a thin wrapper around <code>&lt;QRCode/&gt;</code> with a payload encoder. Design
        props (shape, eyeShape, gradient, animation, theme) flow through every wrapper.
      </p>

      <HowToUse
        title="QR Types"
        description="Each QR type is a specialized wrapper that encodes different data formats (URLs, WiFi credentials, contact info, crypto payments, etc.). All design props like shape, theme, and gradient work with every type."
        examples={[
          {
            language: 'tsx',
            label: 'Website QR',
            code: `import { WebsiteQR } from 'react-qr-master';\n\nexport function MyComponent() {\n  return (\n    <WebsiteQR \n      url="https://acme.com" \n      size={256}\n      shape="rounded"\n      theme="neon"\n    />\n  );\n}`,
            description: 'Encodes a URL that opens in the browser when scanned.'
          },
          {
            language: 'tsx',
            label: 'WiFi QR',
            code: `import { WiFiQR } from 'react-qr-master';\n\nexport function WiFiShare() {\n  return (\n    <WiFiQR\n      ssid="HomeNetwork"\n      password="secure123"\n      encryption="WPA2"\n      size={256}\n    />\n  );\n}`,
            description: 'Encodes WiFi credentials. Scanned phones auto-connect.'
          },
          {
            language: 'tsx',
            label: 'Contact QR',
            code: `import { ContactQR } from 'react-qr-master';\n\nexport function BusinessCard() {\n  return (\n    <ContactQR\n      firstName="John"\n      lastName="Doe"\n      email="john@company.com"\n      mobile="+1 555 123 4567"\n      organization="Acme Corp"\n      website="https://acme.com"\n      size={256}\n    />\n  );\n}`,
            description: 'Encodes vCard format. Scanned phones save contact.'
          },
        ]}
      />
      <h3 style={{ ...sectionHeading, fontSize: 24, marginTop: 32, marginBottom: 32 }}>Gallery</h3>
      <div style={grid}>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>WebsiteQR</p>
            <CopyButton
              text='<WebsiteQR url="acme.com" size={256} />'
              label="Code"
              size="sm"
            />
          </div>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              flex: 1,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => openQRModal({ value: 'https://acme.com' }, 'Website QR')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            <WebsiteQR url="acme.com" size={180} />
          </div>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Opens a URL when scanned</p>
        </div>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>TextQR</p>
            <CopyButton text='<TextQR text="Hello!" size={256} />' label="Code" size="sm" />
          </div>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              flex: 1,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => openQRModal({ value: 'Hello, world!' }, 'Text QR')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            <TextQR text="Hello, world!" size={180} />
          </div>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Plain text message</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>WiFiQR</p>
            <CopyButton text='<WiFiQR ssid="Network" password="pass" size={256} />' label="Code" size="sm" />
          </div>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              flex: 1,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => openQRModal({ value: 'WIFI:T:WPA;S:HomeNet;P:hunter2;;' }, 'WiFi QR')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            <WiFiQR ssid="HomeNet" password="hunter2" encryption="WPA2" shape="dot" cornerStyle="circle" eyeShape="circle" size={180} />
          </div>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Auto-connect WiFi on scan</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>EmailQR</p>
            <CopyButton text='<EmailQR to="user@example.com" subject="Hi" size={256} />' label="Code" size="sm" />
          </div>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              flex: 1,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => openQRModal({ value: 'mailto:hi@acme.com?subject=Hello&body=From%20QR' }, 'Email QR')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            <EmailQR to="hi@acme.com" subject="Hello" body="From QR" shape="diamond" size={180} />
          </div>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Open email composer</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>PhoneQR</p>
            <CopyButton text='<PhoneQR phoneNumber="+1 555 123 4567" size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'tel:+14155552671' }, 'Phone QR')}>
            <PhoneQR phoneNumber="+1 415 555 2671" size={180} />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Initiate phone call</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>SMSQR</p>
            <CopyButton text='<SMSQR phoneNumber="+1 555 123 4567" message="Hi!" size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'SMSTO:14155552671:Hey!' }, 'SMS QR')}>
            <SMSQR phoneNumber="14155552671" message="Hey!" size={180} />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Send SMS message</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>WhatsAppQR</p>
            <CopyButton text='<WhatsAppQR phoneNumber="+1 555 123" message="Hi!" size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'https://wa.me/14155552671?text=Hi!', cornerStyle: 'rounded', eyeShape: 'rounded' }, 'WhatsApp QR')}>
            <WhatsAppQR phoneNumber="14155552671" message="Hi!" size={180} gradient={{ type: 'linear', colors: ['#25D366', '#128C7E'], rotation: 90 }} cornerStyle="rounded" eyeShape="rounded" />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>WhatsApp message</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>ContactQR</p>
            <CopyButton text='<ContactQR firstName="John" email="john@example.com" size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'BEGIN:VCARD\nVERSION:3.0\nN:Doe;Jane\nORG:Acme Co\nEMAIL:jane@acme.com\nTEL:+14155552671\nURL:https://acme.com\nEND:VCARD' }, 'Contact QR')}>
            <ContactQR firstName="Jane" lastName="Doe" organization="Acme Co" email="jane@acme.com" mobile="+1 415 555 2671" website="https://acme.com" size={180} />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>vCard contact save</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>GoogleMapsQR</p>
            <CopyButton text='<GoogleMapsQR query="Eiffel Tower, Paris" size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'https://www.google.com/maps/search/?api=1&query=Eiffel+Tower,+Paris', shape: 'rounded', cornerStyle: 'rounded' }, 'Google Maps QR')}>
            <GoogleMapsQR query="Eiffel Tower, Paris" size={180} shape="rounded" cornerStyle="rounded" />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Open Google Maps location</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>LocationQR</p>
            <CopyButton text='<LocationQR latitude={37.7749} longitude={-122.4194} size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'geo:37.7749,-122.4194' }, 'Location QR')}>
            <LocationQR latitude={37.7749} longitude={-122.4194} query="San Francisco" size={180} />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>geo: URL location</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>EventQR</p>
            <CopyButton text='<EventQR title="Conference" start="2026-10-15T09:00Z" size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'BEGIN:VEVENT\nSUMMARY:React Conf\nDTSTART:20261015T090000Z\nDTEND:20261015T170000Z\nLOCATION:San Francisco\nEND:VEVENT' }, 'Event QR')}>
            <EventQR title="React Conf" start="2026-10-15T09:00:00Z" end="2026-10-15T17:00:00Z" location="San Francisco" size={180} />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>iCal event schedule</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>CalendarQR</p>
            <CopyButton text='<CalendarQR title="Standup" recurrence="FREQ=WEEKLY" size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'BEGIN:VEVENT\nSUMMARY:Standup\nDTSTART:20260615T090000Z\nDTEND:20260615T091500Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR\nEND:VEVENT' }, 'Calendar QR')}>
            <CalendarQR title="Standup" start="2026-06-15T09:00:00Z" end="2026-06-15T09:15:00Z" recurrence="FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR" size={180} />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Recurring calendar event</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>UPIQR</p>
            <CopyButton text='<UPIQR payeeVPA="merchant@upi" amount="299.00" size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'upi://pay?pa=merchant@upi&pn=Acme%20Pvt%20Ltd&am=299.00&tn=Order%201234', cornerStyle: 'modern', eyeShape: 'modern' }, 'UPI QR')}>
            <UPIQR payeeVPA="merchant@upi" payeeName="Acme Pvt Ltd" amount="299.00" note="Order #1234" size={180} gradient={{ type: 'radial', colors: ['#10b981', '#064e3b'] }} cornerStyle="modern" eyeShape="modern" />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>UPI payment request</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>CryptoQR · Bitcoin</p>
            <CopyButton text='<CryptoQR coin="bitcoin" address="bc1qxy..." amount={0.05} size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.05', fgColor: '#f7931a' }, 'Bitcoin QR')}>
            <CryptoQR coin="bitcoin" address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" amount={0.05} label="Donation" size={180} fgColor="#f7931a" />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Bitcoin payment</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>CryptoQR · Ethereum</p>
            <CopyButton text='<CryptoQR coin="ethereum" address="0x742d..." amount={1.5} size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb6?value=1.5' }, 'Ethereum QR')}>
            <CryptoQR coin="ethereum" address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb6" amount={1.5} size={180} gradient={{ type: 'linear', colors: ['#627eea', '#3c5ad6'], rotation: 45 }} />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Ethereum payment</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>SocialQR · GitHub</p>
            <CopyButton text='<SocialQR platform="github" username="anthropics" size={256} />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'https://github.com/anthropics', shape: 'circle' }, 'Social QR')}>
            <SocialQR platform="github" username="anthropics" size={180} shape="circle" />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Social profile link</p>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <p style={typeLabel}>QRCode · Base</p>
            <CopyButton text='<QRCode value="https://example.com" size={256} shape="diamond" />' label="Code" size="sm" />
          </div>
          <QRPreview onOpen={() => openQRModal({ value: 'https://example.com', shape: 'diamond', cornerStyle: 'rounded', eyeShape: 'rounded', fgColor: '#fbbf24', bgColor: '#0f172a' }, 'QR Code')}>
            <QRCode value="https://example.com" size={180} shape="diamond" cornerStyle="rounded" eyeShape="rounded" fgColor="#fbbf24" bgColor="#0f172a" />
          </QRPreview>
          <p style={{ fontSize: 11, color: tokens.textSubtle, margin: 0 }}>Raw data encoding</p>
        </div>
      </div>
    </div>
  );
}

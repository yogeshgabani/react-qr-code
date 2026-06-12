import { QRBatchGenerator } from 'react-qr-master';
import { subtle } from '../styles';

const SAMPLE_ROWS = [
  { id: 'order-001', value: 'https://shop.example.com/order/001', label: 'Order 001' },
  { id: 'order-002', value: 'https://shop.example.com/order/002', label: 'Order 002' },
  { id: 'order-003', value: 'https://shop.example.com/order/003', label: 'Order 003' },
  { id: 'order-004', value: 'https://shop.example.com/order/004', label: 'Order 004' },
  { id: 'order-005', value: 'https://shop.example.com/order/005', label: 'Order 005' },
  { id: 'order-006', value: 'https://shop.example.com/order/006', label: 'Order 006' },
];

export function BatchTab() {
  return (
    <div>
      <p style={subtle}>
        Import a CSV with columns <code>id, value, label</code> (or a JSON array). Export the
        whole batch as a ZIP of PNGs or a paginated PDF. PDF / ZIP libraries are dynamic-imported.
      </p>
      <QRBatchGenerator
        initialRows={SAMPLE_ROWS}
        qrOptions={{ shape: 'rounded', cornerStyle: 'rounded', eyeShape: 'rounded' }}
      />
    </div>
  );
}

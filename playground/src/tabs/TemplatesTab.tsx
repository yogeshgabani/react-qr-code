import { useState } from 'react';
import { QRCode, TEMPLATES, type TemplateCategory } from 'react-qr-master';
import { card, cardLabel, grid, sectionHeading, subtle, tokens } from '../styles';

const CATS: (TemplateCategory | 'all')[] = [
  'all',
  'business',
  'restaurant',
  'portfolio',
  'wedding',
  'event',
  'education',
  'real-estate',
  'healthcare',
  'ecommerce',
  'startup',
  'agency',
];

export function TemplatesTab() {
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all');
  const items = category === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category);

  return (
    <div>
      <h2 style={sectionHeading}>Template library · {TEMPLATES.length} presets</h2>
      <p style={subtle}>
        Categories cover Business, Restaurant, Portfolio, Wedding, Event, Education, Real Estate,
        Healthcare, E-commerce, Startup, Agency. Apply with{' '}
        <code>&lt;QRCode {'{...template.preset}'} value=… /&gt;</code>.
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              border: '1px solid',
              borderColor:
                category === c ? 'rgba(168,85,247,0.5)' : tokens.border,
              background:
                category === c
                  ? 'linear-gradient(135deg,#a855f7,#7c3aed)'
                  : tokens.bgCard,
              color: category === c ? '#fff' : tokens.textMuted,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.3,
              boxShadow: category === c ? '0 4px 14px rgba(124,58,237,0.4)' : 'none',
              transition: 'all 0.15s ease',
              textTransform: 'capitalize',
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={grid}>
        {items.map((tpl) => (
          <div style={card} className="qrm-card" key={tpl.id}>
            <p style={cardLabel}>{tpl.name}</p>
            <QRCode value={tpl.sampleValue} size={160} {...tpl.preset} />
            <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', margin: 0 }}>
              {tpl.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

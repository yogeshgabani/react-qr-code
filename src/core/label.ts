// Layout for the call-to-action label ("SCAN ME") drawn next to a QR. All
// values are in module units, the same as the QR's viewBox, so the label
// scales with the code. Pure maths: no DOM, so it runs on the server too.

export type LabelStyle = 'banner' | 'pill' | 'plain';
export type LabelPosition = 'top' | 'bottom';

export interface LabelLayout {
  /** Width and height of the whole drawing (QR + label). */
  width: number;
  height: number;
  /** Top-left corner of the QR square, quiet zone included. */
  qrX: number;
  qrY: number;
  /** Horizontal centre and baseline of the text. */
  textX: number;
  textY: number;
  fontSize: number;
  /** Frame thickness around the QR ('banner' only, otherwise 0). */
  border: number;
  /** Button behind the text ('pill' only). */
  pill?: { x: number; y: number; width: number; height: number };
}

// Approximate advance widths (in em) of a bold sans-serif such as Helvetica,
// Arial or Segoe UI. Text can't be measured without a DOM, and an estimate is
// enough to shrink long labels so they stay inside the frame.
function textWidthEm(text: string): number {
  let em = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (ch === ' ') em += 0.28;
    else if (/[iIjlft.,:;!|'`()[\]]/.test(ch)) em += 0.34;
    else if (/[mwMW@%]/.test(ch)) em += 0.92;
    else if (/[A-Z]/.test(ch)) em += 0.74;
    else if (code < 0x80) em += 0.6;
    else if (code >= 0x2e80) em += 1; // CJK, emoji
    else em += 0.72;
  }
  return Math.max(em, 0.5);
}

/**
 * Place the QR and its label.
 *
 * @param text    Label text (already trimmed, non-empty).
 * @param total   QR size including the quiet zone, in modules.
 * @param margin  Quiet zone, in modules.
 */
export function layoutLabel(
  text: string,
  style: LabelStyle,
  position: LabelPosition,
  total: number,
  margin: number,
): LabelLayout {
  const baseFont = total * 0.085;
  const em = textWidthEm(text);
  // The cap height of these fonts is ~0.72 em, so this baseline centres
  // capitals on the band's midline.
  const baseline = (center: number, font: number) => center + font * 0.36;

  if (style === 'banner') {
    const border = total * 0.035;
    const band = baseFont * 2;
    const width = total + border * 2;
    const fontSize = Math.min(baseFont, (total * 0.92) / em);
    const qrY = position === 'top' ? band : border;
    const bandCenter = position === 'top' ? band / 2 : border + total + band / 2;
    return {
      width,
      height: total + border + band,
      qrX: border,
      qrY,
      textX: width / 2,
      textY: baseline(bandCenter, fontSize),
      fontSize,
      border,
    };
  }

  // 'pill' and 'plain' sit on the QR's background, below (or above) it. Keep at
  // least 2 modules of quiet zone between the code and the label so scanners
  // still find the code's edge, and reuse the rest of the quiet zone.
  const quiet = Math.min(Math.max(margin, 2), 3);
  const outerPad = Math.max(margin * 0.75, 1.5);
  const isPill = style === 'pill';
  const boxHeight = baseFont * (isPill ? 1.9 : 1.3);
  const extra = quiet - margin + boxHeight + outerPad;
  const boxY = position === 'top' ? outerPad : total - margin + quiet;
  const qrY = position === 'top' ? extra : 0;

  const pillMax = total * 0.84;
  const pillPad = baseFont * 1.6;
  const fontSize = Math.min(baseFont, (isPill ? pillMax - pillPad : total * 0.92) / em);
  const pillWidth = Math.min(pillMax, em * fontSize + pillPad);

  return {
    width: total,
    height: total + extra,
    qrX: 0,
    qrY,
    textX: total / 2,
    textY: baseline(boxY + boxHeight / 2, fontSize),
    fontSize,
    border: 0,
    pill: isPill
      ? { x: (total - pillWidth) / 2, y: boxY, width: pillWidth, height: boxHeight }
      : undefined,
  };
}

import {
  forwardRef,
  useId,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { generateMatrix, type ErrorCorrectionLevel } from '../../core/qr-generator';
import {
  renderModule,
  renderFinderCorner,
  renderFinderInner,
  type ModuleShape,
  type CornerStyle,
  type EyeShape,
} from '../../core/shapes';
import { getFinderOrigins, isInFinderPattern } from '../../core/finder';
import { getAnimationCSS, type QRAnimation } from '../../core/animations';
import { THEMES, type QRThemeName, type QRTheme } from '../../core/themes';
import { layoutLabel, type LabelPosition, type LabelStyle } from '../../core/label';
import type { QRGradient } from '../../core/qr-types';

export type { QRGradient } from '../../core/qr-types';
export type { QRThemeName } from '../../core/themes';
export type { QRAnimation } from '../../core/animations';
export type { LabelStyle, LabelPosition } from '../../core/label';

const DEFAULT_LABEL_FONT =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Safe maximum logoSize (linear ratio of the QR) for each error-correction
// level. Beyond these the logo eats more data modules than the level can
// recover, so the QR stops scanning. Derived from the ISO/IEC 18004 recovery
// capacities (L≈7%, M≈15%, Q≈25%, H≈30%) with a small safety buffer.
const SAFE_LOGO_RATIO_BY_LEVEL: Record<ErrorCorrectionLevel, number> = {
  L: 0.15,
  M: 0.2,
  Q: 0.25,
  H: 0.3,
};

export interface QRCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  /** Quiet-zone margin in module units. Defaults to 4. */
  margin?: number;
  /**
   * Error-correction level. Defaults to `'M'`, but auto-bumps to `'H'` when a
   * `logo` is provided (so a centred logo doesn't break scanning). Pass an
   * explicit level to opt out of the auto-bump.
   */
  level?: ErrorCorrectionLevel;

  // ── Logo overlay ─────────────────────────────────────────────────────────
  /** URL or data URI of the logo (PNG / SVG / JPG / WEBP). */
  logo?: string;
  /** Fraction of the QR size (0..0.5). Defaults to 0.2. */
  logoSize?: number;
  /** Padding around the logo in module units. Defaults to 1. */
  logoPadding?: number;
  /** Logo cut-out shape. Defaults to 'square'. */
  logoShape?: 'square' | 'rounded' | 'circle';
  /**
   * How the logo sits in the QR:
   *   - 'foreground' (default) — small overlay with bgColor box behind it
   *   - 'embedded' — small overlay with NO box (modules continue through)
   *   - 'background' — image fills the entire QR; modules render on top
   */
  logoMode?: 'foreground' | 'embedded' | 'background';
  /** Logo placement (ignored when logoMode === 'background'). Defaults to 'center'. */
  logoPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  /** Border colour around the logo. Disabled when undefined. */
  logoBorderColor?: string;
  /** Border thickness in module units. Defaults to 0.5 when borderColor is set. */
  logoBorderWidth?: number;

  // ── Outer frame ──────────────────────────────────────────────────────────
  /** Outer QR frame shape. 'rounded' rounds the bg corners; safe inside the quiet zone. */
  frame?: 'square' | 'rounded';

  // ── Label ("SCAN ME" call to action) ─────────────────────────────────────
  /**
   * Short call-to-action text drawn with the QR, e.g. "SCAN ME". The SVG keeps
   * `size` as its width and grows taller to fit the label. Long text shrinks
   * to fit the width.
   */
  label?: string;
  /**
   * How the label is drawn:
   *   - 'banner' (default) — coloured frame around the QR, text in a band
   *   - 'pill' — text in a rounded button next to the QR
   *   - 'plain' — text only
   */
  labelStyle?: LabelStyle;
  /** Side of the QR the label sits on. Defaults to 'bottom'. */
  labelPosition?: LabelPosition;
  /** Text colour. Defaults to bgColor for 'banner' / 'pill', fgColor for 'plain'. */
  labelColor?: string;
  /** Frame / pill colour. Defaults to fgColor (the first colour of a gradient). */
  labelBackground?: string;
  /** CSS font-family of the label. Defaults to a bold system sans-serif. */
  labelFont?: string;

  // ── Design engine ────────────────────────────────────────────────────────
  /** Apply a preset theme. Individual props override theme values. */
  theme?: QRThemeName;
  /** Data-module shape. */
  shape?: ModuleShape;
  /** Outer ring of the 3 finder patterns ("eyes"). */
  cornerStyle?: CornerStyle;
  /** Inner pupil of the 3 finder patterns. */
  eyeShape?: EyeShape;
  /** Override colour of the finder patterns. Defaults to fgColor/gradient. */
  eyeColor?: string;
  /** Linear, radial, or conic gradient. Conic uses CSS via foreignObject. */
  gradient?: QRGradient;
  /** CSS animation applied to the QR. */
  animation?: QRAnimation;
  /** Spacing between modules (0..0.5). 0 = no gap, 0.5 = maximum gap. */
  moduleSpacing?: number;

  // ── DOM ──────────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
  id?: string;
  title?: string;
}

function applyTheme(theme: QRTheme | undefined, props: QRCodeProps): Required<
  Pick<
    QRCodeProps,
    'fgColor' | 'bgColor' | 'shape' | 'cornerStyle' | 'eyeShape'
  >
> & {
  eyeColor: string | undefined;
  gradient: QRGradient | undefined;
  animation: QRAnimation | undefined;
} {
  return {
    fgColor: props.fgColor ?? theme?.fgColor ?? '#000000',
    bgColor: props.bgColor ?? theme?.bgColor ?? '#ffffff',
    shape: props.shape ?? theme?.shape ?? 'square',
    cornerStyle: props.cornerStyle ?? theme?.cornerStyle ?? 'square',
    eyeShape: props.eyeShape ?? theme?.eyeShape ?? 'square',
    eyeColor: props.eyeColor ?? theme?.eyeColor,
    gradient: props.gradient ?? theme?.gradient,
    animation: props.animation ?? theme?.animation,
  };
}

export const QRCode = /* @__PURE__ */ forwardRef<SVGSVGElement, QRCodeProps>(function QRCode(props, ref) {
  const {
    value,
    size = 256,
    margin = 4,
    logo,
    logoSize = 0.2,
    logoPadding = 1,
    logoShape = 'square',
    logoMode = 'foreground',
    logoPosition = 'center',
    logoBorderColor,
    logoBorderWidth = 0.5,
    frame = 'square',
    label,
    labelStyle = 'banner',
    labelPosition = 'bottom',
    labelFont = DEFAULT_LABEL_FONT,
    theme: themeName,
    moduleSpacing = 0,
    className,
    style,
    id,
    title,
  } = props;

  // Auto-bump error correction to 'H' (30% recovery) when a logo is present and
  // the caller hasn't picked a level. Without this, even a modestly sized logo
  // can wipe out more data modules than the default level 'M' can recover, and
  // the QR stops scanning.
  const level: ErrorCorrectionLevel = props.level ?? (logo ? 'H' : 'M');

  if (
    process.env.NODE_ENV !== 'production' &&
    logo &&
    logoSize > SAFE_LOGO_RATIO_BY_LEVEL[level]
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `[react-qr-master] logoSize=${logoSize} exceeds the safe ratio (${SAFE_LOGO_RATIO_BY_LEVEL[level]}) ` +
        `for error-correction level "${level}". The QR may fail to scan. ` +
        `Reduce logoSize or pass level="H".`,
    );
  }

  const themePreset = themeName ? THEMES[themeName] : undefined;
  const resolved = applyTheme(themePreset, props);
  const {
    fgColor,
    bgColor,
    shape,
    cornerStyle,
    eyeShape,
    eyeColor,
    gradient,
    animation,
  } = resolved;

  const reactId = useId();
  const idBase = `qrm-${reactId.replace(/:/g, '')}`;
  const gradId = `${idBase}-grad`;
  const animClass = animation ? 'qrm-anim' : undefined;

  const { modules, size: count } = useMemo(
    () => generateMatrix(value, level),
    [value, level],
  );
  const total = count + margin * 2;
  const frameRadius = frame === 'rounded' ? Math.min(margin, total * 0.06) : 0;

  // Optional "SCAN ME" label. The QR keeps its own coordinates and is shifted
  // into place, so nothing below needs to know about the label.
  const labelText = label?.trim();
  const labelLayout = labelText
    ? layoutLabel(labelText, labelStyle, labelPosition, total, margin)
    : null;
  const viewWidth = labelLayout?.width ?? total;
  const viewHeight = labelLayout?.height ?? total;
  const labelAccent = gradient?.colors[0] ?? fgColor;
  const labelFill = props.labelBackground ?? labelAccent;
  const labelTextColor = props.labelColor ?? (labelStyle === 'plain' ? labelAccent : bgColor);
  const outerRadius =
    labelStyle === 'banner' && frame === 'rounded'
      ? frameRadius + (labelLayout?.border ?? 0)
      : frameRadius;

  // Clamp logo size to both the UI limit (0.5) and the safety limit for the EC level.
  // Safety limits ensure the QR remains scannable even on strict built-in scanners.
  const safeLimit = SAFE_LOGO_RATIO_BY_LEVEL[level];
  const clampedLogoSize = Math.min(Math.max(logoSize, 0), 0.5, safeLimit);
  const isBackgroundLogo = !!logo && logoMode === 'background';
  const logoPx = logo && !isBackgroundLogo ? total * clampedLogoSize : 0;

  // Position the logo. For non-center positions we offset along the chosen
  // axis but keep the perpendicular axis centred to avoid colliding with
  // finder patterns. The shift is bounded by margin + 1.
  let logoOffsetX = (total - logoPx) / 2;
  let logoOffsetY = (total - logoPx) / 2;
  if (logo && !isBackgroundLogo && logoPosition !== 'center') {
    const edgeShift = Math.max(0, total / 2 - logoPx / 2 - margin - 8);
    switch (logoPosition) {
      case 'top':
        logoOffsetY -= edgeShift;
        break;
      case 'bottom':
        logoOffsetY += edgeShift;
        break;
      case 'left':
        logoOffsetX -= edgeShift;
        break;
      case 'right':
        logoOffsetX += edgeShift;
        break;
    }
  }

  const dataNodes: ReactNode[] = [];
  for (let r = 0; r < count; r++) {
    const row = modules[r];
    if (!row) continue;
    for (let c = 0; c < count; c++) {
      if (!row[c]) continue;
      if (isInFinderPattern(r, c, count)) continue;
      dataNodes.push(renderModule(shape, c + margin, r + margin, `${r}-${c}`, moduleSpacing));
    }
  }

  const useConic = gradient?.type === 'conic';
  const dataFill = gradient && !useConic ? `url(#${gradId})` : fgColor;
  const eyeFill = eyeColor ?? (gradient && !useConic ? `url(#${gradId})` : fgColor);
  const finderOrigins = getFinderOrigins(count);
  const maskId = `${idBase}-mask`;

  // For conic mode we render all module shapes into an SVG mask, then mask
  // a single foreignObject containing a CSS conic-gradient div. This avoids
  // putting foreignObject inside <pattern> (which most browsers refuse to
  // composite). The mask is rendered ONLY in conic mode.
  const conicMaskShapes = useConic ? (
    <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={total} height={total}>
      <rect width={total} height={total} fill="black" />
      <g fill="white">{dataNodes}</g>
      {finderOrigins.map((o, i) => (
        <g key={`mask-finder-${i}`}>
          {renderFinderCorner(
            cornerStyle,
            o.col + margin,
            o.row + margin,
            'white',
            'black',
            `mask-corner-${i}`,
          )}
          {renderFinderInner(
            eyeShape,
            o.col + margin,
            o.row + margin,
            'white',
            `mask-inner-${i}`,
          )}
        </g>
      ))}
    </mask>
  ) : null;

  const conicCSS =
    useConic && gradient
      ? `conic-gradient(from ${gradient.rotation ?? 0}deg, ${gradient.colors
          .map((c) => c.replace(/[<>"]/g, ''))
          .join(', ')})`
      : '';

  const body = (
    <>
      <rect
        width={total}
        height={total}
        fill={bgColor}
        rx={frameRadius}
        ry={frameRadius}
      />

      {/* Background-mode logo: image fills the whole QR canvas before modules render. */}
      {isBackgroundLogo ? (
        <image
          href={logo}
          x={0}
          y={0}
          width={total}
          height={total}
          preserveAspectRatio="xMidYMid slice"
          opacity={0.9}
        />
      ) : null}

      <g className={animClass}>
        {useConic ? (
          <foreignObject
            x={0}
            y={0}
            width={total}
            height={total}
            mask={`url(#${maskId})`}
            dangerouslySetInnerHTML={{
              __html: `<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;background:${conicCSS};"></div>`,
            }}
          />
        ) : (
          <>
            <g fill={dataFill}>{dataNodes}</g>
            {finderOrigins.map((o, i) => (
              <g key={`finder-${i}`}>
                {renderFinderCorner(
                  cornerStyle,
                  o.col + margin,
                  o.row + margin,
                  eyeColor ?? dataFill,
                  bgColor,
                  `corner-${i}`,
                )}
                {renderFinderInner(
                  eyeShape,
                  o.col + margin,
                  o.row + margin,
                  eyeFill,
                  `inner-${i}`,
                )}
              </g>
            ))}
          </>
        )}
      </g>

      {logo && !isBackgroundLogo
        ? (() => {
            const logoClipId = `${idBase}-logo-clip`;
            const boxX = logoOffsetX - logoPadding;
            const boxY = logoOffsetY - logoPadding;
            const boxSize = logoPx + logoPadding * 2;
            const boxCx = logoOffsetX + logoPx / 2;
            const boxCy = logoOffsetY + logoPx / 2;
            const boxR = boxSize / 2;
            const innerR = logoPx / 2;
            const cornerRadius = logoPx * 0.15;
            const boxCornerRadius = cornerRadius + logoPadding;
            const isCircle = logoShape === 'circle';
            const isRounded = logoShape === 'rounded';
            const showBg = logoMode === 'foreground';
            const showBorder = Boolean(logoBorderColor && logoBorderWidth);
            const clipPath = isCircle || isRounded ? `url(#${logoClipId})` : undefined;

            return (
              <>
                {isCircle || isRounded ? (
                  <defs>
                    <clipPath id={logoClipId}>
                      {isCircle ? (
                        <circle cx={boxCx} cy={boxCy} r={innerR} />
                      ) : (
                        <rect
                          x={logoOffsetX}
                          y={logoOffsetY}
                          width={logoPx}
                          height={logoPx}
                          rx={cornerRadius}
                          ry={cornerRadius}
                        />
                      )}
                    </clipPath>
                  </defs>
                ) : null}

                {showBg ? (
                  isCircle ? (
                    <circle cx={boxCx} cy={boxCy} r={boxR} fill={bgColor} />
                  ) : isRounded ? (
                    <rect
                      x={boxX}
                      y={boxY}
                      width={boxSize}
                      height={boxSize}
                      rx={boxCornerRadius}
                      ry={boxCornerRadius}
                      fill={bgColor}
                    />
                  ) : (
                    <rect
                      x={boxX}
                      y={boxY}
                      width={boxSize}
                      height={boxSize}
                      fill={bgColor}
                    />
                  )
                ) : null}

                <image
                  href={logo}
                  x={logoOffsetX}
                  y={logoOffsetY}
                  width={logoPx}
                  height={logoPx}
                  preserveAspectRatio="xMidYMid meet"
                  clipPath={clipPath}
                />

                {showBorder ? (
                  isCircle ? (
                    <circle
                      cx={boxCx}
                      cy={boxCy}
                      r={boxR}
                      fill="none"
                      stroke={logoBorderColor}
                      strokeWidth={logoBorderWidth}
                    />
                  ) : isRounded ? (
                    <rect
                      x={boxX}
                      y={boxY}
                      width={boxSize}
                      height={boxSize}
                      rx={boxCornerRadius}
                      ry={boxCornerRadius}
                      fill="none"
                      stroke={logoBorderColor}
                      strokeWidth={logoBorderWidth}
                    />
                  ) : (
                    <rect
                      x={boxX}
                      y={boxY}
                      width={boxSize}
                      height={boxSize}
                      fill="none"
                      stroke={logoBorderColor}
                      strokeWidth={logoBorderWidth}
                    />
                  )
                ) : null}
              </>
            );
          })()
        : null}

      {/* 'scan' animation overlay: a moving translucent bar */}
      {animation === 'scan' ? (
        <>
          <style>{getAnimationCSS('scan')}</style>
          <rect
            className="qrm-scan-bar"
            x={margin}
            y={margin}
            width={count}
            height={1.2}
            fill={fgColor}
            opacity={0.35}
          />
        </>
      ) : null}
    </>
  );

  return (
    <svg
      ref={ref}
      id={id}
      className={className}
      style={style}
      width={size}
      height={(size * viewHeight) / viewWidth}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title ?? `QR code for ${value}`}
      shapeRendering="crispEdges"
    >
      {title ? <title>{title}</title> : null}
      {animation ? <style>{getAnimationCSS(animation)}</style> : null}
      {gradient && !useConic ? (
        <defs>
          {gradient.type === 'linear' ? (
            <linearGradient
              id={gradId}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={0}
              x2={total}
              y2={0}
              gradientTransform={
                gradient.rotation
                  ? `rotate(${gradient.rotation} ${total / 2} ${total / 2})`
                  : undefined
              }
            >
              {gradient.colors.map((color, i) => (
                <stop
                  key={i}
                  offset={
                    gradient.colors.length === 1
                      ? 1
                      : i / (gradient.colors.length - 1)
                  }
                  stopColor={color}
                />
              ))}
            </linearGradient>
          ) : (
            <radialGradient
              id={gradId}
              gradientUnits="userSpaceOnUse"
              cx={total / 2}
              cy={total / 2}
              r={total / 2}
            >
              {gradient.colors.map((color, i) => (
                <stop
                  key={i}
                  offset={
                    gradient.colors.length === 1
                      ? 1
                      : i / (gradient.colors.length - 1)
                  }
                  stopColor={color}
                />
              ))}
            </radialGradient>
          )}
        </defs>
      ) : null}

      {/* Conic gradient: SVG mask of the module shapes clips a foreignObject
          that hosts a CSS conic-gradient div (with explicit XHTML namespace
          so the browser actually parses + paints it). */}
      {useConic ? <defs>{conicMaskShapes}</defs> : null}

      {labelLayout ? (
        <rect
          width={viewWidth}
          height={viewHeight}
          fill={labelStyle === 'banner' ? labelFill : bgColor}
          rx={outerRadius}
          ry={outerRadius}
        />
      ) : null}

      {labelLayout ? (
        <g transform={`translate(${labelLayout.qrX} ${labelLayout.qrY})`}>{body}</g>
      ) : (
        body
      )}

      {labelLayout ? (
        <>
          {labelLayout.pill ? (
            <rect
              x={labelLayout.pill.x}
              y={labelLayout.pill.y}
              width={labelLayout.pill.width}
              height={labelLayout.pill.height}
              rx={labelLayout.pill.height / 2}
              ry={labelLayout.pill.height / 2}
              fill={labelFill}
              shapeRendering="auto"
            />
          ) : null}
          <text
            x={labelLayout.textX}
            y={labelLayout.textY}
            fontSize={labelLayout.fontSize}
            fontFamily={labelFont}
            fontWeight={700}
            textAnchor="middle"
            fill={labelTextColor}
          >
            {labelText}
          </text>
        </>
      ) : null}
    </svg>
  );
});

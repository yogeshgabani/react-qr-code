export type QRAnimation =
  | 'pulse'
  | 'zoom'
  | 'bounce'
  | 'rotate'
  | 'fade'
  | 'wave'
  | 'glow'
  | 'breathing'
  | 'scan';

/**
 * Returns a `<style>` element body containing the keyframe + class for the
 * given animation. Designed to be embedded inside an `<svg>` so the QR is
 * self-contained (no global stylesheet required).
 *
 * The class to apply is `.qrm-anim`.
 */
export function getAnimationCSS(animation: QRAnimation): string {
  const base = '.qrm-anim { transform-origin: center; transform-box: fill-box; }';
  switch (animation) {
    case 'pulse':
      return `${base}
@keyframes qrm-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.05) } }
.qrm-anim { animation: qrm-pulse 1.6s ease-in-out infinite; }`;
    case 'zoom':
      return `${base}
@keyframes qrm-zoom { 0%,100% { transform: scale(1) } 50% { transform: scale(1.1) } }
.qrm-anim { animation: qrm-zoom 2s ease-in-out infinite; }`;
    case 'bounce':
      return `${base}
@keyframes qrm-bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4%) } }
.qrm-anim { animation: qrm-bounce 1.4s cubic-bezier(.5,.05,.5,.95) infinite; }`;
    case 'rotate':
      return `${base}
@keyframes qrm-rotate { from { transform: rotate(0) } to { transform: rotate(360deg) } }
.qrm-anim { animation: qrm-rotate 8s linear infinite; }`;
    case 'fade':
      return `${base}
@keyframes qrm-fade { 0%,100% { opacity: 1 } 50% { opacity: 0.55 } }
.qrm-anim { animation: qrm-fade 2s ease-in-out infinite; }`;
    case 'wave':
      return `${base}
@keyframes qrm-wave { 0%,100% { transform: skewX(0) } 25% { transform: skewX(4deg) } 75% { transform: skewX(-4deg) } }
.qrm-anim { animation: qrm-wave 3s ease-in-out infinite; }`;
    case 'glow':
      return `${base}
@keyframes qrm-glow { 0%,100% { filter: drop-shadow(0 0 0 currentColor) } 50% { filter: drop-shadow(0 0 6px currentColor) } }
.qrm-anim { animation: qrm-glow 2s ease-in-out infinite; }`;
    case 'breathing':
      return `${base}
@keyframes qrm-breath { 0%,100% { transform: scale(1) } 50% { transform: scale(1.02) } }
.qrm-anim { animation: qrm-breath 3.5s ease-in-out infinite; }`;
    case 'scan':
      // The 'scan' animation is a moving line overlay drawn elsewhere; here we
      // just hand back the keyframes the QRCode component uses for the bar.
      return `@keyframes qrm-scan { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(100%); opacity: 0; } }
.qrm-scan-bar { animation: qrm-scan 2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }`;
  }
}

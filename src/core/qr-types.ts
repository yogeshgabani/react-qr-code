export interface QRGradient {
  type: 'linear' | 'radial' | 'conic';
  /** Two or more colour stops, evenly distributed. */
  colors: string[];
  /** Linear/conic rotation in degrees. Ignored for radial. */
  rotation?: number;
}

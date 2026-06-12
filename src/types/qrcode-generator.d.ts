declare module 'qrcode-generator' {
  type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
  type TypeNumber =
    | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
    | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
    | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40;

  interface QRCodeInstance {
    addData(data: string, mode?: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji'): void;
    make(): void;
    getModuleCount(): number;
    isDark(row: number, col: number): boolean;
    createImgTag(cellSize?: number, margin?: number): string;
    createSvgTag(cellSize?: number, margin?: number): string;
    createDataURL(cellSize?: number, margin?: number): string;
  }

  function qrcode(typeNumber: TypeNumber, errorCorrectionLevel: ErrorCorrectionLevel): QRCodeInstance;
  export = qrcode;
}

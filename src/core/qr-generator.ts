import qrcode from 'qrcode-generator';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRMatrix {
  modules: boolean[][];
  size: number;
}

export function generateMatrix(value: string, level: ErrorCorrectionLevel = 'M'): QRMatrix {
  const qr = qrcode(0, level);
  qr.addData(value);
  qr.make();
  const size = qr.getModuleCount();
  const modules: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      row.push(qr.isDark(r, c));
    }
    modules.push(row);
  }
  return { modules, size };
}

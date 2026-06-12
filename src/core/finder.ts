// Locating the 3 finder patterns ("eyes") in a QR matrix so they can be styled
// separately from the data modules.

export const FINDER_SIZE = 7;

export interface FinderOrigin {
  /** Top-left corner of the 7x7 finder area, in matrix coordinates (excludes margin). */
  row: number;
  col: number;
}

export function getFinderOrigins(matrixSize: number): FinderOrigin[] {
  return [
    { row: 0, col: 0 },
    { row: 0, col: matrixSize - FINDER_SIZE },
    { row: matrixSize - FINDER_SIZE, col: 0 },
  ];
}

export function isInFinderPattern(
  row: number,
  col: number,
  matrixSize: number,
): boolean {
  for (const o of getFinderOrigins(matrixSize)) {
    if (
      row >= o.row &&
      row < o.row + FINDER_SIZE &&
      col >= o.col &&
      col < o.col + FINDER_SIZE
    ) {
      return true;
    }
  }
  return false;
}

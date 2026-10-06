// Vendored qrcode-generator (MIT License, Kazuhiko Arase)
// Wrapped to provide the generateMatrix interface
// @ts-nocheck (vendored third-party code; TS strict mode too restrictive for original JS)

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

// ─────────────────────────────────────────────────────────────────────────────
// Vendored qrcode-generator library

interface QRCodeInstance {
  addData(data: string, mode?: string): void;
  make(): void;
  isDark(row: number, col: number): boolean;
  getModuleCount(): number;
}

const QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3,
};

const QRErrorCorrectionLevel: Record<ErrorCorrectionLevel, number> = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2,
};

function qrcode(typeNumber: number, errorCorrectionLevel: ErrorCorrectionLevel): QRCodeInstance {
  const PAD0 = 0xec;
  const PAD1 = 0x11;

  let _typeNumber = typeNumber;
  let _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
  let _modules: Array<Array<boolean | null>> | null = null;
  let _moduleCount = 0;
  let _dataCache: number[] | null = null;
  const _dataList: any[] = [];

  const _this: QRCodeInstance = {} as QRCodeInstance;

  const makeImpl = function (test: boolean, maskPattern: number) {
    _moduleCount = _typeNumber * 4 + 17;
    _modules = (() => {
      const modules: Array<Array<boolean | null>> = [];
      for (let row = 0; row < _moduleCount; row++) {
        modules[row] = [];
        for (let col = 0; col < _moduleCount; col++) {
          modules[row][col] = null;
        }
      }
      return modules;
    })();

    setupPositionProbePattern(0, 0);
    setupPositionProbePattern(_moduleCount - 7, 0);
    setupPositionProbePattern(0, _moduleCount - 7);
    setupPositionAdjustPattern();
    setupTimingPattern();
    setupTypeInfo(test, maskPattern);

    if (_typeNumber >= 7) {
      setupTypeNumber(test);
    }

    if (_dataCache === null) {
      _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
    }

    mapData(_dataCache, maskPattern);
  };

  const setupPositionProbePattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || _moduleCount <= row + r) continue;

      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || _moduleCount <= col + c) continue;

        const set =
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4);
        _modules![(row + r)]![(col + c)] = set;
      }
    }
  };

  const getBestMaskPattern = (): number => {
    let minLostPoint = 0;
    let pattern = 0;

    for (let i = 0; i < 8; i++) {
      makeImpl(true, i);
      const lostPoint = QRUtil.getLostPoint(_this);

      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }

    return pattern;
  };

  const setupTimingPattern = () => {
    for (let r = 8; r < _moduleCount - 8; r++) {
      if (_modules![r][6] !== null) continue;
      _modules![r][6] = r % 2 === 0;
    }

    for (let c = 8; c < _moduleCount - 8; c++) {
      if (_modules![6][c] !== null) continue;
      _modules![6][c] = c % 2 === 0;
    }
  };

  const setupPositionAdjustPattern = () => {
    const pos = QRUtil.getPatternPosition(_typeNumber);

    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];

        if (_modules![row][col] !== null) continue;

        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              _modules![row + r][col + c] = true;
            } else {
              _modules![row + r][col + c] = false;
            }
          }
        }
      }
    }
  };

  const setupTypeNumber = (test: boolean) => {
    const bits = QRUtil.getBCHTypeNumber(_typeNumber);

    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      _modules![Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
    }

    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      _modules![i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  };

  const setupTypeInfo = (test: boolean, maskPattern: number) => {
    const data = (_errorCorrectionLevel << 3) | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);

    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;

      if (i < 6) {
        _modules![i][8] = mod;
      } else if (i < 8) {
        _modules![i + 1][8] = mod;
      } else {
        _modules![_moduleCount - 15 + i][8] = mod;
      }
    }

    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;

      if (i < 8) {
        _modules![8][_moduleCount - i - 1] = mod;
      } else if (i < 9) {
        _modules![8][15 - i - 1 + 1] = mod;
      } else {
        _modules![8][15 - i - 1] = mod;
      }
    }

    _modules![_moduleCount - 8][8] = !test;
  };

  const mapData = (data: number[], maskPattern: number) => {
    let inc = -1;
    let row = _moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    const maskFunc = QRUtil.getMaskFunction(maskPattern);

    for (let col = _moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col -= 1;

      while (true) {
        for (let c = 0; c < 2; c++) {
          if (_modules![row][col - c] === null) {
            let dark = false;

            if (byteIndex < data.length) {
              dark = (((data[byteIndex]! >>> bitIndex) & 1) === 1);
            }

            const mask = maskFunc(row, col - c);

            if (mask) {
              dark = !dark;
            }

            _modules![row][col - c] = dark;
            bitIndex -= 1;

            if (bitIndex === -1) {
              byteIndex += 1;
              bitIndex = 7;
            }
          }
        }

        row += inc;

        if (row < 0 || _moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  };

  const createBytes = (buffer: BitBuffer, rsBlocks: RSBlock[]): number[] => {
    let offset = 0;

    let maxDcCount = 0;
    let maxEcCount = 0;

    const dcdata: number[][] = [];
    const ecdata: number[][] = [];

    for (let r = 0; r < rsBlocks.length; r++) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;

      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);

      dcdata[r] = [];

      for (let i = 0; i < dcCount; i++) {
        dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset]!;
      }
      offset += dcCount;

      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = [];
      for (let i = 0; i < rsPoly.getLength() - 1; i++) {
        const modIndex = i + modPoly.getLength() - (rsPoly.getLength() - 1);
        ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
      }
    }

    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i++) {
      totalCodeCount += rsBlocks[i].totalCount;
    }

    const data: number[] = [];
    let index = 0;

    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index] = dcdata[r][i]!;
          index += 1;
        }
      }
    }

    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index] = ecdata[r][i]!;
          index += 1;
        }
      }
    }

    return data;
  };

  const createData = (typeNumber: number, errorCorrectionLevel: number, dataList: any[]): number[] => {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

    const buffer = qrBitBuffer();

    for (let i = 0; i < dataList.length; i++) {
      const data = dataList[i];
      buffer.put(data.getMode(), 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
      data.write(buffer);
    }

    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i].dataCount;
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw 'code length overflow. (' + buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')';
    }

    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }

    while (buffer.getLengthInBits() % 8 !== 0) {
      buffer.putBit(false);
    }

    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD0, 8);

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(PAD1, 8);
    }

    return createBytes(buffer, rsBlocks);
  };

  _this.addData = function (data: string, mode?: string) {
    mode = mode || 'Byte';

    let newData: any = null;

    switch (mode) {
      case 'Numeric':
        newData = qrNumber(data);
        break;
      case 'Alphanumeric':
        newData = qrAlphaNum(data);
        break;
      case 'Byte':
        newData = qr8BitByte(data);
        break;
      case 'Kanji':
        newData = qrKanji(data);
        break;
      default:
        throw 'mode:' + mode;
    }

    _dataList.push(newData);
    _dataCache = null;
  };

  _this.isDark = function (row: number, col: number): boolean {
    if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
      throw row + ',' + col;
    }
    return _modules![row][col] === true;
  };

  _this.getModuleCount = function (): number {
    return _moduleCount;
  };

  const make = function () {
    if (_typeNumber < 1) {
      let typeNumber = 1;

      for (; typeNumber < 40; typeNumber++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
        const buffer = qrBitBuffer();

        for (let i = 0; i < _dataList.length; i++) {
          const data = _dataList[i];
          buffer.put(data.getMode(), 4);
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
          data.write(buffer);
        }

        let totalDataCount = 0;
        for (let i = 0; i < rsBlocks.length; i++) {
          totalDataCount += rsBlocks[i].dataCount;
        }

        if (buffer.getLengthInBits() <= totalDataCount * 8) {
          break;
        }
      }

      _typeNumber = typeNumber;
    }

    makeImpl(false, getBestMaskPattern());
  };

  _this.make = make;

  return _this;
}

const QRUtil = /* @__PURE__ */ (() => {
  const PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170],
  ];

  const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
  const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
  const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

  const getBCHDigit = (data: number): number => {
    let digit = 0;
    while (data !== 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  };

  return {
    getBCHTypeInfo: (data: number): number => {
      let d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= G15 << (getBCHDigit(d) - getBCHDigit(G15));
      }
      return ((data << 10) | d) ^ G15_MASK;
    },
    getBCHTypeNumber: (data: number): number => {
      let d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= G18 << (getBCHDigit(d) - getBCHDigit(G18));
      }
      return (data << 12) | d;
    },
    getPatternPosition: (typeNumber: number): number[] => {
      return PATTERN_POSITION_TABLE[typeNumber - 1]!;
    },
    getMaskFunction: (maskPattern: number) => {
      switch (maskPattern) {
        case 0:
          return (i: number, j: number) => (i + j) % 2 === 0;
        case 1:
          return (i: number, j: number) => i % 2 === 0;
        case 2:
          return (i: number, j: number) => j % 3 === 0;
        case 3:
          return (i: number, j: number) => (i + j) % 3 === 0;
        case 4:
          return (i: number, j: number) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case 5:
          return (i: number, j: number) => ((i * j) % 2) + ((i * j) % 3) === 0;
        case 6:
          return (i: number, j: number) => ((((i * j) % 2) + ((i * j) % 3)) % 2) === 0;
        case 7:
          return (i: number, j: number) => ((((i + j) % 2) + ((i * j) % 3)) % 2) === 0;
        default:
          throw 'bad maskPattern:' + maskPattern;
      }
    },
    getErrorCorrectPolynomial: (errorCorrectLength: number) => {
      let a = qrPolynomial([1], 0);
      for (let i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    },
    getLengthInBits: (mode: number, type: number): number => {
      if (1 <= type && type < 10) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 10;
          case QRMode.MODE_ALPHA_NUM:
            return 9;
          case QRMode.MODE_8BIT_BYTE:
            return 8;
          case QRMode.MODE_KANJI:
            return 8;
          default:
            throw 'mode:' + mode;
        }
      } else if (type < 27) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 12;
          case QRMode.MODE_ALPHA_NUM:
            return 11;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 10;
          default:
            throw 'mode:' + mode;
        }
      } else if (type < 41) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 14;
          case QRMode.MODE_ALPHA_NUM:
            return 13;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 12;
          default:
            throw 'mode:' + mode;
        }
      } else {
        throw 'type:' + type;
      }
    },
    getLostPoint: (qr: QRCodeInstance): number => {
      const moduleCount = qr.getModuleCount();
      let lostPoint = 0;

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          let sameCount = 0;
          const dark = qr.isDark(row, col);

          for (let r = -1; r <= 1; r++) {
            if (row + r < 0 || moduleCount <= row + r) continue;

            for (let c = -1; c <= 1; c++) {
              if (col + c < 0 || moduleCount <= col + c) continue;

              if (r === 0 && c === 0) continue;

              if (dark === qr.isDark(row + r, col + c)) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += 3 + sameCount - 5;
          }
        }
      }

      for (let row = 0; row < moduleCount - 1; row++) {
        for (let col = 0; col < moduleCount - 1; col++) {
          let count = 0;
          if (qr.isDark(row, col)) count += 1;
          if (qr.isDark(row + 1, col)) count += 1;
          if (qr.isDark(row, col + 1)) count += 1;
          if (qr.isDark(row + 1, col + 1)) count += 1;
          if (count === 0 || count === 4) {
            lostPoint += 3;
          }
        }
      }

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount - 6; col++) {
          if (
            qr.isDark(row, col) &&
            !qr.isDark(row, col + 1) &&
            qr.isDark(row, col + 2) &&
            qr.isDark(row, col + 3) &&
            qr.isDark(row, col + 4) &&
            !qr.isDark(row, col + 5) &&
            qr.isDark(row, col + 6)
          ) {
            lostPoint += 40;
          }
        }
      }

      for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount - 6; row++) {
          if (
            qr.isDark(row, col) &&
            !qr.isDark(row + 1, col) &&
            qr.isDark(row + 2, col) &&
            qr.isDark(row + 3, col) &&
            qr.isDark(row + 4, col) &&
            !qr.isDark(row + 5, col) &&
            qr.isDark(row + 6, col)
          ) {
            lostPoint += 40;
          }
        }
      }

      let darkCount = 0;

      for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount; row++) {
          if (qr.isDark(row, col)) {
            darkCount += 1;
          }
        }
      }

      const ratio = Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    },
  };
})();

const QRMath = /* @__PURE__ */ (() => {
  const EXP_TABLE = new Array(256);
  const LOG_TABLE = new Array(256);

  for (let i = 0; i < 8; i++) {
    EXP_TABLE[i] = 1 << i;
  }
  for (let i = 8; i < 256; i++) {
    EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i++) {
    LOG_TABLE[EXP_TABLE[i]!] = i;
  }

  return {
    glog: (n: number): number => {
      if (n < 1) throw 'glog(' + n + ')';
      return LOG_TABLE[n]!;
    },
    gexp: (n: number): number => {
      while (n < 0) {
        n += 255;
      }
      while (n >= 256) {
        n -= 255;
      }
      return EXP_TABLE[n]!;
    },
  };
})();

interface Polynomial {
  getAt(index: number): number;
  getLength(): number;
  multiply(e: Polynomial): Polynomial;
  mod(e: Polynomial): Polynomial;
}

function qrPolynomial(num: number[], shift: number): Polynomial {
  const _num = (() => {
    let offset = 0;
    while (offset < num.length && num[offset] === 0) {
      offset += 1;
    }
    const _num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) {
      _num[i] = num[i + offset]!;
    }
    return _num;
  })();

  const self: Polynomial = {
    getAt: (index: number): number => _num[index] ?? 0,
    getLength: (): number => _num.length,
    multiply: (e: Polynomial): Polynomial => {
      const num = new Array(self.getLength() + e.getLength() - 1);

      for (let i = 0; i < self.getLength(); i++) {
        for (let j = 0; j < e.getLength(); j++) {
          num[i + j] = (num[i + j] ?? 0) ^ QRMath.gexp(QRMath.glog(self.getAt(i)) + QRMath.glog(e.getAt(j)));
        }
      }

      return qrPolynomial(num, 0);
    },
    mod: function (e: Polynomial): Polynomial {
      if (self.getLength() - e.getLength() < 0) {
        return self;
      }

      const ratio = QRMath.glog(self.getAt(0)) - QRMath.glog(e.getAt(0));

      const num = new Array(self.getLength());
      for (let i = 0; i < self.getLength(); i++) {
        num[i] = self.getAt(i)!;
      }

      for (let i = 0; i < e.getLength(); i++) {
        num[i] = (num[i] ?? 0) ^ QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
      }

      return qrPolynomial(num, 0).mod(e);
    },
  };
  return self;
}

interface RSBlock {
  dataCount: number;
  totalCount: number;
}

const QRRSBlock = /* @__PURE__ */ (() => {
  const RS_BLOCK_TABLE = [
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16],
    [4, 144, 116, 4, 145, 117],
    [17, 68, 42],
    [17, 50, 22, 6, 51, 23],
    [19, 46, 16, 6, 47, 17],
    [2, 139, 111, 7, 140, 112],
    [17, 74, 46],
    [7, 54, 24, 16, 55, 25],
    [34, 37, 13],
    [4, 151, 121, 5, 152, 122],
    [4, 75, 47, 14, 76, 48],
    [11, 54, 24, 14, 55, 25],
    [16, 45, 15, 14, 46, 16],
    [6, 147, 117, 4, 148, 118],
    [6, 73, 45, 14, 74, 46],
    [11, 54, 24, 16, 55, 25],
    [30, 46, 16, 2, 47, 17],
    [8, 132, 106, 4, 133, 107],
    [8, 75, 47, 13, 76, 48],
    [7, 54, 24, 22, 55, 25],
    [22, 45, 15, 13, 46, 16],
    [10, 142, 114, 2, 143, 115],
    [19, 74, 46, 4, 75, 47],
    [28, 50, 22, 6, 51, 23],
    [33, 46, 16, 4, 47, 17],
    [8, 152, 122, 4, 153, 123],
    [22, 73, 45, 3, 74, 46],
    [8, 53, 23, 26, 54, 24],
    [12, 45, 15, 28, 46, 16],
    [3, 147, 117, 10, 148, 118],
    [3, 73, 45, 23, 74, 46],
    [4, 54, 24, 31, 55, 25],
    [11, 45, 15, 31, 46, 16],
    [7, 146, 116, 7, 147, 117],
    [21, 73, 45, 7, 74, 46],
    [1, 53, 23, 37, 54, 24],
    [19, 45, 15, 26, 46, 16],
    [5, 145, 115, 10, 146, 116],
    [19, 75, 47, 10, 76, 48],
    [15, 54, 24, 25, 55, 25],
    [23, 45, 15, 25, 46, 16],
    [13, 145, 115, 3, 146, 116],
    [2, 74, 46, 29, 75, 47],
    [42, 54, 24, 1, 55, 25],
    [23, 45, 15, 28, 46, 16],
    [17, 145, 115],
    [10, 74, 46, 23, 75, 47],
    [10, 54, 24, 35, 55, 25],
    [19, 45, 15, 35, 46, 16],
    [17, 145, 115, 1, 146, 116],
    [14, 74, 46, 21, 75, 47],
    [29, 54, 24, 19, 55, 25],
    [11, 45, 15, 46, 46, 16],
    [13, 145, 115, 6, 146, 116],
    [14, 74, 46, 23, 75, 47],
    [44, 54, 24, 7, 55, 25],
    [59, 46, 16, 1, 47, 17],
    [12, 151, 121, 7, 152, 122],
    [12, 75, 47, 26, 76, 48],
    [39, 54, 24, 14, 55, 25],
    [22, 45, 15, 41, 46, 16],
    [6, 151, 121, 14, 152, 122],
    [6, 75, 47, 34, 76, 48],
    [46, 54, 24, 10, 55, 25],
    [2, 45, 15, 64, 46, 16],
    [17, 152, 122, 4, 153, 123],
    [29, 74, 46, 14, 75, 47],
    [49, 54, 24, 10, 55, 25],
    [24, 45, 15, 46, 46, 16],
    [4, 152, 122, 18, 153, 123],
    [13, 74, 46, 32, 75, 47],
    [48, 54, 24, 14, 55, 25],
    [42, 45, 15, 32, 46, 16],
    [20, 147, 117, 4, 148, 118],
    [40, 75, 47, 7, 76, 48],
    [43, 54, 24, 22, 55, 25],
    [10, 45, 15, 67, 46, 16],
    [19, 148, 118, 6, 149, 119],
    [18, 75, 47, 31, 76, 48],
    [34, 54, 24, 34, 55, 25],
    [20, 45, 15, 61, 46, 16],
  ];

  const getRsBlockTable = (typeNumber: number, errorCorrectionLevel: number): number[] => {
    switch (errorCorrectionLevel) {
      case 1:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0]!;
      case 0:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1]!;
      case 3:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2]!;
      case 2:
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3]!;
      default:
        return [];
    }
  };

  return {
    getRSBlocks: (typeNumber: number, errorCorrectionLevel: number): RSBlock[] => {
      const rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (!rsBlock || rsBlock.length === 0) {
        throw 'bad rs block @ typeNumber:' + typeNumber + '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      const length = rsBlock.length / 3;
      const list: RSBlock[] = [];

      for (let i = 0; i < length; i++) {
        const count = rsBlock[i * 3 + 0]!;
        const totalCount = rsBlock[i * 3 + 1]!;
        const dataCount = rsBlock[i * 3 + 2]!;

        for (let j = 0; j < count; j++) {
          list.push({ totalCount, dataCount });
        }
      }

      return list;
    },
  };
})();

interface BitBuffer {
  getBuffer(): number[];
  getAt(index: number): boolean;
  put(num: number, length: number): void;
  getLengthInBits(): number;
  putBit(bit: boolean): void;
}

function qrBitBuffer(): BitBuffer {
  const _buffer: number[] = [];
  let _length = 0;

  return {
    getBuffer: () => _buffer,
    getAt: (index: number): boolean => {
      const bufIndex = Math.floor(index / 8);
      return ((_buffer[bufIndex]! >>> (7 - (index % 8))) & 1) === 1;
    },
    put: (num: number, length: number) => {
      for (let i = 0; i < length; i++) {
        const bit = ((num >>> (length - i - 1)) & 1) === 1;
        const bufIndex = Math.floor(_length / 8);
        if (_buffer.length <= bufIndex) {
          _buffer.push(0);
        }
        if (bit) {
          _buffer[bufIndex] |= 0x80 >>> (_length % 8);
        }
        _length += 1;
      }
    },
    getLengthInBits: () => _length,
    putBit: (bit: boolean) => {
      const bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }
      if (bit) {
        _buffer[bufIndex] |= 0x80 >>> (_length % 8);
      }
      _length += 1;
    },
  };
}

function qrNumber(data: string): any {
  return {
    getMode: () => QRMode.MODE_NUMBER,
    getLength: () => data.length,
    write: (buffer: BitBuffer) => {
      let i = 0;
      while (i + 2 < data.length) {
        buffer.put(parseInt(data.substring(i, i + 3), 10), 10);
        i += 3;
      }
      if (i < data.length) {
        if (data.length - i === 1) {
          buffer.put(parseInt(data.substring(i, i + 1), 10), 4);
        } else if (data.length - i === 2) {
          buffer.put(parseInt(data.substring(i, i + 2), 10), 7);
        }
      }
    },
  };
}

function qrAlphaNum(data: string): any {
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
  const getCode = (c: string): number => {
    const code = CHARS.indexOf(c);
    if (code === -1) throw 'illegal char :' + c;
    return code;
  };

  return {
    getMode: () => QRMode.MODE_ALPHA_NUM,
    getLength: () => data.length,
    write: (buffer: BitBuffer) => {
      let i = 0;
      while (i + 1 < data.length) {
        buffer.put(getCode(data.charAt(i)) * 45 + getCode(data.charAt(i + 1)), 11);
        i += 2;
      }
      if (i < data.length) {
        buffer.put(getCode(data.charAt(i)), 6);
      }
    },
  };
}

function qr8BitByte(data: string): any {
  const bytes = new TextEncoder().encode(data);
  return {
    getMode: () => QRMode.MODE_8BIT_BYTE,
    getLength: () => bytes.length,
    write: (buffer: BitBuffer) => {
      for (let i = 0; i < bytes.length; i++) {
        buffer.put(bytes[i]!, 8);
      }
    },
  };
}

function qrKanji(data: string): any {
  return {
    getMode: () => QRMode.MODE_KANJI,
    getLength: () => Math.floor(data.length / 2),
    write: () => {
      throw 'Kanji mode not supported';
    },
  };
}

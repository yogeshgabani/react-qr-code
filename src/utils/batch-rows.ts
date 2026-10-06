// CSV / JSON ingest for batch QR generation. The CSV reader is a small
// RFC 4180 parser (quoted fields, escaped quotes, CRLF, embedded newlines)
// with delimiter auto-detection — enough to replace papaparse here.

export interface BatchRow {
  /** Unique identifier, also used as the export file name. */
  id?: string;
  /** The QR payload value. */
  value: string;
  /** Optional label / display name. */
  label?: string;
}

const DELIMITERS = [',', ';', '\t', '|'] as const;

/** Pick the delimiter that splits the first line into the most fields. */
function detectDelimiter(input: string): string {
  const firstLine = input.split(/\r\n|\n|\r/, 1)[0] ?? '';
  const unquoted = firstLine.replace(/"[^"]*"/g, '');
  let best: string = ',';
  let bestCount = 0;
  for (const d of DELIMITERS) {
    const count = unquoted.split(d).length - 1;
    if (count > bestCount) {
      best = d;
      bestCount = count;
    }
  }
  return best;
}

/** Parse CSV text into rows of fields. Blank lines are skipped. */
export function parseCSV(input: string, delimiter = detectDelimiter(input)): string[][] {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let quotedLine = 0;
  let line = 1;

  const endRow = () => {
    row.push(field);
    field = '';
    if (row.length > 1 || row[0] !== '') rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        if (ch === '\n') line++;
        field += ch;
      }
    } else if (ch === '"' && field === '') {
      inQuotes = true;
      quotedLine = line;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      line++;
      endRow();
    } else {
      field += ch;
    }
  }
  if (inQuotes) throw new Error(`CSV: unterminated quoted field starting on line ${quotedLine}.`);
  if (field !== '' || row.length) endRow();
  return rows;
}

/**
 * Read batch rows from CSV. Needs a header row with a `value` (or `url` /
 * `text`) column; `id` and `label` columns are optional. Header names are
 * case-insensitive.
 */
export function parseCSVRows(input: string): BatchRow[] {
  const [header, ...records] = parseCSV(input.trim());
  if (!header) return [];
  const cols = header.map((h) => h.trim().toLowerCase());
  const valueCol = ['value', 'url', 'text'].map((c) => cols.indexOf(c)).find((i) => i >= 0);
  if (valueCol === undefined) {
    throw new Error('CSV needs a header row with a "value", "url" or "text" column.');
  }
  const idCol = cols.indexOf('id');
  const labelCol = cols.indexOf('label');

  const rows: BatchRow[] = [];
  records.forEach((rec, idx) => {
    const value = rec[valueCol]?.trim() ?? '';
    if (!value) return;
    const label = labelCol >= 0 ? rec[labelCol]?.trim() : undefined;
    rows.push({
      id: (idCol >= 0 && rec[idCol]?.trim()) || `row-${idx + 1}`,
      value,
      ...(label ? { label } : {}),
    });
  });
  return rows;
}

/** Read batch rows from a JSON array of strings or `{ id?, value, label? }` objects. */
export function parseJSONRows(input: string): BatchRow[] {
  const parsed: unknown = JSON.parse(input);
  if (!Array.isArray(parsed)) {
    throw new Error('JSON must be an array of {id?, value, label?} objects.');
  }
  return parsed.map((row, idx) => {
    if (typeof row === 'string') return { value: row, id: `row-${idx + 1}` };
    if (row && typeof row === 'object' && 'value' in row) {
      const r = row as Record<string, unknown>;
      return {
        id: typeof r.id === 'string' ? r.id : `row-${idx + 1}`,
        value: String(r.value),
        ...(typeof r.label === 'string' ? { label: r.label } : {}),
      };
    }
    throw new Error(`Row ${idx + 1} missing "value" field.`);
  });
}

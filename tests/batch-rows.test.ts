import { describe, expect, it } from 'vitest';
import { parseCSV, parseCSVRows, parseJSONRows } from '../src/utils/batch-rows';

describe('parseCSV', () => {
  it('handles quotes, escaped quotes, embedded newlines and CRLF', () => {
    const csv = 'id,value,label\r\n1,"https://a.com/?q=1,2","He said ""hi""\nnext line"\r\n2,b,\r\n';
    expect(parseCSV(csv)).toEqual([
      ['id', 'value', 'label'],
      ['1', 'https://a.com/?q=1,2', 'He said "hi"\nnext line'],
      ['2', 'b', ''],
    ]);
  });

  it('detects semicolon and tab delimiters', () => {
    expect(parseCSV('value;label\nhttps://a.com;A')).toEqual([
      ['value', 'label'],
      ['https://a.com', 'A'],
    ]);
    expect(parseCSV('value\tlabel\nx\ty')).toEqual([
      ['value', 'label'],
      ['x', 'y'],
    ]);
  });

  it('strips a UTF-8 BOM and skips blank lines', () => {
    expect(parseCSV('﻿value\n\nx\n\n')).toEqual([['value'], ['x']]);
  });

  it('throws on an unterminated quote', () => {
    expect(() => parseCSV('value\n"oops')).toThrow(/line 2/);
  });
});

describe('parseCSVRows', () => {
  it('maps value/url/text columns case-insensitively and fills ids', () => {
    expect(parseCSVRows('URL,Label\nhttps://a.com,A\n,skipped\nhttps://b.com,')).toEqual([
      { id: 'row-1', value: 'https://a.com', label: 'A' },
      { id: 'row-3', value: 'https://b.com' },
    ]);
    expect(parseCSVRows('id,text\nx1,hello')).toEqual([{ id: 'x1', value: 'hello' }]);
  });

  it('explains a missing value column', () => {
    expect(() => parseCSVRows('name,email\nA,a@b.c')).toThrow(/"value"/);
  });
});

describe('parseJSONRows', () => {
  it('accepts strings and objects', () => {
    expect(parseJSONRows('["a", {"value": 2, "label": "Two"}]')).toEqual([
      { id: 'row-1', value: 'a' },
      { id: 'row-2', value: '2', label: 'Two' },
    ]);
  });

  it('rejects non-arrays and rows without a value', () => {
    expect(() => parseJSONRows('{}')).toThrow(/array/);
    expect(() => parseJSONRows('[{"label": "x"}]')).toThrow(/Row 1/);
  });
});

// Type-checks every ```tsx / ```ts code block in the docs against the source,
// so examples can't drift from the real API. Each block becomes its own module:
// names exported by the package are auto-imported when the block doesn't
// import them, and a block made only of JSX is wrapped in a fragment.
// Put <!-- docs-check: skip --> on the line before a block to skip it.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const DOCS = ['README.md', 'FEATURES.md'];
const OUT = '.docs-check';
const require = createRequire(import.meta.url);

// Value exports of the package (not `export type`).
const indexSrc = readFileSync('src/index.ts', 'utf8') + readFileSync('src/entry-core.ts', 'utf8');
const exported = [...indexSrc.matchAll(/^export \{([^}]+)\} from/gm)].flatMap((m) =>
  m[1].split(',').map((s) => s.trim()).filter(Boolean),
);
const REACT_HOOKS = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback'];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

const blocks = [];
for (const doc of DOCS) {
  const lines = readFileSync(doc, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const open = /^```(tsx|ts|jsx)\s*$/.exec(lines[i]);
    if (!open) continue;
    const end = lines.findIndex((l, j) => j > i && /^```\s*$/.test(l));
    const skip = /docs-check:\s*skip/.test(lines[i - 1] ?? '') || /docs-check:\s*skip/.test(lines[i - 2] ?? '');
    if (!skip) blocks.push({ doc, line: i + 2, code: lines.slice(i + 1, end).join('\n') });
    i = end;
  }
}

blocks.forEach((b, n) => {
  const imported = new Set(
    [...b.code.matchAll(/import\s+(?:type\s+)?(?:\w+\s*,\s*)?\{([^}]+)\}/g)].flatMap((m) =>
      m[1].split(',').map((s) => s.replace(/^type\s+/, '').trim().split(/\s+as\s+/).pop()),
    ),
  );
  const uses = (name) => new RegExp(`\\b${name}\\b`).test(b.code) && !imported.has(name);
  const header = [];
  const pkgNames = exported.filter(uses);
  if (pkgNames.length) header.push(`import { ${pkgNames.join(', ')} } from 'react-qr-master';`);
  const hooks = REACT_HOOKS.filter(uses);
  if (hooks.length) header.push(`import { ${hooks.join(', ')} } from 'react';`);
  header.push('export {};');

  const body = b.code.split('\n');
  const firstCode = body.findIndex((l) => l.trim() && !/^\s*(import\b|\/\/)/.test(l));
  const jsxOnly = firstCode >= 0 && /^\s*</.test(body[firstCode]);
  let source;
  if (jsxOnly) {
    const imports = body.slice(0, firstCode);
    const jsx = body.slice(firstCode);
    source = [...header, ...imports, 'const __example = (<>', ...jsx, '</>);'];
    b.offset = header.length + 1;
  } else {
    source = [...header, ...body];
    b.offset = header.length;
  }
  b.file = `block${n}.tsx`;
  writeFileSync(join(OUT, b.file), source.join('\n'));
});

writeFileSync(
  join(OUT, 'tsconfig.json'),
  JSON.stringify(
    {
      extends: '../tsconfig.json',
      compilerOptions: {
        noEmit: true,
        rootDir: '..',
        baseUrl: '.',
        paths: {
          'react-qr-master': ['../src/index.ts'],
          'react-qr-master/core': ['../src/entry-core.ts'],
        },
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
      include: ['*.tsx'],
    },
    null,
    2,
  ),
);

let output = '';
try {
  execFileSync(process.execPath, [require.resolve('typescript/lib/tsc.js'), '-p', join(OUT, 'tsconfig.json')], {
    encoding: 'utf8',
  });
} catch (e) {
  output = `${e.stdout ?? ''}${e.stderr ?? ''}`;
}

const errors = [];
for (const line of output.split('\n')) {
  const m = /block(\d+)\.tsx\((\d+),(\d+)\): (.*)/.exec(line);
  if (!m) continue;
  const b = blocks[Number(m[1])];
  errors.push(`${b.doc}:${b.line + Number(m[2]) - 1 - b.offset}  ${m[4]}`);
}
const unmapped = output.split('\n').filter((l) => /error TS/.test(l) && !/block\d+\.tsx/.test(l));

if (errors.length || unmapped.length) {
  console.error([...errors, ...unmapped].join('\n'));
  console.error(`\n${errors.length + unmapped.length} error(s) in ${blocks.length} doc examples.`);
  process.exit(1);
}
rmSync(OUT, { recursive: true, force: true });
console.log(`ok  ${blocks.length} doc examples type-check.`);

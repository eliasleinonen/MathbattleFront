import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('generator writes exactly 60 unique landing pages', () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, 'generate-variants.mjs')], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));
  assert.equal(manifest.length, 60);

  const ids = manifest.map((m) => m.id);
  assert.equal(new Set(ids).size, 60);
  assert.deepEqual(
    [...ids].sort((a, b) => a - b),
    Array.from({ length: 60 }, (_, i) => i + 1)
  );

  for (const entry of manifest) {
    const filePath = path.join(__dirname, 'pages', entry.file);
    assert.ok(fs.existsSync(filePath), `missing ${entry.file}`);
    const html = fs.readFileSync(filePath, 'utf8');
    assert.match(html, /Derivative Duel|∂/);
    assert.match(html, /Play|duel|match|challenge/i);
    assert.match(html, /@keyframes/);
    assert.ok(html.includes('brand-mark') || html.includes('∂'));
  }
});

test('index gallery links every variant', () => {
  const index = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));
  for (const entry of manifest) {
    assert.ok(index.includes(entry.file), `index missing link to ${entry.file}`);
  }
});

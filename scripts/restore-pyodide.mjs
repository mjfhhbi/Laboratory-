#!/usr/bin/env node
/**
 * Restores any missing local Pyodide 0.26.4 assets (WASM, stdlib, OpenBLAS, NumPy, SciPy, SymPy, Pandas, Matplotlib)
 * into public/pyodide/ from the official Pyodide 0.26.4 GitHub release archive and verifies SHA-256 digests
 * against public/pyodide/pyodide-lock.json.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const ROOT = path.resolve(import.meta.dirname, '..');
const PYODIDE_DIR = path.join(ROOT, 'public', 'pyodide');
const LOCK_PATH = path.join(PYODIDE_DIR, 'pyodide-lock.json');
const RELEASE_URL = 'https://github.com/pyodide/pyodide/releases/download/0.26.4/pyodide-0.26.4.tar.bz2';

const CORE_FILES = [
  'pyodide.mjs',
  'pyodide-lock.json',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'openblas-0.3.26.zip'
];

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex').toLowerCase();
}

function getMissingFiles() {
  if (!fs.existsSync(LOCK_PATH)) {
    throw new Error(`Missing lockfile: ${LOCK_PATH}`);
  }
  const lock = JSON.parse(fs.readFileSync(LOCK_PATH, 'utf8'));
  const targetPkgs = [
    'numpy',
    'scipy',
    'sympy',
    'pandas',
    'matplotlib',
    'pillow',
    'fonttools',
    'mpmath',
    'pytz',
    'python-dateutil',
    'pyparsing',
    'packaging',
    'kiwisolver',
    'matplotlib-pyodide',
    'six',
    'cycler',
    'openblas'
  ];

  const missing = [];
  for (const f of CORE_FILES) {
    const p = path.join(PYODIDE_DIR, f);
    if (!fs.existsSync(p) || fs.statSync(p).size === 0) {
      missing.push(f);
    }
  }
  for (const name of targetPkgs) {
    const entry = lock.packages?.[name];
    if (!entry) continue;
    const p = path.join(PYODIDE_DIR, entry.file_name);
    if (!fs.existsSync(p) || sha256File(p) !== String(entry.sha256).toLowerCase()) {
      missing.push(entry.file_name);
    }
  }
  return Array.from(new Set(missing));
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok || !res.body) {
    throw new Error(`Failed to download ${url}: HTTP ${res.status}`);
  }
  const out = fs.createWriteStream(destPath);
  const reader = res.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      out.write(Buffer.from(value));
    }
  } finally {
    out.end();
  }
  await new Promise((resolve, reject) => {
    out.on('finish', resolve);
    out.on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(PYODIDE_DIR, { recursive: true });
  const initialMissing = getMissingFiles();
  if (initialMissing.length === 0) {
    console.log('[OK] All Pyodide 0.26.4 core files and SHA-256 verified packages are already present locally.');
    return;
  }

  console.log(`[INFO] Restoring ${initialMissing.length} missing Pyodide 0.26.4 files from official release...`);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'foodsci-pyodide-'));
  const archivePath = path.join(tmpDir, 'pyodide-0.26.4.tar.bz2');
  const extractDir = path.join(tmpDir, 'extracted');
  fs.mkdirSync(extractDir, { recursive: true });

  try {
    await downloadFile(RELEASE_URL, archivePath);
    const tarMembers = initialMissing.map((f) => `pyodide/${f}`);
    execFileSync('tar', ['-xjf', archivePath, '-C', extractDir, ...tarMembers], { stdio: 'inherit' });

    for (const f of initialMissing) {
      const src = path.join(extractDir, 'pyodide', f);
      const dst = path.join(PYODIDE_DIR, f);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
      }
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  const remaining = getMissingFiles();
  if (remaining.length > 0) {
    throw new Error(`Failed to restore/verify Pyodide files: ${remaining.join(', ')}`);
  }
  console.log('[PASS] Restored and SHA-256 verified all local Pyodide 0.26.4 & SciPy assets.');
}

main().catch((err) => {
  console.error('[FAIL] Pyodide restore error:', err);
  process.exit(1);
});

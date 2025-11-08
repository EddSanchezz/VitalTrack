#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';

function readPortFromEnv() {
  try {
    if (!existsSync('.env')) return 3000;
    const content = readFileSync('.env', 'utf8');
    const line = content.split(/\r?\n/).find(l => l.startsWith('PORT='));
    if (!line) return 3000;
    const value = Number(line.replace('PORT=', '').trim());
    return Number.isFinite(value) ? value : 3000;
  } catch {
    return 3000;
  }
}

const port = readPortFromEnv();
console.log(`Swagger docs: http://localhost:${port}/api/docs`);
console.log(`Swagger JSON: http://localhost:${port}/api/docs.json`);

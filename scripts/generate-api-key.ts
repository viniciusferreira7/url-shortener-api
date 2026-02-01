#!/usr/bin/env bun
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is not set');
  console.log(
    '\nUsage: JWT_SECRET=your-secret bun scripts/generate-api-key.ts'
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const customPayload: Record<string, string> = {};

for (const arg of args) {
  const [key, value] = arg.split('=');
  if (key && value) {
    customPayload[key] = value;
  }
}

const payload = {
  iss: 'url-shortener-api',
  type: 'api-key',
  iat: Math.floor(Date.now() / 1000),
  ...customPayload,
};

const token = jwt.sign(payload, JWT_SECRET, {});

console.log('\n🔑 API Key Generated Successfully!\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\nToken:');
console.log(token);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\nPayload:');
console.log(JSON.stringify(payload, null, 2));
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\nUsage:');
console.log(
  `curl -H "Authorization: Bearer ${token}" http://localhost:3333/api/readyz`
);
console.log('\n');

#!/usr/bin/env node

/**
 * Simple script to load .env file and run K6 with environment variables
 * Usage: node load-env.js [k6 command]
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Load .env file if it exists
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          process.env[key] = value;
        }
      }
    });
    console.log('✅ Loaded environment variables from .env file');
  } else {
    console.log('ℹ️  No .env file found, using system environment variables');
  }
}

// Get K6 command from arguments or use default
const k6Args = process.argv.slice(2);
if (k6Args.length === 0) {
  k6Args.push('run', 'master.js');
}

// Load environment variables
loadEnvFile();

// Run K6 with the loaded environment
const k6 = spawn('k6', k6Args, {
  stdio: 'inherit',
  env: process.env
});

k6.on('close', (code) => {
  process.exit(code);
});

k6.on('error', (err) => {
  console.error('Failed to start K6:', err);
  process.exit(1);
});
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const targetName = process.argv[2];

if (!targetName) {
  console.error('Usage: create-miracle-backend <project-name>');
  process.exit(1);
}

const root = process.cwd();
const targetDir = path.join(root, targetName);

if (fs.existsSync(targetDir)) {
  console.error(`Directory already exists: ${targetDir}`);
  process.exit(1);
}

const sourceDir = path.join(__dirname, '..', 'backend');

if (!fs.existsSync(sourceDir)) {
  console.error('Backend template directory not found.');
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });
copyRecursive(sourceDir, targetDir);

const packageJsonPath = path.join(targetDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.name = targetName;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

console.log(`Project created at ${targetDir}`);
console.log('Run:');
console.log(`  cd ${targetName}`);
console.log('  npm install');

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

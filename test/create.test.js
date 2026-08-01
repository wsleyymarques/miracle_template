const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

test('creates a project from the backend template', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'miracle-create-'));
  const projectName = 'demo-backend';

  execFileSync(process.execPath, [path.join(__dirname, '..', 'bin', 'create.js'), projectName], {
    cwd: tempDir,
    stdio: 'pipe'
  });

  const createdDir = path.join(tempDir, projectName);
  const packageJson = JSON.parse(fs.readFileSync(path.join(createdDir, 'package.json'), 'utf8'));

  assert.ok(fs.existsSync(createdDir));
  assert.ok(fs.existsSync(path.join(createdDir, 'package.json')));
  assert.ok(fs.existsSync(path.join(createdDir, 'src')));
  assert.equal(packageJson.name, projectName);
});

/** `npm run dev` in the project folder: starts the backend and the frontend together in one terminal. Ctrl+C stops both. */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// frontend packages missing (new clone, or package.json changed): install them first
if (!existsSync('frontend/node_modules/.bin/vite') && !existsSync('frontend/node_modules/.bin/vite.cmd')) {
  console.log('\x1b[36m[frontend]\x1b[0m Installing packages (npm install)…');
  if (spawnSync('npm install --no-audit --no-fund', { cwd: 'frontend', shell: true, stdio: 'inherit' }).status !== 0) process.exit(1);
}

const apps = [
  { name: 'backend ', dir: 'backend', color: 32 },
  { name: 'frontend', dir: 'frontend', color: 36 },
];
const children = apps.map(({ name, dir, color }) => {
  const child = spawn('npm run dev', { cwd: dir, shell: true, env: { ...process.env, FORCE_COLOR: '1' } });
  const tag = `\x1b[${color}m[${name}]\x1b[0m `;
  const pipe = (stream, out) => {
    let rest = '';
    stream.on('data', (chunk) => {
      const lines = (rest + chunk).split(/\r?\n/);
      rest = lines.pop();
      for (const line of lines) out.write(tag + line + '\n');
    });
  };
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  child.on('exit', (code) => {
    console.log(`${tag}stopped${code ? ` (exit code ${code})` : ''}`);
    stopAll();
  });
  return child;
});

let stopping = false;
function stopAll() {
  if (stopping) return;
  stopping = true;
  for (const c of children) {
    if (c.exitCode !== null) continue;
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(c.pid), '/t', '/f']);
    else c.kill('SIGINT');
  }
  setTimeout(() => process.exit(0), 1500);
}
process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);

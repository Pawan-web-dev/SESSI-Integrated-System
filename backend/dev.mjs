/**
 * `npm run dev` for the backend. One command that:
 *   1. creates the Python environment (.venv) the first time,
 *   2. installs / updates the Python packages when requirements change,
 *   3. creates .env from .env.example if it is missing,
 *   4. updates the database tables (alembic upgrade head),
 *   5. starts the API on http://localhost:8000 and restarts it when you save a file.
 */
import { spawnSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const win = process.platform === 'win32';
const venvPython = join(here, '.venv', win ? 'Scripts\\python.exe' : 'bin/python');
const port = process.env.PORT || '8000';

const say = (msg) => console.log(`\x1b[32m[backend]\x1b[0m ${msg}`);
function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: here, stdio: 'inherit' });
  return r.status === 0;
}
function stop(msg) {
  console.error(`\x1b[31m[backend]\x1b[0m ${msg}`);
  process.exit(1);
}

// 1. Python environment
if (!existsSync(venvPython)) {
  say('First run: creating the Python environment (.venv)…');
  const pythons = win ? [['py', ['-3']], ['python', []]] : [['python3', []], ['python', []]];
  const ok = pythons.some(([cmd, pre]) => run(cmd, [...pre, '-m', 'venv', '.venv']));
  if (!ok) stop('Python was not found. Install Python 3.11+ from https://www.python.org (tick "Add to PATH") and try again.');
}

// 2. Packages: reinstall only when requirements files change
const reqHash = createHash('sha1')
  .update(['requirements.txt', 'requirements-dev.txt'].map((f) => (existsSync(join(here, f)) ? readFileSync(join(here, f)) : '')).join('\n'))
  .digest('hex');
const stamp = join(here, '.venv', '.requirements-hash');
if (!existsSync(stamp) || readFileSync(stamp, 'utf8') !== reqHash) {
  say('Installing Python packages (only when requirements change)…');
  if (!run(venvPython, ['-m', 'pip', 'install', '-q', '-r', 'requirements-dev.txt'])) stop('Installing the Python packages failed (see the error above).');
  writeFileSync(stamp, reqHash);
}

// 3. Settings
if (!existsSync(join(here, '.env'))) {
  copyFileSync(join(here, '.env.example'), join(here, '.env'));
  say('Created .env from .env.example. Ask the team lead for the real DATABASE_URL and other secrets.');
}

// 4. Database tables
say('Updating the database tables…');
if (!run(venvPython, ['-m', 'alembic', 'upgrade', 'head'])) say('\x1b[33mDatabase update failed (see above). Starting the API anyway.\x1b[0m');

// 5. API with auto-reload
say(`Starting the API on http://localhost:${port}  (docs: http://localhost:${port}/docs)  - press Ctrl+C to stop`);
const api = spawn(venvPython, ['-m', 'uvicorn', 'app.main:app', '--reload', '--port', port], { cwd: here, stdio: 'inherit' });
api.on('exit', (code) => process.exit(code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => api.kill(sig));

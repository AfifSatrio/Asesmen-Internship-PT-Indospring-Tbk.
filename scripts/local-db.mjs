import { existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Only manage this workspace's existing optional PostgreSQL cluster.
// External/system PostgreSQL instances remain managed by their owner.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try { process.loadEnvFile(resolve(root, '.env')); } catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const automatic = process.argv.includes('--if-configured');
const action = process.argv.includes('stop') ? 'stop' : 'start';
const dataDir = resolve(root, '.local/pgdata');
let url;
try { url = new URL(process.env.DATABASE_URL); } catch { /* Regular setup handles missing configuration. */ }
const configured = existsSync(join(dataDir, 'PG_VERSION')) &&
  url?.hostname === '127.0.0.1' && url?.port === '55432';
if (!configured) {
  if (automatic) process.exit(0);
  console.error('Cluster PostgreSQL lokal tidak dikonfigurasi. Gunakan PostgreSQL sesuai DATABASE_URL dan ikuti README.');
  process.exit(1);
}
const binary = resolve(root, `.local/pg-runtime/node_modules/@embedded-postgres/${process.platform}-${process.arch}/native/bin/pg_ctl${process.platform === 'win32' ? '.exe' : ''}`);
if (!existsSync(binary)) {
  console.error('Runtime PostgreSQL lokal tidak ditemukan. Pulihkan .local/pg-runtime atau arahkan DATABASE_URL ke PostgreSQL yang berjalan.');
  process.exit(1);
}
const status = spawnSync(binary, ['-D', dataDir, 'status'], { stdio: 'ignore' });
if (status.error || ![0, 3].includes(status.status)) {
  console.error('Tidak dapat memeriksa status PostgreSQL lokal. Periksa izin folder .local/pgdata.');
  process.exit(1);
}
if ((action === 'start' && status.status === 0) || (action === 'stop' && status.status === 3)) {
  console.log(action === 'start' ? 'PostgreSQL lokal sudah berjalan (127.0.0.1:55432).' : 'PostgreSQL lokal sudah berhenti.');
  process.exit(0);
}
const args = action === 'start'
  ? ['-D', dataDir, '-l', resolve(root, '.local/postgres.log'), '-o', '-h 127.0.0.1 -p 55432', '-w', 'start']
  : ['-D', dataDir, '-m', 'fast', '-w', 'stop'];
const result = spawnSync(binary, args, { stdio: 'inherit' });
if (result.error || result.status !== 0) {
  console.error('Gagal mengelola PostgreSQL lokal. Periksa .local/postgres.log.');
  process.exit(1);
}
console.log(action === 'start' ? 'PostgreSQL lokal siap (127.0.0.1:55432). Data sebelumnya dipertahankan.' : 'PostgreSQL lokal dihentikan. Data tetap tersimpan.');

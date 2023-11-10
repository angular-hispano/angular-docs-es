import { access, cp, mkdir, rm } from 'node:fs/promises';

export async function rmrf(path) {
  try {
    await rm(path, { recursive: true });
  } catch {}
}

export async function exists(path) {
  return await access(path)
    .then(() => true)
    .catch(() => false);
}

export async function initDir(path) {
  await rmrf(path);
  await mkdir(path, { recursive: true });
}

export async function cpRf(src, dest) {
  await cp(src, dest, { recursive: true, force: true });
}

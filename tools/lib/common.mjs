import { watch } from 'chokidar';
import { resolve } from 'node:path';
import { $, cd, chalk, glob, within } from 'zx';
import { initDir, cpRf, exists } from './fileutiles.mjs';

const rootDir = resolve(__dirname, '../');
const adevEsDir = resolve(rootDir, 'adev-es');
const outDir = resolve(rootDir, 'build');

export async function resetBuildDir({ init = false }) {
  if (init) {
    console.log(chalk.cyan('synchronizing git submodule...'));
    await syncSubmodule();
  }

  const buildDirExists = await exists(outDir);
  if (init || !buildDirExists) {
    console.log(chalk.cyan('removing build directory...'));
    await initDir(outDir);
    console.log(chalk.cyan('copying origin files to build directory...'));
    await cpRf(resolve(rootDir, 'origin'), outDir);
  }
}

export async function buildADEV() {
  await within(async () => {
    cd(`${outDir}`);
    await $`pnpm install --frozen-lockfile`;
    await $`pnpm bazel build //adev:build.production --config=release`;
  });
}

export async function watchADEV() {
  await within(async () => {
    cd(`${outDir}`);
    await $`pnpm ibazel run //adev:build.serve`;
  });
}

/**
 * glob patterns of localized files in adev-es
 */
const localizedFilePatterns = ['**/*', '!**/*.en.*'];

export async function copyLocalizedFiles() {
  const esFiles = await glob(localizedFilePatterns, {
    cwd: adevEsDir,
  });
  for (const file of esFiles) {
    const src = resolve(adevEsDir, file);
    const dest = resolve(outDir, 'adev', file);
    await cpRf(src, dest);
  }
}

export async function watchLocalizedFiles(signal) {
  const watcher = watch(localizedFilePatterns, {
    cwd: adevEsDir,
  });
  watcher.on('change', (path) => {
    const src = resolve(adevEsDir, path);
    const dest = resolve(outDir, 'adev', path);
    cpRf(src, dest);
  });
  signal.addEventListener('abort', () => watcher.close());
}

export async function applyPatches() {
  await within(async () => {
    cd(outDir);
    const patches = await glob('tools/git-patches/*.patch', { cwd: rootDir });
    for (const patch of patches) {
      const path = resolve(rootDir, patch);
      await $`git apply -p1 --ignore-whitespace ${path}`;
    }
  });
}

export async function syncSubmodule() {
  await within(async () => {
    cd(rootDir);
    await $`git submodule sync`;
    await $`git submodule update --init`;
  });
}


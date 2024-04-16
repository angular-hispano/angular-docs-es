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
    cd(`${outDir}/adev`);
    await $`yarn install`;
    await $`yarn build`;
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

export async function syncSubmodule() {
  await within(async () => {
    cd(rootDir);
    await $`git submodule sync`;
    await $`git submodule update --init`;
  });
}

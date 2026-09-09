import { access, copyFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { $, argv, chalk, glob } from 'zx';
import { copyTargets, enPathOf } from './lib/targets.mjs';


try {
  console.log(chalk.cyan('Checking adev changes in origin...'));

  const [adevHash] = argv._;
  if (adevHash == null) {
    console.log('No adev origin SHA is provided.');
    process.exit(1);
  }
  console.log(chalk.green('adev origin SHA: ' + adevHash));

  await resetOriginHead(adevHash);
  await copyOriginFiles();

  console.log(chalk.cyan('Done.'));
} catch (err) {
  console.error(chalk.red(err));
  process.exit(1);
}

async function resetOriginHead(hash) {
  await $`git -C origin fetch --all`;
  await $`git -C origin reset ${hash} --hard`;
}

async function copyOriginFiles() {
  const adevOriginDir = 'origin/adev';
  const adevEsDir = 'adev-es';

  for (const target of copyTargets) {
    const files = await glob(target, { cwd: adevOriginDir, caseSensitiveMatch: true });

    // Un objetivo que no coincide con nada casi siempre significa que la ruta
    // cambió upstream, no que sobre. Fallar aquí evita que el archivo quede
    // desactualizado sin que nadie lo note.
    if (files.length === 0) {
      throw new Error(`No files matched: ${JSON.stringify(target)}`);
    }

    for (const file of files) {
      const src = resolve(adevOriginDir, file);
      const enFilePath = enPathOf(file);

      let isTranslated = false;
      try {
        await access(resolve(adevEsDir, enFilePath));
        isTranslated = true;
      } catch {}
      const dest = resolve(adevEsDir, isTranslated ? enFilePath : file);

      await mkdir(dirname(dest), { recursive: true });
      await copyFile(src, dest);
    }
  }
}

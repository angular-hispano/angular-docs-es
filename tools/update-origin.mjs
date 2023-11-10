import { access, copyFile, mkdir } from 'node:fs/promises';
import { extname, resolve, dirname } from 'node:path';
import { $, argv, chalk, glob } from 'zx';

const copyTargets = [
  // Text contents
  'src/content/best-practices/**/*.md',
  'src/content/ecosystem/**/*.md',
  'src/content/guide/**/*.md',
  'src/content/introduction/**/*.md',
  'src/content/reference/**/*.md',
  'src/content/tools/**/*.md',
  'src/content/*.md',
  // Navigation 
  'src/app/sub-navigation-data.ts'
];

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

  const files = await glob(copyTargets, { cwd: adevOriginDir });

  for (const file of files) {
    const src = resolve(adevOriginDir, file);
    const ext = extname(file);
    const enFilePath = file.replace(`${ext}`, `.en${ext}`);

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
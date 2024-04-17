import { argv, chalk } from 'zx';
import { copyLocalizedFiles, resetBuildDir, watchADEV, watchLocalizedFiles } from './lib/common.mjs';

try {
  const { init = false } = argv;

  console.log(chalk.green('==== setup ===='));
  await setup({ init });
  console.log(chalk.green('==== preWatch ===='));
  await preWatch({ init });
  console.log(chalk.green('==== watch ===='));
  await watch();
} catch (e) {
  console.error(chalk.red(e));
  process.exit(1);
}

async function setup({ init }) {
  console.log('');
  console.log(chalk.white('The targets of change monitoring are the files in adev-es and the source code in build/adev.'));
  if (init) {
    console.log(chalk.yellow('Initialize the build directory and discard the cache.'));
  } else {
    console.log(chalk.white('Specify the --init option to initialize the build directory.'));
  }

  await resetBuildDir({ init });
}

async function preWatch({ init }) {
  if (init) {
    // copy translated files
    console.log(chalk.cyan('Copy localized files...'));
    await copyLocalizedFiles();
  }
}

async function watch() {
  const ctrl = new AbortController();
  await watchLocalizedFiles(ctrl.signal);
  try {
    await watchADEV();
  } finally {
    console.log(chalk.cyan('Abort watching...'));
    ctrl.abort();
  }
}
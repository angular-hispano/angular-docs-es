#!/usr/bin/env zx

import { chalk } from 'zx';
import { buildADEV, copyLocalizedFiles, resetBuildDir } from './lib/common.mjs';

try {
  console.log(chalk.green('==== setup ===='));
  await setup();
  console.log(chalk.green('==== preBuild ===='));
  await preBuild();
  console.log(chalk.green('==== build ===='));
  await build();
} catch (e) {
  console.error(chalk.red(e));
  process.exit(1);
}

async function setup() {
  // always reset build dir
  await resetBuildDir({ init: true });
}

async function preBuild() {
  // copy translated files
  console.log(chalk.cyan('Copy localized files...'));
  await copyLocalizedFiles();
}

async function build() {
  await buildADEV();
}
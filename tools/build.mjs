#!/usr/bin/env zx

import { chalk } from 'zx';
import { applyPatches, buildADEV, copyLocalizedFiles, resetBuildDir } from './lib/common.mjs';

try {
  const { ci = false } = argv;

  console.log(chalk.green('==== setup ===='));
  await setup();
  console.log(chalk.green('==== preBuild ===='));
  await preBuild();

  if(!ci){
    console.log(chalk.green('==== build ===='));
    await build();
  }
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

  console.log(chalk.cyan('Apply patches...'));
  await applyPatches();
}

async function build() {
  await buildADEV();
}
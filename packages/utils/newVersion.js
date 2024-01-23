import * as fs from 'fs';
import promptSync from 'prompt-sync';
const prompt = promptSync();
import chalk from 'chalk';

console.log(chalk.bold.bgMagentaBright(' Major/minor/patch? (M, m, p) '));
const updateKind = prompt('> ');

const rootPackageJson = JSON.parse(fs.readFileSync('../../package.json'));
const oldVersion = rootPackageJson.version;
const versionArray = oldVersion.split('.').map(el => parseInt(el));

switch (updateKind) {
  case 'M':
    versionArray[0] += 1;
    break;
  case 'm':
    versionArray[1] += 1;
    break;
  case 'p':
    versionArray[2] += 1;
    break;
  default:
    console.error(chalk.bold.bgRedBright(' Invalid update type '));
}

const newVersion = versionArray.join('.');
console.log(
  chalk.bold.bgMagentaBright(
    ` Updating versions (${oldVersion} => ${newVersion})... `,
  ),
);

rootPackageJson.version = newVersion;
fs.writeFileSync(
  '../../package.json',
  JSON.stringify(rootPackageJson, null, 2),
);
console.log(chalk.bold.bgMagentaBright(' Updated root package.json '));

const allPackages = fs.readdirSync('../');

for (const folder of allPackages) {
  const folderPath = `../${folder}/package.json`;
  const packageJson = fs.readFileSync(folderPath);
  packageJson.version = newVersion;
  if (folder === 'app') {
    const versionCode =
      parseInt(versionArray[0]) * 10000 +
      parseInt(versionArray[1]) * 100 +
      parseInt(versionArray[2]);
    packageJson.versionCode = versionCode;
    const buildGradlePath = '../app/android/app/build.gradle';
    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    const newBuildGradle = buildGradle
      .replace(/versionCode\s+\d+/, `versionCode ${versionCode}`)
      .replace(/versionName\s+"[^"]+"/, `versionName "${newVersion}"`);
    fs.writeFileSync(buildGradlePath, newBuildGradle);
  }
  fs.writeFileSync(folderPath, JSON.stringify(packageJson, null, 2));
  console.log(
    chalk.bold.bgMagentaBright(` Updated package.json for package ${folder} `),
  );
}

import * as fs from 'fs';
import packageJson from './i18n-resources.json' assert {type: 'json'};

function getVersionCodeFromVersionName(versionName) {
  const versionComponents = versionName.split('.');
  if (versionComponents.length !== 3) {
    throw new Error(
      'Invalid version format. Must be in the format major.minor.patch',
    );
  }
  return (
    parseInt(versionComponents[0]) * 10000 +
    parseInt(versionComponents[1]) * 100 +
    parseInt(versionComponents[2])
  );
}

const versionName = packageJson.version;
const versionCode = getVersionCodeFromVersionName(versionName);
packageJson.versionCode = versionCode;
fs.writeFileSync('package.json', JSON.stringify(packageJson));

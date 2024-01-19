import {execSync} from 'child_process';

// Run gradlew clean for React Native (THIS REQUIRES NODE_MODULES)
console.log('Running gradlew clean...');
execSync('gradlew clean', {cwd: '../app/android/'});
console.log('Ran gradlew clean');

import Dockerode from 'dockerode';
import {execSync} from 'child_process';
import chalk from 'chalk';

const docker = new Dockerode();

docker.ping(err => {
  if (err) {
    console.error(
      chalk.bold.bgRedBright(' Docker is not running or not accessible '),
    );
    process.exit(1);
  }
  const imageName = 'voyalert/backend:' + process.env.npm_package_version;
  console.log(
    chalk.bold.bgMagentaBright(` Building docker image ${imageName} `),
  );
  try {
    execSync('docker build . -t ' + imageName);
    console.log(
      chalk.bold.bgGreenBright(
        ` Successfully built docker image ${imageName} `,
      ),
    );
  } catch (err) {
    console.error(
      chalk.bold.bgRedBright(` Error building docker image ${imageName} `),
    );
  }
});

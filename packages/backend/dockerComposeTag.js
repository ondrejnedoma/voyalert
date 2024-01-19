import * as fs from 'fs';
import yaml from 'js-yaml';
import chalk from 'chalk';

const file = fs.readFileSync('docker-compose.yml');
const yamlData = yaml.load(file);

const yamlVersion = yamlData.services.voyalertbackend.image.split(':')[1];
const npmVersion = process.env.npm_package_version;
if (yamlVersion !== npmVersion) {
  yamlData.services.voyalertbackend.image =
    'ondrejnedoma/voyalert-backend:' + npmVersion;
  const updatedYaml = yaml.dump(yamlData);
  fs.writeFileSync('docker-compose.yml', updatedYaml);
  console.log(
    chalk.bold.bgMagentaBright(
      ` Updated @voyalert/backend/docker-compose.yml tag from ${yamlVersion} to ${npmVersion} `,
    ),
  );
}

import * as fs from "fs";

const destinationFolders = ["app", "backend"];
const allLanguages = fs.readdirSync("languages");

let resources = {};
for (const language of allLanguages) {
  resources[language] = { translation: null };
  resources[language].translation = JSON.parse(
    fs.readFileSync(`languages/${language}/translation.json`)
  );
}

for (const folder of destinationFolders) {
  fs.writeFileSync(
    `../${folder}/i18n-resources.json`,
    JSON.stringify(resources)
  );
}

console.log("Merged @voyalert/i18n languages into packages");

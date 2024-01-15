// For safety reasons, this script does NOT use any other modules than the ones directly built into node to avoid issues with the removal of node_modules
import { execSync } from "child_process";
import * as fs from "fs";

// Delete node_modules for all individual packages
const packages = fs.readdirSync("../");
console.log(
  `Deleting node_modules for ${packages.length} packages (${packages.join(
    ", "
  )})...`
);
for (const folder of packages) {
  fs.rmSync(`../${folder}/node_modules`, { recursive: true, force: true });
  console.log(`Deleted node_modules for ${folder}`);
}
console.log("\n");

// Delete root node_modules
console.log("Deleting root node_modules...");
fs.rmSync("../../node_modules", { recursive: true, force: true });
console.log("Deleted root node_modules");
console.log("\n");

// Install node_modules again
console.log("Running npm install...");
execSync("npm install", { cwd: "../../" });
console.log("Ran npm install");

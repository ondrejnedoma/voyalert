import ip from "ip";
import chalk from "chalk";

const line = chalk.bold.magenta("<><><><><><><><><>");

console.log(line);

console.log(chalk.bold.greenBright("IP: " + ip.address()));

console.log(line);

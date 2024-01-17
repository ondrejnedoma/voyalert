import ip from "ip";
import chalk from "chalk";

console.log(chalk.bold.bgMagentaBright(` >>> IP: ${ip.address()} <<< `));

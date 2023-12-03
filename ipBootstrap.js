const fs = require("fs")
const ip = require("ip")
const { parse, stringify } = require('envfile')
const prompt = require('prompt-sync')();

const ipAddress = ip.address()
if (ipAddress === "127.0.0.1") {
    console.log("localhost ip detected - check internet connection")
    process.exit()
}
const port = prompt("Port: ")
let parsedFile = parse(".env");
parsedFile.DEV_URL = "http://" + ipAddress
parsedFile.DEV_PORT = port
fs.writeFileSync('./.env', stringify(parsedFile)) 
console.log("Written new .env file. IP: " + ip.address())
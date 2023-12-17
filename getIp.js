const ip = require('ip');

const ipAddress = ip.address();
if (ipAddress === '127.0.0.1') {
  console.log('localhost ip detected - check internet connection');
  process.exit();
}

console.log('IP: ' + ip.address());

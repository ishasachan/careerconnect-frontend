const fs = require('fs');
const path = require('path');

const dir = './src/environments';
const targetFile = 'environment.ts';
const devFile = 'environment.development.ts';

// Use BASE_URL from environment variables (like on Render) or default to localhost
const apiUrl = process.env.BASE_URL || 'http://localhost:9090/api';

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

const devContent = `export const environment = {
  production: false,
  apiUrl: 'http://localhost:9090/api'
};
`;

// Ensure directory exists
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Write the files
fs.writeFileSync(path.join(dir, targetFile), content);
fs.writeFileSync(path.join(dir, devFile), devContent);

console.log(`Environment files generated at ${dir}`);
console.log(`Using API URL: ${apiUrl}`);

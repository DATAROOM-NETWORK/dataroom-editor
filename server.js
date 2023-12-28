import express from 'express';
import { createServer } from 'https';
import { readFileSync, existsSync } from 'fs';
import path, { join } from 'path';
import os from 'os';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

let PORT = process.env.PORT || 3000;

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const key in interfaces) {
    for (const iface of interfaces[key]) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address !== '127.0.0.1') {
        return iface.address;
      }
    }
  }
  return null;
}

global.ip_address = getLocalIpAddress();

const currentModuleURL = new URL(import.meta.url);
const rootDirectory = decodeURIComponent(new URL('.', currentModuleURL).pathname);
global.root_directory = rootDirectory;

global.hostname = os.hostname();

// BEARER TOKENS


// Load logins.json file
const loginsPath = join(rootDirectory, 'logins.json');
let authorizedTokens = [];

try {
  const loginsData = readFileSync(loginsPath, 'utf-8');
  authorizedTokens = JSON.parse(loginsData);
} catch (error) {
  console.error('Error loading logins.json:', error.message);
}

app.use(express.json());

// BASIC ROUTES

app.use(express.json());
app.use('/plugins', express.static(join(rootDirectory, '/plugins')));
app.use("/index.css", express.static(join(rootDirectory, '/index.css')));
app.use("/index.js", express.static(join(rootDirectory, '/index.js')));

app.get('/', (req, res) => {
  res.sendFile(path.join(global.root_directory, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(global.root_directory, 'login.html'));
});

// Check if private-key.pem and certificate.pem files exist
const privateKeyPath = join(rootDirectory, 'private-key.pem');
const certificatePath = join(rootDirectory, 'certificate.pem');

if (!existsSync(privateKeyPath) || !existsSync(certificatePath)) {
  console.log('Certificates not found. Generating new certificates...');
  // Generate new self-signed certificates using openssl
  try {
    execSync(`openssl req -x509 -newkey rsa:4096 -keyout ${privateKeyPath} -out ${certificatePath} -days 365 -nodes -subj "/CN=${hostname}"`);
    console.log('New certificates generated successfully.');
  } catch (error) {
    console.error('Error generating certificates:', error.message);
  }
}

// Configure HTTPS server
const httpsOptions = {
  key: readFileSync(privateKeyPath),
  cert: readFileSync(certificatePath),
};

const httpsServer = createServer(httpsOptions, app);
httpsServer.listen(PORT, () => {
  console.log(`Server listening on port https://${global.hostname}:${PORT} and serving ${global.root_directory}`);
});

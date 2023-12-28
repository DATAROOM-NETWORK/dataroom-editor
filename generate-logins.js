import { readFileSync, writeFileSync, existsSync } from 'fs';
import { randomBytes } from 'crypto';

// Function to generate a cryptographically random string
function generateRandomString(length) {
  return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// Function to generate an array of random strings
function generateRandomStringsArray(count, length) {
  const randomStrings = [];
  for (let i = 0; i < count; i++) {
    randomStrings.push(generateRandomString(length));
  }
  return randomStrings;
}

// Exported function to generate logins and write to a file
export function generateLogins(numberOfStrings, stringLength) {
  // Generate an array of cryptographically random strings
  const randomStringsArray = generateRandomStringsArray(numberOfStrings, stringLength);

  // Create an object with the array of random strings
  const loginsObject = {
    logins: randomStringsArray,
  };

  // Convert the object to JSON
  const loginsJson = JSON.stringify(loginsObject, null, 2);

  // Write the JSON to a file named logins.json
  writeFileSync('logins.json', loginsJson, 'utf-8');

  console.log('logins.json generated successfully.');
}

// Exported function to get the logins array from logins.json
export function getLogins() {
  if (existsSync('logins.json')) {
    const loginsJson = readFileSync('logins.json', 'utf-8');
    const loginsObject = JSON.parse(loginsJson);
    return loginsObject.logins;
  } else {
    console.error('logins.json does not exist. Please generate logins first.');
    return [];
  }
}

// Check if the file logins.json exists
const loginsFileExists = existsSync('logins.json');

// If the file doesn't exist, generate logins
if (!loginsFileExists) {
  const numberOfStrings = 1024;
  const stringLength = 20;
  generateLogins(numberOfStrings, stringLength);
} else {
  console.log('logins.json already exists.');
}

// Example usage of getLogins
const loginsArray = getLogins();

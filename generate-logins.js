import { writeFileSync } from 'fs';
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

// Number of random strings and their length
const numberOfStrings = 1024;
const stringLength = 20;

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

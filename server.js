/*
  *** begin ascii art ***

          ,a8a,
         ,8" "8,                       8I
         d8   8b                       8I
         88   88                       8I
         88   88                       8I
         Y8   8P  ,ggg,,ggg,     ,gggg,8I   ,ggg,      ,gg,   ,gg
         `8, ,8' ,8" "8P" "8,   dP"  "Y8I  i8" "8i    d8""8b,dP"
    8888  "8,8"  I8   8I   8I  i8'    ,8I  I8, ,8I   dP   ,88"
    `8b,  ,d8b, ,dP   8I   Yb,,d8,   ,d8b, `YbadP' ,dP  ,dP"Y8,
      "Y88P" "Y88P'   8I   `Y8P"Y8888P"`Y8888P"Y8888"  dP"   "Y88

  *** end ascii art ***

  index.js,

  This is to wire together components and prototype quick ideas, not run the 
  business logic.

  Software is, above all things, a human / computer interface. This bundle of 
  text is your interface between the server and you: keep it clear and humane.

*/

// require modules here
const express = require('express');  // Express.js framework for building web applications
const app = express();              // Create an instance of the Express application
const server = require('http').Server(app);  // Create an HTTP server using the Express app
const path = require('path');
const os = require('os');

// Load environment variables from a .env file if present
const dotenv = require("dotenv");
dotenv.config();

// Set the PORT for the server from the .env file
let PORT = process.env.PORT; // Try to get the PORT from environment variables
if (!PORT) {
  PORT = 3000; // If PORT is not defined, default to 3000
}

// Get the local IP Address
// Share it as a global variable
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  
  // Iterate over network interfaces
  for (const key in interfaces) {
    for (const iface of interfaces[key]) {
      // Check for IPv4 and skip internal and loopback addresses
      if (iface.family === 'IPv4' && !iface.internal && iface.address !== '127.0.0.1') {
        return iface.address;
      }
    }
  }

  // Return null if no suitable address is found
  return null;
}

global.ip_address = getLocalIpAddress();

global.root_directory = __dirname;

app.use(express.json());
app.use('/', express.static(__dirname + '/plugins')); // Serve files in the 'components' directory at the root URL
app.use("/", express.static(__dirname + '/notebooks')); // Serve files in the 'assets' directory at the root URL
app.use("/index.css", express.static(__dirname + '/index.css')); // Serve 'index.css' file at '/index.css' URL
app.use("/index.js", express.static(__dirname + '/index.js')); // Serve 'index.js' file at '/index.js' URL

const routes = require('./routes.js')(app);

app.get('/', (req, res) => {
  res.sendFile(path.join(global.root_directory, 'index.html'));
});

// Start the server and listen on the specified PORT
app.listen(PORT, () => {
  console.log(`Server listening on port http://${global.ip_address}:${PORT} and serving ${global.root_directory}`);
});


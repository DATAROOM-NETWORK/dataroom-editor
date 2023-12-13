const Mocha = require('mocha');
const app = require('express')();  // Assuming Express is properly set up in your project

const server = require('http').Server(app);  // Create an HTTP server using the Express app
const routes = require('./routes.js')(app);



const mocha = new Mocha({
  timeout: 60000, // A one minute time out
  bail: false,   // bail on the first test failure
  reporter: 'spec', // choose a reporter (e.g., 'spec', 'nyan', 'dot', etc.)
});


mocha.addFile('./plugins/chat-gpt/chat-gpt.tests.js');
// mocha.addFile('./plugins/file-clerk/file-clerk.tests.js');

mocha.run((failures) => {
  process.exitCode = failures ? 1 : 0; // exit with non-zero status if there are failures
});


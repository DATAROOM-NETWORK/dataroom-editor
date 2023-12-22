module.exports = function(app, server) {  
  /* BEGIN GENERATED MODULES */ 
  const fileClerk = require('./plugins/file-clerk/file-clerk.route.js')(app);
  const dataRoom = require('./plugins/dataroom/dataroom.route.js')(app);
}
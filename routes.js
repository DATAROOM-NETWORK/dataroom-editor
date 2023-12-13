module.exports = function(app, server) {  

  //  const generateComponent = require('./components/generate-new-component/generate-new-component.route.js')(app);
  const fileClerk = require('./plugins/file-clerk/file-clerk.route.js')(app);
}
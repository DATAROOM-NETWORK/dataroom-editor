// Middleware to check for bearer token against logins.json
app.use((req, res, next) => {
  // Skip authentication for login.html and index.html
  // 
  // Check for bearer token in the Authorization header
  const token = req.headers['authorization'];

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Bearer token missing' });
  }

  // Check if the token is in the authorizedTokens array
  if (!authorizedTokens.includes(token.replace('Bearer ', ''))) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }

  next();
});

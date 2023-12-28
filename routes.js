import {getLogins} from './generate-logins.js';

// Get Authorized Devices
const authorizedTokens = getLogins();

export default function (app) {

  // Bearer Tokens for endpoints
  app.use((req, res, next) => {
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

/*
  BEGIN GENERATED CODE
*/

/* 
  END GENERATED CODE
 */
}
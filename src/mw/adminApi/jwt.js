const jwt = require('jsonwebtoken');

export function token_create(subject, secret) {
  return jwt.sign({}, Buffer.from(secret, 'base64'), {
    subject,
    noTimestamp: true,
    algorithm: 'HS256'
  });
}

export default token_create;

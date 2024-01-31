import jwt from 'jsonwebtoken';
import config from 'config';

export const signJwt = (payload, key, options) => {
  const privateKey = config.get(key).replace(/\\n/g, '\n');

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = (token, key) => {
  try {
    const publicKey = config.get(key).replace(/\\n/g, '\n');
    return jwt.verify(token, publicKey);
  } catch (error) {
    return null;
  }
};
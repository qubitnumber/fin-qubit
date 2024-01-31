import lodash from 'lodash';
import config from 'config';
import userModel from '../models/user.model.js';
import { excludedFields } from '../controllers/auth.controller.js';
import { signJwt } from '../utils/jwt.js';
import kv from '../utils/connectRedis.js';

// CreateUser service
export const createUser = async (input) => {
  const user = await userModel.create(input);
  return lodash.omit(user.toJSON(), excludedFields);
};

// Find User by Id
export const findUserById = async (id) => {
  const user = await userModel.findById(id).lean();
  return lodash.omit(user, excludedFields);
};

// Find All users
export const findAllUsers = async () => {
  return await userModel.find();
};

// Find one user by any fields
export const findUser = async (
  query,
  options
) => {
  return await userModel.findOne(query, {}, options).select('+password');
};

// Sign Token
export const signToken = async (user) => {
  // Sign the access token
  const access_token = signJwt({ sub: user._id }, 'accessTokenPrivateKey', {
    expiresIn: `${config.get('accessTokenExpiresIn')}m`,
  });

  // Sign the refresh token
  const refresh_token = signJwt({ sub: user._id }, 'refreshTokenPrivateKey', {
    expiresIn: `${config.get('refreshTokenExpiresIn')}m`,
  });

  // Create a Session
  await kv.set(user._id.toString(), JSON.stringify(user), {
    ex: 3600,
    nx: true,
  });

  // Return access token
  return { access_token, refresh_token };
};

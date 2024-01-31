import config from 'config';
import {
  createUser,
  findUser,
  findUserById,
  signToken,
} from '../services/user.service.js';
import AppError from '../utils/appError.js';
import kv from '../utils/connectRedis.js';
import { signJwt, verifyJwt } from '../utils/jwt.js';

// Exclude this fields from the response
export const excludedFields = ['password'];

// Cookie options
const accessTokenCookieOptions = {
  expires: new Date(
    Date.now() + config.get('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get('accessTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

const refreshTokenCookieOptions = {
  expires: new Date(
    Date.now() + config.get('refreshTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get('refreshTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

// Only set secure to true in production
if (process.env.NODE_ENV === 'production')
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (req, res, next) => {
  try {
    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: 'fail',
        message: 'Email already exist',
      });
    }
    next(err);
  }
};

export const loginHandler = async (req, res, next) => {
  try {
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });

    // Check if user exist and password is correct
    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Create the Access and refresh Tokens
    const { access_token, refresh_token } = await signToken(user);

    // Send Access Token in Cookie
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    res.status(200).json({
      status: 'success',
      access_token,
    });
  } catch (err) {
    next(err);
  }
};

// Refresh tokens
const logout = (res) => {
  res.cookie('access_token', '', { maxAge: 1 });
  res.cookie('refresh_token', '', { maxAge: 1 });
  res.cookie('logged_in', '', { maxAge: 1 });
};

export const refreshAccessTokenHandler = async (req, res, next) => {
  try {
    // Get the refresh token from cookie
    const refresh_token = req.cookies.refresh_token;

    // Validate the Refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      'refreshTokenPublicKey'
    );
    const message = 'Could not refresh access token';
    if (!decoded) {
      return next(new AppError(message, 403));
    }

    // Check if the user has a valid session
    const session = await kv.get(decoded.sub);
    if (!session) {
      return next(new AppError(message, 403));
    }

    // Check if the user exist
    const user = await findUserById(JSON.parse(session)._id);

    if (!user) {
      return next(new AppError(message, 403));
    }

    // Sign new access token
    const access_token = signJwt({ sub: user._id }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    // Send the access token as cookie
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send response
    res.status(200).json({
      status: 'success',
      access_token,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutHandler = async (_req, res, next) => {
  try {
    const user = res.locals.user;
    await kv.del(user._id);
    logout(res);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    next(err);
  }
};

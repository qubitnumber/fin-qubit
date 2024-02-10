import { findUserById } from '../services/user.service.js';
import AppError from '../utils/appError.js';
import kv from '../utils/connectRedis.js';
import { verifyJwt } from '../utils/jwt.js';

export const deserializeUser = async (req, res, next) => {
  try {
    // Get the token
    let access_token;
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new AppError('You are not logged in', 401));
    }

    // Validate Access Token
    const decoded = verifyJwt(
      access_token,
      'accessTokenPublicKey'
    );

    if (!decoded) {
      return next(new AppError(`Invalid token or user doesn't exist`, 401));
    }
 
    // Check if user has a valid session
    const session = await kv.get(decoded.sub);
    if (!session) {
      return next(new AppError(`User session has expired`, 401));
    }

    // Check if user still exist
    const user = await findUserById(session._id.toString());
    if (!user) {
      return next(new AppError(`User with that token no longer exist`, 401));
    }

    // This is really important (Helps us know if the user is logged in from other controllers)
    // You can do: (req.user or res.locals.user)
    res.locals.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

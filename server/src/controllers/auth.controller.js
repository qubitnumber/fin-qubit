import config from 'config';
import otpGenerator from 'otp-generator';
import {
  createUser,
  findUser,
  findUserById,
  signToken,
  findOtp,
  createOpt,
  updateUser,
} from '../services/user.service.js';
import AppError from '../utils/appError.js';
import kv from '../utils/connectRedis.js';
import { signJwt, verifyJwt } from '../utils/jwt.js';

// Exclude this fields from the response
export const excludedFields = ['password'];

// Cookie options
const accessTokenCookieOptions = {
  expires: new Date(
    Date.now() + config.util.getEnv('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.util.getEnv('accessTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

const refreshTokenCookieOptions = {
  expires: new Date(
    Date.now() + config.util.getEnv('refreshTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.util.getEnv('refreshTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

// Only set secure to true in production
if (process.env.NODE_ENV === 'production')
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (req, res, next) => {
  try {
    const {name, email, password, otp}= req.body
    const user = await createUser({
      email,
      name,
      password,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user
      },
      message: '',
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

export const sendOtpHandler = async (req, res, next) => {
  try {
    const { email }= req.body
		const user = await findUser({ email });
		if (!user) {
			return res.status(401).json({
				success: false,
				message: `User is not Registered`,
			});
		};

    let otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
    let result = await findOtp({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await findOtp({ otp });
    };

    const otpBody = await createOpt({ email, otp });
    res.status(200).json({
      status: 'success',
      data: {
        otpBody,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
			error: error.message,
    });
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

    if (user && !user.isVerified) {
      res.status(200).json({
        status: 'success',
        access_token: '',
        isVerified: user.isVerified,
        email: user.email,
      });
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
      isVerified: user.isVerified,
      email: user.email,
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

export const verifyEmailHandler = async (req, res, next) => {
  try {
    const otp = await findOtp({ otp: req.params.otp });
    if (!otp) {
			return res.status(401).json({
				success: false,
				message: `OTP is expired`,
        email: '',
			});
		};

    await updateUser({email: otp.email}, {isVerified: true});

    res.status(200).json({
      status: 'success',
      message: `Email is verified`,
      email: otp.email,
    });
  } catch (err) {
    next(err);
  }
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
      expiresIn: `${app.get<number>('accessTokenExpiresIn')}m`,
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

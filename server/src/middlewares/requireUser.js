import AppError from '../utils/appError.js';

export const requireUser = (_req, res, next) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return next(new AppError(`Invalid token or session has expired`, 401));
    }

    next();
  } catch (err) {
    next(err);
  }
};

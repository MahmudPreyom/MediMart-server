import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../app/config';
import AppError from '../app/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../modules/users/user.model';
import { TUserRole } from '../modules/users/user.interface';

const auth = (...requiredRole: TUserRole[]) => {
  // const auth = (...requiredRole: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { email, role } = decoded;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const isActiveStatus = user?.isActivate;

    if (isActiveStatus === false) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is deactivated !!');
    }

    if (requiredRole && !requiredRole.includes(role)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized');
    }
    req.user = decoded as JwtPayload & { role: string };
    // req.user = decoded as JwtPayload;
    // req.user = user;
    // req.user._id = _id;

    next();
  });
};

export default auth;

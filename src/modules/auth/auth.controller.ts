import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { AuthServices } from './auth.service';
import config from '../../app/config';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'User registered successfully',
    data: {
      _id: result._id,
      name: result.name,
      email: result.email,
      // password: result?.password,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict', // Prevents CSRF attacks
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successful',
    data: { accessToken },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new Error('Refresh token is missing');
  }

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'New access token generated',
    data: result,
  });
});

// Uncomment if logout functionality is needed
// const logout = catchAsync(async (req: Request, res: Response) => {
//   res.clearCookie('refreshToken', {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: 'strict',
//   });

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'User logged out successfully',
//   });
// });

export const AuthControllers = {
  register,
  login,
  refreshToken,
  // logout,
};

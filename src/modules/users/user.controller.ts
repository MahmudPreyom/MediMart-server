/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const payload = req.body;

  const result = await UserService.createUserIntoDB(payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User Registered Successfully',
    data: result,
  });
});

// const changePassword = catchAsync(async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   const userId = req.user?._id; // Retrieved from authenticated token

//   const result = await UserService.changePassword(
//     userId,
//     currentPassword,
//     newPassword,
//   );

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: result.message,
//   });
// });

const getUser = catchAsync(async (req, res) => {
  const result = await UserService.getUserFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users Getting Successfully',
    data: result,
  });
});

const updateUserActiveStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.updateUserActiveStatusIntoDb(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User Deactivated Successfully',
  });
});

export const UserControllers = {
  createUser,
  // changePassword,
  getUser,
  updateUserActiveStatus,
};

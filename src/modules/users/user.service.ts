import { StatusCodes } from 'http-status-codes';
import AppError from '../../app/errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: TUser): Promise<TUser> => {
  payload.role = 'admin';
  const result = await User.create(payload);
  return result;
};

const getUserFromDB = async () => {
  const result = await User.find();
  return result;
};

const updateUserActiveStatusIntoDb = async (id: string) => {
  const userId = await User.findById(id);

  if (!userId) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (userId?.isActivate == false) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User already deactivate');
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isActivate: false },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

export const UserService = {
  createUserIntoDB,
  getUserFromDB,
  updateUserActiveStatusIntoDb,
};

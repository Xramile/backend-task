import { Errors } from '../shared/errors';
import { createToken } from '../helpers/jwt';
import { User } from '../models';
import { UserInterface } from '../shared/types/user';

export const createUser = (user: Required<UserInterface>) => {
  return new Promise<{ user: UserInterface }>(async (resolve, reject) => {
    try {
      // create new supplier
      const newUser = new User(user);

      // save
      await newUser.save();

      resolve({ user: newUser });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        reject(Errors.EXISTS);
      } else {
        reject(err);
      }
    }
  });
};

export const login = ({
  email,
  password,
  rememberMe = false,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  return new Promise<{
    token: { token: string; expiresIn: string };
    user: UserInterface;
  }>(async (resolve, reject) => {
    try {
      // check email
      const user = await User.findOne({ email });
      if (!user) throw Errors.INCORECT_CREDINTIAL;

      // check password
      const isValid = await user.isValidPass(password);
      if (!isValid) throw Errors.INCORECT_CREDINTIAL;

      // create token
      const token = createToken({ id: user._id }, rememberMe);
      resolve({
        token,
        user,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      reject(err);
    }
  });
};

export const updateUser = ({
  id,
  updates = {},
  whiteList = [],
}: {
  id: string;
  updates: { [key: string]: unknown };
  whiteList: string[];
}) => {
  return new Promise<{ user: UserInterface }>(async (resolve, reject) => {
    const allowedUpdates = Object.fromEntries(
      whiteList.map((x) => [x, updates[x]]).filter((obj) => !!obj[1])
    );
    try {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: allowedUpdates },
        { new: true }
      );
      if (!user) {
        throw Errors.NOT_FOUND;
      }
      resolve({ user });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.kind === 'ObjectId') {
        reject(Errors.NOT_FOUND);
      }
      reject(err);
    }
  });
};

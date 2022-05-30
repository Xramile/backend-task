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

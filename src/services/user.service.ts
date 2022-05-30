import { Errors } from './../shared/errors';
import { createToken } from './../helpers/jwt';
import { User } from 'models';
import { UserInterface } from '../shared/types/user';

export const createUser = (user: Required<UserInterface>) => {
  return new Promise<{ user: UserInterface }>(async (resolve, reject) => {
    try {
      // create new supplier
      const newUser = new User(user);

      // save
      await newUser.save();

      resolve({ user: newUser });
    } catch (err) {
      reject({ status: 400, err });
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
      if (!user) throw new Error(Errors.INCORECT_CREDINTIAL);

      // check password
      const isValid = await user.isValidPass(password);
      if (!isValid) throw new Error(Errors.INCORECT_CREDINTIAL);

      // create token
      const token = createToken({ id: user._id }, rememberMe);
      resolve({
        token,
        user,
      });
    } catch (err) {
      let status = 400;
      if ((err as Error).message === Errors.INCORECT_CREDINTIAL) {
        status = 401;
      }
      reject({ status, err });
    }
  });
};

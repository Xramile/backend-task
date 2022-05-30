import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import responseFactory from '../helpers/responseFactory';
import { userService } from '../services';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = matchedData(req);
  try {
    const { user } = await userService.createUser({
      name: name,
      email: email,
      hash: password,
    });

    res.status(201).json(responseFactory.success({ user }));
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, rememberMe } = matchedData(req);
  try {
    const { user, token } = await userService.login({
      email: email.toLowerCase(),
      password,
      rememberMe,
    });

    res.json(responseFactory.success({ user, token }));
  } catch (err) {
    next(err);
  }
};

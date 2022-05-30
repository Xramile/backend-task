import { Errors } from '../shared/errors';
import { verifyToken } from '../helpers/jwt';
import { Request, Response, NextFunction } from 'express';

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check token
    const header = req.header('Authorization');
    if (!header) throw Errors.UNAUTHORIZED;

    const token = header.replace('Bearer ', '');
    if (!token) throw Errors.UNAUTHORIZED;

    // verify
    const decodeResponse = verifyToken(token);
    if (!decodeResponse.isValid) throw Errors.UNAUTHORIZED;

    // set user id to be avilable to full request-response cycle if needed
    res.locals.userId = (
      decodeResponse.data as unknown as { [key: string]: unknown }
    ).id;
    next();
  } catch (err) {
    next(err);
  }
};

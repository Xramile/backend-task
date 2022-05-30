import { Errors } from './shared/errors';
import createError, { HttpError } from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { appendFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from 'morgan';

//routes
import apiRouter from 'routes/api';
import responseFactory from 'helpers/responseFactory';

const app = express();

//** config
if (process.env.NODE_ENV === 'production') {
  // limit 100 request every minute for user
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 360,
    })
  );

  // security
  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
} else {
  // accept request from any domain
  app.use(
    cors({
      origin: '*',
    })
  );
}

// statics
app.use(['/assets'], express.static(path.join(__dirname, 'assets')));

// logger
if (process.env.NODE_ENV === 'production') {
  // log
  const accessLogStream = createWriteStream(
    path.join(__dirname, 'logs', 'access.log'),
    { flags: 'a' }
  );
  app.use(
    logger('combined', {
      stream: accessLogStream,
    })
  );
} else {
  // log
  app.use(logger('dev'));
}

// parse request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//** handel api
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction): void => {
  next(createError(404));
});

// error handler
app.use(
  async (
    err: HttpError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
  ): Promise<void> => {
    if (process.env.NODE_ENV === 'production') {
      try {
        const errLine = `${new Date().toISOString()}\n----\n${err}\n====\n`;
        await appendFile(
          path.join(__dirname, '..', 'logs', 'error.log'),
          errLine
        );
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(err);
    }
    res.status(err.status || 500).json(
      responseFactory.error({
        message: err.msg || Errors.SERVER_ERROR,
      })
    );
  }
);

export default app;

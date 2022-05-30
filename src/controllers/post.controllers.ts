import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import responseFactory from '../helpers/responseFactory';
import { postService } from '../services';

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content } = matchedData(req);
  const { userId } = res.locals;
  try {
    const { post } = await postService.createPost({
      user: userId,
      title,
      content,
    });

    res.status(201).json(responseFactory.success({ post }));
  } catch (err) {
    next(err);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, user, sortBy, sortType, page, limit } = matchedData(req);
  try {
    const { posts, pagination } = await postService.getPosts({
      queryData: {
        title,
        userId: user,
      },
      sort: { sortBy, sortType },
      page,
      limit,
    });

    res.json(responseFactory.success({ posts, pagination }));
  } catch (err) {
    next(err);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  try {
    const { post } = await postService.getPost(postId);

    res.json(responseFactory.success(post));
  } catch (err) {
    next(err);
  }
};

export const updateOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  const { userId } = res.locals;
  const data = matchedData(req);

  const whiteList = ['title', 'content'];
  try {
    const { post } = await postService.updatePost({
      postId,
      userId,
      updates: data,
      whiteList,
    });

    res.json(responseFactory.success(post));
  } catch (err) {
    next(err);
  }
};

export const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  const { userId } = res.locals;

  try {
    await postService.deletePost({
      postId,
      userId,
    });

    res.json(responseFactory.success());
  } catch (err) {
    next(err);
  }
};

import { ObjectId } from 'mongoose';
import { Errors } from '../shared/errors';
import { Post } from '../models';
import { PostInterface } from '../shared/types/Post';
import { PaginationInterface } from '../shared/types/pagination';

export const createPost = (post: PostInterface) => {
  return new Promise<{ post: PostInterface }>(async (resolve, reject) => {
    try {
      const newPost = new Post({ post });
      await newPost.save();
      resolve({ post: newPost });
    } catch (err) {
      reject(err);
    }
  });
};

export const getPosts = ({
  queryData = {},
  sort = {
    sortBy: 'createdAt',
    sortType: 1,
  },
  page,
  limit,
}: {
  queryData?: {
    title?: string;
    userId?: string | ObjectId;
  };
  sort?: {
    sortBy: keyof PostInterface;
    sortType: 1 | -1;
  };
  page: number;
  limit: number;
}) => {
  if (!page || page < 1) page = 1;
  if (!limit || limit < 1) limit = 10;
  const skip = page * limit - limit;

  const query = {
    ...(queryData.title
      ? {
          title: {
            $regex: new RegExp(queryData.title, 'ig'),
          },
        }
      : {}),
    ...(queryData.userId
      ? {
          user: queryData.userId,
        }
      : {}),
  };

  return new Promise<{
    posts: PostInterface[];
    pagination: PaginationInterface;
  }>(async (resolve, reject) => {
    try {
      const total = await Post.countDocuments(query);
      const pages = Math.ceil(total / limit);

      const pagination: PaginationInterface = {
        count: 0,
        total,
        perPage: limit,
        currentPage: page,
        totalPages: pages,
        has: {
          next: page < pages ? true : false,
          prev: page > 1 ? true : false,
        },
      };

      if (page > pages)
        return resolve({
          posts: [],
          pagination,
        });

      const posts = await Post.aggregate([
        { $match: query },
        {
          $sort: {
            createdAt: -1,
          },
        },
        { $skip: skip },
        { $limit: limit },
        ...(sort.sortBy
          ? [
              {
                $sort: {
                  [sort.sortBy]: sort.sortType || 1,
                },
              },
            ]
          : []),
        {
          $lookup: {
            from: 'Users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
      ]);

      pagination.count = posts.length;

      resolve({ posts, pagination });
    } catch (err) {
      reject(err);
    }
  });
};

export const getPost = ({
  postId,
  userId,
}: {
  postId: string | ObjectId;
  userId: string | ObjectId;
}) => {
  return new Promise<{ post: PostInterface }>(async (resolve, reject) => {
    try {
      const post = await Post.findOne({
        _id: postId,
        user: userId,
      }).populate('user');

      if (!post) {
        throw Errors.NOT_FOUND;
      }
      resolve({ post });
    } catch (err) {
      reject(err);
    }
  });
};

export const updatePost = ({
  postId,
  userId,
  updates = {},
  whiteList = [],
}: {
  postId: string | ObjectId;
  userId: string | ObjectId;
  updates: { [key: string]: unknown };
  whiteList: string[];
}) => {
  return new Promise<{ post: PostInterface }>(async (resolve, reject) => {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: postId, user: userId },
        {
          $set: whiteList.map((x) => updates[x]).filter((x) => !!x),
        },
        { new: true }
      );
      if (!post) {
        throw Errors.NOT_FOUND;
      }
      resolve({ post });
    } catch (err) {
      reject(err);
    }
  });
};

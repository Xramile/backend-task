import { Errors } from '../shared/errors';
import { Post } from '../models';
import { PostInterface } from '../shared/types/Post';
import { PaginationInterface } from '../shared/types/pagination';

export const createPost = (post: PostInterface) => {
  return new Promise<{ post: PostInterface }>(async (resolve, reject) => {
    try {
      const newPost = new Post(post);
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
    userId?: string;
  };
  sort?: {
    sortBy: keyof PostInterface;
    sortType: 1 | -1;
  };
  page: number;
  limit: number;
}) => {
  return new Promise<{
    posts: PostInterface[];
    pagination: PaginationInterface;
  }>(async (resolve, reject) => {
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
            $expr: {
              $eq: [{ $toString: '$user' }, queryData.userId],
            },
          }
        : {}),
    };
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
            from: 'users',
            let: {
              userId: '$user',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$userId'],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  email: 1,
                },
              },
            ],
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
      ]);

      pagination.count = posts.length;

      resolve({ posts, pagination });
    } catch (err) {
      reject(err);
    }
  });
};

export const getPost = (postId: string) => {
  return new Promise<{ post: PostInterface }>(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId).populate(
        'user',
        '_id name email'
      );

      if (!post) {
        throw Errors.NOT_FOUND;
      }
      resolve({ post });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
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
  postId: string;
  userId: string;
  updates: { [key: string]: unknown };
  whiteList: string[];
}) => {
  return new Promise<{ post: PostInterface }>(async (resolve, reject) => {
    const allowedUpdates = Object.fromEntries(
      whiteList.map((x) => [x, updates[x]]).filter(([key, value]) => !!value)
    );
    try {
      const post = await Post.findOneAndUpdate(
        { _id: postId, user: userId },
        { $set: allowedUpdates },
        { new: true }
      );
      if (!post) {
        throw Errors.NOT_FOUND;
      }
      resolve({ post });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.kind === 'ObjectId') {
        reject(Errors.NOT_FOUND);
      }
      reject(err);
    }
  });
};

export const deletePost = ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const post = await Post.deleteOne({ _id: postId, user: userId });
      if (post.deletedCount === 0) {
        throw Errors.NOT_FOUND;
      }
      resolve(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.kind === 'ObjectId') {
        reject(Errors.NOT_FOUND);
      }
      reject(err);
    }
  });
};

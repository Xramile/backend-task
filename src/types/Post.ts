import { User } from './user';
import { ObjectId } from 'mongoose';

export interface Post {
  user: ObjectId | User;
  title: string;
  content: string;
}

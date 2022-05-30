import { UserInterface } from './user';
import { ObjectId } from 'mongoose';

export interface PostInterface {
  user: ObjectId | UserInterface;
  title: string;
  content: string;
}

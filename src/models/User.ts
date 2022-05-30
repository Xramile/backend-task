import { UserInterface } from '../shared/types/user';
import mongoose, {
  CallbackError,
  CallbackWithoutResultAndOptionalError,
} from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function (): UserInterface {
  const user: UserInterface = this.toObject();
  delete user.hash;
  return user;
};

userSchema.pre(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError): Promise<void> {
    try {
      // only hash the password if it has been modified (or is new)
      if (this.isModified('hash')) {
        const hash = await bcrypt.hash(this.hash, 10);
        this.hash = hash;
      }

      return next();
    } catch (err) {
      return next(err as CallbackError);
    }
  }
);

userSchema.methods.isValidPass = async function (
  password: string
): Promise<boolean | Error> {
  try {
    return await bcrypt.compare(password, this.hash);
  } catch (err) {
    return err as Error;
  }
};

const User = mongoose.model('User', userSchema);

export default User;

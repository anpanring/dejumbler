import { Schema, Types, model, models } from 'mongoose';
import { IUser } from './definitions.types';

// Password will be hashed, Users authenticated w/ passport.js
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true }, // hashed
  lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
});

export default models.User || model<IUser>('User', UserSchema);

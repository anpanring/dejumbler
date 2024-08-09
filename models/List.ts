import { Schema, Types, model, models } from 'mongoose';
import { ItemSchema } from './Item';
import { IList } from './definitions.types';

import URLSlugs from 'mongoose-url-slugs';

const ListSchema = new Schema<IList>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Books', 'Movies', 'Music', 'Any'],
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  items: [ItemSchema],
});

ListSchema.plugin(URLSlugs('name'));

export default models.List || model<IList>('List', ListSchema);

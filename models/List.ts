import { Schema, Types, model, models } from "mongoose";
import { ItemSchema } from "./Item";

const URLSlugs = require('mongoose-url-slugs')

const ListSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Books", "Movies", "Music", "Any"]
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date, required: true
    },
    items: [ItemSchema],
});

ListSchema.plugin(URLSlugs('name'));

export default models.List || model('List', ListSchema);
import mongoose from "mongoose";
import { ItemSchema } from "./Item";

const ListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    type: { type: String, enum: ["Books", "Movies", "Music", "Any"] },
    description: { type: String },
    createdAt: { type: Date, required: true },
    items: [ItemSchema]
});

export default mongoose.models.List || mongoose.model('List', ListSchema);
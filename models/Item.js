import mongoose from "mongoose";

//Generic Item object, contains general properties shared by all types of Items
export const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artURL: { type: String },
    status: {
        type: String, enum: ["todo", "in progress", "done"],
        default: false, required: true
    },
    notes: { type: String }
}, {
    _id: true
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
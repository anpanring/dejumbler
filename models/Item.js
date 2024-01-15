import mongoose from "mongoose";

// Generic Item object, contains general properties shared by all types of Items
export const ItemSchema = new mongoose.Schema({
    // Name of the item
    name: {
        type: String,
        required: true
    },

    // URL for artwork
    artURL: {
        type: String
    },

    // To-do status - in future, allow people to choose their own statuses
    status: {
        type: String, enum: ["todo", "in progress", "done"],
        default: false, required: true
    },
    notes: {
        type: String
    }
}, {
    _id: true
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
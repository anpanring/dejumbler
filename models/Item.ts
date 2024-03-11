import { model, models, Schema } from "mongoose";
import { IItem } from "./definitions.types";

// Generic Item object, contains general properties shared by all types of Items
export const ItemSchema = new Schema<IItem>({
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
        type: String,
        enum: ["todo", "in progress", "done"],
        default: "todo",
        required: true
    },
    notes: {
        type: String
    }
}, {
    _id: true
});

export default models.Item || model<IItem>('Item', ItemSchema);
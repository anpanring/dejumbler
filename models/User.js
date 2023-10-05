import mongoose from "mongoose";

// Password will be hashed, Users authenticated w/ passport.js
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }, //hashed
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
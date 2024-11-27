import mongoose from "mongoose";

const termsSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,

    },
    definition: {
        type: String,
        required: true,

    },
    example: {
        type: String,
        required: true,

    },
    author: {
        type: String,
        required: true,

    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    upvotersId: {
        type: String,
    },
    downvotersId: {
        type: String,
    },

}, { timestamps: true })



const Terms = mongoose.models.Terms || mongoose.model("Terms", termsSchema)

export default Terms;
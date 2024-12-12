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
    upvoterIds: [{
        type: String,
    }],
    downvoterIds: [{
        type: String,
    }],
}, { timestamps: true });

// Add pre-save hook to update vote counts
termsSchema.pre('save', function (next) {
    // Make sure arrays exist
    if (!this.upvoterIds) this.upvoterIds = [];
    if (!this.downvoterIds) this.downvoterIds = [];

    // Update vote counts based on array lengths
    this.upvotes = this.upvoterIds.length;
    this.downvotes = this.downvoterIds.length;

    next();
});

const Terms = mongoose.models.Terms || mongoose.model("Terms", termsSchema);

export default Terms;
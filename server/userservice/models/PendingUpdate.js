const mongoose = require("mongoose");

const PendingUpdateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ['change_email'],
            required: true
        },
        data: {
            type: mongoose.Schema.Types.Mixed, // Store dynamic data like { newEmail: '...' }
            required: true
        },
        verificationToken: {
            type: String,
            required: true,
        },
        verificationExpires: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

// TTL index to automatically delete expired records
PendingUpdateSchema.index({ verificationExpires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PendingUpdate", PendingUpdateSchema);

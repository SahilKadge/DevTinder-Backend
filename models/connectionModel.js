import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save middleware
connectionSchema.pre("save", function (next) {
    const connectionRequest = this; // Use `this` directly
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        return next(
            new Error("You cannot send a connection request to yourself.")
        );
    }
    next();
});

const connectionModel = mongoose.model("Connections", connectionSchema);
export default connectionModel;

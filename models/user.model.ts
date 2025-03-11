import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    subscriptionTier: {
      type: String,
      enum: ["free", "basic"],
      default: "free",
    },
    customerId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = models?.User || model("User", UserSchema);

export default User;

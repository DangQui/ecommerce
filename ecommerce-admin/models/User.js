import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String }, // For users who register with email/password
    city: { type: String },
    postalCode: { type: String },
    streetAddress: { type: String },
    country: { type: String },
    stripeCustomerId: { type: String, unique: true, sparse: true }, // For Stripe integration
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Hash password before saving (if applicable)
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = models.User || model("User", UserSchema);
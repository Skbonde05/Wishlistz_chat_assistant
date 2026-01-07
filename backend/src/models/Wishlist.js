import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    images: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);

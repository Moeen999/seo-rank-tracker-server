import mongoose from "mongoose";

const rankEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    position: { type: Number, default: null },
    page: { type: Number, default: null },
    title: { type: String, default: "" },
    snippet: { type: String, default: "" },
  },
  { _id: false },
);

const competitorSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true },
    url: { type: String, required: true },
    domain: { type: String, required: true },
    title: { type: String, default: "" },
    snippet: { type: String, default: "" },
  },
  { _id: false },
);

const keywordTrackingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    keyword: { type: String, required: true, trim: true, lowercase: true },
    url: { type: String, required: true, trim: true },
    domain: { type: String, required: true },
    currentPosition: { type: Number, default: null },
    currentPage: { type: Number, default: null },
    bestPosition: { type: Number, default: null },
    positionChange: { type: Number, default: 0 },
    rankingHistory: [rankEntrySchema],
    competitors: [competitorSchema],
    active: { type: Boolean, default: true },
    lastChecked: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "checking", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

keywordTrackingSchema.index(
  { userId: 1, keyword: 1, domain: 1 },
  { unique: true },
); //todo: --> is line ka matlab hai ki ek user ek hi keyword ke liye ek hi domain ko track kar sakta hai, duplicate entries nahi banengi

const KeywordTracking =
  mongoose.models.KeywordTracking ||
  mongoose.model("KeywordTracking", keywordTrackingSchema);

export default KeywordTracking;

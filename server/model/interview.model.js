
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    timeLimit: {
      type: Number,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    confidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    communication: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    correctness: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    status: {
      type: String,
      enum: ["pending", "answered", "evaluated"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    mode: {
      type: String,
      enum: ["HR", "Technical"],
      required: true,
    },

    resumeText: {
      type: String,
      default: "",
    },

    questions: [questionSchema],

    finalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["incompleted", "completed"],
      default: "incompleted",
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;

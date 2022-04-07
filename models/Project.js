import mongoose from "mongoose"

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryDate: {
      type: Date,
      default: Date.now(),
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //User comes from User.js => const User = mongoose.model("User", userSchema)
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
      }
    ],
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true
  }
)

const Project = mongoose.model("Project", projectSchema)

export default Project

import mongoose from "mongoose";

const workspaceSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "workspace name is required"],
    unique: [true, "workspace name already exists"]
  },
  description: {
    type: String
  },
  members: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
      }
    }
  ],
  joinCode: {
    type: String,
    required: [true, "join code is required"]
  },
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel"
    }
  ]
});

const WorkspaceModel = mongoose.model("Workspace", workspaceSchema);

export default WorkspaceModel;

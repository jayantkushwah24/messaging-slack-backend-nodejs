import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  body: {
    type: string,
    required: [true, "message body is required"]
  },
  image: {
    type: string
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: [true, "channel id is required"]
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "sender id is required"]
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: [true, "workspace id is required"]
  }
});

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;

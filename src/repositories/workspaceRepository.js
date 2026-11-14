import { StatusCodes } from "http-status-codes";
import Workspace from "../schema/workspaceSchema.js";
import clientError from "../utils/errors/clientError.js";
import crudRepository from "./crudRepository.js";
import UserModel from "../schema/userSchema.js";
import channelRepository from "./channelRepository.js";

const workspaceRepository = {
  ...crudRepository(Workspace),

  getWorkspaceByName: async function (workspaceName) {
    const workspace = await Workspace.findOne({ name: workspaceName });
    if (!workspace) {
      throw new clientError({
        explaination: "Invalid data sent from client",
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return workspace;
  },

  getWorkspaceByJoinCode: async function (joinCode) {
    const workspace = await Workspace.findOne({ joinCode });
    if (!workspace) {
      throw new clientError({
        explaination: "Invalid data sent from client",
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return workspace;
  },

  addMemberToWorkspace: async function ({ workspaceId, memberId, role }) {
    const workspace = await Workspace.findById({ workspaceId });
    if (!workspace) {
      throw new clientError({
        explaination: "Invalid data sent from client",
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isValidUser = await UserModel.findById(memberId);
    if (!isValidUser) {
      throw new clientError({
        explaination: "Invalid data sent from client",
        message: "User not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMemberAlreadyPartOfWorkspace = workspace.members.find(
      (member) => member.memberId === memberId
    );
    if (isMemberAlreadyPartOfWorkspace) {
      throw new clientError({
        explaination: "Invalid data sent from client",
        message: "Member already part of Workspace",
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    workspace.members.push({ memberId, role });
    await Workspace.save();
    return workspace;
    // await Workspace.updateOne(
    //   { _id: workspaceId },
    //   { $push: { members: { memberId, role } } }
    // );
  },

  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspace = await Workspace.findById({ workspaceId }).populate(
      "channels"
    );
    if (!workspace) {
      throw new clientError({
        explaination: "Invalid data sent from client",
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
      (channel) => channel.name === channelName
    );
    if (isChannelAlreadyPartOfWorkspace) {
      throw new clientError({
        explaination: "Invalid data sent from client",
        message: "channel already part of Workspace",
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    const channel = await channelRepository.create({
      name: channelName,
      workspaceId
    });
    workspace.channels.push(channel);
    await Workspace.save();
    return workspace;
  },

  fetchAllWorkspaceByMemberID: async function (memberId) {
    const workspaces = await Workspace.find({
      "members.memberId": memberId
    }).populate("members.memberId", "username email avatar");
    return workspaces;
  },

  getWorkspaceDetailsById: async function (workspaceId) {
    const workspace = await Workspace.findById(workspaceId)
      .populate("members.memberId", "username email avatar")
      .populate("channels");

    return workspace;
  }
};

export default workspaceRepository;

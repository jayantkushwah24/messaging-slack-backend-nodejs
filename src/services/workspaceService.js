import channelRepository from "../repositories/channelRepository.js";
import workspaceRepository from "../repositories/workspaceRepository.js";
import { v4 as uuidv4 } from "uuid";
import clientError from "../utils/errors/clientError.js";
import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/userRepository.js";

const isUserAdminOfWorkspace = (workspace, userId) => {
  const response = workspace.members.find(
    (member) =>
      (member.memberId.toString() === userId ||
        member.memberId._id.toString() === userId) &&
      member.role === "admin"
  );
  return response;
};

export const isUserMemberOfWorkspace = (workspace, userId) => {
  return workspace.members.find((member) => {
    return member.memberId._id.toString() === userId;
  });
};

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6);

    const response = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });

    await workspaceRepository.addMemberToWorkspace(
      response._id,
      workspaceData.owner,
      "admin"
    );

    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      response._id,
      "general"
    );

    return updatedWorkspace;
  } catch (error) {
    console.log("Create workspace service error:", error);

    if (error.name === "ValidationError") {
      throw new ValidationError({ error: error.errors }, error.message);
    }

    if (error.name === "MongoServerError" && error.code === 11000) {
      throw new ValidationError({
        error: ["a workspace with same details already exists"]
      });
    }

    throw error;
  }
};

export const getWorkspaceUserIsMemberOfService = async (userId) => {
  try {
    const workspaces =
      await workspaceRepository.fetchAllWorkspaceByMemberID(userId);
    return workspaces;
  } catch (error) {
    console.log("get workspace user is member of service error: ", error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channels);
      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }
    throw new clientError({
      explanation: "User is either not a member or an admin of the workspace",
      message: "User is not allowed to delete the workspace",
      statusCode: StatusCodes.UNAUTHORIZED
    });
  } catch (error) {
    console.log("get workspace user is member of service error: ", error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new clientError({
        explanation: "invalid data sent from the client",
        message: "workspace not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new clientError({
        explanation: "user is not a member of the workspace",
        message: "user is not a member of the workspace",
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    console.log("get Workspace Service error:", error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByJoinCode(joinCode);

    if (!workspace) {
      throw new clientError({
        explanation: "invalid data sent from the client",
        message: "workspace not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new clientError({
        explanation: "user is not a member of the workspace",
        message: "user is not a member of the workspace",
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    console.log("get Workspace by joincode Service error:", error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new clientError({
        explanation: "invalid data sent from the client",
        message: "workspace not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new clientError({
        explanation: "User is not an admin of the workspace",
        message: "User is not allowed to update the workspace",
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );
    return updatedWorkspace;
  } catch (error) {
    console.log("update Workspace Service error:", error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new clientError({
        explanation: "invalid data sent from the client",
        message: "workspace not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new clientError({
        explanation: "User is not an admin of the workspace",
        message: "User is not allowed to update the workspace",
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const isValidUser = await userRepository.findById(memberId);
    if (!isValidUser) {
      throw new clientError({
        explanation: "invalid data sent from the client",
        message: "user not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, memberId);
    if (isMember) {
      throw new clientError({
        explanation: "user is already a member of the workspace",
        message: "user is already a member of the workspace",
        statusCode: StatusCodes.BAD_REQUEST // or StatusCodes.CONFLICT
      });
    }
    const updatedWorkspace = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );
    return updatedWorkspace;
  } catch (error) {
    console.log("add Member To Workspace Service error:", error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new clientError({
        explanation: "invalid data sent from the client",
        message: "workspace not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new clientError({
        explanation: "User is not an admin of the workspace",
        message: "User is not allowed to update the workspace",
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
      (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
    );
    if (isChannelAlreadyPartOfWorkspace) {
      throw new clientError({
        explanation: "invalid data sent from the client",
        message: "channel already part of the workspace",
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return response;
  } catch (error) {
    console.log("add Channel To Workspace Service error:", error);
    throw error;
  }
};

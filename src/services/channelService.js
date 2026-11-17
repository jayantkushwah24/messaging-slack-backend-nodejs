import channelRepository from "../repositories/channelRepository.js";
import clientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getChannelByIdService = async (channelId) => {
  try {
    const channel = await channelRepository.getChannelWithWorkspaceDetails(
      channelId,
      userId
    );
    if (!channel || !channel.workspaceId) {
      throw new clientError({
        explanation: "invalid data sent from the client",
        message: "Channel not found with provided ID",
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isUserPartOfWorkspace = isUserMemberOfWorkspace(
      channel.workspaceId,
      userId
    );
    if (!isUserPartOfWorkspace) {
      throw new clientError({
        explanation:
          "user is not a member of the workspace and hence cannot access the channel",
        message: "user is not a member of the workspace",
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return channel;
  } catch (error) {
    console.log("get Channel By Id error:", error);
    throw error;
  }
};

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import clientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getMessageService = async (messageParams, page, limit, user) => {
  try {
    const channelDetails = channelRepository.getChannelWithWorkspaceDetails(
      messageParams.channelId
    );
    const workspace = channelDetails.workspaceId;
    const isMember = isUserMemberOfWorkspace(workspace, user);
    if (!isMember) {
      throw new clientError({
        explanation: "User is not a member of the workspace",
        message: "User is not a member of the workspace",
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const messages = await messageRepository.getPaginatedMessages(
      messageParams,
      page,
      limit
    );
    return messages;
  } catch (error) {
    console.log(error);
  }
};

export const createMessageService = async (message) => {
  const newMessage = await messageRepository.create(message);

  const messageDetails = await messageRepository.getMessageDetails(
    newMessage._id
  );

  return messageDetails;
};

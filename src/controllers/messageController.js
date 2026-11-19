import { StatusCodes } from "http-status-codes";
import { getMessageService } from "../services/messageService.js";
import { successResponse } from "../utils/common/responseObject.js";

export const getMessagesController = async (req, res) => {
  try {
    if (!req.query.channelId) {
      return res.send(StatusCodes.NOT_FOUND);
    }
    const messages = await getMessageService(
      {
        channelId: req.params.channelId
      },
      req.query.page || 1,
      req.query.limit || 20,
      req.user
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, "messages fetched successfully"));
  } catch (error) {
    console.log("get messages error: ", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/serverConfig.js";
import userRepository from "../repositories/userRepository.js";
import {
  customErrorResponse,
  internalErrorResponse
} from "../utils/common/responseObject.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "Invalid data sent from the client",
          message: "No auth token provided"
        })
      );
    }

    const response = jwt.verify(token, JWT_SECRET);

    if (!response) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "Invalid data sent from the client",
          message: "Invalid auth token provided"
        })
      );
    }

    const user = await userRepository.getById(response.id);
    if (!user) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "Invalid data sent from the client",
          message: "Invalid auth token provided"
        })
      );
    }

    req.user = user.id;
    return next();
  } catch (error) {
    console.log("Auth middleware error", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "Invalid data sent from the client",
          message: "Invalid auth token provided"
        })
      );
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import { customErrorResponse } from "../utils/common/responseObject.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (!(error instanceof ZodError)) {
        return next(error);
      }

      const explanation = error.issues.map((issue) => {
        const path = issue.path.length ? issue.path.join(".") : "request";
        return `${path} ${issue.message}`;
      });

      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: `validation error: ${explanation.join("; ")}`,
          explanation
        })
      );
    }
  };
};

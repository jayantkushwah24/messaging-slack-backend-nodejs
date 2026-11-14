import express from "express";
import { validate } from "../../validators/zodValidator.js";
import {
  addChannelToWorkspaceController,
  addMemberToWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  getWorkspaceUserIsMemberOfController,
  updateWorkspaceController
} from "../../controllers/workspaceController.js";
import {
  addChannelToWorkspaceSchema,
  addMemberToWorkspaceSchema,
  createWorkspaceSchema
} from "../../validators/workspaceSchema.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  validate(createWorkspaceSchema),
  createWorkspaceController
);

router.get("/", isAuthenticated, getWorkspaceUserIsMemberOfController);

router.delete("/:workspaceId", isAuthenticated, deleteWorkspaceController);

router.get("/:workspaceId", isAuthenticated, getWorkspaceController);

router.get(
  "/join/:joinCode",
  isAuthenticated,
  getWorkspaceByJoinCodeController
);

router.put("/:workspaceId", isAuthenticated, updateWorkspaceController);

router.put(
  "/:workspaceId/members",
  isAuthenticated,
  validate(addMemberToWorkspaceSchema),
  addMemberToWorkspaceController
);

router.put(
  "/:workspaceId/members",
  isAuthenticated,
  validate(addChannelToWorkspaceSchema),
  addChannelToWorkspaceController
);
export default router;

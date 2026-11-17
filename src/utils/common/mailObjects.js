import { MAIL_ID } from "../../config/serverConfig.js";

export const workspaceJoinMail = function (workspaceName) {
  return {
    from: MAIL_ID,
    subject: "You have been added to workspace",
    text: `Congratulations! You have been added to workspace ${workspace.name}`
  };
};

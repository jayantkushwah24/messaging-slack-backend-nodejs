import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().optional()
});

export const addMemberToWorkspaceSchema = z.object({
  memberId: z.string(),
  role: z.enum(["admin", "member"]).optional()
});

export const addChannelToWorkspaceSchema = z.object({
  channelName: z.string()
});

export const updateWorkspaceSchema = z
  .object({
    name: z.string().min(3).max(50).optional(),
    description: z.string().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one workspace field must be provided"
  });

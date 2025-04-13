import { z } from 'zod';

export const dialogueSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  npcRole: z.string().min(1, "Role is required"),
  personality: z.string().min(1, "Personality is required"),
  sceneContext: z.string().optional(),
  expectedLength: z
    .number()
    .min(1, "Minimum 1 line")
    .max(3, "Maximum 3 lines")
    .optional(),
    lineStyle: z.enum(["short", "normal", "long"]).optional(),
    model: z.enum([
        "openrouter/optimus-alpha",
        "deepseek/deepseek-chat-v3-0324:free",
        "deepseek/deepseek-r1:free"
    ])
});

export type DialogueSchema = z.infer<typeof dialogueSchema>;

import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(1, { message: "Message must be at least 1 characters long." })
        .max(500, { message: "Message must be at most 500 characters long." }),
});

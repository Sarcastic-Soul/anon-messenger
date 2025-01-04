import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username should not contain special characters" });

export const emailValidation = z
    .string()
    .email({ message: "Invalid email" });

export const passwordValidation = z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" });

export const signUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation,
});

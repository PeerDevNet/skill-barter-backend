import { body } from "express-validator";
import { validateRequest } from "../middlewares/validation.middleware";

export const LoginSchema = [
  body("username").notEmpty().withMessage("This field is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validateRequest, // ! Always add this at the end of the validation chain
];

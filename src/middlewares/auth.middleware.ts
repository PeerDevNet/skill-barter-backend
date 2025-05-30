import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

export const rateLimitMessage = {
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  status: "error",
  error: {
    code: StatusCodes.TOO_MANY_REQUESTS,
    message: "Too many requests, please try again later.",
  },
};

export const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});

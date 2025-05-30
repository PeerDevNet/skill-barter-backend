import express, { Express, Request, Response } from "express";
import logger from "morgan";
import connectDb from "./config/db.config";
import {
  RequestErrorHandler,
  NotFoundErrorHandler,
} from "./middlewares/errors.middleware";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { SuccessResponse } from "./utils/responses";
import { StatusCodes } from "http-status-codes";
import compression from "compression";
import sysLogger from "./utils/logger";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { rateLimitMessage } from "./middlewares/auth.middleware";
import { PORT } from "./utils/constants";

const app: Express = express();

const corsOrigin = [
  "http://localhost:3000",
  "https://localhost:3000",
  "http://localhost:3001",
];

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
  },
  connectionStateRecovery: {
    skipMiddlewares: false,
    maxDisconnectionDuration: 15 * 60 * 1000,
  },
  connectTimeout: 5 * 60 * 1000,
});

app.use(
  cors({
    origin: corsOrigin,
  })
);

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: rateLimitMessage,
});

app.use(rateLimiter);
app.use(helmet());
app.use(logger("combined"));
app.set("port", PORT || 7000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Routes

// TODO

// Metrics endpoint

app.get("/metrics", (req: Request, res: Response) => {
  const response = SuccessResponse({
    status: "success",
    message: "Metrics endpoint is not implemented yet",
    data: null,
  });

  res.status(StatusCodes.OK).json(response);
});

// Middlewares

app.use("*", NotFoundErrorHandler);
app.use(RequestErrorHandler);

// Start server using IIFE

(() => {
  connectDb()
    .then(() => {
      sysLogger.info("Database connection successful");

      server.listen(app.get("port"), () => {
        sysLogger.info(`Server is running on port ${app.get("port")}`);
      });
    })
    .catch((e) => {
      sysLogger.error(`An error occurred connecting to database: ${e}`);
    });
})();

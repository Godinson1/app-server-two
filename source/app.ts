import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import HttpStatus from "http-status-codes";

import { ResponseError, handleError } from "./Error";
import { router as PostRouter } from "./Post/routes";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

//Define Routes
app.use("/posts", PostRouter);

// setting fall back route and message for undefined route
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found") as ResponseError;
  error.status = HttpStatus.NOT_FOUND;
  next(error);
});

//Error handler helper
app.use(
  (
    err: { statusCode: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    handleError(
      { statusCode: HttpStatus.NOT_FOUND, message: "Route not found!" },
      res
    );
    next();
  }
);

// setting fall back message for other uncaught errors in app
app.use(
  (
    error: { message: string; status: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        message: error.message,
      },
    });
    next();
  }
);

export default app;

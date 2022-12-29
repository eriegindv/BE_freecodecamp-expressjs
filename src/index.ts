import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";

import { credentials, verifyJWT } from "~/middlewares";
import { connectDB, corsOptions } from "./config";
import { common } from "./constants";
import { errorHandler, logger } from "./middlewares";
import {
  authRoute,
  employeesRoute,
  logoutRoute,
  refreshRoute,
  registerRout,
  rootRoute,
} from "./routes";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      roles?: Array<number>;
    }
  }
}

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

app.use(logger);

// Handle options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// use static
app.use("/", express.static(path.join(__dirname, "../public")));
app.use("/home", express.static(path.join(__dirname, "../public")));

// parse form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// parse json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.use("/", rootRoute);
app.use("/register", registerRout);
app.use("/auth", authRoute);
app.use("/refresh", refreshRoute);
app.use("/logout", logoutRoute);

app.use(verifyJWT);
app.use("/employees", employeesRoute);

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(common.PORT, () => {
    console.log(`app is listening on port ${common.PORT}`);
  });
});

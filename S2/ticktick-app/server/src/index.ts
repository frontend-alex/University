import './events/index';
import './config/passport';

import cors from "cors";
import http from "http";
import helmet from "helmet";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";

import { db } from "./config/db";
import { router } from "./routes";
import { config } from "./config/config";
import { logger } from "./services/loggerService";
import { errorHandler } from "./middleware/errorHandler";
import { setupSocketServer } from './websockets/socketServer';

dotenv.config();

const app = express();
const PORT = config.PORT;
const server = http.createServer(app);

db();

app.use(helmet());

app.use(
  cors({
    origin: config.URL,
    credentials: true,
  })
);

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      if (req.originalUrl === "/api/stripe/webhook") {
        req.rawBody = buf;
      }
    },
  })
);


app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: config.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.use(errorHandler);

app.use("/", (req, res) => {
  res.send("hello world");
});

setupSocketServer(server)

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import cookieParser from "cookie-parser";
import sequelize from "./config/db";
import { UserTokenPayload } from "./models/User";
import firebaseApp from "./utils/firebase";
import { createServer } from "http";
import { Server } from "socket.io";
import validateUser, { validateUserSocket } from "./middleware/validateUser";
import handlers from "./handlers";

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["https://localhost:5173"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: ["https://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Socket.io connection
// io.engine.use(cookieParser());
// io.engine.use(validateUser);
io.use(validateUserSocket);

io.on("connection", (socket) => {
  handlers(io, socket);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Service is up and running");
});

app.use("/api", router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  res.status(err.status ?? 500).json({
    message: err.message,
    status: err.status ?? 500,
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({
    //   alter: true,
    // });

    firebaseApp;

    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});

//type declarations
declare module "express" {
  interface Request {
    user?: UserTokenPayload;
    storeId?: number;
    productId?: number;
    orderId?: number;
  }
}

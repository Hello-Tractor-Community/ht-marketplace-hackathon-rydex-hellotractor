import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors";
import { verify } from "jsonwebtoken";
import { UserTokenPayload } from "../models/User";
import { ExtendedError, Socket } from "socket.io";

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.token;
  console.log("validateUser middleware", req.cookies);

  // For development purposes, postman does not send cookies in the socket io connection
  if (!token && process.env.NODE_ENV === "development") {
    token = req.headers["x-access-token"] as string;
  }

  if (!token) {
    next(new ApiError(401, "Unauthorized"));
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as UserTokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Unauthorized"));
  }
};

export const validateUserSocket = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  // console.log("validateUserSocket middleware", socket.handshake.headers);
  const cookies = socket.handshake.headers.cookie?.split("; ");

  let token = cookies
    ?.find((cookie) => cookie.startsWith("token="))
    ?.split("token=")[1];

  console.log("token cookie", token);

  if (!token && process.env.NODE_ENV === "development") {
    console.log("token header", socket.handshake.headers["x-access-token"]);
    token = socket.handshake.headers["x-access-token"] as string;
  }

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as UserTokenPayload;
    socket.data = decoded;
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};

export default validateUser;

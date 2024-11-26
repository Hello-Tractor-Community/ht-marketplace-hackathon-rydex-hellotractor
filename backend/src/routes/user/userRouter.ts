import { Router } from "express";
import userAuthRouter from "./auth/userAuthRouter";
import validateUser from "../../middleware/validateUser";
import userChatRouter from "./chat/userChatRouter";

const userRouter = Router();

userRouter.use("/auth", userAuthRouter);
userRouter.use("/chat", validateUser, userChatRouter);

export default userRouter;

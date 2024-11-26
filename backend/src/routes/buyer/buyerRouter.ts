import { Router } from "express";
import buyerAuthRouter from "./auth/buyerAuthRouter";
import validateUser from "../../middleware/validateUser";
import buyerOrderRouter from "./order/buyerOrderRouter";
import buyerChatRouter from "./chat/buyerChatRouter";

const buyerRouter = Router();

buyerRouter.use("/auth", validateUser, buyerAuthRouter);
buyerRouter.use("/order", validateUser, buyerOrderRouter);
buyerRouter.use("/chat", validateUser, buyerChatRouter);

export default buyerRouter;

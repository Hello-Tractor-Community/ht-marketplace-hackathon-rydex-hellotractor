import { Router } from "express";
import sellerAuthRouter from "./auth/sellerAuthRouter";
import validateUser from "../../middleware/validateUser";
import sellerStoreRouter from "./store/sellerStoreRouter";
import sellerChatRouter from "./chat/sellerChatRouter";

const sellerRouter = Router();

sellerRouter.use("/auth", validateUser, sellerAuthRouter);
sellerRouter.use("/store", validateUser, sellerStoreRouter);
sellerRouter.use("/chat", validateUser, sellerChatRouter);

export default sellerRouter;

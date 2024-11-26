import { Router } from "express";
import sellerAuthRouter from "./auth/sellerAuthRouter";
import validateUser from "../../middleware/validateUser";
import sellerStoreRouter from "./store/sellerStoreRouter";

const sellerRouter = Router();

sellerRouter.use("/auth", validateUser, sellerAuthRouter);
sellerRouter.use("/store", validateUser, sellerStoreRouter);

export default sellerRouter;

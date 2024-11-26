import { Router } from "express";
import buyerRouter from "./buyer/buyerRouter";
import sellerRouter from "./seller/sellerRouter";
import userRouter from "./user/userRouter";
import productRouter from "./product/productRouter";
import storeRouter from "./store/storeRouter";
import fileRouter from "./file/fileRouter";
import categoryRouter from "./category/categoryRouter";
import miscRouter from "./misc/miscRouter";
import adminRouter from "./admin/adminRouter";

const router = Router();

router.use("/user", userRouter);
router.use("/buyer", buyerRouter);
router.use("/seller", sellerRouter);
router.use("/product", productRouter);
router.use("/store", storeRouter);
router.use("/file", fileRouter);
router.use("/category", categoryRouter);
router.use("/misc", miscRouter);
router.use("/admin", adminRouter);

export default router;

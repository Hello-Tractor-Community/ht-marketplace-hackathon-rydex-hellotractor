import { Request, Router } from "express";
import { extendedParser } from "../../../utils/queryParser";
import { Seller } from "../../../models/Seller";

const sellerStoreRouter = Router();

sellerStoreRouter.get("/", async (req: Request, res, next) => {
  try {
    const parsed = extendedParser(req);
    const seller = await Seller.findByPk(req.user?.data?.sellerId);
    const stores = await seller?.$get("stores", parsed.data);
    res.json(stores);
  } catch (error) {
    next(error);
  }
});

export default sellerStoreRouter;

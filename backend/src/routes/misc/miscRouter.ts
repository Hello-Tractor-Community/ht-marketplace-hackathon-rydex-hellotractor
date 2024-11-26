import { Router } from "express";
import Region from "../../models/Region";
import DealerType from "../../models/DealerType";

const miscRouter = Router();

miscRouter.get("/regions", async (req, res, next) => {
  const regions = await Region.findAll();
  res.json(regions);
});

miscRouter.get("/dealerTypes", async (req, res, next) => {
  const dealerTypes = await DealerType.findAll();
  res.json(dealerTypes);
});

export default miscRouter;

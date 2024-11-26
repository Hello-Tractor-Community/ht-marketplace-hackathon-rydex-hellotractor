import { Request, Router } from "express";
import { extendedParser } from "../../../utils/queryParser";
import { Admin } from "../../../models/Admin";
import { ApiError } from "../../../utils/errors";
import { Order } from "../../../models/Order";
import { OrderProduct } from "../../../models/OrderProduct";

const adminOrdersRouter = Router();

adminOrdersRouter.get("/", async (req: Request, res, next) => {
  try {
    const parsed = extendedParser(req);

    const admin = await Admin.findByPk(req.user?.data.adminId, {});
    if (!admin) {
      throw new ApiError(401, "Unauthorized");
    }

    const orders = await Order.findAll({
      ...parsed.data,
      include: [OrderProduct, ...(parsed.data?.include ?? [])],
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

export default adminOrdersRouter;

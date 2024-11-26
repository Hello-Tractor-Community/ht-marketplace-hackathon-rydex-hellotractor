import { Request, Router } from "express";
import validateUser from "../../middleware/validateUser";
import dayjs from "dayjs";
import { ApiError } from "../../utils/errors";
import { Admin } from "../../models/Admin";
import { Order } from "../../models/Order";
import { col, fn, Op } from "sequelize";
import adminAuthRouter from "./auth/adminAuthRouter";
import adminProductRouter from "./product/adminProductRouter";
import adminOrdersRouter from "./orders/adminOrdersRouter";

const adminRouter = Router();

adminRouter.use("/auth", validateUser, adminAuthRouter);
adminRouter.use("/product", validateUser, adminProductRouter);
adminRouter.use("/order", validateUser, adminOrdersRouter);

adminRouter.get("/dashboard", validateUser, async (req: Request, res, next) => {
  try {
    const {
      from = dayjs().startOf("week").format("YYYY-MM-DD"),
      to = dayjs().endOf("week").format("YYYY-MM-DD"),
    } = req.query;

    if (typeof from !== "string" || typeof to !== "string") {
      throw new ApiError(400, "Invalid date format");
    }
    const admin = await Admin.findByPk(req.user?.data?.adminId);

    if (!admin) {
      throw new ApiError(404, "Seller not found");
    }

    const orderRecords = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      attributes: [
        [fn("date", col("createdAt")), "date"],
        [fn("sum", col("priceTotal")), "priceTotal"],
        [fn("count", col("id")), "count"],
      ],
      group: [col("date")],
      order: [[col("date"), "ASC"]],
    });

    const length = dayjs(to).diff(dayjs(from), "day") + 1;

    const orders = new Array(length).fill(0).map((_, index) => {
      const date = dayjs(from).add(index, "day").format("YYYY-MM-DD");

      const order = orderRecords.find(
        (order) => order.getDataValue("date" as any) === date
      );

      return {
        date,
        priceTotal: order ? order.getDataValue("priceTotal" as any) : 0,
        count: order ? parseInt(order.getDataValue("count" as any)) : 0,
      };
    });

    // const orders = orderRecords.map((order) => ({
    //   date: order.getDataValue("date" as any),
    //   priceTotal: order.getDataValue("priceTotal" as any),
    //   count: parseInt(order.getDataValue("count" as any)),
    // }));

    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

export default adminRouter;

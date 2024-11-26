import { Request, Router } from "express";
import { Store } from "../../models/Store";
import { ApiError } from "../../utils/errors";
import validateUser from "../../middleware/validateUser";
import { Seller } from "../../models/Seller";
import storeOrderRouter from "./order/storeOrderRouter";
import storeProductRouter from "./product/storeProductRouter";
import { col, fn, Op } from "sequelize";
import dayjs from "dayjs";
import { extendedParser } from "../../utils/queryParser";

const parser: any = require("@bitovi/sequelize-querystring-parser");

const storeRouter = Router();

storeRouter.get("/", async (req, res, next) => {
  try {
    console.log("req.query in store router", req.url.split("?")[1]);

    const parsed = extendedParser(req);

    console.log("parsed in store router", parsed.data);

    const { limit, order, offset, ...totalQuery } = parsed.data;

    const total = await Store.count({
      ...totalQuery,
    });

    const stores = await Store.findAll({
      ...parsed.data,
    });

    res.json({ stores, total });
  } catch (error) {
    next(error);
  }
});

storeRouter.get("/:id", async (req, res, next) => {
  try {
    const store = await Store.findByPk(req.params.id);

    if (!store) {
      throw new ApiError(404, "Store not found");
    }

    res.json(store);
  } catch (error) {
    next(error);
  }
});

storeRouter.get(
  "/:id/dashboard",
  validateUser,
  async (req: Request, res, next) => {
    try {
      const {
        from = dayjs().startOf("week").format("YYYY-MM-DD"),
        to = dayjs().endOf("week").format("YYYY-MM-DD"),
      } = req.query;

      if (typeof from !== "string" || typeof to !== "string") {
        throw new ApiError(400, "Invalid date format");
      }
      const seller = await Seller.findByPk(req.user?.data?.sellerId);

      if (!seller) {
        throw new ApiError(404, "Seller not found");
      }

      const stores = await seller.$get("stores", {
        where: {
          id: req.params.id,
        },
      });

      if (stores.length === 0) {
        throw new ApiError(404, "Store not found");
      }

      const store = stores[0];

      const orderRecords = await store.$get("orders", {
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
  }
);

storeRouter.post("/", validateUser, async (req: Request, res, next) => {
  try {
    const seller = await Seller.findByPk(req.user?.data?.sellerId);

    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }

    const store = await seller.$create("store", {
      ...req.body,
    });
    res.status(201).json(store);
  } catch (error) {
    next(error);
  }
});

storeRouter.put("/:id", validateUser, async (req: Request, res, next) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        {
          model: Seller,
          where: {
            id: req.user?.data?.sellerId,
          },
        },
      ],
    });

    if (!store) {
      throw new ApiError(404, "Store not found");
    }

    await store.update(req.body);
    res.json(store);
  } catch (error) {
    next(error);
  }
});

storeRouter.use(
  "/:id/order",
  validateUser,
  (req: Request, res, next) => {
    req.storeId = parseInt(req.params.id);

    next();
  },
  storeOrderRouter
);

storeRouter.use(
  "/:id/product",
  validateUser,
  (req: Request, res, next) => {
    req.storeId = parseInt(req.params.id);

    next();
  },
  storeProductRouter
);

export default storeRouter;

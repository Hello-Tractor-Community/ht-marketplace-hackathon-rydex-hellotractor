import { Request, Router } from "express";
import { Seller } from "../../../models/Seller";
import { Store } from "../../../models/Store";
import { Order } from "../../../models/Order";
import { ApiError } from "../../../utils/errors";
import { OrderProduct } from "../../../models/OrderProduct";
import { extendedParser } from "../../../utils/queryParser";
import storeOrderProductRouter from "./orderProduct/storeOrderProductRoter";
const parser: any = require("@bitovi/sequelize-querystring-parser");

const storeOrderRouter = Router();

storeOrderRouter.get("/", async (req: Request, res, next) => {
  try {
    console.log("req.query in storeOrderRouter", req.url.split("?")[1]);

    const parsed = extendedParser(req);

    console.log("parsed in storeOrderRouter", parsed.data);

    console.log("storeparams", req.storeId);

    const seller = await Seller.findByPk(req.user?.data.sellerId, {
      include: [
        {
          model: Store,

          where: {
            id: req.storeId,
          },
        },
      ],
    });
    if (!seller || !seller.stores?.length) {
      throw new ApiError(401, "Seller/Store not found");
    }

    const store = seller.stores[0];
    const orders = await store.$get("orders", {
      ...parsed.data,
      include: [OrderProduct, ...(parsed.data?.include ?? [])],
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

storeOrderRouter.get("/:id", async (req: Request, res, next) => {
  try {
    console.log("req.query in storeOrderRouter", req.url.split("?")[1]);

    const parsed = extendedParser(req);

    console.log("parsed in storeOrderRouter", parsed.data);

    console.log("storeparams", req.storeId);

    const seller = await Seller.findByPk(req.user?.data.sellerId, {
      include: [
        {
          model: Store,
          include: [
            {
              model: Order,
              ...parsed.data,
              where: {
                id: req.params.id,
              },
              include: [OrderProduct, ...(parsed.data?.include ?? [])],
            },
          ],
          where: {
            id: req.storeId,
          },
        },
      ],
    });
    if (!seller || !seller.stores?.length) {
      throw new ApiError(401, "Seller/Store not found");
    }
    const order = seller.stores[0].orders?.[0];

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

storeOrderRouter.put("/:id", async (req: Request, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const seller = await Seller.findByPk(req.user?.data.sellerId, {
      include: [
        {
          model: Store,
          include: [
            {
              model: Order,
              where: {
                id,
              },
              include: [OrderProduct],
            },
          ],
          where: {
            id: req.storeId,
          },
        },
      ],
    });

    if (!seller || !seller.stores?.length) {
      throw new ApiError(401, "Seller/Store not found");
    }

    const order = seller.stores[0].orders?.[0];
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    await order.update(body, {
      include: [OrderProduct],
    });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

storeOrderRouter.delete("/:id", async (req: Request, res, next) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findByPk(req.user?.data.sellerId, {
      include: [
        {
          model: Store,
          include: [
            {
              model: Order,
              where: {
                id,
              },
            },
          ],
          where: {
            id: req.storeId,
          },
        },
      ],
    });

    if (!seller || !seller.stores?.length) {
      throw new ApiError(401, "Seller/Store not found");
    }

    const order = seller.stores[0].orders?.[0];
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    await order.destroy({});
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

storeOrderRouter.use(
  "/:id/product",
  (req: Request, res, next) => {
    req.orderId = parseInt(req.params.id);

    next();
  },
  storeOrderProductRouter
);

export default storeOrderRouter;

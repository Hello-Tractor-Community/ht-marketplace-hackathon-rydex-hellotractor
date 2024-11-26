import { Request, Router } from "express";
import { Buyer } from "../../../models/Buyer";
import { ApiError } from "../../../utils/errors";
import { OrderProduct } from "../../../models/OrderProduct";
import { extendedParser } from "../../../utils/queryParser";
import { ProductReview } from "../../../models/ProductReview";
import Product from "../../../models/Product";
import { Order } from "../../../models/Order";

const parser: any = require("@bitovi/sequelize-querystring-parser");

const buyerOrderRouter = Router();

// orderRouter.use(validateUser);
buyerOrderRouter.post("/", async (req: Request, res, next) => {
  try {
    const buyer = await Buyer.findByPk(req.user?.data.buyerId);
    if (!buyer) {
      throw new ApiError(401, "Buyer not found");
    }

    const payload = req.body;

    payload.orderProducts = await Promise.all(
      payload.orderProducts.map(async (orderProduct: any) => {
        const product = await Product.findByPk(orderProduct.productId);
        return {
          ...orderProduct,
          pricePerUnit: product?.price,
        };
      })
    );

    delete payload.id;
    delete payload.status;
    delete payload.priceTotal;

    console.log(
      "post buyerOrderRouter  payload",
      JSON.stringify(payload, null, 2)
    );

    const order = await buyer.$create(
      "order",
      {
        ...payload,
      },
      {
        include: [OrderProduct],
      }
    );

    await order.reload({
      include: [OrderProduct],
    });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

buyerOrderRouter.get("/", async (req: Request, res, next) => {
  try {
    const parsed = extendedParser(req);

    const buyer = await Buyer.findByPk(req.user?.data.buyerId);
    if (!buyer) {
      throw new ApiError(401, "Buyer not found");
    }
    const orders = await buyer.$get("orders", {
      ...parsed.data,
      include: [OrderProduct, ...parsed.data?.include],
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

buyerOrderRouter.get("/:id", async (req: Request, res, next) => {
  try {
    const parsed = extendedParser(req);

    const buyer = await Buyer.findByPk(req.user?.data.buyerId);
    if (!buyer) {
      throw new ApiError(401, "Buyer not found");
    }
    const orders = await buyer.$get("orders", {
      include: [OrderProduct],
      ...parsed.data,
      where: {
        id: req.params.id,
      },
    });

    if (!orders?.[0]) {
      throw new ApiError(404, "Order not found");
    }

    res.status(200).json(orders?.[0]);
  } catch (error) {
    next(error);
  }
});

buyerOrderRouter.put("/:id", async (req: Request, res, next) => {
  try {
    const buyer = await Buyer.findByPk(req.user?.data.buyerId);

    if (!buyer) {
      throw new ApiError(401, "Buyer not found");
    }
    const orders = await buyer.$get("orders", {
      where: {
        id: req.params.id,
      },
      include: [OrderProduct],
    });

    if (!orders?.[0]) {
      throw new ApiError(404, "Order not found");
    }

    const acceptedPayload = {
      status: req.body.status,
    };

    if (acceptedPayload.status !== "CANCELLED") {
      throw new ApiError(400, "Invalid status");
    }

    if (orders[0].status !== "PENDING") {
      throw new ApiError(400, "Cannot cancel order");
    }
    const order = await orders[0].update(acceptedPayload);

    await order.reload({
      include: [OrderProduct],
    });

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

buyerOrderRouter.post("/:orderId/review", async (req: Request, res, next) => {
  try {
    const buyer = await Buyer.findByPk(req.user?.data.buyerId);
    if (!buyer) {
      throw new ApiError(401, "Buyer not found");
    }

    const { orderId } = req.params;
    const { productId, rating, comment } = req.body;

    const order = await Order.findOne({
      where: { id: orderId, buyerId: buyer.id, status: "DELIVERED" },
      include: [OrderProduct],
    });

    if (!order) {
      throw new ApiError(404, "Order is not found or not yet delivered");
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const existingReview = await ProductReview.findOne({
      where: {
        orderId: order.id,
        productId: product.id,
      },
    });

    if (existingReview) {
      throw new ApiError(400, "Review already exists");
    }

    const review = await ProductReview.create({
      orderId: order.id,
      productId: product.id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

export default buyerOrderRouter;

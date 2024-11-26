import { Request, Router } from "express";
import { Seller } from "../../../../models/Seller";
import { Store } from "../../../../models/Store";
import Product from "../../../../models/Product";
import { ApiError } from "../../../../utils/errors";
import { OrderProduct } from "../../../../models/OrderProduct";

const productInventoryRouter = Router();

productInventoryRouter.post("/", async (req: Request, res, next) => {
  try {
    const seller = await Seller.findByPk(req.user?.data.sellerId, {
      include: [
        {
          model: Store,

          include: [
            {
              model: Product,
              where: {
                id: req.productId,
                trackInventory: true,
              },
              attributes: {
                include: ["stockCount"],
              },
            },
          ],
        },
      ],
    });

    const product = seller?.stores?.[0]?.products?.[0];

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const promises = [];
    const params = Array.isArray(req.body) ? req.body : [req.body];

    for (const param of params) {
      promises.push(
        (async () => {
          if (param.orderId) {
            const existingInventory = await product.$get("inventory", {
              where: {
                orderId: param.orderId,
                productId: product.id,
              },
            });

            if (existingInventory.length) {
              throw new ApiError(
                400,
                "Inventory already updated for this product"
              );
            }
          }

          if (product.stockCount - param.amountOut < 0) {
            throw new ApiError(400, "Not enough stock");
          }

          const inventory = await product.$create("inventory", param);

          if (param.orderId) {
            const orderProduct = await OrderProduct.findOne({
              where: {
                orderId: param.orderId,
                productId: product.id,
              },
            });
            if (!orderProduct) {
              throw new ApiError(404, "Order product not found");
            }
            orderProduct.productInventoryId = inventory.id;
            await orderProduct.save();
          }

          return inventory;
        })()
      );
    }

    const results = await Promise.all(promises);
    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
});

export default productInventoryRouter;

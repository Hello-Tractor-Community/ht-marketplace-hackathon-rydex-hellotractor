import { Request, Router } from "express";
import { OrderProduct } from "../../../../models/OrderProduct";
import { Order } from "../../../../models/Order";
import { ApiError } from "../../../../utils/errors";

const storeOrderProductRouter = Router();

storeOrderProductRouter.put(
  "/:orderProductId",
  async (req: Request, res, next) => {
    try {
      const { orderProductId } = req.params;
      const { body } = req;

      const orderProduct = await OrderProduct.findOne({
        where: {
          productId: orderProductId,
          productInventoryId: null,
        },
        include: [
          {
            model: Order,
            where: {
              storeId: req.storeId,
              id: req.orderId,
            },
          },
        ],
      });

      if (!orderProduct) {
        throw new ApiError(404, "OrderProduct not found");
      }

      await orderProduct.update(body);

      res.status(200).json(orderProduct);
    } catch (error) {
      next(error);
    }
  }
);

export default storeOrderProductRouter;

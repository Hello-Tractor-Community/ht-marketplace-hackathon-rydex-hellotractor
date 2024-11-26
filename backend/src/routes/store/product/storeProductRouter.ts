import { Request, Router } from "express";
import { Seller } from "../../../models/Seller";
import { Store } from "../../../models/Store";
import Product from "../../../models/Product";
import { ApiError } from "../../../utils/errors";
import productInventoryRouter from "./productInventory/productInventoryRouter";
import { extendedParser } from "../../../utils/queryParser";
const parser: any = require("@bitovi/sequelize-querystring-parser");

const storeProductRouter = Router();

storeProductRouter.get("/", async (req: Request, res, next) => {
  try {
    console.log("req.query in storeProductRouter", req.url.split("?")[1]);

    const parsed = extendedParser(req);

    console.log("parsed in storeProductRouter", parsed.data);

    const seller = await Seller.findByPk(req.user?.data.sellerId, {
      include: [
        {
          model: Store,
          include: [
            {
              model: Product,
              ...parsed.data,
              attributes: {
                include: ["views", "clicks", "trackInventory", "stockCount"],
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
    const products = seller.stores[0].products;

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

storeProductRouter.get("/:productId", async (req: Request, res, next) => {
  try {
    console.log("req.query in storeProductRouter", req.url.split("?")[1]);

    const parsed = extendedParser(req);
    console.log("parsed in storeProductRouter", parsed.data);

    const seller = await Seller.findByPk(req.user?.data.sellerId, {
      include: [
        {
          model: Store,
          include: [
            {
              model: Product,
              ...parsed.data,
              where: {
                id: req.params.productId,
              },
              attributes: {
                include: ["views", "clicks", "trackInventory", "stockCount"],
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
    const products = seller.stores[0].products?.[0];

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

storeProductRouter.post("/", async (req: Request, res, next) => {
  try {
    const seller = await Seller.findByPk(req.user?.data.sellerId);

    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }
    const stores = await seller.$get("stores", {
      where: {
        id: req.storeId,
      },
    });

    if (!stores?.length) {
      throw new ApiError(404, "Store not found");
    }

    const product = await Product.create({
      ...req.body,
      storeId: req.storeId,
      status: "PENDING_APPROVAL",
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

storeProductRouter.put(
  "/:id",

  async (req: Request, res, next) => {
    try {
      const seller = await Seller.findByPk(req.user?.data.sellerId);

      if (!seller) {
        throw new ApiError(404, "Seller not found");
      }

      const stores = await seller.$get("stores", {
        where: {
          id: req.storeId,
        },
        include: [
          {
            model: Product,
            where: {
              id: req.params.id,
            },
          },
        ],
      });

      if (!stores?.length) {
        throw new ApiError(404, "Store not found");
      }

      const product = stores[0].products?.[0];

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      await product.update({
        ...req.body,
      });

      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

storeProductRouter.delete(
  "/:id",

  async (req: Request, res, next) => {
    try {
      const seller = await Seller.findByPk(req.user?.data.sellerId);

      if (!seller) {
        throw new ApiError(404, "Seller not found");
      }

      const stores = await seller.$get("stores", {
        where: {
          id: req.storeId,
        },
        include: [
          {
            model: Product,
            where: {
              id: req.params.id,
            },
          },
        ],
      });

      if (!stores?.length) {
        throw new ApiError(404, "Store/Product not found");
      }

      const product = stores[0].products?.[0];

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      await product.destroy();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

storeProductRouter.use(
  "/:id/inventory",
  (req: Request, res, next) => {
    req.productId = parseInt(req.params.id);

    next();
  },
  productInventoryRouter
);
export default storeProductRouter;

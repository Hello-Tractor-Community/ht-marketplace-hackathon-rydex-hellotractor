import { Request, Router } from "express";
import Product from "../../models/Product";
import { ApiError } from "../../utils/errors";
import { extendedParser } from "../../utils/queryParser";
import { col, Op, where } from "sequelize";
import SubCategoryProduct from "../../models/SubCategoryProduct";
import SubCategory from "../../models/SubCategory";
import Category from "../../models/Category";
import { ProductReview } from "../../models/ProductReview";
import { Order } from "../../models/Order";
import { Buyer } from "../../models/Buyer";
import { User } from "../../models/User";
const parser: any = require("@bitovi/sequelize-querystring-parser");

const productRouter = Router();

productRouter.get("/", async (req: Request, res, next) => {
  try {
    console.log("req.query in product router", req.url.split("?")[1]);

    const parsed = extendedParser(req);
    console.log(
      "parsed in product router",
      JSON.stringify(parsed.data, null, 2)
    );

    delete parsed.data?.include;
    delete parsed.data?.attributes;

    parsed.data.where = {
      ...parsed.data.where,
      status: "ACTIVE",
    };

    if (req.query.specifications) {
      parsed.data.where = {
        ...parsed.data.where,
        [Op.and]: [
          ...(parsed.data?.where?.[Op.and] ?? []),

          where(col("specifications"), "@>", req.query.specifications),
        ],
      };
    }

    parsed.data = {
      ...parsed.data,
      include: [
        {
          model: SubCategory,
          include: [
            {
              model: Category,
            },
          ],
        },
      ],
    };

    let { limit, offset, include, order, ...totalQuery } = parsed.data;

    const total = await Product.count({
      ...totalQuery,
    });

    const allProducts = await Product.findAll(totalQuery);
    const highestPrice = Math.max(...allProducts.map((p) => p.price));
    const lowestPrice = Math.min(...allProducts.map((p) => p.price));

    const products = await Product.findAll({
      ...parsed.data,
    });

    await Product.increment("views", {
      ...parsed.data,
    });

    // console.log("products", products[products.length - 1]?.name);

    res.json({
      total,
      products,
      highestPrice,
      lowestPrice,
    });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: ProductReview,
          include: [
            {
              model: Order,
              include: [
                {
                  model: Buyer,
                  include: [{ model: User, attributes: ["id", "name"] }],
                  attributes: ["id"],
                },
              ],
              attributes: ["id"],
            },
          ],
        },
        {
          model: SubCategory,
          include: [
            {
              model: Category,
            },
          ],
        },
      ],
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    product.increment("clicks");

    res.json(product);
  } catch (error) {
    next(error);
  }
});

export default productRouter;

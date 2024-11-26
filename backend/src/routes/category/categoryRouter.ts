import { Router } from "express";
import Category from "../../models/Category";
import SubCategory from "../../models/SubCategory";
import Product from "../../models/Product";
import { extendedParser, likeHelper } from "../../utils/queryParser";
import SubCategoryProduct from "../../models/SubCategoryProduct";
import { ApiError } from "../../utils/errors";
const parser: any = require("@bitovi/sequelize-querystring-parser");

const categoryRouter = Router();

categoryRouter.get("/", async (req, res, next) => {
  try {
    console.log("req.query in category router", req.url.split("?")[1]);

    const parsed = extendedParser(req);

    console.log("parsed in category router", parsed.data);

    const categories = await Category.findAll(parsed.data);
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

categoryRouter.get("/subCategory", async (req, res, next) => {
  try {
    const parsed = extendedParser(req);

    // delete parsed.data?.attributes;

    const subCategories = await SubCategory.findAll(parsed.data);

    res.json(subCategories);
  } catch (error) {
    next(error);
  }
});

categoryRouter.get("/:id/product", async (req, res, next) => {
  try {
    console.log("req.query in category router", req.url.split("?")[1]);

    const parsed = extendedParser(req);
    console.log("parsed in category router", parsed.data);

    // delete parsed.data?.attributes;

    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: SubCategory,
        },
      ],
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const productQuery = {
      ...parsed.data,
      include: [
        {
          model: SubCategory,
          where: {
            id: category?.subCategories.map((subCategory) => subCategory.id),
          },
          include: [
            {
              model: Category,
            },
          ],
        },
      ],
    };

    const { limit, offset, ...totalQuery } = productQuery;

    console.log("productQuery", productQuery);
    console.log("totalQuery", totalQuery);

    const allProducts = await Product.findAll(totalQuery);
    const total = allProducts.length;
    const highestPrice = Math.max(...allProducts.map((p) => p.price));
    const lowestPrice = Math.min(...allProducts.map((p) => p.price));

    const products = await Product.findAll(productQuery);
    await Product.increment("views", {
      ...productQuery,
      where: {
        ...productQuery.where,
      },
    });

    res.json({
      products,
      total,
      highestPrice,
      lowestPrice,
    });
  } catch (error) {
    next(error);
  }
});

categoryRouter.get("/subCategory/:id/product", async (req, res, next) => {
  try {
    console.log("req.query in category router", req.url.split("?")[1]);

    const parsed = extendedParser(req);
    console.log("parsed in category router", parsed.data);

    // delete parsed.data?.attributes;

    const productQuery = {
      ...parsed.data,
      include: [
        {
          model: SubCategory,
          where: {
            id: req.params.id,
          },
          include: [
            {
              model: Category,
            },
          ],
        },
      ],
    };

    const { limit, offset, ...totalQuery } = productQuery;

    const allProducts = await Product.findAll(totalQuery);
    const total = allProducts.length;
    const highestPrice = Math.max(...allProducts.map((p) => p.price));
    const lowestPrice = Math.min(...allProducts.map((p) => p.price));

    const products = await Product.findAll(productQuery);
    await Product.increment("views", {
      ...productQuery,
      where: {
        ...productQuery.where,
      },
    });

    res.json({
      products,
      total,
      highestPrice,
      lowestPrice,
    });
  } catch (error) {
    next(error);
  }
});

export default categoryRouter;

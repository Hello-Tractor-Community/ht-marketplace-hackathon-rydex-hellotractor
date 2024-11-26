import { Request, Router } from "express";
import { Admin } from "../../../models/Admin";
import { ApiError } from "../../../utils/errors";
import Product from "../../../models/Product";

const adminProductRouter = Router();
adminProductRouter.put(
  "/:id",

  async (req: Request, res, next) => {
    try {
      const admin = await Admin.findByPk(req.user?.data.adminId);

      if (!admin) {
        throw new ApiError(404, "Admin not found");
      }

      const product = await Product.findByPk(req.params.id);

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

export default adminProductRouter;

import { Request, Router } from "express";
import { User } from "../../../models/User";
import { Seller, SellerCreationAttributes } from "../../../models/Seller";
import { ApiError } from "../../../utils/errors";
import validateUser from "../../../middleware/validateUser";
import { Admin } from "../../../models/Admin";

const adminAuthRouter = Router();

adminAuthRouter.post("/create", async (req: Request, res, next) => {
  try {
    const user = await User.findByPk(req.user?.id);

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const adminUser = await User.create({
      ...req.body,
    });
    const admin = await Admin.create({
      userId: adminUser.id,
    });

    await admin.reload({
      include: [User],
    });

    // const userJson = user.toJSON() as Partial<User>;
    // delete userJson.password;

    res.status(201).json(admin.toJSON());
  } catch (error) {
    next(error);
  }
});

adminAuthRouter.get("/me", async (req: Request, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findByPk(req.user.id, {
      include: [Admin],
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default adminAuthRouter;

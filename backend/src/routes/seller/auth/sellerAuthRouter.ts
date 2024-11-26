import { Request, Router } from "express";
import { User } from "../../../models/User";
import { Seller, SellerCreationAttributes } from "../../../models/Seller";
import { ApiError } from "../../../utils/errors";
import validateUser from "../../../middleware/validateUser";

const sellerAuthRouter = Router();

sellerAuthRouter.post("/create", async (req: Request, res, next) => {
  try {
    const user = await User.findByPk(req.user?.id);

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const seller = (await user.$create(
      "seller",
      {} as SellerCreationAttributes
    )) as Seller;

    const token = await seller.createToken();

    // Set a cookie
    res.cookie("token", token, {
      httpOnly: true, // The cookie only accessible by the web server
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    });

    // const userJson = user.toJSON() as Partial<User>;
    // delete userJson.password;

    res.status(201).json(seller.toJSON());
  } catch (error) {
    next(error);
  }
});

sellerAuthRouter.get("/me", async (req: Request, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findByPk(req.user.id, {
      include: [Seller],
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default sellerAuthRouter;

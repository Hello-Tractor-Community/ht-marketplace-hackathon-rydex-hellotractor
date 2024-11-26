import { Request, Router } from "express";
import { User } from "../../../models/User";
import { ApiError } from "../../../utils/errors";
import { Buyer, BuyerCreationAttributes } from "../../../models/Buyer";
import validateUser from "../../../middleware/validateUser";

const buyerAuthRouter = Router();

buyerAuthRouter.post("/create", async (req: Request, res, next) => {
  try {
    let user = await User.findByPk(req.user?.id);

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const buyer = (await user.$create(
      "buyer",
      {} as BuyerCreationAttributes
    )) as Buyer;

    user = await User.findByPk(req.user?.id, {
      include: [Buyer],
    });

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = user.createToken();

    // Set a cookie
    res.cookie("token", token, {
      httpOnly: true, // The cookie only accessible by the web server
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    });

    // const userJson = user.toJSON() as Partial<User>;
    // delete userJson.password;

    res.status(201).json(buyer.toJSON());
  } catch (error) {
    next(error);
  }
});

buyerAuthRouter.get("/me", async (req: Request, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findByPk(req.user.id, {
      include: [Buyer],
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});
export default buyerAuthRouter;

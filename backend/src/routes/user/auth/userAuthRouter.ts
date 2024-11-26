import { Request, Router } from "express";
import { User } from "../../../models/User";
import { ApiError } from "../../../utils/errors";
import validateUser from "../../../middleware/validateUser";
import { Seller } from "../../../models/Seller";
import { Buyer } from "../../../models/Buyer";
import { Admin } from "../../../models/Admin";
import { randomBytes } from "crypto";

const userAuthRouter = Router();

userAuthRouter.post("/login", async (req, res, next) => {
  try {
    const user = await User.validatePassword(req.body.email, req.body.password);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = user.createToken();
    res.cookie("token", token, {
      httpOnly: true, // The cookie only accessible by the web server
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    });

    const userJson = user.toJSON() as Partial<User>;
    delete userJson.password;

    res.status(200).json(userJson);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/register/email", async (req, res, next) => {
  try {
    const user = await User.createFromEmailAndPassword(
      req.body.email,
      req.body.password,
      req.body.name
    );

    const token = user.createToken();

    // Set a cookie
    res.cookie("token", token, {
      httpOnly: true, // The cookie only accessible by the web server
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    });

    const userJson = user.toJSON() as Partial<User>;
    delete userJson.password;

    res.status(201).json(userJson);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/facebook", async (req, res, next) => {
  try {
    const { email, name, accessToken } = req.body;

    const [user, created] = await User.findOrCreate({
      where: {
        email,
      },
      defaults: {
        email,
        name,
        password: randomBytes(20).toString("hex"),
        data: { facebookAccessToken: accessToken },
      },
    });

    const token = user.createToken();

    // Set a cookie
    res.cookie("token", token, {
      httpOnly: true, // The cookie only accessible by the web server
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires after 1 day
    });

    const userJson = user.toJSON() as Partial<User>;
    delete userJson.password;

    res.status(created ? 201 : 200).json(userJson);
  } catch (error) {}
});

userAuthRouter.get("/me", validateUser, async (req: Request, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findByPk(req.user.id, {
      include: [Seller, Buyer, Admin],
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

export default userAuthRouter;

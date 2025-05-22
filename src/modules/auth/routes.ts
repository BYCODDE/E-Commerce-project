import { Router, Request, Response, NextFunction } from "express";
import { register } from "./services/register";
import { validateRequest } from "@/middlewares/validate";
import { registerSchema } from "./schemas/register";
import { serviceWrapper } from "@/utils/serviceWrapper";
import { loginSchema } from "./schemas/login";
import { login } from "./services/login";

const router = Router();

router.post(
  "/register",
  validateRequest({ body: registerSchema }),
  serviceWrapper(async (req: Request, res: Response) => {
    const result = await register(req.body);
    res.status(201).json(result);
  })
);

router.post(
  "/login",
  validateRequest({ body: loginSchema }),
  serviceWrapper(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await login(req.body);
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login  successful", user });
  })
);

export default router;

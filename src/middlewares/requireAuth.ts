import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      res
        .status(401)
        .json({ message: "Unauthorized: no valid access token provided" });
      return;
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as {
      userId: string;
    };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId));

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      phone: user.phone,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid expired token" });
    return;
  }
};

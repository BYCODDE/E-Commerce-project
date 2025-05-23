import { Router } from "express";
import { createCategorySchema } from "./schema/createCategory";
import { createCategory } from "./services/create";
import { requireRole } from "@/middlewares/requireRole";
import { validateRequest } from "@/middlewares/validate";
import { serviceWrapper } from "@/utils/serviceWrapper";

const router = Router();

router.post(
  "/",
  requireRole("ADMIN"),
  validateRequest({ body: createCategorySchema }),
  serviceWrapper(async (req, res) => {
    const result = await createCategory(req.body);
    res.status(201).json(result);
  })
);

export default router;

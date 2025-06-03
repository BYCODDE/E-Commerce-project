import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import authRoutes from "@/modules/auth/routes";
import categoryRoutes from "@/modules/categories/routes";
const swaggerDocument = YAML.load("./swagger/swagger.yaml");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);


app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(err);
  res.status(statusCode).json({ message });
});

export default app;

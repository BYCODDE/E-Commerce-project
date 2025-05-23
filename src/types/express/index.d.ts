import { userRole } from "@/db/schema";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: userRole | string;
        age: number;
        phone: string;
      };
    }
  }
}

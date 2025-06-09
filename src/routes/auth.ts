import { Router } from "express";
import { register } from "../controllers/authController";
const router = Router();

router.post("/register", register);

const authRoutes = router;
export default authRoutes;
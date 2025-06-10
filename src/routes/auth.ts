import { Router } from "express";
import { register,login, logout, refresh } from "../controllers/authController";
const router = Router();

router.post("/register", register);
router.post("/login",login);
router.get("/logout", logout);
router.get("/refresh-token", refresh);

const authRoutes = router;
export default authRoutes;
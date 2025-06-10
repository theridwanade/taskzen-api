import { Router } from "express";
import { register,login, logout } from "../controllers/authController";
const router = Router();

router.post("/register", register);
router.post("/login",login);
router.get("/logout", logout);

const authRoutes = router;
export default authRoutes;
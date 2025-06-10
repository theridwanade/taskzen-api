import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authServices";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    res.status(result!.code).json(result);
    return;
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      code: 500,
      success: false
    })
    return;
  }
}

export const login = async (req: Request, res: Response) => {
  try {
     const result = await loginUser(req.body, res);
    res.status(result!.code).json(result);
    return;
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      code: 500,
      success: false
    });
  }
};
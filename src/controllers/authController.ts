import { Request, Response } from "express";
import { registerUser, loginUser, refreshAccessToken } from "../services/authServices";

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

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.setHeader('Authorization', '');
    res.status(200).json({
      message: "Logged out successfully",
      code: 200,
      success: true
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      code: 500,
      success: false
    });
  }
}

export const refresh = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;
      const result = await refreshAccessToken(refreshToken, res);
      res.status(result!.code).json(result);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
        code: 500,
        success: false
      });
    }
  
} 

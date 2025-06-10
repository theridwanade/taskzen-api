import bcrypt from "bcrypt";
import { prisma } from "../utils/lib";
import jwt from "jsonwebtoken";
import { Response } from "express";
// Define the interface for authentication data

interface AuthData {
  email: string;
  password: string;
}

export const registerUser = async (data: AuthData) => {
  try {
    const { email, password } = data;
    if (!email || !password) {
      return {
        message: "Email and password are required",
        code: 400,
        success: false,
      };
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return {
        message: "User already exists",
        code: 409,
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return {
      message: "User registered successfully",
      code: 201,
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      },
    };
  } catch (error: any) {
    return {
      message: error.message || "Internal Server Error",
      code: 500,
      success: false,
    };
  }
};

export const loginUser = async (data: AuthData, res: Response) => {
  try {
    const { email, password } = data;
    if (!email || !password) {
      return {
        message: "Email and password are required",
        code: 400,
        success: false,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: "User not found",
        code: 404,
        success: false,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        message: "Invalid password",
        code: 401,
        success: false,
      };
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "14d",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2592000000, // 30 days
    });
    res.header("Authorization", `Bearer ${accessToken}`);
    return {
      message: "Login successful",
      code: 200,
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };
  } catch (error: any) {
    return {
      message: error.message || "Internal Server Error",
      code: 500,
      success: false,
    };
  }
};

export const refreshAccessToken = async (
  refreshToken: string,
  res: Response
) => {
  try {
    if (!refreshToken) {
      return {
        message: "Refresh token is required",
        code: 400,
        success: false,
      };
    }
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string);
    } catch (err) {
      return {
        message: "Invalid refresh token",
        code: 401,
        success: false,
      };
    }
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    res.header("Authorization", `Bearer ${newAccessToken}`);
    return {
      message: "Access token refreshed successfully",
      code: 200,
      success: true,
      data: {
        tokens: {
          accessToken: newAccessToken,
        },
      },
    };
  } catch (error: any) {
    return {
      message: error.message || "Internal Server Error",
      code: 500,
      success: false,
    };
  }
};

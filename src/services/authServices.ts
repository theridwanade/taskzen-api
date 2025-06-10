import bcrypt from "bcrypt";
import { prisma } from "../utils/lib";

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

export const loginUser = async (data: AuthData) => {
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

    return {
      message: "Login successful",
      code: 200,
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
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
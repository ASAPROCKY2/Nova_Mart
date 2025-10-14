import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUserService,
  getUserByEmailService,
  verifyUserService,
  userLoginService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  getUserWithOrdersService,
  getUserWithPaymentsService,
  getUserFullDetailsService,
} from "./user.service";
import { sendEmail } from "../../Mailer/mailer";

//
// 🧩 Create a new user
//
export const createUserController = async (req: Request, res: Response) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      contact_phone,
      address,
      city,
      role,
      image_url,
    } = req.body;

    // Check if user exists
    const existingUser = await getUserByEmailService(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = {
      firstname,
      lastname,
      email,
      password: hashedPassword,
      contact_phone,
      address,
      city,
      role: role || "user",
      isVerified: false,
      verificationCode,
      image_url: image_url || null,
    };

    await createUserService(newUser);

    // Send verification email
    if (process.env.NODE_ENV !== "test") {
      await sendEmail(
        email,
        "Verify Your NovaMart Account",
        `Hello ${firstname}, your verification code is ${verificationCode}`,
        `<p>Hello ${firstname},</p><p>Your verification code is: <b>${verificationCode}</b></p>`
      );
    }

    return res.status(201).json({
      message: "User created successfully. Verification code sent to email.",
    });
  } catch (error: any) {
    console.error("❌ Error in createUserController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Login user
//
export const userLoginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await getUserByEmailService(email);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Prepare JWT payload
    const payload = {
      user_id: existingUser.user_id,
      firstname: existingUser.firstname,
      lastname: existingUser.lastname,
      email: existingUser.email,
      contact_phone: existingUser.contact_phone,
      address: existingUser.address,
      city: existingUser.city,
      role: existingUser.role,
      image_url: existingUser.image_url,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // expires in 1 hour
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not defined in environment.");

    const token = jwt.sign(payload, secret);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
    });
  } catch (error: any) {
    console.error("❌ Error in userLoginController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Verify user
//
export const verifyUserController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await verifyUserService(email);
    return res.status(200).json({ message: "User verified successfully" });
  } catch (error: any) {
    console.error("❌ Error in verifyUserController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get all users
//
export const getUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getUsersService();
    return res.status(200).json({ data: users });
  } catch (error: any) {
    console.error("❌ Error in getUsersController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get user by ID
//
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

    const user = await getUserByIdService(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ data: user });
  } catch (error: any) {
    console.error("❌ Error in getUserByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Update user
//
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

    const updates: any = { ...req.body };

    // Hash password if provided
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await updateUserService(id, updates);
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("❌ Error in updateUserController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Delete user
//
export const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

    await deleteUserService(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error in deleteUserByIdController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get user with orders
//
export const getUserWithOrdersController = async (req: Request, res: Response) => {
  try {
    const userID = parseInt(req.params.id);
    const user = await getUserWithOrdersService(userID);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (error: any) {
    console.error("❌ Error in getUserWithOrdersController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get user with payments
//
export const getUserWithPaymentsController = async (req: Request, res: Response) => {
  try {
    const userID = parseInt(req.params.id);
    const user = await getUserWithPaymentsService(userID);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (error: any) {
    console.error("❌ Error in getUserWithPaymentsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

//
// 🧩 Get full user details (orders + items + payments + deliveries)
//
export const getUserFullDetailsController = async (req: Request, res: Response) => {
  try {
    const userID = parseInt(req.params.id);
    const user = await getUserFullDetailsService(userID);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (error: any) {
    console.error("❌ Error in getUserFullDetailsController:", error);
    return res.status(500).json({ error: error.message });
  }
};

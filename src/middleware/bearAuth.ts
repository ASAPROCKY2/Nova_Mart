import jwt from "jsonwebtoken";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";

// Middleware to verify JWT and ensure the user is logged in
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized - Token missing or invalid" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Middleware to verify specific roles
export const checkRoles = (requiredRole: "admin" | "user" | "delivery" | "any") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized - No token provided" });
            return;
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            (req as any).user = decoded;

            if (
                typeof decoded === "object" &&
                decoded !== null &&
                "role" in decoded
            ) {
                const userRole = (decoded as any).role;

                if (requiredRole === "any" || userRole === requiredRole) {
                    next();
                    return;
                }

                res.status(403).json({ message: "Forbidden - Access denied" });
                return;
            } else {
                res.status(401).json({ message: "Invalid token structure" });
                return;
            }
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
};

// Role-based middleware exports
export const adminAuth = checkRoles("admin");
export const userAuth = checkRoles("user");
export const deliveryAuth = checkRoles("delivery");
export const anyAuth = checkRoles("any");
 
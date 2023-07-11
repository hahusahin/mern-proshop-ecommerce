import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Middleware for normal authentication
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    // extract the payload from the token (UserId)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // find the user from DB (get all fields except password) and attach it into request body
    req.user = await User.findById(decoded.userId).select("-password");
    next();
    try {
    } catch (error) {
      // Token exists but not valid
      res.status(401);
      throw new Error("Not Authorized, token failed");
    }
  } else {
    // No token found in the cookie
    res.status(401);
    throw new Error("Not Authorized, token not found");
  }
});

// Middleware for admin user
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as Admin");
  }
};

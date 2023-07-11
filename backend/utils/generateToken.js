import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign(
    { userId }, // payload
    process.env.JWT_SECRET, // secret key
    { expiresIn: "30d" } // options
  );

  // Set JWT as HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (milliseconds)
  });
};

export default generateToken;

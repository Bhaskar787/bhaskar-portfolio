import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return process.env.JWT_SECRET;
};

export const verifyAdmin = (req) => {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) throw new Error("No token");

  return jwt.verify(token, getJwtSecret());
};

export default getJwtSecret;

import dotenv from "dotenv";
import { compareToken } from "./jwt.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access Denied: No token provided or invalid token format",
    });
  }

  const token = authHeader.split(" ")[1];
  // console.log("from auth,token:",token)
  try {
    const verified =await compareToken(token, SECRET_KEY);
    if (!verified) {
      return res.status(401).json({ message: "Access Denied: Invalid token" });
    }
    req.user =  verified;
    // console.log("authorization completed and req.user:",req.user)
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export default auth;

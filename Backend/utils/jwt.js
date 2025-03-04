import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = async (payload) => {
  if (!payload) {
    throw new Error("requirements for generating token is not enough");
  }
  return await Jwt.sign(payload, SECRET_KEY);
};

const compareToken = async (token) => {
  if (!token ) {
    throw new Error("requirements for comparing token is not enough!");
  }
  return await Jwt.verify(token,SECRET_KEY);
};

export { compareToken, generateToken };

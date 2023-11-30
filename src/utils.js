import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
const SECRETJWT = "jwtSecret";


export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = async (data) => {
    const salt = await bcrypt.genSalt(10);
return bcrypt.hash(data, salt);
};

export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
};

export const generateToken = (user) => {
    return jwt.sign(user, SECRETJWT);
  };
  

import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  } catch (error) {
    console.log(`error while generating token ${error}`);
  }
};

export default generateToken;

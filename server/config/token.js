import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  if (!userId) {
    throw new Error("User ID is required to generate token");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return token;
};

export default generateToken;
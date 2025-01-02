import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization").split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied" });
    }
  
    try {
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid token" });
      console.log(error);
    }
  };
import jwt from "jsonwebtoken";

export const auth = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded; // this is the payload {_id: _id}
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

export const admin = async function (req, res, next) {
  // 403 forbidden
  // 401 unauthorized
  if (!req.user.isAdmin) return res.status(403).send("Access Denied");
  next();
};

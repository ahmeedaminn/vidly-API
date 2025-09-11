import mongoose from "mongoose";
export const validateObjectId = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res
      .status(400)
      .json({ error: "ERROR 400, The given ID is not valid ID" });

  next();
};

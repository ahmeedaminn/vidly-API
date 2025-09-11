import mongoose from "mongoose";

export const exist = (Model) => {
  return async (req, res, next) => {
    // check exist
    const doc = await Model.findById(req.params.id);
    // not return not found
    if (!doc)
      return res
        .status(404)
        .json({ error: "ERROR 404, Resource with given ID is NOT found" });

    // set new property req.doc = doc that exist
    req.doc = doc;

    // next() pass the execution
    next();
  };
};

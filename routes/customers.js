import express from "express";
import { exist } from "../middleware/exist.js";
import { validateCustomer, Customer } from "../models/customers.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

// GET All
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// GET by ID
router.get("/:id", exist(Customer), async (req, res) => {
  // Check existance with the middleware

  const customer = await Customer.findById({ _id: req.params.id });
  res.send(customer);
});

// POST
router.post("/", validate(validateCustomer), async (req, res) => {
  // Validate the user input from the req.body

  // create the new customer
  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  // save to DB
  customer = await customer.save();

  // send it as response
  res.send(customer);
});

// PUT
router.put(
  "/:id",
  [exist(Customer), validate(validateCustomer)],
  async (req, res) => {
    // Check existance with the middleware

    // Validate the update user input

    // find by id then update then return the object
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
      { new: true }
    );

    // send it as response
    res.send(customer);
  }
);

// DELETE
router.delete("/:id", exist(Customer), async (req, res) => {
  // Check existance with the middleware

  const customer = await Customer.findByIdAndDelete({ _id: req.params.id });
  const customers = await Customer.find();

  res.send({
    deleted: customer,
    message: "Customer SUCCESSFULLY deleted",
    customers,
  });
});

export default router;

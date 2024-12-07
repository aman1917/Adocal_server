const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// const Purchases = require("../models/Purchase");
const Alldata = require("../models/Alldata");

const isValidGSTNumber = (gstNo) => {
  const gstRegex = /^([0-3][0-9])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  return gstRegex.test(gstNo);
};

module.exports = {
  isValidGSTNumber,
};


router.get("/fetchallpurchasedata", fetchuser, async (req, res) => {
  try {
    const purchase = await Alldata.find({ user: req.user.id, mode: "purchase" });
    res.json(purchase);
  } catch (error) {
    console.error(error.message); // Fixed Typo
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//ROUTE 2 :Add new Purchase using Post  "/api/purchases/addPurchase" Login require


router.post("/addalldata", fetchuser, async (req, res) => {
  const { pinvoice, pdate, gstno, amount, mode } = req.body;
  // Basic Validation
  if (!pinvoice || !pdate || !gstno || !amount || !mode) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (isValidGSTNumber(gstno)) {
    try {
      // const formattedDate = new Date(pdate).toISOString().split('T')[0];
      // console.log(formattedDate)
      const purchase = new Alldata({
        pinvoice,
        pdate,
        gstno,
        amount,
        mode,
        user: req.user.id,
      });
      const savePurchase = await purchase.save();
      // console.log(savePurchase);
      res.json(savePurchase);

    }
    catch (error) {
      console.log(error.meassage);
      res.status(500).json("Internal Server Error");
    }
  }
  else {
    return res.status(400).json({ message: "Invalid GST Number" });
  }
});

//ROUTE 3 :UpdatePurchase using Put  "/api/purchases/updatepurchase/:id" Login require


router.put("/updatepurchase/:id", fetchuser, async (req, res) => {
  const { pdate, gstno, amount } = req.body;
  //Create new Note Object
  const newPurchase = {};
  if (pinvoice) {
    newPurchase.pinvoice = pinvoice;
  }
  if (pdate) {
    newPurchase.pdate = pdate;
  }
  if (description) {
    newPurchase.gstno = gstno;
  }
  if (tag) {
    newPurchase.amount = amount;
  }
  if (mode) {
    newPurchase.mode = mode;
  }
  //Find the Purchase to be updated & update it
  let purchase = await Alldata.findById(req.params.id);
  if (!purchase) {
    return res.status(400).send("Not data Found");
  }
  if (purchase.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }
  purchase = await Alldata.findByIdAndUpdate(
    req.params.id,
    { $set: newPurchase },
    { new: true }
  );
  res.json({ purchase });
});

//ROUTE 4 :Deletepurchase using delete  "/api/purchases/deletepurchase/:id" Login require

router.delete("/deletepurchase/:id", fetchuser, async (req, res) => {
  //Find the Purchase to be delete & delete it
  let purchase = await Alldata.findById(req.params.id);
  if (!purchase) {
    return res.status(400).send("Not data Found");
  }
  //allow deletion only if user owns this Note
  if (purchase.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }
  purchase = await Alldata.findByIdAndDelete(req.params.id);
  res.json({ Sucess: "This ID has been deleted", purchase: purchase });
});

//ROUTE 5 :Totalpurchase using   "/api/purchases/fetchallpurchasedata/:" Login require


router.get("/fetchpurchasetotal/:startDate/:endDate", fetchuser, async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure the date range includes the full day
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    // Validate dates
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // console.log("Start Date:", start);
    // console.log("End Date:", end);

    const matchedDocuments = await Alldata.find({
      user: req.user.id,
      pdate: { $gte: startDate, $lte: endDate },
      mode: "purchase"
    });

    // console.log("Matched Documents:", matchedDocuments);

    // Calculate the total amount using reduce()
    const totalPurchase = matchedDocuments.reduce((acc, doc) => acc + doc.amount, 0);

    // Log the total amount for debugging
    // console.log("Total Amount:", totalPurchase);

    // Return the total amount
    res.json({ totalPurchase })

  } catch (error) {
    console.error("Error fetching total purchases:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;

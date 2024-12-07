const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");

// const ReturnData = require("../models/Return");
const Alldata = require("../models/Alldata");

// ROUTE 1: Get All Returns (GET) - "api/auth/fetchallreturn" - Login required

router.get("/fetchallreturndata", fetchuser, async (req, res) => {
  try {
    const returns = await Alldata.find({ user: req.user.id, mode: "return" });
    res.json(returns);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/fetchallreturndata/:pinvoice", fetchuser, async (req, res) => {
  try {
    const { pinvoice } = req.params;
    console.log(pinvoice);
    const returns = await Alldata.find({ user: req.user.id, pinvoice: pinvoice });
    res.json(returns);
    console.log(returns);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ROUTE 2: Add New Return (POST) - "api/auth/addreturn" - Login required

router.post("/addreturndata", fetchuser, async (req, res) => {
  try {
    const { pinvoice, pdate, gstno, amount, mode } = req.body;
    console.log(req.body);
    // Basic Validation
    if (!pinvoice || !pdate || !gstno || !amount || !mode) {
      return res.status(400).json({ error: "All fields are required." });
    } 
    const returns = new Alldata({
      pinvoice,
      pdate,
      gstno,
      amount,
      mode,
      user: req.user.id,
    });
    const saveReturn = await returns.save();
    res.json(saveReturn);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ROUTE 3: Update Return (PUT) - "api/auth/updatereturn/:id" - Login required

router.put("/updatereturndata/:id", fetchuser, async (req, res) => {
  const { pinvoice, pdate, gstno, amount, mode } = req.body;

  // Create a new object with updated fields
  const newReturn = {};
  if (pinvoice) newReturn.pdate = pinvoice;
  if (pdate) newReturn.pdate = pdate;
  if (gstno) newReturn.gstno = gstno;
  if (amount) newReturn.amount = amount;
  if (mode) newReturn.amount = mode;
  try {
    // Find the return to be updated
    let returns = await Alldata.findById(req.params.id);
    if (!returns) {
      return res.status(404).json({ error: "Return not found" });
    }

    // Check if the user owns the return
    if (returns.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Update the return
    returns = await Alldata.findByIdAndUpdate(
      req.params.id,
      { $set: newReturn },
      { new: true }
    );

    res.json({ success: "Return updated successfully", returns });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTE 4: Delete Return (DELETE) - "api/returns/deletereturn/:id" - Login required

router.delete("/deletereturn/:id", fetchuser, async (req, res) => {
  try {
    // Find the return to be deleted
    let returns = await Alldata.findById(req.params.id);
    if (!returns) {
      return res.status(404).json({ error: "Return not found" });
    }

    // Check if the user owns the return
    if (returns.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Delete the return
    await Alldata.findByIdAndDelete(req.params.id);

    res.json({ success: "Return deleted successfully", returns });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ROUTE 5 :Totalpurchase using   "/api/purchases/fetchallpurchasedata/:" Login require
router.get("/fetchreturntotal/:startDate/:endDate", fetchuser, async (req, res) => {
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
      mode: "return"
    });

    // console.log("Matched Documents:", matchedDocuments);

    // Calculate the total amount using reduce()
    const totalReturn = matchedDocuments.reduce((acc, doc) => acc + doc.amount, 0);

    // Log the total amount for debugging
    // console.log("Total Amount:", totalReturn);

    // Return the total amount
    res.json({ totalReturn })

  } catch (error) {
    console.error("Error fetching total purchases:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;

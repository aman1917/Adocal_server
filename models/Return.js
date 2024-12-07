const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReturnData = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  pdate: {
    type: Date,
    required: true,
    set: (value) => {
      // Format to "yyyy-mm-dd" string format before saving
      return new Date(value).toISOString().split('T')[0];
    }
  },
  gstno: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("return", ReturnData);
